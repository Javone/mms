/**
 * Created by houdong on 16/11/10.
 */
var redis = require('redis');
var config = require('./config');

module.exports = redis.createClient(config.redis);