/**
 * TODO:
 * 1-错误级别的定义
 * 2-本地缓存监控的内容,累计到阈值后发送到服务器
 * 3-同一个错误的反复报错的控制,以及报错次数的控制
 */



function JS_Error (jserror) {
    /*{ msg: jserror[0], url:  jserror[1], line:  jserror[2],letter: jserror[3],type: jserror[4] }*/

    return {
        timestamp: (new Date()).getTime(),
        src:location.href,
        msg: encodeURIComponent(jserror[0]),
        url:  jserror[1],
        line:  jserror[2],
        letter:jserror[3],
        type: encodeURIComponent(jserror[4])
    };


}


function runMethod(method) {
    try {
        method();
    } catch(ex) {
        M.log({ msg: ex.message, type:'try-catch' });
    }
}

module.exports = JS_Error;