const Blog = require('../models/blogs');
const Topic = require('../models/topics');
const moment = require('moment');
const sendMails = require('../sendMail');
module.exports.renderBlog = async (req,res) =>{
    let idPage = 2;
    const PAGE_SIZE =6;
    const blogs = await Blog.find({})
        .limit(PAGE_SIZE);
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
 
    res.render('blogs/index',{blogs,topics,views,updatedAts,idPage});
}

module.exports.renderShow = async (req,res) =>{
    const {id} = req.params;
    const post = await Blog.findById(id);
    const blogs = await Blog.find({});
    const topics = await Topic.find({}).populate('blogs');
    post.view++;
    await post.save();
    let updatedAts= moment(post.updatedAt).format("MM-DD-yyyy");
    const views = await Blog.aggregate([{
        $sort:{
            view:-1
        }
    }])
    let qtyBlog = blogs.length;
    
    let relatedPosts = [];
    for(let i= 0;i<3;i++){

        let vt = Math.floor(Math.random()*qtyBlog)
       
        relatedPosts.push(blogs[vt])
    }
    res.render('blogs/show',{post,blogs,topics,views,updatedAts,relatedPosts});
}
module.exports.renderPostTopic = async (req,res) =>{
    const idPage = 2;
    const {id} = req.params;
    const topics = await Topic.find({}).populate('blogs');
    const posts = await Topic.findById(id).populate('blogs');
   let updatedAts =[];
   posts.blogs.forEach((t)=>{
    updatedAts.push(moment(t.updatedAt).format("MM-DD-yyyy"))
   })
    const views = await Blog.aggregate([{
        $sort:{
            view:-1
        }
    }])
    res.render('blogs/post',{topics,posts,views,idPage,updatedAts});
}

module.exports.editPost = async (req, res) => {
    const {id} = req.params;
    const topics = await Topic.find({}).populate('blogs');
    const posts = await Topic.findById(id).populate('blogs');
    const views = await Blog.aggregate([{
        $sort:{
            view:-1
        }
    }])
    res.render('blogs/post',{topics,posts,views});
}
