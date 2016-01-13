var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');
/* GET users listing. */
router.route('/login').get(userController.getRegister).post(userController.postRegister);//login和register统一控制器
router.route('/register').get(userController.getRegister).post(userController.postRegister);
router.route('/getVerifitionCode').post(userController.getVerifitionCode);
module.exports = router;
