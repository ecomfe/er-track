/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 捕捉池
 * @author otakustay, dddbear
 */
define(
    function (require) {
        var u = require('underscore');

        var exports = {};

        function bind(method, tracker) {
            if (method) {
                return u.bind(method, tracker);
            }
            return new Function();
        }

        /**
         * 绑定Promise异常捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.promiseReject = function (tracker) {
            require('er/events').on(
                'promisereject',
                bind(tracker.trackPromiseReject, tracker)
            );

            require('promise').onReject(function (reason) {
                require('er/events').fire('promisereject', {reason: reason, promise: this});
            });
        };

        /**
         * 绑定Deferred异常捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.deferredException = function (tracker) {
            require('er/Deferred').on(
                'exception',
                bind(tracker.trackException, tracker)
            );
        };

        /**
         * 绑定通用错误捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.windowError = function (tracker) {
            window.onerror = bind(tracker.trackWindowError, tracker);
        };

        /**
         * 绑定超时行为捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.requestTimeout = function (tracker) {
            require('er/ajax').on(
                'timeout',
                bind(tracker.trackRequestFail, tracker)
            );
        };

        /**
         * 绑定Ajax请求异常捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.requestFail = function (tracker) {
            // TODO 业务系统有时会使用自己的ajax实例，
            // 这里是否需要也以ioc形式注入？
            this.getAjax().on(
                'fail',
                bind(tracker.trackRequestFail, tracker)
            );
        };

        /**
         * 绑定页面跳转行为捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.pageView = function (tracker) {
            require('er/events').on(
                'redirect',
                bind(tracker.trackPageView, tracker)
            );
        };

        /**
         * 绑定页面进入行为捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.enterAction = function (tracker) {
            require('er/events').on(
                'enteractioncomplete',
                bind(tracker.trackEnterAction, tracker)
            );
        };

        /**
         * 绑定页面离开行为捕捉者
         * @param {er-track.Termial} tracker 捕捉者实例
         * @public
         */
        exports.leaveAction = function (tracker) {
            require('er/events').on(
                'leaveaction',
                bind(tracker.trackLeaveAction, tracker)
            );
        };

        /**
         * 获取所有捕捉绑定方法
         * @return {Object}
         * @public
         */
        exports.getAllCatchers = function () {
            return {
                pageView: u.bind(this.pageView, this),
                promiseReject: u.bind(this.promiseReject, this),
                deferredException: u.bind(this.deferredException, this),
                windowError: u.bind(this.windowError, this),
                requestTimeout: u.bind(this.requestTimeout, this),
                requestFail: u.bind(this.requestFail, this),
                enterAction: u.bind(this.enterAction, this),
                leaveAction: u.bind(this.leaveAction, this)
            };
        };

        var eoo = require('eoo');
        eoo.defineAccessor(exports, 'ajax');
        var CatchersPool = eoo.create(exports);
        return CatchersPool;
    }
);
