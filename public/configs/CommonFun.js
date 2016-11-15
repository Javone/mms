/**
 * Created by houdong on 16/8/26.
 */
var objectAssign = require('object-assign');
module.exports = {

    dateTransform: function (timestamp) {
        let date = new Date(timestamp);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
    transformDate:function (timestamp) {
        let array = timestamp.split('/');
        return array[2]+'-'+array[1]+'-'+array[0];
    },
    changeStatus: function (type, param,cb=function () {}) {
        this.setState({
            type: objectAssign(this.state[type], param)
        },cb());
    }
};