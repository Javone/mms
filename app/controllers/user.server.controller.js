/**
 * Created by houdong on 16/11/9.
 */

module.exports = {
    create:function (req,res,next) {
        if(!req.query.title || !req.query.content){
            return next(new Error('params error'));
        }
        req.models.post.create({title:req.query.title,content:req.query.content},function (err,doc) {
            if(err) return next(err);
            return res.json(doc);
        });
    },
    login:function (req,res,next) {
        if(!req.body.login_name || !req.body.password){
            return next(new Error('params error'));
        }
        req.models.user.find({}).exec(function(err, users) {console.log('err,users',err,users)});

        var json = {
            flag:1,
            result:true
        };
        return res.json(json);
    },
    list:function (req,res,next) {
        if(!req.body.login_name || !req.body.password){
            return next(new Error('params error'));
        }
        req.models.user.create({title:req.query.title,content:req.query.content},function (err,doc) {
            if(err) return next(err);
            return res.json(doc);
        });
    }
};