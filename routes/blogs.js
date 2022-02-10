const express = require('express');
const router = express.Router();
const homes = require('../controllers/blogs');
const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
router.route('/')
     .get(catchAsync(homes.renderBlog));
router.route('/:id')  
      .get(catchAsync(homes.renderShow));
router.route('/post/:id')  
      .get(catchAsync(homes.renderPostTopic));

module.exports = router;