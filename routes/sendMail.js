const express = require('express');
const router = express.Router();
const sendM = require('../controllers/sendMail');
const {validateUser,validateCommentUser} = require('../middleware')
router.route('/comment/:id')
    .post(validateCommentUser,sendM.sendMailComment);
router.route('/flow')
    .post(validateUser,sendM.sendMailFlow);
module.exports = router;