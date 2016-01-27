



function JS_Error (jserror) {
    /*{ msg: jserror[0], url:  jserror[1], line:  jserror[2],letter: jserror[3],type: jserror[4] }*/

    return {
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