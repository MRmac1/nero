var settings = require("../config/setting");
var redis = require("redis"),
    client = redis.createClient({
            host: settings.redisHost,
            port: settings.redisPort
        });

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = client;