const router = require("express").Router();
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer.html", "utf8");

const dashboardView = fs.readFileSync("./public/dashboard/dashboard.html", "utf8");


router.use("/dashboard/*", (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/auth/signin");
    }
    next();
});

router.get("/dashboard", (req, res) => {
    return res.send(navbarView + dashboardView + footerView);
});


module.exports = router;