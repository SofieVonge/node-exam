const router = require("express").Router();

const bcrypt = require('bcrypt');
const saltRounds = 12;

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");
const ChatAuthentication = require("../../models/ChatAuthentication.js");


/**
 * Sign in route based on web session
 * Cookie is returned in header
 */
router.post("/api/auth/signin", async (req, res) => {
    const { username, password } = req.body;

    // username or password missing
    if (!(username && password)) {
        return res.status(400).send({ response: "username or password missing" });
    }

    try
    {
        // fetch user from the db using the provided username
        const user = await User.query().first().withGraphFetched('household').where('username', username);
        // if the user is found
        if (user) {
            // compare hashed passwords
            const bcryptResult = await bcrypt.compare(password, user.password);
            // if hashed passwords match
            if (bcryptResult === true) {
                /* initialize session variables */
                req.session.userId = user.id;
                req.session.householdId = user.household.id;

                // create chat authentication token (hash)
                const chatAuthenticationKey = await bcrypt.hash((Date.now()).toString(), saltRounds);

                try {
                    // insert chat authentication token into the database
                    await ChatAuthentication.query().insert({
                        userId: user.id,
                        key: chatAuthenticationKey,
                    });                   
                } catch (err) {
                    // upon database error: 'UniqueViolationError'
                    if (err.name == 'UniqueViolationError') {
                        // update chat authentication token in the database
                        await ChatAuthentication.query().where({userId: user.id}).update({
                            key: chatAuthenticationKey,
                        });
                    } else {
                        // throw the error to parent try/catch scope
                        throw err;
                    }
                }

                return res.status(200).send({ response: true });
            } else {
                return res.status(400).send({ response: "password doesn't match" });
            }
        } else {
            return res.status(400).send({ response: "username not found" });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(500).send({ response: "something went wrong with the DB" })
    }
});

/**
 * Sign out route based on web session
 * Header should contain the cookie to be invalidated
 */
router.post("/api/auth/signout", async (req, res) =>
{
    try
    {
        // delete session variables
        delete req.session.userId;
        delete req.session.householdId;

        return res.status(200).send({ response: true });
    } catch (err) {
        // this err should be logged to database.
        return res.status(500).send({ response: `something went wrong. You were not signed out correctly.\n\r Error: ${ err }` });
    }
});


module.exports = router;