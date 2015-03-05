/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 终端追踪器基类
 * @author otakustay, dddbear
 */
define(
    function (require) {
        var exports = {};

        /**
         * 展示内容
         * @param {*} data 要展示的数据
         */
        exports.display = function (data) {};

        /**
         * 页面跳转行为追踪展示
         * @param {Object} context 跳转行为相关上下文
         * @param {string} context.referrer 跳转来源地址
         * @param {string} context.url 跳转地址
         * @public
         */
        exports.trackPageView = function (context) {};

        /**
         * 页面进入行为追踪展示
         * @param {Object} context 行为相关上下文
         * @param {er.Action} context.action 当前Action实例
         * @param {Object} context.args 创建action的参数
         * @param {string} context.container 模版容器id
         * @param {er.controller} context.controller controller单例
         * @param {boolean} context.isChildAction 是否子Action
         * @param {string} context.title Action抬头
         * @param {er.URL} context.url 当前Action的URL对象
         * @param {er.URL} context.referrer 来源Action的URL对象
         * @public
         */
        exports.trackEnterAction = function (context) {};


        /**
         * 追踪模块离开行为
         * @param {Object} context 行为相关的上下文
         * @param {er.Action} context.action 当前Action实例
         * @param {er.controller} context.controller controller单例
         * @param {Object} context.to 下一个要前往的Action的上下文，跟trackEnterAction参数格式一样
         */
        exports.trackLeaveAction = function (context) {};

        /**
         * 追踪系统异常，异常处理覆盖所有被封装成Deferred的对象
         * @param {Object} context 异常相关的上下文
         * @param {Object} context.deferred 异常的Deferred对象
         * @param {Object} context.reason 异常的原因，这个对象触发点不同，值也不同
         * @param {string} context.reason.error.message 错误信息
         * @param {string} context.reason.error.stack 错误栈
         * @param {string} context.reason.name 错误方法
         * @param {Array} context.args 异常是的参数，原生Deferred就一个元素，就是reason
         */
        exports.trackException = function (context) {};

        /**
         * 追踪Ajax请求错误
         * 1. status < 200 或者 status >=300 但不是304时触发
         * 2. 解析结果失败时触发
         * 3. 超时
         * @param {Object} context 错误相关的上下文
         * @param {Object} context.options Ajax请求时的参数详情
         * @param {Object} context.xhr Ajax请求的xhr对象
         */
        exports.trackRequestFail = function (context) {};


        /**
         * 追踪通用window异常
         * @param {string} msg 错误信息
         * @param {string} url 错误文件路径
         * @param {string} line 错误行数
         * @param {string} col 错误列数
         */
        exports.trackWindowError = function (msg, url, line, col) {};

        var eoo = require('eoo');
        var Terminal = eoo.create(exports);
        return Terminal;
    }
);
