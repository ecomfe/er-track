/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 命令行追踪器
 * @author otakustay, dddbear
 */
define(
    function (require) {
        var exports = {};

        /**
         * 单行log输出
         * @param  {Array} entries 输出内容
         * @private
         */
        function logLine(entries) {
            if (!window.console) {
                return;
            }

            /* eslint-disable no-console */
            // IE的`console.log`不是函数，不支持`apply`，且不支持多个参数
            if (typeof console.log === 'function') {
                console.log.apply(console, entries);
            }
            else {
                console.log(entries.join(' '));
            }
        }

        /**
         * @override
         * @param  {Array} groupName 组内容
         */
        exports.display = function (groupName) {
            if (!window.console) {
                return;
            }

            var i;
            if (console.groupCollapsed) {
                console.groupCollapsed(groupName);
                for (i = 1; i < arguments.length; i++) {
                    try {
                        logLine(arguments[i]);
                    }
                    catch (e) {
                    }
                }
                console.groupEnd(groupName);
            }
            else {
                console.log('➤' + groupName);
                var prefix = '├───';
                for (i = 1; i < arguments.length; i++) {
                    if (i === arguments.length - 1) {
                        prefix = '└───';
                    }
                    var entry = arguments[i];
                    if (typeof entry === 'string') {
                        entry = prefix + entry;
                    }
                    else {
                        entry[0] = prefix + entry[0];
                    }
                    logLine(entry);
                }
            }
        };

        /**
         * @override
         */
        exports.trackPageView = function (context) {
            var referrer = context.referrer || document.referrer;
            var from = referrer === '' ? '二次元' : referrer;
            var to = context.url;
            var entries = '从' + from + '跳到了' + to;
            this.display(entries);
        };

        /**
         * @override
         */
        exports.trackEnterAction = function (context) {
            this.display(
                '正在进入' + (context.isChildAction ? '子' : '') + '模块：' + context.url  + ' ' + context.args.title,
                ['Action：', context.action],
                ['Model：', context.action.model],
                ['Model里的数据：', context.action.model.dump()],
                ['View：', context.action.view],
                ['DOM容器：', context.action.view.getContainerElement()]
            );
        };

        /**
         * @override
         */
        exports.trackLeaveAction = function (context) {
            this.display(
                '已经离开"' + context.action.context.url + '"',
                ['当前的Action：', context.action],
                ['前往的URL：' + context.to.url]
            );
        };

        /**
         * @override
         */
        exports.trackException = function (context) {
            var entries = [];
            var error;
            // 这个是Deferred原生的error，
            // 理论上我觉着这个error不用理会，后端的请求异常有专门的逻辑处理
            if (context.reason instanceof Error) {
                error = context.reason;
            }
            // Model的load加载回调封装后的Error
            else if (context.reason.error instanceof Error) {
                error = context.reason.error;
            }

            if (error) {
                entries = [
                    '有个Promise出异常了',
                    ['出事的Deferred对象: ', context.deferred],
                    ['出事时给的参数: ', context.args],
                    ['出事的原因大概是: ' + error.message],
                    ['调用堆栈给你看看好了：\n' + error.stack]
                ];

                this.display.apply(this, entries);
            }
        };

        /**
         * @override
         */
        exports.trackRequestFail = function (context) {
            var options = context.options;
            var xhr = context.xhr;
            var entries = [
                '请求后端时出异常了',
                ['请求URL: ', options.url],
                ['请求类型: ', options.method],
                ['请求参数: ', options.data],
                ['错误状态: ', xhr.status]
            ];

            var errorText = xhr.responseText;

            // 403
            if (xhr.status === 403) {
                errorText = '无权访问';
            }
            // 404
            else if (xhr.status === 404) {
                errorText = '链接或页面不存在';
            }
            // 408
            else if (xhr.status === 408) {
                errorText = '请求超时';
            }

            entries.push(['错误描述:', errorText]);

            // 一般解析出错的时候有
            if (context.xhr.error) {
                entries.push(['给你看看错误对象:', context.xhr.error]);
            }

            this.display.apply(this, entries);
        };

        /**
         * @override
         */
        exports.trackWindowError = function (sMsg, url, sLine) {
            this.display(
                '可能发生语法错误',
                ['错误位置：' + url],
                ['错误信息：' + context.to.url]
            );
        };

        var eoo = require('eoo');
        var Console = eoo.create(require('er-track/trackers/Terminal'), exports);
        return Console;
    }
);
