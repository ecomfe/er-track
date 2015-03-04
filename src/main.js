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
            var catchersPool;
            var tag = 1;
            if (includingCatchers && includingCatchers.length) {
                catchersPool = includingCatchers;
            }
            else {
                catchersPool = excludingCatchers;
                tag = -1;
            }

            catchersPool = catchersPool || [];

            var catchers = this.getCatchersPool().getAllCatchers();
            for (var name in catchers) {
                if (catchers.hasOwnProperty(name) && u.indexOf(catchersPool, name) * tag) {
                    catchers[name](tracker);
                }
            }
        };

        /**
         * 启用追踪
         */
        exports.start = function () {
            u.each(this.getTrackers(), u.partial(this.include), this);
        };

        var eoo = require('eoo');
        eoo.defineAccessor(exports, 'trackers');
        eoo.defineAccessor(exports, 'catchersPool');

        var tracker = eoo.create(exports);
        return tracker;
    }
);
