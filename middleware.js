const { findOne } = require("./models/blogs");
const {userSchema,userCommentSchema} = require('./joiSchemas');
const User = require("./models/users");
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAdmin = async (req, res, next) =>{
    const role = req.user.roles;
   
    if(role==='admin'){
      next();
    }
   
}
module.exports.validateUser= (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}
module.exports.validateCommentUser= (req, res, next) => {
    const { error } = userCommentSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}