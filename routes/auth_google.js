const express = require("express");
const router = express.Router();
const authGoogle = require("../controllers/auth_google");

router.route("/google").get(authGoogle.auth);
router.route("/google/callback").get(authGoogle.authcallback);
module.exports = router;
