/**
 * @author 郭豪
 * @version [v1.0] 2015-08-28
 * @description ua组件
 * @param UA.trident {Number} - trident 的版本号
 * @param UA.webkit {Number} - webkit 的版本号
 * @param UA.gecko {Number} - gecko 的版本号
 * @param UA.presto {Number} - presto 的版本号
 * @param UA.chrome {Number} - chrome 的版本号
 * @param UA.safari {Number} - safari 的版本号
 * @param UA.firefox {Number} - firefox 的版本号
 * @param UA.ie {Number} - ie 的版本号
 * @param UA.opera {Number} - opera 的版本号
 * @param UA.mobile {String} - mobile 的标志符。 若无法探测或非移动设备浏览器，将返回空字符串。
 * @param UA.core {String} - core 的标志符。此标识符表示浏览器的内核标识。若浏览器内核不是 trident, webkit, gecko, presto 将返回空字符串。
 * @param UA.ipad {Number} - ipad ios 版本号。例如 5.0
 * @param UA.ios {Number} - ios 的版本号
 * @param UA.android {Number} - android 的版本号
 * @param UA.browser {String} - 浏览器名称
 * @param UA.browserVersion {Number} - 浏览器版本号
 */
!(function () {
    var win = typeof window !== 'undefined' ? window : {},
        undef,
        doc = win.document,
        ua = win.navigator && win.navigator.userAgent || '';

    function numberify(s) {
        var c = 0;
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    function setTridentVersion(ua, UA) {
        var core, m;
        UA[core = 'trident'] = 0.1;
        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    function getIEVersion(ua) {
        var m, v;
        if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))) {
            return numberify(v);
        }
        return 0;
    }

    function getBrowers(ua, UA) {
        var browerArr = {
            UC: ['UCBrowser'],
            weixin: ['MicroMessenger'],
            qq: ['MQQBrowser'],
            QQ: ['QQ'],
            baidu: ['baiduboxapp'],
            360: ['360 Aphone Browser', 'QHBrowser'],
            sogou: ['SogouMobileBrowser'],
            chrome: ['CriOS']
        };

        var item;
        for (item in browerArr) {
            var thisItem = browerArr[item], i;
            for (i = 0; i < thisItem.length; i++) {
                if (ua.match(thisItem[i])) {
                    UA.browser = item;
                    var reg = eval('/(' + thisItem[i] + '\\/([\\d.]*)|' + thisItem[i] + ' \\(([\\d.]*)' + ')/');
                    UA.browserVersion = ua.match(reg)[1] || {};
                    var ind;
                    if (UA.browserVersion.indexOf('/') >= 0) {
                        ind = UA.browserVersion.indexOf('/')
                    } else if (UA.browserVersion.indexOf('(') >= 0) {
                        ind = UA.browserVersion.indexOf('(')
                    } else {
                        ind = -1;
                    }
                    UA.browserVersion = UA.browserVersion.substring(ind + 1, UA.browserVersion.length);
                    return;
                }
            }

        }
        UA.browser = null;
        UA.browserVersion = null;
    }

    function getDescriptorFromUserAgent(ua) {
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY,
            m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        var UA = {
            webkit: undef,
            trident: undef,
            gecko: undef,
            presto: undef,
            chrome: undef,
            safari: undef,
            firefox: undef,
            ie: undef,
            ieMode: undef,
            opera: undef,
            mobile: undef,
            core: undef,
            shell: undef,
            phantomjs: undef,
            os: undef,
            ipad: undef,
            iphone: undef,
            ipod: undef,
            ios: undef,
            android: undef,
            nodejs: undef,
            browser: undef,
            browserVersion: undef
        };

        if (div && div.getElementsByTagName) {
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }
        if (s.length > 0) {
            setTridentVersion(ua, UA);

            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                UA[shell = 'ie'] = ieVersion;
            }
        } else {
            if (((m = ua.match(/AppleWebKit\/([\d.]*)/)) || (m = ua.match(/Safari\/([\d.]*)/))) && m[1]) {
                UA[core = 'webkit'] = numberify(m[1]);

                if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
                    UA[shell = 'opera'] = numberify(m[1]);
                } else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    UA[shell = 'chrome'] = numberify(m[1]);
                } else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    UA[shell = 'safari'] = numberify(m[1]);
                } else {
                    UA.safari = UA.webkit;
                }

                // Apple Mobile
                if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if (m && m[1]) {
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if (m && m[0]) {
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if (/ Android/i.test(ua)) {
                    if (/Mobile/.test(ua)) {
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        UA.android = numberify(m[1]);
                    }
                } else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                    UA.phantomjs = numberify(m[1]);
                }
            } else {
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    UA[core = 'presto'] = numberify(m[1]);
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            UA[shell] = numberify(m[1]);
                        }
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        } else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            UA.mobile = m[0];
                        }
                    }
                } else {
                    if ((ieVersion = getIEVersion(ua))) {
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                    } else {
                        // Gecko
                        if ((m = ua.match(/Gecko/))) {
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                UA[core] = numberify(m[1]);
                                if (/Mobile|Tablet/.test(ua)) {
                                    UA.mobile = 'firefox';
                                }
                            }
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        if (!os) {
            if ((/windows|win32/i).test(ua)) {
                os = 'windows';
            } else if ((/macintosh|mac_powerpc/i).test(ua)) {
                os = 'macintosh';
            } else if ((/linux/i).test(ua)) {
                os = 'linux';
            } else if ((/rhino/i).test(ua)) {
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;
        UA.ieMode = UA.ie && doc.documentMode || UA.ie;

        getBrowers(ua, UA);
        if (!UA.browser) {
            var brArr = ['chrome', 'firefox', 'safari', 'ie', 'opera'], i;

            for (i = 0; i < brArr.length; i++) {
                if (UA[brArr[i]]) {
                    UA.browser = brArr[i];
                    UA.browserVersion = UA[brArr[i]];
                    return UA;
                }
            }
        }


        return UA;
    }
    var UA = getDescriptorFromUserAgent(ua);


    if (typeof process === 'object') {
        var versions, nodeVersion;
        if ((versions = process.versions) && (nodeVersion = versions.node)) {
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    // RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function() {
            return UA;
        });
        // NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = UA;
    } else {
        this.UA = UA;
    }

}());