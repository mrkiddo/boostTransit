var ObjectId = require('mongoose').Types.ObjectId;

var timestampToObjectId = function (timestamp, offset) {
    timestamp = timestamp || new Date();
    if(typeof(timestamp) === 'string') {
        timestamp = new Date(timestamp);
    }
    if(offset) {
        timestamp = timestamp - 1000 * parseInt(offset, 10);
    }
    var hexSeconds = Math.floor(timestamp / 1000).toString(16);
    return ObjectId(hexSeconds + '0000000000000000');
};

module.exports = {
    timestampToObjectId: timestampToObjectId
};