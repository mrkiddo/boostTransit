/**
 * Created by mrkiddo on 2017/2/20.
 */
var mongoose = require('mongoose');
var config = require('../config/config');
var dataService = require('../services/dataService');

// also need to connect to db for child process
// since it listens to another port number
mongoose.connect(config.database);

process.on('message', function (message) {});

var counter = 1;

var main = function () {
    if(counter++ > 1) {
        clearInterval(timer);
        process.send('child finished');
        return true;
    }
    dataService.getTripData('getTripByStop', {
        routeNo: '168',
        stopNo: '6933'
    }).then(function (info) {
        dataService.saveTripData(info);
    }, function (err) {
        console.log(err.toString());
    });
};

var timer = setInterval(main, 3000);

console.log('fetchData Child');