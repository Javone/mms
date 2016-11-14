/**
 * Created by houdong on 16/11/9.
 */
var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    identity:'user',//表名=集合名
    connection:'mongo',//用哪个连接
    attributes:{//字段
       id:{type:'integer'},
       name:{type:'string'},
       login_name:{type:'string'},
       age:{type:'string'},
       gender:{type:'string'},
       position:{type:'string'},
       entry_date:{type:'date'},
    }
});