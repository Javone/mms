/**
 * Created by houdong on 16/11/9.
 */
var UserController = require('../controllers/user.server.controller');

module.exports = function (app) {
    app.route('/api/register')
        .post(UserController.register);
    app.route('/api/user/list')
        .post(UserController.list);
    app.route('/api/login')
        .post(UserController.login);

};