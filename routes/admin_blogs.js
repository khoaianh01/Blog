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
      .get(adminBlogs.renderAddPost)
      .post(parser.single('avata') ,adminBlogs.postAddPost);
router.route('/upload')
      .post(multipartMiddleware,adminBlogs.uploadImgContent)
router.route('/addtopic')
      .get(adminBlogs.renderTopic)
      .post(adminBlogs.postTopic);
router.route('/edit')
      .get(adminBlogs.renderIndex);
router.route('/edit/editpost/:topicid/post/:postid')
      .get(adminBlogs.renderEditPost)
      .post(parser.single('avata'),adminBlogs.postEditPost);
router.delete('/edit/deletepost/:topicid/post/:postid',adminBlogs.deletePost);
router.route('/edit/edittopic/:id')
      .get(adminBlogs.renderEditTopic)
      .post(adminBlogs.editTopic);
module.exports = router;