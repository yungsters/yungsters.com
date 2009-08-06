/* Copyright (c) 2009, Timothy Yung. All rights reserved.
   Special thanks to Anhang Zhu. */

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
            container.height($(window).height()).height($(document).height());
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
            $(el).closest("a").mouseover(function () {
                if (!el.step) {
                    el.step = 0;
                    transformNextChar(el);
                }
            });
        });
    },
    animateDrops: function () {
        var config = {
            speed: 15,    // Milliseconds per pixel of movement
            gravity: 500, // Speed of the final fall
            opacity: 0.6, // Opacity of the drop
            filling: 0.9, // Opacity of the drop at the end
            fall: 200,    // Distance of the final fall
            pause: 750    // Pause before the final fall
        };
        var Drop = function (top, left, path) {
            this.el = $("<div class=\"drop\"></div>");
            this.path = path;
            this.animating = false;
            this.initial = {
                marginTop:  top,
                marginLeft: left,
                opacity:    config.opacity
            };
        };
        Drop.prototype.start = function () {
            if (!this.animating) {
                this.animating = true;
                $("body").prepend(this.el);
                this.el.css(this.initial);
                return true;
            } else {
                return false;
            }
        };
        Drop.prototype.stop = function () {
            this.el.remove();
            this.animating = false;
            return true;
        };
        Drop.prototype.shift = function (top, left) {
            return this.el.animate({
                marginTop:  (top  < 0 ? "-=" : "+=") + Math.abs(top),
                marginLeft: (left < 0 ? "-=" : "+=") + Math.abs(left)
            }, (top * config.speed), "linear");
        };
        Drop.prototype.animate = function (callback) {
            if (this.start()) {
                for (var i = 0; i < this.path.length; i++) {
                    this.shift(this.path[i][0], this.path[i][1]);
                }
                var self = this;
                this.el.animate({
                    opacity: config.filling
                }, config.pause).animate({
                    marginTop: "+=" + config.fall,
                    opacity: 0
                }, config.gravity, "swing", function () {
                    self.stop();
                    if (callback) {
                        callback();
                    }
                });
            }
            return this;
        };
        
        var drops = [
            new Drop(150, 145, [
                [ 8, -2],
                [13, 1],
                [ 8, 2],
                [ 6, 2],
                [ 5, 3],
                [ 7, 5]
            ]),
            new Drop(150, 212, [
                [48, -20],
                [15, -3],
                [20, -3],
                [30, 1],
                [20, 3],
                [20, 6],
                [15, 5],
                [ 6, 2]
            ]),
            new Drop(150, 245, [
                [37, 5],
                [15, 3],
                [20, 2],
                [25, 1],
                [20, -2],
                [15, -4],
                [17, -7],
                [25, -15],
                [25, -23],
                [22, -25],
                [29, -35],
                [13, -13],
                [10, -10],
                [10, -9],
                [15, -12],
                [20, -10],
                [18, -4],
                [20, 0],
                [10, 1],
                [14, 3],
                [12, 5]
            ]),
            new Drop(150, 279, [
                [50, -6],
                [50, -4],
                [35, 0],
                [35, 3],
                [33, 9],
                [16, 8],
                [12, 9],
                [11, 14]
            ])
        ];
        setInterval(function () { drops[0].animate(); }, 4750);
        setInterval(function () { drops[1].animate(); }, 2250);
        setInterval(function () { drops[2].animate(); }, 9500);
        setInterval(function () { drops[3].animate(); }, 6250);
        drops[3].animate();
    }
};

$(document).ready(function () {
    YUNG.createEmailLink();
    YUNG.showLineNumbers();
    YUNG.attachAliasEffect();
    YUNG.animateDrops();
});

try {
    var pageTracker = _gat._getTracker("UA-9951783-2");
    pageTracker._trackPageview();
} catch(err) {}
