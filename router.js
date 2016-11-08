/*修复引入外部js问题 修复 when的问题*/
function router(obj) {
    this.view = obj;
    this.info = [];
    this.flag = true;
    this.init();
    this.pathInfo="";
}
router.prototype = {
    config: function () {

        if (this.flag) {
            this.check();
        }
    },
    check: function () {
        var that = this;
        var hash = location.hash.substr(1);
        for (var i = 0; i < this.info.length; i++) {
            if(hash==this.info[i].url){
                if (this.info[i].temp.indexOf("$$") == -1) {
                    var url = this.info[i].temp;
                    var obj = "default";
                } else {

                    var index = this.info[i].temp.indexOf("$$");
                    var url = this.info[i].temp.slice(0, index);

                    var obj = this.info[i].temp.slice(index + 2);
                }
                history.pushState({temp: url,box:obj}, "", "");

                var box1 = that.checkBox(obj);

                $.ajax({
                    url: url,
                    dataType:"html",
                    success: function (e) {
                        that.parse(e);
                        box1.html(e);
                    }
                })
            }
        }

    },
    when: function (param) {

        var that = this;/**************/
        var hash = location.hash;
        if(hash){
            if(hash.substr(1)==param.url) {
                if (param.temp.indexOf("$$") == -1) {
                    var url = param.temp;
                    var obj = "default";
                } else {

                    var index = param.temp.indexOf("$$");
                    var url = param.temp.slice(0, index);

                    var obj = param.temp.slice(index + 2);
                }
            }
        }else {
            if (param.temp.indexOf("$$") == -1) {
                var url = param.temp;
                var obj = "default";
            } else {

                var index = param.temp.indexOf("$$");
                var url = param.temp.slice(0, index);

                var obj = param.temp.slice(index + 2);
            }
        }
        var box1=that.checkBox(obj);
        that.pathInfo+=that.pathInfo?";"+url+"&"+obj:url+"&"+obj;
            that.flag = false;

            history.pushState({temp: url,box:obj}, "", "#"+url+"$$"+obj);

            $.ajax({
                url: url,
                dataType:"html",
                success: function (e) {
                   that.parse(e);
                   box1.html(e);

                    if(box1.animateIn){
                        box1.css("-webkit-animation","");
                        var t=setTimeout(function(){
                            box1.css("-webkit-animation",box1.animateIn);
                            clearTimeout(t);
                        },30)

                    }
                }
            })
        

        return this;
    },
    parse:function(e){
        var reg=/<script\s*src\s*=\s*\"(.*)\">\s*<\/script>/;
        if(!reg.test(e)){
            return;
        }
        var reg=/<script\s*src\s*=\s*\"(.*)\">\s*<\/script>/g;
        var str=[];
        while(obj=reg.exec(e)){
            str.push(obj[1]);
        }
        //alert(str[0]);
        for(var i=0;i<str.length;i++){

            $.ajax({
                url:str[i].toString()
            })
        }
    },
    other: function (param) {

        this.info.push(param);
        return this;

    },
    init: function () {
        var that = this;
        $("body").delegate("a[ui-router]", "click", function (e) {

            e.preventDefault();

            if($(this).attr("ui-router").indexOf("$$")==-1){
                var url = $(this).attr("ui-router");
                var obj = "default";

            }else {


                var index = $(this).attr("ui-router").indexOf("$$");
                var url = $(this).attr("ui-router").slice(0, index);

                var obj = $(this).attr("ui-router").slice(index + 2);
            }
             that.pathInfo+=that.pathInfo?";"+url+"&"+obj:url+"&"+obj;

                history.pushState({temp: url, box: obj,pathInfo:that.pathInfo}, "", "#" + url + "$$" + obj);
                //检测相对应的容器
            var box=that.checkBox(obj);
                $.ajax({
                    url: url,
                    success: function (e) {
                        that.parse(e);
                        box.html(e);
                        if(box.animateIn){
                            box.css("-webkit-animation","");
                            var t=setTimeout(function(){
                                box.css("-webkit-animation",box.animateIn);
                                clearTimeout(t);
                            },30)

                        }
                    }
                })

        })

        this.popstate();
        return this;
    },
    checkBox:function(obj){
        var that=this;
        for(var i=0;i<that.view.length;i++){
            var name=that.view[i].name||"default";

            if(obj==name){
                if(that.view[i].animateIn){
                    that.view[i].obj.animateIn=that.view[i].animateIn;

                }
                if(that.view[i].animateOut){
                    that.view[i].obj.animateOut=that.view[i].animateOut;
                }
               return that.view[i].obj;
            }
        }
    },
    popstate: function () {

        var that = this;
        window.addEventListener("popstate", function () {
          if(!that.pathInfo){
              return false;
          }

          var pathInfo=that.pathInfo.split(";");
          var popInfo=pathInfo.pop().split("&");
            that.pathInfo=pathInfo.join(";");
          var popTemp=popInfo[0];
          var popbox=popInfo[1];
          var box=that.checkBox(popbox)
          box.html("");

         for(var i=pathInfo.length-1;i>=0;i--){
             var infoArr=pathInfo[i].split("&");
             if(infoArr[1]==popbox){
                 $.ajax({
                     url:infoArr[0],
                     success:function(e){
                         that.parse(e);
                         box.html(e);
                         if(box.animateOut){
                             box.css("-webkit-animation","");
                             var t=setTimeout(function(){
                                 box.css("-webkit-animation",box.animateOut);
                                 clearTimeout(t);
                             },30)
                         }
                 }
                 })
                 return;

             }

         }


        }, false)
    }
}