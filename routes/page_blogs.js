const express = require('express');
const router = express.Router();
const pageBlogs = require('../controllers/page_blogs');
const {isLoggedIn} = require('../middleware');

router.route('/page/:idPage')
      .get(pageBlogs.renderPageBlog);
router.route('/post/:id/page/:idPage')  
      .get(pageBlogs.renderPagePostTopic);
module.exports = router;