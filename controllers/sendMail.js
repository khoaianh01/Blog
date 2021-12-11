const ExpressError = require('../utils/ExpressError');
const sendMails = require('../sendMail');
const User = require('../models/users');
const { Cookie } = require('express-session');
const emailAdmin = process.env.EMAIL_ADMIN;

module.exports.sendMailComment = (req,res,next) => {
   
    const id =req.params.id;
    console.log(req.params)
    const comment = req.body.comment;
    const username = req.body.username;
    const fromEmail = req.body.email;
    const toEmail = emailAdmin;
    const contentHtml = '<p>' + comment +'</b><ul><li>Username:' + username + '</li><li>Email:' + fromEmail +'</p>';
    const isSend = sendMails.sendMail(username,fromEmail,comment,toEmail,contentHtml);
    if(isSend==='fail'){
        next(new ExpressError(500,"gửi email thất bại,bạn vul lòng gửi lại"));
    }
    res.redirect(`/home/${id}`)
}

module.exports.sendMailFlow = async (req,res,next) => {
    const {id} =req.params;
    const toEmail = req.body.email;
   
    const user = new User({email:toEmail});
  await user.save();
    const text = '';
   const contentHtml = '<p>' + 'cảm ơn bạn đã theo dõi blog của tôi' +'</p>';
    const isSend = sendMails.sendMail(username='',fromEmail='',text,toEmail,contentHtml);
    if(isSend==='fail'){
        next(new ExpressError(500,"gửi email thất bại,bạn vul lòng gửi lại"));
    }
    if(id){
        res.redirect(`/home/${id}`);
    }
    else{
        res.redirect(`/home`)
    }
   
}
