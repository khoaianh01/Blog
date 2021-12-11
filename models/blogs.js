const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AvataSchema = new Schema({
    url: String,
    filename: String
});
AvataSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_210');
});

const blogSchema = new Schema({
    title:String,
    des:String,
    avata: [AvataSchema],
    view:{
        type:Number,
        default:'0'
    },
    content:String,
    blogTopic:String
},{
    timestamps:true
});



module.exports = mongoose.model('Blog', blogSchema);