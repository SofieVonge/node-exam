const router = require("express").Router();

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");


const bcrypt = require('bcrypt');
const saltRounds = 12;

/* security middleware */
router.use("/api/household/*", (req, res, next) => {
    const { userId, householdId } = req.session;

    if (!(userId && householdId)) {
        return res.status(401).send({ response: "Unauthorized access" });
    }
    return next();
});


/**
 * Get household with related members
 */
router.get("/api/household", async (req, res) =>
{
    const householdId = req.session.householdId;

    try {
        // fetch household from database
        const household = await Household.query().first().where({ id: householdId }).withGraphFetched('members');

        household.members.map((member) => {
            delete member.password;
        });

        return res.send({ response: household });
    } catch (err) {
        return res.status(500).send({ response: `Something went wrong with the database: ${ err }` });
    }
});



/**
 * Add member to household.
 * Creates a User in database.
 */
router.post("/api/household/member", async (req, res) =>
{
    const householdId = req.session.householdId;
    const { username, password, email } = req.body;

    // username or password missing
    if (!(username && password && email)) {
        return res.status(400).send({ response: "username, password or email missing" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {// create user
            const household = await Household.query().findById(householdId);

            if (household.ownerId != req.session.userId) {
                return res.status(401).send({ response: `Unauthorized access: authenticated user is not owner of household ${ household.name }`});
            }

            const foundUser = await User.query().where({ username }).orWhere({ email }).first();
            if (foundUser) {
                return res.status(400).send({ response: "username or email already exist in the system" });
            }

            // insert user to db
            const newUser = await household.$relatedQuery('members').insertAndFetch(
            {
                username,
                password: hashedPassword,
                email,
                household: household
            });
            delete newUser.password;
    
            return res.status(201).send({response: newUser});
    
        } catch(err) {
            // this error should be logged
            // should probably not send err to client.
            return res.send({response: "Error with DB" + err});
        }
    } catch(err) {
        // this error should be logged
        // should probably not send err to client.
        return res.send({response: "Error encrypting password" + err});
    }
});


/**
 * Removes a member from household.
 * Deletes user in database.
 */
router.delete("/api/household/member/:id", async (req, res) => {
    const householdId = req.session.householdId;
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).send({ response: "id missing"});
    }

    try {
        const household = await Household.query().findById(householdId);

        if (!household) {
            return res.status(500).send({ response: `Could not fetch household by id: ${ householdId }` });
        }

        const numDeleted = await household.$relatedQuery('members').deleteById(userId);
        return res.send({ response: numDeleted });
    }
    catch (err) {
        return res.status(500).send({ response: `Something went wrong with the database: ${ err }`});
    }
});

module.exports = router;