const router = require("express").Router();

const bcrypt = require('bcrypt');
const saltRounds = 12;

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");


router.post("/api/auth/signin", async (req, res) => {
    const { username, password } = req.body;

    // username or password missing
    if (!(username && password)) {
        return res.status(400).send({ response: "username or password missing" });
    }

    try
    {
        const user = await User.query().first().withGraphFetched('household').where('username', username);
        if (user) {
            const bcryptResult = await bcrypt.compare(password, user.password);
            if (bcryptResult === true) {
                req.session.userId = user.id;
                req.session.householdId = user.household.id;
                return res.status(200).send({ response: true });
            } else {
                return res.status(400).send({ response: "password doesn't match" });
            }
        } else {
            return res.status(400).send({ response: "username not found" });
        }
    } catch (ex) {
        return res.status(500).send({ response: "something went wrong with the DB" })
    }
});

router.post("/api/auth/signout", async (req, res) =>
{
    try
    {
        delete req.session.userId;
        delete req.session.householdId;

        return res.status(200).send({ response: true });
    } catch (err) {
        // this err should be logged to database.
        return res.status(500).send({ response: `something went wrong. You were not signed out correctly.\n\r Error: ${ err }` })
    }
});


module.exports = router;