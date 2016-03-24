// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var wins = 0,
    losses = 0;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.type("text/plain");
    res.send("Hello world!");
});
app.post("/flip", function(req, res) {
    var flips = ["heads", "tails"];
    res.type("application/json");
    var index = Math.floor(Math.random() * flips.length);
    var randomFlip = flips[index];
    if (req.body.call === randomFlip) {
        wins += 1;
        res.json({
            "result": "win"
        });
    } else {
        losses += 1;
        res.json({
            "result": "lose"
        });
    }
});
app.get("/stats", function(req, res) {
    res.json({
        "wins": wins,
        "losses": losses
    });
});

app.listen(3000);