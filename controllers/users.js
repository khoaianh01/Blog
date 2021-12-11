const User = require('../models/users');

module.exports.renderLogin = (req,res) => {
    res.render('users/login');
}
module.exports.postLogin = (req, res) => {
    res.redirect('/home');
}
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}
module.exports.postRegister = async (req, res,next) => {
        const {email,password} = req.body;
        const user = new User({email});
      
        const registerUser = await User.register(user, password);
        req.login(registerUser,(err)=>{
            if(err) return next(err);
            res.redirect('/home');
        })
}
  