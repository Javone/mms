/**
 * Created by houdong on 16/11/9.
 */
var redisClient = require('../../config/redis');
var Data = {};
const REDIS_USER = 'user:name';
const REDIS_LIST = 'user:list';
//向redis中写入数据,一般创建的时候不会写入,会在第一次从数据库中查询后写入redis,一般会设置redis的过期时间为10分钟,这样会保证与数据库的一致性
var userToRedis = function (doc) {
    redisClient.hset(REDIS_USER, doc.login_name, JSON.stringify(doc))
};
var listToRedis = function (doc) {
    redisClient.set(REDIS_LIST,JSON.stringify(doc));
};
var count = function (req, res, next) {
    req.models.user.count(function (err,doc) {
        if(err) return next(err);
        Data.count = doc;
        return res.json(Data);
    })
};
var loginFromRedis = function (req, res, next) {
    Data = {};
    redisClient.hgetall(REDIS_USER, function (err, doc) {
        if (err) return next(err);
        if (doc[req.body.login_name]) {
            var user = JSON.parse(doc[req.body.login_name]);
            if (user && user.login_name == req.body.login_name && user.password == req.body.password) {
                Data.result = true;
                Data.user = user;
            } else {
                Data.result = false;
                Data.message = '用户名或密码错误';
            }
            return res.json(Data);
        } else {
            //redis中没有则去数据库中拿
            loginFromDb(req, res, next);
        }
    })
};
var loginFromDb = function (req, res, next) {
    Data = {};
    req.models.user.findOne({login_name: req.body.login_name, password: req.body.password}, function (err, doc) {
        if (err) return next(err);
        if (!doc) {
            Data.result = false;
            Data.message = '用户名或密码错误';
        } else {
            userToRedis(doc);
            Data.result = true;
            Data.user = doc;
        }
        return res.json(Data);
    });
};
var listFromRedis = function (req, res, next) {
    Data = {};
    redisClient.get(REDIS_LIST, function (err, doc) {
        if (err) return next(err);
        if(!doc) return listFromDb(req,res,next);
        Data.result = true;
        Data.list = JSON.parse(doc);
        count(req,res,next);
    })
};
var listFromDb = function (req, res, next) {
    Data = {};
    req.models.user.find()
        .skip((req.body.pageNow - 1 ) * req.body.pageSize)
        .limit(req.body.pageSize)
        .exec(function (err, doc) {
            if(err) return next(err);
            if(!doc) {
                Data.result = false;
                Data.message = '没有数据';
            }else{
                listToRedis(doc);
                Data.result = true;
                Data.list = doc;
            }
            count(req,res,next);
        });
};
module.exports = {
    login: function (req, res, next) {
        if (!req.body.login_name || !req.body.password) {
            return next(new Error('params error'));
        }
        loginFromRedis(req, res, next);
    },
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
    list: function (req, res, next) {
        if (!req.body.pageNow || !req.body.pageSize) {
            return next(new Error('params error'));
        }
        listFromRedis(req, res, next);
    },
    name:function (req, res, next) {

    }
};