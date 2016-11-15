/**
 * Created by houdong on 16/11/9.
 */
var redisClient = require('../../config/redis');

//从mongodb中拿数据
var loginFromMongo = function (id, cb) {
    console.log('run loginFromMongo');
    News
        .findOne({_id: id})
        .exec(function (err, doc) {
            if (doc) {//如果数据库中存在,则存到redis中
                console.log('save mongo doc to redis');
                redisClient.set(REDIS_NEWS_PREFIX + id, JSON.stringify(doc))
            }
            return cb(err, doc);
        })
};
//从redis中拿数据
var loginFromRedis = function (id, cb) {
    console.log('run loginFromRedis');
    redisClient.get(REDIS_NEWS_PREFIX + id, function (err, v) {
        if (err) {
            return cb(err, null);
        }
        if (!v) {
            console.log('doc not int redis');
            return cb(null, null);
        }
        try {//避免JSON转换出错
            v = JSON.parse(v);//redis中的数据转化成JSON
        } catch (e) {
            return cb(e, null);
        }
        console.log('get doc from redis');
        return cb(err, v);
    });
};
module.exports = {
    register: function (req, res, next) {
        if (!req.body.login_name || !req.body.password || !req.body.name || !req.body.age || !req.body.gender || !req.body.position || !req.body.entry_date) {
            return next(new Error('params error'));
        }
        req.models.post.create({
            login_name: req.body.login_name,
            password: req.body.password,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            position: req.body.position,
            entry_date: req.body.entry_date,
        }, function (err, doc) {
            if (err) return next(err);
            return res.json(doc);
        });
    },
    login: function (req, res, next) {
        if (!req.body.login_name || !req.body.password) {
            return next(new Error('params error'));
        }
        req.models.user.find({}).exec(function (err, users) {
            console.log('err,users', err, users)
        });

        var json = {
            flag: 1,
            result: true
        };
        return res.json(json);
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