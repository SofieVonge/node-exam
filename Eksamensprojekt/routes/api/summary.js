const router = require("express").Router();

const Summary = require("../../models/Summary.js");


/**
 * Security middleware
 */
router.use("/api/summaries/*", (req, res, next) => {
    if (!(req.session.userId && req.session.householdId)) {
        return res.status(401).send({ response: "Unauthorized access"});
    }

    return next();
});


/**
 * Fetch summaries from household based
 * on web session.
 */
router.get("/api/summaries", async (req, res) => {
    const householdId = req.session.householdId;

    try {
        // fetch summaries with household from database
        const summaries = await Summary.query().withGraphFetched("household").where("householdId", householdId);
        // respond with summaries
        return res.send({response: summaries});

    } catch(error) {
        return res.send({response: "Error with DB: " + error});
    }
});

// get details (the expenses) about a summary based on the summaryId
router.get("/api/summaries/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // fetch summaries with expenses and household from database
        const summary = await Summary.query().first().withGraphFetched("expenses").withGraphFetched("household").where("id", id); 
        return res.send({response: summary});
    } catch(error) {
        return res.send({response: "Error with DB:" + error});
    }
});

module.exports = router;