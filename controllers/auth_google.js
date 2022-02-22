const passport = require("passport");
module.exports.auth = (err, req, res, next) => {
  passport.authenticate("google", { scope: "email" }),
    (err, req, res, next) => {
      if (err) {
        next(
          new ExpressError(
            500,
            "server gặp lỗi, b vui lòng đăng nhập vào lúc khác"
          )
        );
      }
    };
};
module.exports.authcallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "admin/login" });
};
