/* Copyright (c) 2009, Timothy Yung & Anhang Zhu. All rights reserved. */

var YUNG = {
    createEmailLink: function () {
        var domain = "gmail.com"; // Indirection to trick spambots
        $("a:last").attr({ href: "mailto:yungsters@" + domain });
    },
    showLineNumbers: function () {
        var config = {
            duration: 200,   // Fade duration
            delay:    25,    // Delay between adding lines
            interval: 15000, // Interval to repeat fading
            normal:   0.1,   // Target opacity
            repeat:   0.5,   // Initial opacity for repeats
            hover:    0.7    // Mouseover opacity
        };
        var container  = $("<ol id=\"line-numbers\"></ol>").prependTo("body");
        var firstEl    = $("<li>1</li>").appendTo(container);
        var eachHeight = firstEl.height();
        var numCount   = 1;
        
        firstEl.fadeTo(config.duration, config.normal);
        
        var addNumbers = function () {
            if ((numCount * eachHeight) < container.height()) {
                var el = $("<li>" + ++numCount + "</li>").appendTo(container);
                el.fadeTo(config.duration, config.normal);
                setTimeout(addNumbers, config.delay);
            }
        };
        var resizeContainer = function () {
            container.css({ height: $(document).height() });
            addNumbers();
        };
        resizeContainer();
        $(window).resize(resizeContainer);
        
        var fadeNumbers = function (el) {
            setTimeout(function () {
                var nextEl = el.next("li");
                if (nextEl.size() > 0) {
                    fadeNumbers(nextEl);
                }
            }, config.delay);
            if (el.css("opacity") != config.hover) {
                el.css({ opacity: config.repeat })
                el.fadeTo(config.duration, config.normal);
            }
        };
        setInterval(function () {
            fadeNumbers(firstEl);
        }, config.interval);

        $("a[data-line]").mouseover(function () {
            var lineNumber = parseInt(this.getAttribute("data-line"), 10);
            var el = $("li:eq(" + (lineNumber - 1) + ")", container);
            el.css({ opacity: config.hover });
        });
        $("a[data-line]").mouseout(function () {
            var lineNumber = parseInt(this.getAttribute("data-line"), 10);
            var el = $("li:eq(" + (lineNumber - 1) + ")", container);
            el.css({ opacity: config.normal });
        });
    },
    attachAliasEffect: function () {
        var config = {
            delay: 70,         // Delay between transforming characters
            alias: "yungsters" // Target replacement string
        };
        var randomChar = function () {
            return String.fromCharCode(97 + Math.round(Math.random() * 25));
        };
        var swapCharAt = function (string, index, char) {
            var prefix = string.substr(0, index);
            var suffix = string.substr(index + 1, string.length);
            return prefix + char + suffix;
        };
        var transformNextChar = function (el) {
            if (!el.hasOwnProperty("step")) {
                el.step = 0;
            }
            if (el.step < 15) {
                if (el.step < 5) {
                    el.innerHTML = swapCharAt(el.innerHTML,
                        el.step + 2, randomChar());
                } else if (el.step < 6) {
                    el.innerHTML = swapCharAt(el.innerHTML,
                        el.step + 2, randomChar() + "}");
                } else if (el.step < 13) {
                    el.innerHTML = swapCharAt(el.innerHTML,
                        el.step - 4, config.alias.charAt(el.step - 4))
                } else {
                    el.innerHTML = swapCharAt(el.innerHTML,
                        14 - el.step, config.alias.charAt(14 - el.step));
                }
                el.step++;
                setTimeout(function () {
                    transformNextChar(el);
                }, config.delay);
            }
        };
        
        $("mark").each(function (i) {
            var el = this;
            var animating = false;
            $(el).closest("a").mouseover(function () {
                if (!animating) {
                    animating = true;
                    transformNextChar(el);
                }
            });
        });
    }
};

$(document).ready(function () {
    YUNG.createEmailLink();
    YUNG.showLineNumbers();
    YUNG.attachAliasEffect();
});

try {
    var pageTracker = _gat._getTracker("UA-9951783-2");
    pageTracker._trackPageview();
} catch(err) {}
