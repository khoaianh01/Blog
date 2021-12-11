const Comment = require('../models/comment');
const User = require('../models/users');
const sendMail = require('./sendMail');
module.exports.postComment = (req,res) => {
    const {id} = req.params;
    const {username,email} = req.body;
    const {comment} = req.body;
    const user = new User(username,email);
    sendMail(username,)
}