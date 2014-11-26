/**
 * Created by zzy on 2014/11/26.
 */
var Activity = require('./../model/activity');
var ActivityCtrl = function(){};
ActivityCtrl.save = function(ent,name,content,type,articles,sceneId,value,fn){
    var activity = new Activity({
        'ent':ent,
        'name':name,
        'content':content,
        'type':type,
        'articles':articles,
        'sceneId':sceneId,
        'value':value
    });
    activity.save(function(err,res){
        fn(err,res);
    })
};
module.exports = ActivityCtrl;