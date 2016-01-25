(function(window){

    var js_GIF_url = "http://120.26.130.83:8098/tj/js.gif";
    var fem_RTC_url = "http://120.26.130.83:8098/tj/rtc.gif";

    function getBrowserInfo() {
        var ua = window.navigator.userAgent.toLowerCase();

        var version = null;
        var browser = {
            ie: false,
            firefox: false,
            safari: false,
            opera: false,
            chrome: false,

            gecko: false,
            webkit: false

        };

        if(window.opera) {
            version = window.opera.version();
            browser.opera = true;
        } else {
            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /ms(ie)\s([\w.]+)/.exec(ua) ||
                /(firefox)[ \/]([\w.]+)/.exec(ua) ||
                [];

            if(match[1]) browser[match[1]] = true;
            version = match[2] || "0";

            if(browser.webkit) {
                browser.safari = true;
                var safariMatch = /version\/([\w.]+)/.exec(ua);
                version = safariMatch[1] || "0";
            }
            if(browser.chrome) browser.webkit = true;
            if(browser.firefox) browser.gecko = true;
        }

        var retInfo = "";
        for(var prop in browser){
            if(browser[prop]){
                retInfo = prop;
                break;
            }
        }
        return retInfo +" "+ version;
    }

    var getEnvInfo=function(){
        var env = navigator["language"] +";"+getBrowserInfo()+";"+navigator["platform"]+";"+window.screen.width+"x"+window.screen.height
    };



    var js_error=function(msg){
        try{

            if(!msg ){
                return ;
            }
            var img1 = new Image();
            img1.src = js_GIF_url+"?"+msg

        }catch(ex){
            console.log(ex);
        }
    };


    var rtc_error  = function(msg){

        try{
            if(!msg ){
                return ;
            }
            var img1 = new Image();
            img1.src = fem_RTC_url+"?"+msg

        }catch(ex){
            console.log(ex);
        }

    };

    var M = {

        toQueryString: function(o) {
            var res = [], p, encode = encodeURIComponent;
            for (p in o) {
                if (o.hasOwnProperty(p)) res.push((p) + '=' + (o[p]));
            }
            return res.join('&');
        },

        JsError: function(info) {
            js_error(M.toQueryString(info));
        },
        rtcError:function(info){
            info = info ||{};
            info.page = location.href;
            rtc_error(M.toQueryString(info));
        },

        runMethod: function(method) {
            try {
                method();
            } catch(ex) {
                M.log({ msg: ex.message, type:'try-catch' });
            }
        }
    };

    var rtcLog=function(info,type,ex){


        /**
         userCall
         window.userCall ={
    		data:dataCache,
    		from:"client"
    }
         */
        try{

            window.userCall = window.userCall ||{};
            var dataCache = window.userCall.data ||{};
            var from = window.userCall.from || "";

            var strUserId = dataCache.userId+","+dataCache.otherUserId;
            if(from == "server"){
                strUserId = dataCache.otherUserId+","+dataCache.userId;
            }

            info = info ||{};
            info.type = type;
            info.from = from;
            info.userinfo = strUserId;

            if(ex){
                ex = ex ||{};
                ex.userinfo = strUserId;
                ex.from = from;
                M.JsError(ex);
            }
            M.rtcError(info);
        }catch(ex){
        }

    }

    window.fem = {

        rtc:rtcLog
    }



    function JS_ERROR_REPORTER (jserror) {
        /*{ msg: jserror[0], url:  jserror[1], line:  jserror[2],letter: jserror[3],type: jserror[4] }*/
        M.JsError({
            /* src:location.href,*/
            msg: encodeURIComponent(jserror[0]),
            url:  jserror[1],
            line:  jserror[2]+"-"+jserror[3],
            type: encodeURIComponent(jserror[4])
        });
        return true;
    }
    /*if(window.DEBUG!=true){
     window.onerror = function () {
     JS_ERROR_REPORTER(Array.prototype.slice.call(arguments));
     }
     }*/


})(window);
