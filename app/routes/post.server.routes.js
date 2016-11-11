/**
 * Created by houdong on 16/11/9.
 */
var PostController = require('../controllers/post.server.controller');

module.exports = function (app) {
    app.route('/post/create')//请求方式:http://localhost:7101/post/create?title=test&content=test
        .get(PostController.create);

};