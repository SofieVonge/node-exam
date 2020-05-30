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

    console.log("M:", month, createdAtFrom.toMysqlFormat(), createdAtTo.toMysqlFormat());

    const summaryQuery = Household.relatedQuery("summaries").whereBetween("summaries.paymentDate", [createdAtFrom.toMysqlFormat(), createdAtTo.toMysqlFormat()]);
    const households = await Household.query().whereNotExists(summaryQuery);

    return households;
}


function setNextPayment(expense) {
    
    let next = expense.nextPayment + expense.timeBetween;
    expense.nextPayment = next > 12 ? next - 12 : next;
    //const id = expense.id;
/*
    switch (expense.timeBetween) {

        case 1:
            if (next < 12) {
                updateNextPayment(next++, id);
            } else{
                updateNextPayment(1, id);
            }
            return;
        case 2:
            next = next + 2;
            break;
        case 3:
            next = next + 3;
            break;
        case 4:
            next = next + 4;
            break;
        case 6:
            next = next + 6;
           break;
        case 12:
            //not needed to do anything here?
           // updateNextPayment(next, id);
            return;
         
    }*/
    
    /*if (next > 12) {
        updateNextPayment(next - 12, id);
    } else {
        updateNextPayment(next, id);
    }*/
}

async function updateNextPayment(next, id) {
    try {
        const numUpdated = await Expense.query().findById(id).patch({
            nextPayment: next
        });
    } catch (error) {
        console.log(error);
    }   
}


async function createSummary(householdId, month, year) {
    console.log("month:", (month + 1));
    const expenses = await Expense.query().where({nextPayment: (month + 1), householdId});
    console.log("exp:", expenses.length);
    let total = 0;
    expenses.map(expense => {
        total += expense.amount;
        setNextPayment(expense);
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

        //console.log(paymentDate);

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