/**
 * Created by houdong on 16/11/10.
 */
var Waterline = require('waterline');
var mongoAdapter = require('sails-mongo');
var config = require('./config');

var User = require('../app/models/user.server.model');
var wlconfig = {
    adapters: {
        mongo: mongoAdapter,
        default: 'mongo'
    },
    connections: {
        mongo: {
            adapter: 'mongo',
            url: config.mongodb
        }
    }
};
var orm = new Waterline();//orm是将数据库中的数据转化成程序方便处理的对象,类似于mybatis-generator
orm.loadCollection(User);

exports.wlconfig = wlconfig;
exports.orm = orm;