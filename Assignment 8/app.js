// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

var express = require("express");
var path = require("path");
var app = express();
var http = require("http");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var port = 3000;

var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", function(socket) {
    console.log("a user connected");

    socket.on("new-todo", function(data) {
        console.log("new-todo");
        io.sockets.emit("update-todo", data);
    });

    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});

http.listen(port, function() {
    console.log("listening on *:3000");
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// connect to the amazeriffic data store in mongo
mongoose.connect("mongodb://localhost/test");

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);


app.get("/todos.json", function(req, res) {
    ToDo.find({}, function(err, toDos) {
        res.json(toDos);
    });
});

app.post("/todos", function(req, res) {
    console.log(req.body);
    var newToDo = new ToDo({
        "description": req.body.description,
        "tags": req.body.tags
    });
    newToDo.save(function(err, result) {
        if (err !== null) {
            // the element did not get saved!
            console.log(err);
            res.send("ERROR");
        } else {
            // our client expects *all* of the todo items to be returned, so we'll do
            // an additional request to maintain compatibility
            ToDo.find({}, function(err, result) {
                if (err !== null) {
                    // the element did not get saved!
                    res.send("ERROR");
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        }
    });
});