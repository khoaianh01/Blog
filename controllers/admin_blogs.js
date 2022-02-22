const Blog = require("../models/blogs");
const Topic = require("../models/topics");

const User = require("../models/users");
require("dotenv").config();

const sendMails = require("../sendMail");
const ExpressError = require("../utils/ExpressError");
const { storage, cloudinary } = require("../cloudinary/index");
const emailAdmin = process.env.EMAIL_ADMIN;
module.exports.renderIndex = async (req, res) => {
  const topics = await Topic.find({}).populate("blogs");
  res.render("admins/index", { topics });
};

module.exports.renderAddPost = async (req, res) => {
  const topics = await Topic.find({});
  res.render("admins/addpost", { topics });
};
module.exports.createPost = async (req, res) => {
  const topicTitle = req.body.topic;
  const topics = await Topic.findOne({ ...req.body.topic });
  const blog = new Blog(req.body);
  blog.avata = {
    url: req.file.path,
    filename: req.file.filename,
  };

  blog.blogTopic = req.body.topic.title;
  await blog.save();
  topics.blogs.push(blog);
  topics.save();
  const users = await User.find({ roles: "user" });
  let toEmails = [];
  users.forEach((user) => {
    toEmails.push(user.email);
  });

  let fromEmail = emailAdmin;
  let text = `CoreIt có viết mới :localhost:3001/home/`;
  let contentHtml = "<p>" + `${text}` + "</p>";
  for (let i = 0; i < toEmails.length; i++) {
    await sendMails.sendMail(
      (usernames = ""),
      fromEmail,
      text,
      toEmails[i],
      contentHtml
    );
  }
  res.redirect(`/admin/blog`);
};
module.exports.renderTopic = (req, res) => {
  res.render("admins/addtopic");
};
module.exports.createTopic = async (req, res) => {
  const topic = new Topic({ ...req.body });
  await topic.save();
  res.redirect("/admin/addtopic");
};
module.exports.renderEditPost = async (req, res) => {
  const { topicid, postid } = req.params;
  const blog = await Blog.findById(postid);
  const topics = await Topic.find({});
  res.render("admins/editpost", { blog, topics, topicid });
};
module.exports.updatePost = async (req, res) => {
  const { postid } = req.params;
  const id = req.params.postid;
  const topicid = req.params.topicid;
  const topic = await Topic.findOne({ ...req.body.topic });
  const topicId = await Topic.findById(topicid).populate("blogs");

  const blog = await Blog.findByIdAndUpdate(postid, { ...req.body });
  blog.avata = {
    url: req.file.path,
    filename: req.file.filename,
  };
  blog.blogTopic = req.body.topic.title;
  await blog.save();

  if (blog.blogTopic !== topicId.title) {
    topic.blogs.push(blog);
    await Topic.findByIdAndUpdate(topicid, { $pull: { blogs: postid } });
  }
  await topic.save();
  res.redirect("/admin/edit");
};
module.exports.deletePost = async (req, res) => {
  const { topicid, postid } = req.params;
  const blog = await Blog.findById(postid);
  await cloudinary.uploader.destroy(blog.avata[0].filename);

  await Topic.findByIdAndUpdate(topicid, { $pull: { blogs: postid } });
  await Blog.findByIdAndDelete(postid);
  res.redirect("/admin/edit");
};
module.exports.renderEditTopic = async (req, res) => {
  const { id } = req.params;
  const topic = await Topic.findById(id);
  res.render("admins/edittopic", { topic });
};
module.exports.updateTopic = async (req, res) => {
  const { id } = req.params;
  const title = req.body.title;
  const topicId = await Topic.findById(id).populate("blogs");
  const topicBlog = topicId.blogs[0].blogTopic;
  await Blog.updateMany({ blogTopic: topicBlog }, { blogTopic: title });
  await Topic.findByIdAndUpdate(id, { ...req.body });
  res.redirect("/admin/edit");
};
module.exports.uploadImgContent = async (req, res) => {
  let fileName = req.files.upload.name;
  cloudinary.uploader
    .upload(req.files.upload.path, { folder: "blog" })
    .then((data) => {
      let url = data.url;
      let msg = "Upload successfully";
      let funcNum = req.query.CKEditorFuncNum;
      res
        .status(201)
        .send(
          "<script>window.parent.CKEDITOR.tools.callFunction('" +
            funcNum +
            "','" +
            url +
            "','" +
            msg +
            "');</script>"
        );
    });
};
