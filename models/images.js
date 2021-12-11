const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    avata:[{
        url:String,
        filename:String
    }]
})

module.exports = mongoose.model('Image', imageSchema);