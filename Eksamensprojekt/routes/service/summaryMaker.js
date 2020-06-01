const router = require("express").Router();

const Household = require("../../models/Household.js");
const Summary = require("../../models/Summary.js");
const Expense = require("../../models/Expense.js");


function ensureTwoDigitString(num) {
    if (0 <= num && num < 10) {
        return `0${num}`;
    }
    if(-10 < num && num < 0) {
        return "-0" + (-1*d).toString();
    }
    return num.toString();
}

/**
 * 
 **/
Date.prototype.toMysqlFormat = function() {
    //return this.toISOString().split('T')[0] + ' ' + this.toTimeString().split(' ')[0];
    return this.getFullYear() + "-" + ensureTwoDigitString((1 + this.getUTCMonth())) + "-" + ensureTwoDigitString(this.getDate()) + "T" + ensureTwoDigitString(this.getHours()) + ":" + ensureTwoDigitString(this.getMinutes()) + ":" + ensureTwoDigitString(this.getSeconds()) + "Z";
};



router.get("/testRoute", async (req, res) => {
    //return res.send(await fetchHouseholdsWithMissingSummary(7, 2020));
    return res.send(await createSummaries());
});

async function fetchHouseholdsWithMissingSummary(month, year) {
    const createdAtFrom = new Date(year, month, 1); // start of month
    const createdAtTo = new Date(year, month + 1, 0);// end of month

    const summaryQuery = Household.relatedQuery("summaries").whereBetween("summaries.paymentDate", [createdAtFrom.toMysqlFormat(), createdAtTo.toMysqlFormat()]);
    const households = await Household.query().whereNotExists(summaryQuery);

    return households;
}



async function createSummary(householdId, month, year) {
    const expenses = await Expense.query().where({nextPayment: (month + 1), householdId});
    let total = 0;
    expenses.map(expense => {
        total += expense.amount;

        // set next payment for expense
        let nextPayment = expense.nextPayment + expense.timeBetween;
        expense.nextPayment = nextPayment > 12 ? nextPayment - 12 : nextPayment;
    });

    // transaction will rollback if an exception is thrown
    const summary = await Summary.transaction(async (trx) => {
        
        const upsertOptions = {
            insertMissing: true,
            relate: ['expenses'],
            update: ['expenses'],
            noDelete: ['expenses']
        }

        const paymentDate = new Date(year, (month-1), 20);

        // insert summary with relations to  expenses
        const summary = await Summary.query(trx).upsertGraphAndFetch({
            paymentDate: paymentDate.getFullYear() + "." + (paymentDate.getUTCMonth() + 1) + ".20",
            total,
            householdId,
            expenses,
        }, upsertOptions);

        return summary;
    });

    return summary;
}

let createSummaries = async function () {
    let summaries = [];
    const now = new Date();
    
    const households = await fetchHouseholdsWithMissingSummary(now.getMonth()+1, now.getFullYear());

    try {
        // create summary for each household
        for (let i in households) {
            summaries.push(await createSummary(households[i].id, now.getMonth()+1, now.getUTCFullYear()));
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return summaries;
}

module.exports = {
    router,
    createSummaries
};