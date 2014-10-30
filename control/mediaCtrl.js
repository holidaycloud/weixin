/**
 * Created by zzy on 2014/10/21.
 */
var Media = require('./../model/media');
var MediaCtrl = function(){};

MediaCtrl.save = function(obj,fn){
    var media = new Media(obj);
    media.save(function(err,media){
        fn(err,media);
    });
};

MediaCtrl.list = function(ent,fn){
    Media.find({'ent':ent})
        .sort({'created_at':-1})
        .exec(function(err,list){
            fn(err,list);
        });
};

module.exports = MediaCtrl;