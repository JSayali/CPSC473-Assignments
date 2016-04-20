// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var dbURL = "mongodb://localhost/test";
var port = 3000;

mongoose.connect(dbURL, function(err) {
    if (err) {
        throw err;
    } else {
        console.log("Connected to database");
    }
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var LinkSchema = mongoose.Schema({
    "title": String,
    "link": String,
    "clicks": {
        type: Number,
        default: 0
    }
});
var Link = mongoose.model("links", LinkSchema);

app.get("/", function(req, res) {
    res.type("text/plain");
    res.send("Hello world!");
});

app.post("/links", function(req, res) {

    var l1 = new Link({
        "title": req.body.title,
        "link": req.body.link
    });
    l1.save(function(err) {
        if (err !== null) {
            console.log(err);
        } else {
            console.log("the object was saved!");
        }
        res.send({
            "success": true
        });
    });
});

app.get("/links", function(req, res) {
    Link.find({}, function(err, links) {
        if (err !== null) {
            console.log("ERROR: " + err);
            // return from the function
            return;
        } else {
            res.send(links);
        }

    });
});

app.get("/click/:title", function(req, res) {
    Link.findOne({
        title: req.params.title
    }, function(err, body) {
        if (err !== null) {
            console.log("ERROR: " + err);
            return;
        } else {
            console.log(body.link);
            Link.update({
                title: req.params.title
            }, {
                $inc: {
                    clicks: 1
                }
            }, function(err, data) {
                if (err !== null) {
                    res.send(err);
                } else {
                    console.log(data);
                    res.redirect(body.link);
                }
            });

        }
    });
});

app.listen(port);
console.log("Server is running on port: " + port);