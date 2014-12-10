/**
 * Created by zzy on 2014/10/20.
 */
var WeixinConf = require('./../model/weixinConf');
var async = require('async');
var request = require('request');
var config = require('./../config/config.json');
var WeixinConfigCtrl = function(){};
WeixinConfigCtrl.save = function(id,token,appID,appsecret,partnerId,partnerKey,paySignKey,fn){
    async.auto({
        'findConfig':function(cb){
            WeixinConf.findOne({'ent':id})
                .lean()
                .exec(function(err,res){
                    cb(err,res);
                });
        },
        'checkMemberToken':['findConfig',function(cb,results){
            var conf = results.findConfig;
            if(conf&&conf.memberToken){
                cb(null,null);
            } else {
                var url = config.inf.host+':'+config.inf.port+'/api/member/createWeixinToken';
                request({
                    url:url,
                    method:'POST',
                    form: {token:config.inf.token,ent:id},
                    timeout:3000
                },function(err,response,body){
                    if(err){
                        cb(err,null);
                    } else {
                        if(body.trim()!=""){
                            res = JSON.parse(body);
                            if(res.error!=0){
                                cb(new Error(res.errMsg),null);
                            } else {
                                cb(null,res.data);
                            }
                        } else {
                            cb(null,null);
                        }
                    }
                });
            }
        }],
        'saveConf':['checkMemberToken',function(cb,results){
            var obj = {
                'ent':id
            }
            if(token){
                obj.token = token;
            }
            if(appID){
                obj.appID = appID;
            }
            if(appsecret){
                obj.appsecret = appsecret;
            }
            if(partnerId){
                obj.partnerId = partnerId;
            }
            if(partnerKey){
                obj.partnerKey = partnerKey;
            }
            if(paySignKey){
                obj.paySignKey = paySignKey;
            }
            if(results.checkMemberToken){
                obj.memberToken = results.checkMemberToken;
            }
            WeixinConf.update({'ent':id},{'$set':obj},{'upsert':true},function(err,res){
                cb(err,res);
            })
        }]
    },function(err,results){
        console.log(err,results);
        fn(err,results.saveConf);
    });


};

WeixinConfigCtrl.detail = function(id,fn){
    WeixinConf.findOne({'ent':id},function(err,res){
        fn(err,res);
    });
};
module.exports = WeixinConfigCtrl;