/* Copyright (c) 2009, Timothy Yung & Anhang Zhu. All rights reserved. */

var YUNG = {
    showLineNumbers: function() {
        var config = {
            duration: 200,   // Fade duration
            delay:    25,    // Delay between adding lines
            interval: 15000, // Interval to repeat fading
            normal:   0.1,   // Target opacity
            repeat:   0.5,   // Initial opacity for repeats
            hover:    0.7    // Mouseover opacity
        };
        var container = $("<ol id=\"line-numbers\"></ol>").prependTo("body");
        var numCount = 0;
        
        var addNumber = function() {
            var el = $("<li>" + ++numCount + "</li>").appendTo(container);
            el.fadeTo(config.duration, config.normal);
            setInterval(function() {
                if (el.css("opacity") == config.normal) {
                    el.css({ opacity: config.repeat })
                    el.fadeTo(config.duration, config.normal);
                }
            }, config.interval);
        };
        
        addNumber();
        var eachHeight = $("li", container).height();
        var fullHeight = container.height();
        
        var addUntilFull = function() {
            if ((numCount * eachHeight) < fullHeight) {
                addNumber();
                setTimeout(addUntilFull, config.delay);
            }
        };
        addUntilFull();
        
        $("a[data-line]").mouseover(function() {
            var lineNumber = parseInt(this.getAttribute("data-line"), 10);
            $("li:eq(" + (lineNumber - 1) + ")", container).css({ opacity: config.hover });
        });
        
        $("a[data-line]").mouseout(function() {
            var lineNumber = parseInt(this.getAttribute("data-line"), 10);
            $("li:eq(" + (lineNumber - 1) + ")", container).css({ opacity: config.normal });
        });
    },
    attachAliasEffect: function() {
        var config = {
            delay: 70,         // Delay between transforming characters
            alias: "yungsters" // Target replacement string
        };
        var randomChar = function() {
            return String.fromCharCode(97 + Math.round(Math.random() * 25));
        };
        var swapCharAt = function(string, index, char) {
            return string.substr(0, index) + char + string.substr(index + 1, string.length);
        };
        var transformNextChar = function(el) {
            if (!el.hasOwnProperty("step")) {
                el.step = 0;
            }
            if (el.step < 15) {
                if (el.step < 5) {
                    el.innerHTML = swapCharAt(el.innerHTML, el.step + 2, randomChar());
                } else if (el.step < 6) {
                    el.innerHTML = swapCharAt(el.innerHTML, el.step + 2, randomChar() + "}");
                } else if (el.step < 13) {
                    el.innerHTML = swapCharAt(el.innerHTML, el.step - 4, config.alias.charAt(el.step - 4))
                } else {
                    el.innerHTML = swapCharAt(el.innerHTML, 14 - el.step, config.alias.charAt(14 - el.step));
                }
                el.step ++;
                setTimeout(function() {
                    transformNextChar(el);
                }, config.delay);
            }
        };
        
        $("mark").each(function(i) {
            var el = this;
            $(el).closest("a").mouseover(function() {
                transformNextChar(el);
            });
        });
    }
};

$(document).ready(function() {
    YUNG.showLineNumbers();
    YUNG.attachAliasEffect();
});

try {
    var pageTracker = _gat._getTracker("UA-9951783-2");
    pageTracker._trackPageview();
} catch(err) {}
