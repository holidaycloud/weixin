/**
 * Created by zzy on 2014/10/21.
 */
var Article = require('./../model/article');
var ArticleCtrl = function(){};

ArticleCtrl.save = function(obj,fn){
    var article = new Article(obj);
    article.save(function(err,media){
        fn(err,media);
    });
};

ArticleCtrl.getMediaId = function(id,fn){
    Article.findById(id,'media_id',function(err,article){
        fn(err,article);
    });
};

ArticleCtrl.list = function(ent,fn){
    Article.find({'ent':ent})
        .sort({'created_at':-1})
        .exec(function(err,list){
            fn(err,list);
        });
};

module.exports = ArticleCtrl;