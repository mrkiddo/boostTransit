/**
 * Created by mrkiddo on 2017/2/20.
 */
var request = require('request');
var Promise = require('promise');
var config  = require('../config/transitConfig');
var Trip = require('../models/trip');

var buildUrl = function (type, params) {
    type = type || '';
    var defaultParams = {
        routeNo: 1,
        stopNo: '7659',
        format: 'json'
    };
    params = Object.assign(defaultParams, params);
    var url = '';
    switch(type) {
        case 'getTripByStop': {
            url = config.octApi.getTripByStop
                + '?'
                + 'appID=' + config.octAppId + '&'
                + 'apiKey=' + config.octAppKey + '&'
                + 'routeNo=' + params.routeNo + '&'
                + 'stopNo=' + params.stopNo + '&'
                + 'format=' + params.format;
            break;
        }
        case 'getTripByStopAll': {
            url = config.octApi.getTripByStopAll + '?'
                + 'appID=' + config.octAppId + '&'
                + 'apiKey=' + config.octAppKey + '&'
                + 'stopNo=' + params.stopNo + '&'
                + 'format=' + params.format;
            break;
        }
    }
    return url;
};

var extractTrips = function (trips, entryInfo) {
    var result = [];
    if(!(trips && trips.length > 0)) {
        return result;
    }
    trips.forEach(function (trip) {
        var entry = Object.assign({}, entryInfo);
        entry = Object.assign(entry, trip);
        result.push(entry);
    });
    return result;
};

var extractRoutesTrips = function (stopNo, routes) {
    var result = [];
    if(!(routes && (routes.length > 0))) {
        return false;
    }

    routes.forEach(function (route) {
        var basicInfo = {
            stopNo: stopNo,
            routeNo: route.RouteNo,
            direction: route.Direction,
            destination: route.RouteHeading
        };
        var trips = route.Trips;
        var subResult = extractTrips(trips, basicInfo);
        result = result.concat(subResult);
    });
    return result;
};

var extractData = function (type, jsonStr) {
    type = type || '';
    if(!type) {
        return false;
    }
    var data, result = [];
    try {
        data = JSON.parse(jsonStr);
    } catch(err) {}
    if(!data) {
        return false;
    }
    if(type === 'getTripByStopAll') {
        data = data['GetRouteSummaryForStopResult'];
        if(data.Error) {
            return false;
        }
        var stopNo = data.StopNo;
        var routes = data.Routes.Route;
        result = extractRoutesTrips(stopNo, routes);
    }
    else if(type === 'getTripByStop') {
        data = data['GetNextTripsForStopResult'];
        if(data.Error) {
            return false;
        }
        var trips = data.Route.RouteDirection.Trips.Trip;
        var basicInfo = {
            stopNo: data.StopNo,
            routeNo: data.Route.RouteDirection.RouteNo,
            direction: data.Route.RouteDirection.Direction,
            destination: data.Route.RouteDirection.RouteLabel
        };
        result = result.concat(extractTrips(trips, basicInfo));
    }
    return result;
};

var getTripData = function (type, params) {
    var url = buildUrl(type, params);
    if(!url) {
        return new Promise(function (resolve, reject) {
            reject(new Error('invalid api type'));
        });
    }
    var getDataFromApi = new Promise(function (resolve, reject) {
        request(url, function (err, response, body) {
            if(err) {
                reject(err);
            }
            resolve(body);
        });
    });
    return getDataFromApi.then(function (data) {
        var info = extractData(type, data);
        return new Promise(function (resolve, reject) {
            if(info) {
                resolve(info);
            }
            else {
                reject(new Error('fetch data error'));
            }
        });
    }, function (err) {
        return new Promise(function (resolve, reject) {
            reject(err);
        });
    });
};

var saveTripsData = function (trips) {
    Trip.create(trips).then(function (doc) {
    }, function (err) {
        console.log(err);
    });
};

var getTripsFromDB = function (stopNo) {
    return Trip.find({stopNo: stopNo}).sort({_id: -1}).limit(5);
};

module.exports = {
    getTripData: getTripData,
    saveTripsData: saveTripsData,
    getTripsFromDB: getTripsFromDB
};