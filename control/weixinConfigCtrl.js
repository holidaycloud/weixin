/**
 * Created by zzy on 2014/10/20.
 */
var WeixinConf = require('./../model/weixinConf');
var async = require('async')
var WeixinConfigCtrl = function(){};

WeixinConfigCtrl.save = function(id,token,appID,appsecret,partnerId,partnerKey,paySignKey,memberToken,fn){
    var obj = {
        'ent':id,
        'token': token,
        'appID': appID,
        'appsecret': appsecret,
        'partnerId': partnerId,
        'partnerKey': partnerKey,
        'paySignKey': paySignKey,
        'memberToken':memberToken
    }
    WeixinConf.update({'ent':id},{'$set':obj},{'upsert':true},function(err,res){
        fn(err,res);
    })
};

WeixinConfigCtrl.detail = function(id,fn){
    WeixinConf.findOne({'ent':id},function(err,res){
        fn(err,res);
    });
};
module.exports = WeixinConfigCtrl;