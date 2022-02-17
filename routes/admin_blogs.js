const express = require('express');
const router = express.Router();
const adminBlogs = require('../controllers/admin_blogs');
const { storage } = require('../cloudinary');
const multer = require('multer');
const parser = multer({ storage: storage });
const {isAdmin,isLoggedIn} = require('../middleware');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
router.route('/blog')
      .get(isLoggedIn,isAdmin,adminBlogs.renderAddPost)
      .post(isLoggedIn,isAdmin,parser.single('avata') ,adminBlogs.createPost);
router.route('/upload')
      .post(isLoggedIn,isAdmin,multipartMiddleware,adminBlogs.uploadImgContent)
router.route('/addtopic')
      .get(isLoggedIn,isAdmin,adminBlogs.renderTopic)
      .post(isLoggedIn,isAdmin,adminBlogs.createTopic);
router.route('/edit')
      .get(isLoggedIn,isAdmin,adminBlogs.renderIndex);
router.route('/edit/editpost/:topicid/post/:postid')
      .get(isLoggedIn,isAdmin,adminBlogs.renderEditPost)
      .put(isLoggedIn,isAdmin,parser.single('avata'),adminBlogs.updatePost);
router.delete('/edit/deletepost/:topicid/post/:postid',adminBlogs.deletePost);
router.route('/edit/edittopic/:id')
      .get(isLoggedIn,isAdmin,adminBlogs.renderEditTopic)
      .put(isLoggedIn,isAdmin,adminBlogs.updateTopic);
module.exports = router;