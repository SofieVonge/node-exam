const router = require("express").Router();
const fs = require("fs");

const navbarView = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerView = fs.readFileSync("./public/footer/footer.html", "utf8");

const newMemberView = fs.readFileSync("./public/household/createmember/createmember.html", "utf8");


router.get("/household/members/new", (req, res) => {
    return res.send(navbarView + newMemberView + footerView);
});

module.exports = router;