const express = require('express');
const router = express.Router();
const adminBlogs = require('../controllers/admin_blogs');
const { storage } = require('../cloudinary');
const multer = require('multer');
const parser = multer({ storage: storage });
const {isAdmin,isLoggedIn} = require('../middleware');
router.route('/blog')
      .get(adminBlogs.renderAddPost)
      .post( parser.single('avata') ,adminBlogs.postAddPost);

router.route('/topic')
      .get(adminBlogs.renderTopic)
      .post(adminBlogs.postTopic);
router.route('/edit')
      .get(adminBlogs.renderIndex);
router.route('/editpost/:topicid/post/:postid')
      .get(adminBlogs.renderEditPost)
      .post(parser.single('avata'),adminBlogs.postEditPost);
router.delete('/deletepost/:topicid/post/:postid',adminBlogs.deletePost);
router.route('/edittopic/:id')
      .get(adminBlogs.renderEditTopic)
      .post(adminBlogs.editTopic);
module.exports = router;