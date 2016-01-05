/**
 * Created by mr_mac1 on 14/12/15.
 */
var express = require('express');
var router = express.Router();
var journeyController = require('../controller/journeyController');
/* GET users listing. */

router.route('/').get(journeyController.getJourney).post(journeyController.postJourney);
module.exports = router;
