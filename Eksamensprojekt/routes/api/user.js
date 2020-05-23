const router = require("express").Router();

const User = require("../../models/User.js");


router.post("/api/user", (req, res) => {
    return res.status(501).send({ response: "Not yet implemented" });
});


module.exports = router;