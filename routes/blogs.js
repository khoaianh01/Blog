const express = require('express');
const router = express.Router();
const homes = require('../controllers/blogs');
const {isLoggedIn} = require('../middleware');
router.route('/')
     .get(homes.renderBlog);
router.route('/:id')  
      .get(homes.renderShow);
router.route('/post/:id')  
      .get(homes.renderPostTopic);

module.exports = router;