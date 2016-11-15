/**
 * Created by houdong on 16/11/9.
 */
var redisClient = require('../../config/redis');
var Data = require('../models/data.server.model');

const REDIS_USER = 'user:name';
//向redis中写入数据,一般创建的时候不会写入,会在第一次从数据库中查询后写入redis,一般会设置redis的过期时间为10分钟,这样会保证与数据库的一致性
var writeToRedis = function (doc) {
    redisClient.hset(REDIS_USER,doc.login_name,JSON.stringify(doc))
};
var loginFromRedis = function (req,res,next) {
    redisClient.hgetall(REDIS_USER,function (err,doc) {
        if(err) return next(err);
        //redis中没有则去数据库中拿
        if(!doc) return loginFromDb(req,res,next);
        var user = JSON.parse(doc[req.body.login_name]);
        if(user&&user.login_name==req.body.login_name&&user.password==req.body.password){
            Data.result = true;
            Data.data = doc;
        }else{
            Data.result = false;
            Data.message = '用户名或密码错误';
        }
        return res.json(Data);
    })
};
var loginFromDb = function (req,res,next) {
    req.models.user.findOne({login_name:req.body.login_name,password:req.body.password},function (err, doc) {
        if (err) return next(err);
        if(!doc){
            Data.result = false;
            Data.message = '用户名或密码错误';
        }else{
            writeToRedis(doc);
            Data.result = true;
            Data.data = doc;
        }
        return res.json(Data);
    });
};
module.exports = {
    register: function (req, res, next) {
        if (!req.body.login_name || !req.body.password || !req.body.name || !req.body.age || !req.body.gender || !req.body.position || !req.body.entry_date) {
            return next(new Error('params error'));
        }
        req.models.user.create({
            login_name: req.body.login_name,
            password: req.body.password,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            position: req.body.position,
            entry_date: req.body.entry_date,
        }, function (err, doc) {
            if (err) return next(err);
            Data.result = true;
            Data.data = doc;
            return res.json(Data);
        });
    },
    login: function (req, res, next) {
        if (!req.body.login_name || !req.body.password) {
            return next(new Error('params error'));
        }
        loginFromRedis(req, res, next);
    },
    list: function (req, res, next) {
        if (!req.body.login_name || !req.body.password) {
            return next(new Error('params error'));
        }
        req.models.user.create({title: req.query.title, content: req.query.content}, function (err, doc) {
            if (err) return next(err);
            return res.json(doc);
        });
    }
};