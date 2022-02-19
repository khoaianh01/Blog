const Blog = require("../models/blogs");
const Topic = require("../models/topics");
const moment = require("moment");
const sendMails = require("../sendMail");
module.exports.renderPost = async (req, res) => {
  const PAGE_SIZE = 6;
  let next = req.query.next;
  let idPage = req.query.page || 0;
  let countBlog = await Blog.find({}).count();
  let countPage = Math.floor((countBlog - 1) / PAGE_SIZE);

  if (!next) {
    var blogs = await Blog.find({}).sort({ _id: -1 }).limit(PAGE_SIZE);
  } else {
    var blogs = await Blog.find({ _id: { $lt: next } })
      .sort({ _id: -1 })

      .limit(PAGE_SIZE);
  }
  next = blogs[blogs.length - 1]._id;
  idPage++;
  let updatedAts = [];
  blogs.forEach((t) => {
    updatedAts.push(moment(t.updatedAt).format("MM-DD-yyyy"));
  });
  const views = await Blog.aggregate([
    {
      $sort: {
        view: -1,
      },
    },
  ]);
  const topics = await Topic.find({}).populate({
    path: "blogs",
  });

  res.render("blogs/index", {
    blogs,
    topics,
    views,
    updatedAts,
    next,
    idPage,
    countPage,
  });
};

module.exports.renderShow = async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findById(id);
  const blogs = await Blog.find({});
  const topics = await Topic.find({}).populate("blogs");
  post.view++;
  await post.save();
  let updatedAts = moment(post.updatedAt).format("MM-DD-yyyy");
  const views = await Blog.aggregate([
    {
      $sort: {
        view: -1,
      },
    },
  ]);
  let qtyBlog = blogs.length;
  let relatedPosts = [];
  for (let i = 0; i < 3; i++) {
    let vt = Math.floor(Math.random() * qtyBlog);
    relatedPosts.push(blogs[vt]);
  }
  const next = null;
  res.render("blogs/show", {
    post,
    blogs,
    topics,
    views,
    updatedAts,
    relatedPosts,
    next,
  });
};
module.exports.renderPostTopic = async (req, res) => {
  let next = req.query.next;
  let idPage = req.query.page || 0;
  const PAGE_SIZE = 6;
  const { id } = req.params;
  const topics = await Topic.find({}).populate("blogs");
  let countPostTopic = await Topic.findById(id).populate("blogs");
  let countPages = Math.floor((countPostTopic.blogs.length - 1) / PAGE_SIZE);
  let posts;
  if (!next) {
    posts = await Topic.findById(id).populate({
      path: "blogs",
      options: { sort: { _id: -1 }, limit: PAGE_SIZE },
    });
  } else {
    posts = await Topic.findById(id).populate({
      path: "blogs",
      match: { _id: { $lt: next } },
      options: { sort: { _id: -1 }, limit: PAGE_SIZE },
    });
  }

  next = posts.blogs[posts.blogs.length - 1]._id;
  
  idPage++;
  let updatedAts = [];
  posts.blogs.forEach((t) => {
    updatedAts.push(moment(t.updatedAt).format("MM-DD-yyyy"));
  });
  const views = await Blog.aggregate([
    {
      $sort: {
        view: -1,
      },
    },
  ]);
  res.render("blogs/post", {
    topics,
    posts,
    views,
    updatedAts,
    next,
    idPage,
    countPages,
  });
};

module.exports.editPost = async (req, res) => {
  const { id } = req.params;
  const topics = await Topic.find({}).populate("blogs");
  const posts = await Topic.findById(id).populate("blogs");
  const views = await Blog.aggregate([
    {
      $sort: {
        view: -1,
      },
    },
  ]);
  res.render("blogs/post", { topics, posts, views });
};
