// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/*globals io*/
"use strict";

var socket = io();

var main = function(toDoObjects) {

    console.log("SANITY CHECK");

    var toDos = toDoObjects.map(function(toDo) {
        // we'll just return the description
        // of this toDoObject
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function(element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function() {
            var $content,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul id='newTodo'>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                    /*$($("<li>").text(toDos[i])).appendTo($content).hide().slideDown(500);*/
                    /*$content.append($("<li>").text(toDos[i])).hide().slideDown(500);*/
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul id='oldTodo'>");
                toDos.forEach(function(todo) {
                    $content.append($("<li>").text(todo));
                    /*$($("<li>").text(toDos)).appendTo($content).hide().slideDown(500);*/
                    /*$content.append($("<li>").text(todo)).hide().slideDown(500);*/
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function(tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function(toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });

                console.log(tagObjects);

                tagObjects.forEach(function(tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul id='tagList'>");


                    tag.toDos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                        /*$($("<li>").text(toDos[i])).appendTo($content).hide().slideDown(500);*/
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function() {
                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description": description,
                            "tags": tags
                        };

                    $.post("todos", newToDo, function(result) {
                        console.log(result);

                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function(toDo) {
                            return toDo.description;
                        });
                        socket.emit("new-todo", newToDo);
                        $input.val("");
                        $tagInput.val("");
                    });

                });

                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });
	
	socket.on("update-todo", function(data) {
        console.log("client on new-todo");
        var $new = $("#newTodo");
        var $content = $("main .content");
        var $old = $("#oldTodo");
        var $tagList = $("#tagList");
        var $description = data.description;
        var $tag = data.tags;
        var $newItem = $("<li>").text($description).hide();

        if (($new.length) > 0) {
            /*Add item to new tab*/
            $new.prepend($newItem);
        } else if (($old.length) > 0) {
            /*Add item to old tab*/
            $old.append($newItem);
        } else if (($tagList.length) > 0) {
            /*Add tag to taglist*/
            $content.append($("<h3>").text($tag));
            $content.append($newItem);
        }
        /*SlideDown effect for every update*/
        $newItem.slideDown(500);

        $.getJSON("todos.json", function(newToDoObjects) {
            toDoObjects = newToDoObjects;
            toDos = newToDoObjects.map(function(toDo) {
                return toDo.description;
            });
        });
    });

    $(".tabs a:first-child span").trigger("click");

};
$(document).ready(function() {

    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });

});