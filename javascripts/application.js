/* Copyright (c) 2009, Timothy Yung. All rights reserved. */

var YUNG = {
    showLineNumbers: function() {
        var numListEl = $("<ol id=\"line-numbers\"></ol>").prependTo("body");
        var maxHeight = numListEl.height();
        
        var config = {
            duration: 200,   // Fade duration
            delay:    25,    // Delay between adding lines
            interval: 15000, // Interval to repeat fading
            normal:   0.1,   // Target opacity
            repeat:   0.5    // Initial opacity for repeats
        };
        
        var startFade = function(el) {
            if (el.css("opacity") == config.normal) {
                el.css({ opacity: config.repeat })
            }
            el.fadeTo(config.duration, config.normal);
        };
        
        var addItemEl = function(i) {
            var el = $("<li>" + i + "</li>").appendTo(numListEl);
            startFade(el);
            setInterval(function() {
                startFade(el);
            }, config.interval);
        };
        
        var itemCount = $("li", numListEl).size();
        if (itemCount == 0) {
            addItemEl(1);
            itemCount += 1;
        }
        var oneHeight = $("li", numListEl).height();
        
        var addNextEl = function() {
            if ((itemCount * oneHeight) < maxHeight) {
                itemCount += 1;
                addItemEl(itemCount);
                setTimeout(addNextEl, config.delay);
            }
        };
        addNextEl();
    }
};

$(document).ready(function() {
    YUNG.showLineNumbers();
});

try {
    var pageTracker = _gat._getTracker("UA-9951783-2");
    pageTracker._trackPageview();
} catch(err) {}
