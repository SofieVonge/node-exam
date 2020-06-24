const router = require("express").Router();
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer.html", "utf8");

const detailView = fs.readFileSync("./public/summary/summary.html", "utf8");

router.use("/summaries/*", (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect("/auth/signin");
    }
    return next();
});

router.get("/summaries/detail/:id", (req, res) => {
    return res.send(navbarView + detailView + footerView);
})

module.exports = router;