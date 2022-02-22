const express = require("express");
const router = express.Router();
const authGoogle = require("../controllers/auth_google");
const passport = require("passport");
router.route("/google")
      .get(passport.authenticate('google',{scope: ['profile', 'email']}));
router.route("/google/callback")
      .get(passport.authenticate('google', { failureRedirect: 'admin/login' }),authGoogle.authcallback)
module.exports = router;
