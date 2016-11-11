/**
 * Created by houdong on 16/11/9.
 */
var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity:'post',//表名=集合名
    connection:'mongo',//用哪个连接
    attributes:{//字段
       title:{type:'string'},
       content:{type:'string'}
    }
});