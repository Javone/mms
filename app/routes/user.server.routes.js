/**
 * Created by houdong on 16/11/9.
 */
var UserController = require('../controllers/user.server.controller');

module.exports = function (app) {
    app.route('/post/create')//请求方式:http://localhost:7101/post/create?title=test&content=test
        .get(UserController.create);
    app.route('/list')
        .post(UserController.list);
    app.route('/api/login')
        .post(UserController.login);

};