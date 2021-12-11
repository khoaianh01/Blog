const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    title:String,
    blogs:
    [{
         type: Schema.Types.ObjectId,
          ref: 'Blog' 
    }]
},{
    timestamps:true
})

module.exports = mongoose.model('Topic', topicSchema);