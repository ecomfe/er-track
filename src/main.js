/**
 * ER-Track
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 主入口
 * @author otakustay, dddbear
 */
define(
    function (require) {
        var u = require('underscore');

        var exports = {};

        /**
         * 填充捕捉者
         * @param {er-track.Terminal} tracker 展示终端
         */
        exports.include = function (tracker) {
            // 包含的监控事件
            var includingCatchers = tracker.catchers && tracker.catchers[0];
            // 排除的监控事件
            var excludingCatchers = tracker.catchers && tracker.catchers[1];

            // 二者取一
            var catchers;
            var tag = 1;
            if (includingCatchers && includingCatchers.length) {
                catchers = includingCatchers;
            }
            else {
                catchers = excludingCatchers;
                tag = -1;
            }

            catchers = catchers || [];

            var catchersPool = this.getCatchersPool();
            var allCatchers = catchersPool.getAllCatchers();

            u.each(
                allCatchers,
                function (catcher, name) {
                    if (u.indexOf(allCatchers, name) * tag) {
                        // 不一定出啥未知的错误，还是扔出来吧
                        try {
                            allCatchers[name].call(catchersool, tracker);
                        }
                        catch (e) {
                            throw e;
                        }
                    }
                }
            );
        };

        /**
         * 启用追踪
         */
        exports.start = function () {
            u.each(this.getTrackers(), this.include, this);
        };

        var eoo = require('eoo');
        eoo.defineAccessor(exports, 'trackers');
        eoo.defineAccessor(exports, 'catchersPool');

        var tracker = eoo.create(exports);
        return tracker;
    }
);
