/**
 * Created by mrkiddo on 2017/2/20.
 */
var fork = require('child_process').fork;

var init = function () {
    var filePath = [__dirname.replace('\\modules', ''), 'tasks', 'fetchDataProcess.js'].join('/');
    var p = fork(filePath, [], {
        execArgv: ['--debug=9998']
    });

    p.on('exit', function (code) {
        console.log('exit with code: ', code);
    });

    p.on('message', function (msg) {
        console.log('from fetchData child: ', msg);
    });

    return p;
};

module.exports = init;