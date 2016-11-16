/**
 * Created by houdong on 16/11/9.
 */
var redisClient = require('../../config/redis');
var Data = {};
const REDIS_USER_LOGIN_NAME = 'user:login_name';
const REDIS_LIST = 'user:list';
//向redis中写入数据,一般创建的时候不会写入,会在第一次从数据库中查询后写入redis,一般会设置redis的过期时间为10分钟,这样会保证与数据库的一致性
var userLoginNameToRedis = function (doc) {
    redisClient.hset(REDIS_USER_LOGIN_NAME, doc.login_name, JSON.stringify(doc))
};
//列表写入redis后,继续从redis中读数据,原因是分页只在redis中做了。listFromDb只是为了拿所有数据
var listToRedis = function (doc, req, res, next) {
    for (var i = 0; i < doc.length; i++) {
        redisClient.rpush(REDIS_LIST, JSON.stringify(doc[i]));
    }
    listFromRedis(req, res, next);
};
var count = function (req, res, next) {
    req.models.user.count(function (err, doc) {
        if (err) return next(err);
        Data.count = doc;
        return res.json(Data);
    })
};
var loginFromRedis = function (req, res, next) {
    Data = {};
    redisClient.hgetall(REDIS_USER_LOGIN_NAME, function (err, doc) {
        if (err) return next(err);
        if (!doc) return loginFromDb(req, res, next);
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
            return loginFromDb(req, res, next);
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
            userLoginNameToRedis(doc);
            Data.result = true;
            Data.user = doc;
        }
        return res.json(Data);
    });
};
var listFromRedis = function (req, res, next) {
    Data = {};
    var start = (req.body.pageNow - 1) * req.body.pageSize;
    var end = req.body.pageNow * req.body.pageSize - 1;
    redisClient.lrange(REDIS_LIST, start, end, function (err, doc) {
        if (err) return next(err);
        //有2种情况:1.数据库确实没数据2.具体到某一个页没数据,这页一般不会是第一页
        if (doc.length == 0 && start == 0) return listFromDb(req, res, next);
        Data.result = true;
        var array = [];
        for (var i = 0; i < doc.length; i++) {
            array.push(JSON.parse(doc[i]));
        }
        Data.list = array;
        count(req, res, next);
    })
};
//拿到所有的列表数据,放入redis,由redis进行分页,遇到增删改可以清除redis,or设置redis过期时间
var listFromDb = function (req, res, next) {
    Data = {};
    req.models.user.find()
        .exec(function (err, doc) {
            if (err) return next(err);
            if (!doc) {
                Data.result = false;
                Data.message = '没有数据';
            } else {
                listToRedis(doc, req, res, next);
            }
            count(req, res, next);
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
    name: function (req, res, next) {
        if (!req.body.name) return next(new Error('params error'));
        req.models.user.findOne({name: req.body.name}, function (err, doc) {
            if (err) return next(err);
            if (!doc) {
                Data.result = false;
                Data.message = '未查到该用户';
            } else {
                Data.result = true;
                Data.user = doc;
            }
            return res.json(Data);
        });
    }
};