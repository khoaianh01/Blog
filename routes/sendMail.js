const express = require('express');
const router = express.Router();
const sendM = require('../controllers/sendMail');
const catchAsync = require('../utils/catchAsync');
const {validateUser,validateCommentUser} = require('../middleware');
router.route('/comment/:id')
    .post(validateCommentUser,catchAsync(sendM.sendMailComment));
router.route('/flow')
    .post(validateUser,catchAsync(sendM.sendMailFlow));
module.exports = router;