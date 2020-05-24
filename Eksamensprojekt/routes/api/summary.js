const router = require("express").Router();

const Summary = require("../../models/Summary.js");


router.get("/api/summaries", async (req, res) => {
    const householdId = req.session.householdId;

    try {
        const summaries = await Summary.query().withGraphFetched("user").where("householdId", householdId);
        return res.send({response: summaries});

    } catch(error) {
        return res.send({response: "Error with DB: " + error});
    }
});

// get details (the expenses) about a summary based on the summaryId
router.get("/api/summaries/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const summary = await Summary.query().first().withGraphFetched("expenses").withGraphFetched("user").where("id", id); 
        return res.send({response: summary});


    } catch(error) {
        return res.send({response: "Error with DB:" + error});
    }
});

module.exports = router;