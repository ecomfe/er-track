/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 百度统计追踪器
 * @author otakustay
 */
define(
    function (require) {
        function log(group, message) {
            if (window.console) {
                if (group && console.group) {
                    console.group(group);
                }

                console.log(message);

                if (group && console.group) {
                    console.groupEnd(group);
                }
            }
        }

        var exports = { name: 'console' };

        exports.create = function (config) {
            return {
                name: 'console',

                trackPageView: function (context) {
                    var message = 'Forward to "' + context.url + '"';
                    if (context.referrer) {
                        message += ' from "' + context.referrer + '"';
                    }

                    log(config.account || config.group, message);

                    return this;
                },

                load: function (callback) {
                    callback();
                }
            };
        };

        return exports;
    }
);
