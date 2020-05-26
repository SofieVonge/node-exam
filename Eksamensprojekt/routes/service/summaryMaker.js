const router = require("express").Router();

const Summary = require("../../models/Summary.js");


router.use((req, res, next) => {
    const householdId = req.session.householdId;
    const now = new Date();

    if (now.getDate() === 20 && !summaryExists(householdId, now.getMonth(), now.getFullYear())) {
        //TODO: make new summary, call next?
    } else {
        next();
    }
});

async function summaryExists(householdId, month, year) {
    const summary = await Summary.query().first().where("householdId", householdId).where("paymentDate", new Date(year, month, 20));

    if (summary) {
        return false;
    } else {
        return true;
    }
}

function createSummary(householdId) {

}

    // create summary for each household

module.exports = router;