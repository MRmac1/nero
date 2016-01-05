var express = require('express');
var router = express.Router();
var indexController = require('../controller/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('app_index', { title: 'Express' });
});

router.route('/count').get(indexController.count);//session 计数示范

module.exports = router;
