/* Copyright (c) 2009-2011, Timothy Yung. All rights reserved.
   Special thanks to Anhang Zhu. */

var YUNG = {
    init: function () {
        this.initEmailLink();
        this.initLineNumbers();
        this.initAliasEffect();
        this.initDrops();
    },
    initEmailLink: function () {
        // Indirect creation of href to trick ze spambots.
        $("a:last").attr({
            href: ["m", "ilto:yungsters@gm", "il.com"].join("a")
        });
    },
    initLineNumbers: function () {
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
    initAliasEffect: function () {
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
    initDrops: function () {
        var config = {
            speed:   15,  // Milliseconds per pixel of movement
            gravity: 500, // Milliseconds of the final fall
            height:  2,   // Height of the drop (also defined in CSS)
            growth:  2,   // Height change before the final fall
            opacity: 0.5, // Opacity of the drop
            filling: 0.7, // Opacity of the drop before the final fall
            fall:    200, // Distance of the final fall
            pause:   750  // Pause before the final fall
        };
        var Drop = function (top, left, path) {
            this.el = $("<div></div>", {
              className: "drop"
            }).hide().prependTo("body");
            this.path = path;
            this.animating = false;
            this.initial = {
                marginTop:  top,
                marginLeft: left,
                height:     config.height,
                opacity:    config.opacity
            };
        };
        Drop.prototype.start = function () {
            if (!this.animating) {
                this.animating = true;
                this.el.show();
                this.el.css(this.initial);
                return true;
            } else {
                return false;
            }
        };
        Drop.prototype.stop = function () {
            this.el.hide();
            this.animating = false;
            return true;
        };
        Drop.prototype.shift = function (top, left) {
            var distance = Math.sqrt(top * top + left * left);
            return this.el.animate({
                marginTop:  (top  < 0 ? "-=" : "+=") + Math.abs(top),
                marginLeft: (left < 0 ? "-=" : "+=") + Math.abs(left)
            }, (distance * config.speed), "linear");
        };
        Drop.prototype.animate = function (callback) {
            var self = this;
            if (self.start()) {
                for (var i = 0; i < self.path.length; i++) {
                    self.shift(self.path[i][0], self.path[i][1]);
                }
                self.el.animate({
                    height: config.height + config.growth,
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
            return self;
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
            new Drop(150, 213, [
                [48, -20],
                [15, -3],
                [20, -3],
                [30, 1],
                [20, 3],
                [20, 6],
                [15, 5],
                [ 5, 2]
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
            new Drop(150, 265, [
                [26, -19],
                [31, -30],
                [19, -24],
                [12, -20],
                [13, -32],
                [13, -37],
                [ 9, -19],
                [ 8, -13],
                [ 9, -10],
                [ 9, -8],
                [13, -4],
                [ 9, -2],
                [ 6, -1],
                [49, -2],
                [12, -3],
                [13, -8],
                [ 9, -9],
                [ 7, -12],
                [ 6, -19],
                [ 3, -20]
            ]),
            new Drop(150, 280, [
                [50, -6],
                [50, -4],
                [35, 0],
                [35, 3],
                [33, 9],
                [16, 8],
                [12, 9],
                [11, 15]
            ]),
            new Drop(150, 346, [
                [17, 12],
                [19, 11],
                [16, 9],
                [21, 7],
                [14, 3],
                [29, 0]
            ]),
            new Drop(150, 369, [
                [29, -11],
                [34, -21],
                [14, -7],
                [21, -6],
                [25, -2],
                [23, 2],
                [41, 11],
                [31, 11],
                [24, 6],
                [31, 3],
                [28, -4],
                [27, -9],
                [22, -11],
                [18, -16],
                [8, -12]
            ])
        ];
        
        // Invoke callback if this window is active.
        var ifActive = (function () {
          var lastActive = (new Date()).getTime();
          var inactivity = 5000; // ms
          $(window).mousemove(function () {
            lastActive = (new Date()).getTime();
          });
          return function (callback) {
            return function () {
              var now = (new Date()).getTime();
              if (lastActive > now - inactivity) {
                callback();
              }
            }
          };
        })();
        
        setInterval(ifActive(function () { drops[0].animate(); }),  4750);
        setInterval(ifActive(function () { drops[1].animate(); }),  2250);
        setInterval(ifActive(function () { drops[2].animate(); }), 10000);
        setInterval(ifActive(function () { drops[3].animate(); }),  7500);
        setInterval(ifActive(function () { drops[4].animate(); }),  6250);
        drops[4].animate();
        setInterval(ifActive(function () { drops[5].animate(); }),  3000);
        setInterval(ifActive(function () { drops[6].animate(); }),  5000);
    },
    initTranslation: (function () {
        var config = {
                delay:    175,
                variance: 125
            },
            getDelay = function () {
                return Math.floor(config.delay + (
                    (Math.random() * 100 % (config.variance * 2)
                ) - config.variance));
            },
            stepThrough = function (stepConfig, context) {
                var steps = [];
                
                for (var i = 0; i < stepConfig.length; i++) {
                    steps.push(new Step(stepConfig[i]));
                }
                
                var nextStep = function () {
                    steps[0].execute(context) === 0 && steps.shift();
                    if (steps.length > 0) {
                        setTimeout(nextStep, getDelay());
                    }
                };
                nextStep();
            };
        
        var Step = function (config) {
            this.count  = config.shift();
            this.action = config.shift();
            this.args   = config;
        };
        Step.prototype = {
            execute: function (context) {
                if (this.count > 0) {
                    this.action.apply(context || this, this.args);
                    this.count -= 1;
                }
                return this.count;
            }
        };
        
        return function () {
            var _dfn  = $("dfn"),
                _em   = $("em"),
                _ul   = $("ul");
            
            var steps;
            
            // Line 1
            stepThrough([
                [ 4, function (a) { $(_dfn[0]).before(a.shift()); }, ['v', 'a', 'r', ' '] ],
                [ 2, function (n) { n.nodeValue = n.nodeValue.substring(1); }, _dfn[0].nextSibling ],
                [ 4, function () { $(_dfn[1]).html($(_dfn[1]).html().substr(0, $(_dfn[1]).html().length - 1)); } ],
                [ 1, function () { $(_dfn[1]).remove(); } ],
                [ 1, function () { $(_em[1]).before($(_dfn[1])); } ],
                [ 4, function (a) { $(_dfn[1]).html($(_dfn[1]).html() + a.shift()); }, ['l', 'i', 'a', 's'] ],
                [ 3, function (a) { $(_em[1]).before(a.shift()) }, [' ', '=', ' '] ],
                [ 1, function () { $(_em[1]).after(';') } ]
            ], this);
            
            var translateDeclaration = function (container, shortKey) {
                var steps = [],
                    _dfn  = $(container).find('dfn:first');
                
                steps.push(
                    [ 4, function (a) { _dfn.before(a.shift()); }, ['v', 'a', 'r', ' '] ]
                );
                
                if (shortKey) {
                    steps.push(
                        [ 1, function () { _dfn.after('<dfn />'); } ],
                        [ 3, function (a) { _dfn.after(a.shift()); }, [' ', '=', ' '] ],
                        [ 1, function () { $(container).find('dfn')[1].innerHTML = shortKey; } ]
                    );
                }
                
                return steps;
            };
            
            var translateObject = function (container) {
                var steps = [],
                    li = $(container).find('li');
                
                li.each(function (index) {
                    steps.push(
                        [ 1, function (n) { n.html(n.html().substring(1)); }, $(this).find('dfn') ],
                        [ 3, function (n) { n.nodeValue = n.nodeValue.substring(1); }, $(this).find('dfn')[0].nextSibling ],
                        [ 3, function (n, a) { n.before(a.shift()) }, $(this).find('em, strong'), [':', ' ', ' '] ]
                    );
                    if (index < li.length - 1) {
                        steps.push(
                            [ 1, function (n, a) { n.after(',') }, $(this).find('em, strong') ]
                        );
                    }
                });
                
                return steps;
            };
            
            var translateSection = function () {
                var _dfn  = $(this).find('dfn:first'),
                    _code = $(this).find('code:last');
                
                var shortKey = _dfn.html()[0];
                
                steps = translateDeclaration(this, shortKey)
                    .concat(translateObject(this));
                
                steps.push(
                    [ 1, function () { $(_code[0]).css({ background: '#fff', color: '#000' }); } ],
                    [ 1, function () { $(_code[0]).css({ background: '', color: '' }).html('&nbsp;'); } ]
                );
                var code = (
                    '}; ' + shortKey + '.keys.map(function (n) {return \'<a href="\'' + shortKey + '[n] + \'">\' + n + \'</a>\');}).join(\'<br />\');'
                ).split('');
                steps.push(
                    [ 1, function (a) { _code.html(a.shift()); }, code ],
                    [ code.length - 1, function (a) { _code.html(_code.html() + a.shift()); }, code ]
                );
                
                stepThrough(steps, this);
            };
            
            var translateAside = function () {
                var _code = $(this).find('code:last');
                
                steps = translateDeclaration(this)
                    .concat(translateObject(this));
                
                steps.push(
                    [ 1, function () { _code.html(_code.html() + ';'); } ]
                );
                
                stepThrough(steps, this);
            };
            
            var translateFooter = function () {
                var _code = $(this).find('code:last');
                
                steps = translateDeclaration(this);
                
                steps.push(
                    [ 4, function () { _code.html(_code.html().substr(0, _code.html().length - 1)); } ],
                    [ 6, function (a) { _code.html(_code.html() + a.shift()); }, ['(', '\'', ' ', '\'', ')', ';'] ]
                );
                
                stepThrough(steps, this);
            };
            
            $('section').each(translateSection);
            $('aside').each(translateAside);
            $('footer').each(translateFooter);
        };
    })()
};

$(document).ready(function () {
    YUNG.init();
    setTimeout(function () {
        YUNG.initTranslation();
    }, 2500);
});

try {
    var pageTracker = _gat._getTracker("UA-9951783-2");
    pageTracker._trackPageview();
} catch(err) {}
