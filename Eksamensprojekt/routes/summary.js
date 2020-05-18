const router = require("express").Router();

const Summary = require("../models/Summary.js");


router.get("/summaries", async (req, res) => {
    const householdId = req.session.householdId;

    try {
        const summaries = await Summary.query().select().where("householdId", householdId);
        return res.send({response: summaries});

    } catch(error) {
        return res.send({response: "Error with DB:", error});
    }
});

// get details (the expenses) about a summary based on the summaryId
router.get("/summaries/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const summary = await Summary.query().withGraphFetched("expenses").where("summaries.id", id); // dette svarer måske til en join af de to tabeller?? 
        // ide hvis overstående ikke virker : const summary = await Summary.query().findById(id).whereExists(Summary.relatedQuery("expenses"));
        return res.send({response: summary});


    } catch(error) {
        return res.send({response: "Error with DB:", error});
    }
});

module.exports = router;