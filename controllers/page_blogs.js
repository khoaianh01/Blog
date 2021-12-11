const Blog = require('../models/blogs');
const Topic = require('../models/topics');
const moment = require('moment');
const sendMails = require('../sendMail');

module.exports.renderPageBlog = async (req, res) => {
 
    let idPage = parseInt(req.params.idPage);
    const PAGE_SIZE = 6;
    const soluongBoQua = (parseInt(idPage)-1)*PAGE_SIZE;
    const blogs = await Blog.find({})
        .skip(soluongBoQua)
        .limit(PAGE_SIZE);
    const countDocuments = await Blog.countDocuments({});
    idPage++;
    if(soluongBoQua*2>=countDocuments){
       
        idPage=null;
    }
  
    
    let updatedAts=[];
     blogs.forEach( (t) =>{
     updatedAts.push(moment(t.updatedAt).format("MM-DD-yyyy")) 
    })
    const views = await Blog.aggregate([{
        $sort:{
            view:-1
        }
    }])
    const topics = await Topic.find({}).populate('blogs');
 
    res.render('pages/index',{blogs,topics,views,updatedAts,idPage});
}
module.exports.renderPagePostTopic = async(req, res) => {
    let idPage = parseInt(req.params.idPage);
    const PAGE_SIZE = 2;
    const soluongBoQua = (parseInt(idPage)-1)*PAGE_SIZE;
    const {id} = req.params;
    const topics = await Topic.find({}).populate('blogs');
  
    const countDocuments = await Topic.find({}).populate('blogs').count();
    const posts = await Topic.findById(id).populate({
        path:'blogs',
        options: {skip:soluongBoQua,limit:PAGE_SIZE}
    });
    idPage++;
    if(soluongBoQua*2>=countDocuments){
       
        idPage=null;
    }
   let updatedAts =[];
   posts.blogs.forEach((t)=>{
    updatedAts.push(moment(t.updatedAt).format("MM-DD-yyyy"))
   })
    const views = await Blog.aggregate([{
        $sort:{
            view:-1
        }
    }])
    res.render('pages/post',{topics,posts,views,idPage,updatedAts});
}