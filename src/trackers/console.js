/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file 百度统计追踪器
 * @author otakustay
 */
define(
    function (require) {
        var group = '';

        function log(message) {
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

        return {
            name: 'console',
            
            initialize: function (options) {
                group = options.account;
            },

            trackPageView: function (context) {
                var message = 'Forward to "' + context.url + '"';
                if (context.referrer) {
                    message += ' from "' + context.referrer + '"';
                }

                log(message);

                return this;
            },

            load: function (callback) {
                callback();
            }
        };
    }
);
