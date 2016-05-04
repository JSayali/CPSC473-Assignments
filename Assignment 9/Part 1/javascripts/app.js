// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/*globals ko*/
"use strict";

function ViewModel(userComment) {
    this.comment = ko.observable();
    this.userComment = ko.observableArray(userComment);

    this.addComment = function() {
        if ((this.comment() !== "") &&
            (this.userComment.indexOf(this.comment()) < 0)) // Prevent blanks and duplicates
        {
            this.userComment.push(this.comment());
        }
        this.comment(""); // Clear the text box
    };
}

var vm = new ViewModel();
ko.applyBindings(vm);