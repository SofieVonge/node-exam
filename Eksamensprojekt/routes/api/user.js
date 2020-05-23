const router = require("express").Router();

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");


const bcrypt = require('bcrypt');
const saltRounds = 12;


router.post("/api/user", async (req, res) => {

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
        const foundUser = await User.query().where({ username }).orWhere({ email }).first();
        if (foundUser) {
            return res.status(400).send({ response: "username or email already exist in the system" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Start new transaction.
        // All queries in this transaction will be rolled back upon exception
        const newUser = await User.transaction(async trx => {
            // We query household on the transaction
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
            
            /*
            const newUser = newHousehold.owner;
            newUser.household = newHousehold;
            */

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


module.exports = router;