/**
 * Created by mr_mac1 on 19/11/15.
 */
var setting = require('../config/setting');
var mongoose = require('mongoose');
mongoose.connect(setting.mongoHost);

var db = mongoose.connection;
db.once('open', function(){
    console.log('open mongodb');
});

module.exports = {
    db : db,
    mongoose : mongoose
};

//db.once('')