const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    email:String,
    roles :{
        type: String,
        default:'user'
    },
    username:String
})

UserSchema.plugin(passportLocalMongoose,{
    usernameField: 'email'
});
module.exports = mongoose.model('User',UserSchema);