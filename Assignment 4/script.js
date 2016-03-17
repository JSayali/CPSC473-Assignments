// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

function getId(id) {
    var index = id.replace(/[^0-9]/g, "");
    return (index);
}

function displayName(id, name, star) {
    var item = "<div class=\"mdl-list__item\"> <span class=\"mdl-list__item-primary-content\">" +
        " <i class=\"material-icons mdl-list__item-avatar\">person</i> <span id=\"aName\">" + name + "</span></span> " +
        "<a id=\"" + (id + 1) + "\" class=\"icons\" href=\"#\"><i class=\"material-icons forStar\">" + star + "</i></a> </div>";
    $("#actors").append(item);
}

function starChange(id, nm, star) {
    $.ajax({
        url: "http://localhost:3000/actors/" + id,
        type: "PUT",
        data: {
            name: nm,
            starred: star
        },
        success: function() {
            console.log("Data updated");
        }
    });
}

$("#add").click(function() {
    var nm = $("#textIp").val();
    if (nm !== null && nm !== "" && nm !== undefined) {
        var data = {
            name: nm,
            starred: "false",
        };
        $.ajax({
            url: "http://localhost:3000/actors",
            type: "POST",
            data: data,
            success: function(newData) {
                displayName((newData.id - 1), newData.name, "star_border");
                $("#textIp").val("");
            },
            error: function() {
                console.log("Error posting data");
            }
        });
    } else {
        alert("Please enter the actor's name.");
    }
});

$("#actors").delegate(".icons", "click", function() {
    var $div = $(this).closest("div");
    var status = $div.find("i.forStar").html();
    var nm = $div.find("span#aName").html();
    if (status === "star") {
        $div.find("i.forStar").html("star_border");
        starChange(getId(this.id), nm, false);
    } else {
        $div.find("i.forStar").html("star");
        starChange(getId(this.id), nm, true);
    }

});

$(document).ready(function() {
    $.ajax({
        url: "http://localhost:3000/actors",
        dataType: "json",
        type: "GET",
        cache: false,
        success: function(data) {
            $(data).each(function(index, value) {
                var icon = "star_border";
                if (value.starred) {
                    icon = "star";
                }
                displayName(index, value.name, icon);
            });
        }
    });
});