/* Copyright (c) 2009, Timothy Yung. All rights reserved. */

var YUNG = {
    showLineNumbers: function() {
        var numListEl = $("<ol id=\"line-numbers\"></ol>").prependTo("body");
        var maxHeight = numListEl.height();
        
        /* Fade Settings */
        var delay    = 25;
        var duration = 200;
        var opacity  = 0.2;
        
        var itemCount = $("li", numListEl).size();
        if (itemCount == 0) {
            $("<li>1</li>").appendTo(numListEl).fadeTo(duration, opacity);
            itemCount += 1;
        }
        var oneHeight = $("li", numListEl).height();
        
        var addItemEl = function() {
            if ((itemCount * oneHeight) < maxHeight) {
                itemCount += 1;
                setTimeout(addItemEl, delay);
                var el = $("<li>" + itemCount + "</li>").appendTo(numListEl);
                el.fadeTo(duration, opacity);
            }
        };
        addItemEl();
    }
};

$(document).ready(function() {
    YUNG.showLineNumbers();
});

