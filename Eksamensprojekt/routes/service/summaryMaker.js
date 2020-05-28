const router = require("express").Router();

const Household = require("../../models/Household.js");
const Summary = require("../../models/Summary.js");
const Expense = require("../../models/Expense.js");


router.get("/testRoute", async (req, res) => {
    return res.send(await fetchHouseholdsWithMissingSummary(5, 2020));
});

async function fetchHouseholdsWithMissingSummary(month, year) {
    const createdAtFrom = new Date(year, month, 1); // start of month
    const createdAtTo = new Date(year, month + 1, 0);// end of month

    const summaryQuery = Household.relatedQuery("summaries").whereBetween("summaries.createdAt", [createdAtFrom, createdAtTo]);
    const households = await Household.query().whereNotExists(summaryQuery);

    return households;
}


function setNextPayment(expense) {
    // Sofies algo
}


async function createSummary(householdId, month, year) {
    const expenses = await Expense.query().where("nextPayment", month);

    let total = 0;
    summary.expenses.map(expense => {
        total++;
        setNextPayment(expense);
    });

    // transaction will rollback if an exception is thrown
    const summary = await Summary.transaction(async (trx) => {
        
        const upsertOptions = {
            relate: ['expenses'],
            update: ['expenses'],
            noDelete: ['expenses']
        }

        // insert summary with relations to  expenses
        const summary = await Summary.query(trx).upsertGraphAndFetch({
            paymentDate: new Date(year, month, 20, 0, 0, 0, 0),
            total,
            householdId,
            expenses,
        }, upsertOptions);

        return summary;
    });

    return summary;
}

let createSummaries = async function () {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    // household with no summary for next month (created this month)
    const households = await fetchHouseholdsWithMissingSummary(now.getMonth(), now.getFullYear());

    // create summary for each household
    for (let i in households) {
        createSummary(households[i].id, now);
    }
}

module.exports = {
    router,
    createSummaries
};