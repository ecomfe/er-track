/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 服务器统计追踪器
 * @author otakustay, dddbear
 */
define(
    function (require) {
        var u = require('underscore');
        var moment = require('moment');

        var exports = {};

        /**
         * @override
         */
        exports.constructor = function (destinyUrl) {
            this.$super(arguments);
            this.destinyUrl = destinyUrl || 'http://adm.baidu.com/gen_204';
        };

        /**
         * @override
         */
        exports.display = function (data) {
            data.url = location.hash.replace(/^#/, '');
            data.time = moment().format('YYYY-MM-DD HH:mm:ss');
            // require('er/ajax').log(this.destinyUrl, data);
        };

        /**
         * @override
         */
        exports.trackPageView = function (context) {
            var referrer = context.referrer || document.referrer;
            var data = {
                type: 'route',
                from: referrer === '' ? '二次元' : referrer,
                to: context.url
            };
            this.display(data);
        };

        /**
         * @override
         */
        exports.trackException = function (context) {
            var data = {
                type: 'internal_error'
            };

            // 异常默认只跟踪代码逻辑错误
            if (context.reason.error instanceof Error) {
                var error = context.reason.error;
                data.stack = error.stack;
                data.reason = error.message;
            }
            this.display(data);
        };

        /**
         * @override
         */
        exports.trackRequestFail = function (context) {
            var options = context.options;
            var xhr = context.xhr;
            var data = {
                type: 'server_error',
                url: options.url,
                method: options.method,
                args: options.data,
                status: xhr.status
            };
            this.display(data);
        };

        /**
         * @override
         */
        var eoo = require('eoo');
        var Log = eoo.create(require('er-track/trackers/Terminal'), exports);
        return Log;
    }
);
