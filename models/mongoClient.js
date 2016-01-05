/**
 * Created by mr_mac1 on 19/11/15.
 */
var setting = require('../config/setting');
var mongoose = require('mongoose');
mongoose.connect(setting.mongoHost);

var db = mongoose.connection;
db.once('open', function(){
    console.log('open');
});

module.exports = {
    db : db,
    mongoose : mongoose
};


