const Blog = require('../models/blogs');
const Topic = require('../models/topics');
const Images = require('../models/images');
const User = require('../models/users');
require('dotenv').config();

const sendMails = require('../sendMail');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require("../cloudinary");
const emailAdmin = process.env.EMAIL_ADMIN;
module.exports.renderIndex = async (req,res)=>{
    const topics = await Topic.find({}).populate('blogs');
    res.render('admins/index',{topics})
}

module.exports.renderAddPost =async (req,res)=>{
    const topics = await Topic.find({});
    const fileUrls =null;
    res.render('admins/addpost',{topics,fileUrls});
}
module.exports.postAddPost = async (req,res)=>{ 
   const topicTitle = req.body.topic;
// object[ null properties] xm lai bang console.log(req.body)

    const topics = await Topic.findOne({... req.body.topic});
    const blog = new Blog(req.body);
     blog.avata = {
        url:req.file.path,
        filename:req.files
   }
     blog.blogTopic=req.body.topic.title;
     await blog.save();
     topics.blogs.push(blog);
     topics.save();
   const users = await User.find({role:'user'});
 
   let toEmails = [];
   users.forEach((user) => {
     
       toEmails.push(user.email);
   })
   console.log(toEmails);
   let fromEmail = emailAdmin;
   let text = `CoreIt có viết mới :localhost:3001/home/`;
   let contentHtml = '<p>' + `${text}` + '</p>';
   for(let i=0;i<toEmails.length;i++) {
   await sendMails.sendMail(usernames='',fromEmail,text,toEmails[0],contentHtml);
   }
  
      res.redirect(`/home/${blog._id}`);
 }
module.exports.renderTopic =  (req,res)=>{
    res.render('admins/addtopic');
}
module.exports.postTopic = async (req,res)=>{
    const topic = new Topic({...req.body});
    await topic.save();
    res.redirect('/admin/addtopic');
}
module.exports.renderEditPost = async (req,res)=>{
    const {topicid,postid} = req.params;
    const blog = await Blog.findById(postid);
    const topics = await Topic.find({});
    res.render('admins/editpost',{blog,topics,topicid});
}
module.exports.postEditPost = async (req,res)=>{
    const {postid} = req.params;
    const id = req.params.postid;
    const topicid = req.params.topicid;
    // object[ null properties] xm lai bang console.log(req.body)
    const topic = await Topic.findOne({... req.body.topic});
    const topicId = await Topic.findById(topicid).populate('blogs');
    
    const blog = await Blog.findByIdAndUpdate(postid,{...req.body});
    blog.avata = {
       url: req.file.path,
       filename: req.file.filename 
    };
    blog.blogTopic = req.body.topic.title;
     await blog.save();
     if(blog.blogTopic !== topicId.title){
         
        if(topicId.id){
            await Topic.findOneAndUpdate({... req.body.topic},{blogs:postid});
            await Topic.findByIdAndUpdate(topicid, { $pull: { blogs: postid } });
        }
        else{
            topic.blogs.push(blog);
        }
     
        topic.save();
     }
     res.redirect('/home');
}
module.exports.deletePost = async (req,res)=>{
    const {topicid,postid} = req.params;
    await Blog.findById(postid).exec( async function  (err, blog){
          await cloudinary.uploader.destroy(blog.avata.filename);
    })
    await Topic.findByIdAndUpdate(topicid, { $pull: { blogs: postid } });
    await Blog.findByIdAndDelete(postid);
    res.redirect('/home');
}
module.exports.renderEditTopic = async (req, res)=>{
    const {id} = req.params;
    const topic = await Topic.findById(id);
    res.render('admins/edittopic',{topic});
}
module.exports.editTopic = async (req,res)=>{
    const {id} = req.params;
    const title = req.body.title;
    const topicId = await Topic.findById(id).populate('blogs');
    const topicBlog = topicId.blogs[0].blogTopic;
    await Blog.updateMany({blogTopic:topicBlog},{blogTopic:title})
    await Topic.findByIdAndUpdate(id,{... req.body});
    res.redirect('/admin/home');
}

