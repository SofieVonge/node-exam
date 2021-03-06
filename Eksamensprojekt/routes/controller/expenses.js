const router = require("express").Router();
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer.html", "utf8");

const expenseView = fs.readFileSync("./public/expenses/expenses.html", "utf8");
const newExpense = fs.readFileSync("./public/expenses/createExpense.html", "utf8");
const updateExpense = fs.readFileSync("./public/expenses/updateExpense.html", "utf8");


router.use("/expenses/*", (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/auth/signin");
    }
    return next();
});

router.get("/expenses", (req, res) => {
    return res.send(navbarView + expenseView + footerView);
});

router.get("/expenses/new", (req, res) => {
    return res.send(navbarView + newExpense + footerView);
});

router.get("/expenses/update/:id", (req, res) => {
    return res.send(navbarView + updateExpense + footerView);
});

module.exports = router;