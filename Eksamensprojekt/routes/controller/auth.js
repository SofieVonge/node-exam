const router = require("express").Router();
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar_default.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer.html", "utf8");

const signupView = fs.readFileSync("./public/auth/signup.html", "utf8");
const signinView = fs.readFileSync("./public/auth/signin.html", "utf8");

router.get("/auth/signup", (req, res) => {
    return res.send(navbarView + signupView + footerView);
});

router.get("/auth/signin", (req, res) => {
    return res.send(navbarView + signinView + footerView);
});



module.exports = router;