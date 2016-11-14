/**
 * Created by houdong on 16/11/9.
 */
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function () {
    console.log('init express ...');
    var app = express();
    //使用bodyParser中间件:设置post请求获取的数据都为json
    app.use(bodyParser.json());
    //使用express的static()中间件:添加静态目录
    app.use(express.static('./public'));

    //把models放在req请求对象上,这样以后都可以访问了,注意这个中间件必须在路由中间件之前:这个配置是针对waterline
    app.use(function (req, res, next) {
        req.models = app.get('models');
        next();//跳转下一个中间件
    });

    //导入路由
    require('../app/routes/user.server.routes')(app);

    //以中间件的方式自定义响应函数  try-catch:防止重复返回
    app.use(function (req, res, next) {
        res.status(404);
        try {
            return res.json('Not Found');
        } catch (e) {
            console.error('404 set header after sent');
        }

    });

    //统一处理错误
    app.use(function (err, req, res, next) {//中间件不写路径,默认是/
        if (!err) return next();//非路由中间件,这里next是返回到下一个中间件,否则请求会被挂起,而路由中间件的next,比如在后面回调方法如果出现错误会执行next(err),其实是匹配下一个路由,略过当前路由的所有中间件,然后被错误非路由中间件捕获,来执行对错误的处理
        res.status(500);
        try {
            return res.json(err.message || 'server error');
        } catch (e) {
            console.error('500 set header after sent');
        }

    });
    return app;
};