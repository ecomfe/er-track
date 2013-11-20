er-track
========

用于ER的页面访问统计套件

    var track = require('er-track');

    track.use('baidu')
        .config('scriptURL', '/common/h.js')
        .setAccount('e11f12430782bff9553b65f2be26d907');

    track.use('console')
        .setAccount('Console group from er-track');

    track.start();