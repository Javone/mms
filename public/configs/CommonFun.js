/**
 * Created by houdong on 16/8/26.
 */
var objectAssign = require('object-assign');
module.exports = {

    dateTransform: function (timestamp) {
        let date = new Date(timestamp);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return date.getFullYear() + '-' + month + '-' + day;
    },
    transformDate: function (timestamp) {
        let array = timestamp.split('/');
        return array[2] + '-' + array[0] + '-' + array[1];
    },
    changeStatus: function (type, param, cb = function () {
    }) {
        this.setState({
            type: objectAssign(this.state[type], param)
        }, cb());
    }
};