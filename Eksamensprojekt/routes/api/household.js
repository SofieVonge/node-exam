const router = require("express").Router();

const User = require("../../models/User.js");
const Household = require("../../models/Household.js");
const ChatAuthentication = require("../../models/ChatAuthentication.js");


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
        // fetch household with members from database
        const household = await Household.query().first().where({ id: householdId }).withGraphFetched('members');

        // delete passwords from household members
        household.members.map((member) => {
            delete member.password;
        });

        return res.send({ response: household });
    } catch (err) {
        return res.status(500).send({ response: `Something went wrong with the database: ${ err }` });
    }
});



/**
 * Add member to household. Based on web session.
 * Cookie should be included in header.
 * Creates a User in database.
 */
router.post("/api/household/member", async (req, res) =>
{
    const householdId = req.session.householdId;
    // unpack values from request body
    const { username, password, email } = req.body;

    // username or password missing
    if (!(username && password && email)) {
        return res.status(400).send({ response: "username, password or email missing" });
    }

    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {// create user
            const household = await Household.query().findById(householdId);

            // if the creating user is not the owner of the household
            if (household.ownerId != req.session.userId) {
                return res.status(401).send({ response: `Unauthorized access: authenticated user is not owner of household ${ household.name }`});
            }

            // fetch user from the database using specified username or email
            const foundUser = await User.query().where({ username }).orWhere({ email }).first();
            // if a user with the specified username or email already exists
            if (foundUser) {
                return res.status(400).send({ response: "username or email already exist in the system" });
            }


            // insert user into db and fetch it upon success.
            const newUser = await household.$relatedQuery('members').insertAndFetch(
            {
                username,
                password: hashedPassword,
                email,
                household: household
            });

            // increase members count in household
            await Household.query().increment('memberCount', 1).where({ id: household.id });

            // delete the password before returning the new user object
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
    const requestingUserId = req.session.userId;
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).send({ response: "id missing"});
    }

    try {
        // fetch household from the database
        const household = await Household.query().findById(householdId);

        // if household doesn't exist
        if (!household) {
            return res.status(500).send({ response: `Could not fetch household by id: ${ householdId }` });
        }

        // if deleting user is not the owner of the household
        if (household.ownerId != requestingUserId) {
            return res.status(401).send({ response: "Insufficient privileges to complete the operation."});
        }

        // if the deleted user is the owner of the household
        if (household.ownerId == userId) {
            return res.status(401).send({ response: "Household owner cannot be deleted."});
        }

        // remove chat authentication token from the database
        const deleteChatAuth = await ChatAuthentication.query().deleteById(userId);
        // unrelate user from household
        const unrelate = await User.relatedQuery('household').for(userId).unrelate();
        // remove user from the database
        const numDeleted = await User.query().deleteById(userId);

        // respond with number of users deleted
        return res.status(201).send({ response: numDeleted });
    }
    catch (err) {
        return res.status(500).send({ response: `Something went wrong with the database: ${ err }`});
    }
});

module.exports = router;