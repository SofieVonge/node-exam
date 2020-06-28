const router = require("express").Router();

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");


const bcrypt = require('bcrypt');
const saltRounds = 12;


/**
 * Route for fetching information about the user on
 * current web session. Cookie should be included in
 * the request header.
 */
router.get("/api/user/current", async (req, res) => {
    const { userId, householdId } = req.session;

    if (!(userId && householdId)) {
        return res.status(401).send({ response: "Not authorized" });
    }

    try {
        // fetch user with household and members
        const user = await User.query().first().withGraphFetched('household.members').where({ id: userId });

        // delete passwords from household members before data is served
        user.household.members.map((member) => delete member.password);

        // delete password from user before data is served
        delete user.password;

        return res.send({ response: user });
    } catch (err) {
        return res.status(500).send({ response: `Error with the database: ${ err }` });
    }
});

/**
 * Route for creating a user
 */
router.post("/api/user", async (req, res) => {

    // unpack needed variables from request body
    const { username: username, password, email, household } = req.body;

    // missing variables validation
    if (!(username && password && email && household))
    {
        return res.status(400).send({ response: "username, password, email or household missing" });
    }

    // password validation
    if (password.length < 8) {
        return res.status(400).send({ response: "password must be 8 characters or longer" });
    }

    // email validation
    if (!validateEmail(email)) {
        return res.status(400).send({ response: "email syntax is wrong" });
    }

    try {
        // fetch user with specified username or password from db
        const foundUser = await User.query().where({ username }).orWhere({ email }).first();
        // if user already exist in db
        if (foundUser) {
            return res.status(400).send({ response: "username or email already exist in the system" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Start new transaction.
        // All queries in this transaction will be rolled back upon exception
        const newUser = await User.transaction(async trx => {
            // We query insert household on the transaction
            // with relation to also beforehand inserted owner.
            // This owner object (user) is afterwards refered
            // to as a member.
            const newHousehold = await Household.query(trx).insertGraphAndFetch(
            {
                name: household,
                memberCount: 1,
                owner: {
                    "#id": "householdOwner",
                    username,
                    password: hashedPassword,
                    email,
                },
                members: [ { "#ref": "householdOwner" } ],
            },
            { allowRefs: true });

            // fetch newly created user with graph( household )
            const newUser = await User.query(trx).first().withGraphFetched("household").where({id: newHousehold.owner.id});

            delete newUser.password;
      
          // Whatever we return from the transaction callback gets returned
          // from the `transaction` function.
          return newUser;
        });
        // Here the transaction has been committed.
        return res.status(201).send({ response: newUser });
      } catch (err) {
        // Here the transaction has been rolled back.
        return res.status(500).send({ response: "Something went wrong with the DB" + err });
      }
});


/**
 * Email validation.
 * Author: rnevius (StackOverflow)
 * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 * 
 * @param {string} email
 * @returns boolean indicating if the email is valid.
 */
function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


module.exports = router;