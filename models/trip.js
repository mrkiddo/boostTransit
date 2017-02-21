/**
 * Created by mrkiddo on 2017/2/20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Trip', new Schema({
    stopNo: {
        type: String,
        default: '0000'
    },
    routeNo: {
        type: String,
        default: '00'
    },
    destination: {
        type: String,
        default: ''
    },
    direction: {
        type: String,
        default: ''
    },
    AdjustedScheduleTime: String,
    AdjustmentAge: String,
    BusType: String,
    GPSSpeed: String,
    LastTripOfSchedule: Boolean,
    Latitude: {
        type: String,
        default: '0'
    },
    Longitude: {
        type: String,
        default: '0'
    }
}));