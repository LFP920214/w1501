(function ($) {
//单击
    var touches = {};
    //滚动速度因子
    $.speed = 0.6;
    //hold持续事件
    $.holdDelay = 700;
    //滑动阀值
    $.swipeLen = 30;
    //tap事件事件句柄
    touches.tapTime = [];
    //hold事件事件句柄
    touches.holdTime = [];
    //swipe事件句柄
    touches.swipeTime = [];
    //拖拽句柄
    touches.dragTime = [];
    //旋转事件句柄
    touches.rotateTime = [];
    //滚动时阻止默认滚动事件
    $.isscroll = true;
    if ($.isscroll == true) {

        $(function () {
            $("body").css({
                // overflow:"hidden"
            })
            var scrollBar = $("<div>");
            scrollBar.css({
                position: "fixed",
                "z-index": 999,
                width: 3,
                height: 50,
                right: 1,
                background: "#aaa",
                "border-radius": "2px",
                top: 0,
                display: "none"
            }).appendTo("body");
            $.scrollBar = scrollBar;
        })


        document.addEventListener("touchmove", function (e) {

            e.preventDefault();
        }, false)


    }

    //禁止自定义 页面滚动
    $.ispagescroll = true;

    //touchstart事件
    touches.tap = function (callback) {
        this.each(function (index, obj) {

            obj.addEventListener("touchstart", function (e) {
                var data = _eventVal(e)
                obj.tapTime = setTimeout(function () {
                    callback.call(obj, data)
                }, 240)
                touches.tapTime.push(obj.tapTime);
            }, false)
        })
    }

    //touchend事件
    touches.tapEnd = function (callback) {
        this.each(function (index, obj) {
            obj.addEventListener("touchend", function (e) {
                callback.call(obj, e);

            }, false)
        })
    }

    //hold事件
    touches.hold = function (callback) {
        this.tap(function (e) {

            this.holdTime = setTimeout(function () {
                e.preventDefault();
                callback.call(this, e);
            }, $.holdDelay)
            touches.holdTime.push(this.holdTime);
        })
        this.tapEnd(function () {
            clearTimeout(this.holdTime)
        })
    }

    //手指滑动事件
    touches._move = function (callback) {
        this.each(function (index, obj) {
            obj.addEventListener("touchmove", function (e) {
                var data = _eventVal(e);
                callback(data)
            }, false)
        })
    }


    //滑动事件
    touches.swipe = function (callback) {
        var x, y, x1, y1;
        this.each(function (index, obj) {

            obj.addEventListener("touchstart", function (e) {
                obj.swipeTime = setTimeout(function () {
                    x = e.touches[0].clientX;
                    y = e.touches[0].clientY;
                    obj.addEventListener("touchmove", move, false)
                }, 0)
                touches.swipeTime.push(obj.swipeTime);
            }, false);
            obj.addEventListener("touchend", end, false);
        })
        function move(e) {
            _stops();
            x1 = e.touches[0].clientX;
            y1 = e.touches[0].clientY;
            var obj = {x: x, y: y, x1: x1, y1: y1, lenx: Math.abs(x - x1), leny: Math.abs(y - y1)};
            var data = _eventVal(e, obj);
            if (Math.abs(x - x1) > $.swipeLen || Math.abs(y - y1) > $.swipeLen) {
                callback.call(this, data);
            }

        }

        function end(e) {
            this.removeEventListener("touchmove", move, false);

        }
    }

    //左滑
    touches.swipeLeft = function (callback) {
        this.swipe(function (e) {
            if (Math.abs(e.x - e.x1) > Math.abs(e.y - e.y1)) {
                if (e.x > e.x1) {
                    e.len = Math.abs(e.x - e.x1);
                    var data = _eventVal(e);
                    callback.call(this, data);
                }
            }
        })
    }


    //右滑
    touches.swipeRight = function (callback) {
        this.swipe(function (e) {
            if (Math.abs(e.x - e.x1) > Math.abs(e.y - e.y1)) {
                if (e.x < e.x1) {
                    e.len = Math.abs(e.x - e.x1);
                    var data = _eventVal(e);
                    callback.call(this, data);
                }
            }
        })
    }

    //上滑
    touches.swipeUp = function (callback) {
        this.swipe(function (e) {
            if (Math.abs(e.x - e.x1) < Math.abs(e.y - e.y1)) {
                if (e.y > e.y1) {
                    e.len = Math.abs(e.y - e.y1);
                    var data = _eventVal(e);
                    callback.call(this, data);
                }
            }
        })
    }

    //下滑
    touches.swipeDown = function (callback) {
        this.swipe(function (e) {
            if (Math.abs(e.x - e.x1) < Math.abs(e.y - e.y1)) {
                if (e.y < e.y1) {
                    e.len = Math.abs(e.y - e.y1);
                    var data = _eventVal(e);
                    callback.call(this, data);
                }
            }
        })
    }

    //拖拽事件

    touches.drag = function (callback, dir) {
        var x, y, startx, starty, initx, inity, x1, y1, data, currentx, currenty;
        this.each(function (index, obj) {

            obj.addEventListener("touchstart", function (e) {
                obj.dragTime = setTimeout(function () {
                    x = e.touches[0].clientX;
                    y = e.touches[0].clientY;
                    startx = e.touches[0].clientX;
                    starty = e.touches[0].clientY;
                    initx = e.touches[0].clientX;
                    inity = e.touches[0].clientY;
                    obj.addEventListener("touchmove", move, false)
                }, 0)
                touches.dragTime.push(obj.dragTime);
            }, false);
            obj.addEventListener("touchend", end, false);
        })
        function move(e) {
           _stops();
            x1 = e.touches[0].clientX;
            y1 = e.touches[0].clientY;
            currentx = x1 - x;
            currenty = y1 - y;
            if (x1 < startx) {

                if (x1 > x) {
                    startx = x;
                }
            }
            if (x1 > startx) {

                if (x1 < x) {
                    startx = x;
                }
            }

            if (y1 < starty) {

                if (y1 > y) {
                    starty = y;
                }
            }
            if (y1 > starty) {

                if (y1 < y) {
                    starty = y;
                }
            }

            var obj = {
                x: x,
                y: y,
                x1: x1,
                y1: y1,
                lenx: Math.abs(x1 - initx),
                leny: Math.abs(y1 - inity),
                currentx: currentx,
                currenty: currenty
            }
            data = _eventVal(e, obj);
            if (dir == undefined) {
                callback.call(this, data);
            }
            if (dir == "x") {
                if (Math.abs(x - x1) > Math.abs(y - y1)) {
                    if (x1 < x) {
                        data.dir = "l"
                    } else {
                        data.dir = "r";
                    }
                    callback.call(this, data);
                }
            }
            if (dir == "y") {
                if (Math.abs(x - x1) < Math.abs(y - y1)) {
                    if (y1 < y) {
                        data.dir = "t"
                    } else {
                        data.dir = "b";
                    }
                    callback.call(this, data);
                }
            }

            x = x1;
            y = y1;
        }

        function end(e) {
            this.removeEventListener("touchmove", move, false);

        }
    }

//页面滚动事件
    touches.pagescroll = function (callback, endcallback) {
        var x, y, startx, starty, initx, inity, x1, y1, data, currenty, currentx, istop = true, isbottom = false, scrollTop, clientH, scrollH;
        this.each(function (index, obj) {
            obj.addEventListener("touchstart", function (e) {
                if (!$.ispagescroll) {
                    return;
                }
                $.scrollBar.css("display", "block");
                webkitCancelRequestAnimationFrame(document.scrolltime);
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
                startx = e.touches[0].clientX;
                starty = e.touches[0].clientY;
                initx = e.touches[0].clientX;
                inity = e.touches[0].clientY;
                obj.addEventListener("touchmove", move, false);

            }, false);
            obj.addEventListener("touchend", end, false);
        })
        function move(e) {
            _stops();
            scrollTop = document.body.scrollTop;

            scrollH = document.documentElement.scrollHeight;

            clientH = document.documentElement.clientHeight;

            x1 = e.touches[0].clientX;
            y1 = e.touches[0].clientY;
            currentx = x1 - x;
            currenty = y1 - y;
            if (x1 < startx) {
                if (x1 > x) {
                    startx = x;
                }
            }
            if (x1 > startx) {
                if (x1 < x) {
                    startx = x;
                }
            }

            if (y1 < starty) {
                if (y1 > y) {
                    starty = y;
                }
            }
            if (y1 > starty) {
                if (y1 < y) {
                    starty = y;
                }
            }


            if (scrollTop == 0) {
                istop = true;
            } else {
                istop = false;
            }

            if (scrollTop >= scrollH - clientH) {
                isbottom = true;
            } else {
                isbottom = false;
            }
            var obj = {
                x: x,
                y: y,
                x1: x1,
                y1: y1,
                lenx: Math.abs(x1 - initx),
                leny: Math.abs(y1 - inity),
                currentx: currentx,
                currenty: currenty
            }
            data = _eventVal(e, obj);

            if (Math.abs(x - x1) < Math.abs(y - y1)) {
                if (y1 < y) {
                    data.dir = "t"
                } else {
                    data.dir = "b";
                }
                data.istop = istop;
                data.isbottom = isbottom;
                var temp = $(window).scrollTop();
                $(window).scrollTop(temp - currenty);
                $.scrollBar.css("margin-top", (clientH - 50) / (scrollH - clientH) * $(window).scrollTop());

                if (callback) {

                    callback.call(this, data);
                }
            }

            x = x1;
            y = y1;
            //e.stopPropagation();

        }

        function end(e) {
            document.scrolltime = webkitRequestAnimationFrame(aa)
            function aa() {
                currenty *= $.speed;
                if (currenty > 0) {
                    if (currenty < 0.1) {
                        webkitCancelRequestAnimationFrame(document.scrolltime);
                        $.scrollBar.css("display", "none");
                        if (endcallback) {
                            endcallback(data)
                        }
                    }
                }
                if (currenty < 0) {
                    if (currenty > -0.1) {
                        webkitCancelRequestAnimationFrame(document.scrolltime);
                        $.scrollBar.css("display", "none");
                        if (endcallback) {
                            endcallback(data)
                        }
                    }
                }
                if (Math.abs(currenty) >= 0.1) {

                    var temp = $(window).scrollTop();
                    $(window).scrollTop(temp - currenty * 5);

                    $.scrollBar.css("margin-top", (clientH - 50) / (scrollH - clientH) * $(window).scrollTop());
                    document.scrolltime = webkitRequestAnimationFrame(aa)
                }
            }

            this.removeEventListener("touchmove", move, false);
            $.scrollBar.css("display", "none");
            e.stopPropagation();
        }

    }

    //旋转事件
    touches.rotate = function (callback) {
        var startx;
        var starty;
        var centerx;
        var centery;
        var angle = 0;
        this.each(function (index, obj) {

            obj.addEventListener("touchstart", function (e) {
                $.ispagescroll = false;
                obj.rotateTime = setTimeout(function () {
                    obj.addEventListener("touchmove", move, false);
                    obj.addEventListener("touchend", end, false);

                }, 0)
                centerx = $(this).offset().left + (this.offsetWidth / 2);
                centery = $(this).offset().top + (this.offsetHeight / 2);
                startx = e.touches[0].pageX;
                starty = e.touches[0].pageY;

                touches.rotateTime.push(obj.rotateTime);
                e.preventDefault();
            }, false)


        })
        function move(e) {
            _stops()
            var speed = 5;
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            var newx = x - startx;
            var newy = y - starty;
            var aa = Math.atan2(centery - y, centerx - x) * 180 / Math.PI;
            console.log(aa + 360);
            e.angle = aa;
            if (callback) {
                callback.call(this, e)
            }
            startx = x;
            starty = y
            e.preventDefault();

        }

        function end(e) {
            this.removeEventListener("touchmove", move, false);
            this.removeEventListener("touchend", end, false);
            $.ispagescroll = true;
            e.stopPropagation()

        }
    }
    //停止某个事件
    function _stop(arr) {
        arr.forEach(function (e) {

            clearTimeout(e);
        })
    }

    //取消所有事件
    function _stops() {
        //tap事件事件句柄
        _stop(touches.tapTime)
        //hold事件事件句柄
        _stop(touches.holdTime)
        //swipe事件句柄
        _stop(touches.swipeTime)
        //拖拽句柄
        _stop(touches.dragTime)
        //旋转句柄
        _stop(touches.rotateTime)
    }

    //滚动取消所有事件
    window.addEventListener("scroll", function () {
        _stops();
    }, false)


    //处理事件对象返回值
    function _eventVal(e, obj) {
        var data = e;
        data.clientX = e.touches[0].clientX;
        data.screenX = e.touches[0].screenX;
        data.pageX = e.touches[0].pageX;
        if (obj) {
            data.x = obj.x;
            data.y = obj.y;
            data.x1 = obj.x1;
            data.y1 = obj.y1;
            data.lenx = obj.lenx;
            data.leny = obj.leny;
            data.currentx = obj.currentx;
            data.currenty = obj.currenty;
        }
        return data;
    }

    $.extend($.fn, touches);
    $.fn

})(Zepto);