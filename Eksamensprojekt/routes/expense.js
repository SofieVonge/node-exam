const router = require("express").Router();

const Expense = require("../models/Expense.js");

router.get("/expenses", async (req, res) => {
    const householdId = req.session.householdId;

    try {
        const expenses = await Expense.query().select().where("householdId", householdId); // getting an array of expenses
        return res.send({response: expenses});
    } catch(error) {

        return res.send({response: "Error with DB:", error})
    }   
});

router.get("/expenses/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const expense = await Expense.query().findById(id); //getting the object Expense
        return res.send({response: expense});
    } catch(error) {
        return res.send({response: "Error with DB:", error})
    }
    
});

router.post("/expenses", async (req, res) => {
    const householdId = req.session.householdId;
    const { name, amount, time, next } = req.body;

    try {// getting the object Expense
        const expense = await Expense.query().insert({
            name,
            amount,
            timeBetween: time,
            nextPayment: next,
            householdId
    }); 
        return res.send({response: true}); // return true if it went well or return the expense created?

    } catch(error) {
        return res.send({response: "Error with DB:", error})
    }
    
});

router.delete("/expenses/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const numDeleted = await Expense.query().deleteById(id); //getting the number of items deleted
        return res.send({response: true}); // return true or number of deleted items?

    } catch(error) {
        return res.send({response: "Error with DB:", error})
    };
    
});

router.put("/expenses/:id", async (req, res) => {
    const id = req.params.id;
    const { name, amount, time, next } = req.body;

    try {
        const numUpdated = await Expense.query().findById(id).patch({
            name,
            amount,
            timeBetween: time,
            nextPayment: next,
        });

        return res.send({response: true}); // return true or number of updated items? can also return the item itself with patchAndFetchById()

    } catch(error) {
        return res.send({response: "Error with DB:", error})
    }
});

module.exports = router;