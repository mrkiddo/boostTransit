/**
 * Created by mrkiddo on 2017/2/20.
 */
var express = require('express');
var router = express.Router();

var dataService = require('../services/dataService');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/trip/stop/:stopNo', function (req, res, next) {
    var stopNo = req.params.stopNo;
    dataService.getTripsFromDB(stopNo).then(function (doc) {
        res.json({
            success: true,
            data: doc
        });
    });
});

router.get('/trip/stop/:stopNo/route/:routeNo', function (req, res, next) {
    var stopNo = req.params.stopNo;
    var routeNo = req.params.routeNo;
    dataService.getTripsFromDB(stopNo, routeNo).then(function (doc) {
        res.json({
            success: true,
            data: doc
        });
    });
});

module.exports = router;