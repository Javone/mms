/**
 * Created by houdong on 16/11/9.
 */
var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity: 'user',//表名=集合名
    connection: 'mysql',//用哪个连接
    schema: true,
    autoCreatedAt: false,//不允许在数据库添加这个字段,这2个字段在create会自动添加的
    autoUpdatedAt: false,//不允许在数据库添加这个字段
    attributes: {//字段
        id: {
            type: 'integer',
            required: true,
            index: true
        },
        login_name: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true,
            index: true
        },
        age: {
            type: 'string',
            required: true
        },
        gender: {
            type: 'string'
        },
        position: {
            type: 'string'
        },
        entry_date: {
            type: 'date',
            after: new Date('1900-01-01'),//必须在1900-01-01之后
            before: function () { //必须在当前时间之前
                return new Date()
            }
        },
    }
});