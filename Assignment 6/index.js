// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var redis = require("redis"),
    client = redis.createClient();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

client.on("connect", function() {
    console.log("connected");
});

client.on("error", function(err) {
    console.log("Error " + err);
});

app.get("/", function(req, res) {
    res.type("text/plain");
    res.send("Hello world!");
});

app.post("/flip", function(req, res) {
    var flips = ["heads", "tails"];
    var index = Math.floor(Math.random() * flips.length);
    var randomFlip = flips[index];
    if (req.body.call === randomFlip) {
        client.incr("wins", function(err, rep) {
            console.log("wins: " + rep);
            res.json({
                "result": "win"
            });
        });
    } else {
        client.incr("losses", function(err, reply) {
            console.log("losses: " + reply);
            res.json({
                "result": "lose"
            });
        });
    }
});

app.get("/stats", function(req, res) {

    client.mget("wins", "losses", function(err, rep) {
        console.log("wins - " + rep[0] + ", losses - " + rep[1]);
        res.json({
            "wins": rep[0],
            "losses": rep[1]
        });
    });
});

app.del("/stats", function(req, res) {
    client.set("wins", 0);
    client.set("losses", 0);

    client.mget("wins", "losses", function(err, rep) {
        console.log("wins - " + rep[0] + ", losses - " + rep[1]);
        res.json({
            "wins": rep[0],
            "losses": rep[1]
        });
    });
});

app.listen(3000);
console.log("Server is running on port 3000");