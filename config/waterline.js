/**
 * Created by houdong on 16/11/10.
 */
var Waterline = require('waterline');
var mongoAdapter = require('sails-mongo');
var mysqlAdapter = require('sails-mysql');//将数据库中的数据转化成程序方便处理的对象
var config = require('./config');

var User = require('../app/models/user.server.model');
var wlconfig = {
    adapters: {
        mongo: mongoAdapter,
        mysql:mysqlAdapter,
        default: 'mysql'
    },
    connections: {
       // mongo: {
       //      adapter: 'mongo',
       //      url: config.mongodb
       //  },
        mysql: {
            adapter: 'mysql',
            url: config.mysql
        }
    },
    defaults: {
        migrate: 'safe'//创建的时候不会改动数据库的表,只能我们自己改动
    }
};
var orm = new Waterline();
orm.loadCollection(User);

exports.wlconfig = wlconfig;
exports.orm = orm;