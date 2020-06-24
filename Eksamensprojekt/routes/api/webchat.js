const router = require("express").Router();

const ChatAuthentication = require("../../models/ChatAuthentication.js");


router.use("/api/webchat/*", (req, res, next) => {
    if (!(req.session.userId && req.session.householdId)) {
        return res.status(401).send({ response: "Not authorized." });
    }
    
    return next();
});

router.get("/api/webchat/token", async (req, res) => {
    try {
        const authToken = await ChatAuthentication.query().findById(req.session.userId);
        return res.send({ response: authToken.key });
    } catch (err) {
        return res.status(400).send({ response: "Something went wrong with the DB." });
    }
});

module.exports = router;