/**
 * Created by zzy on 2014/10/21.
 */
var Message = require('./../model/message');
var MessageCtrl = function(){};

MessageCtrl.save = function(obj,fn){
    var message = new Message(obj);
    message.save(function(err,message){
        fn(err,message);
    });
};

MessageCtrl.match = function(ent,key,fn){
    Message.findOne({'ent':ent,'key':new RegExp(key)})
        .exec(function(err,list){
            fn(err,list);
        });
};

module.exports = MessageCtrl;