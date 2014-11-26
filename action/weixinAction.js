/**
 * Created by zzy on 2014/10/17.
 */
var Weixin = require('./../control/weixinCtrl');
var MediaCtrl = require('./../control/mediaCtrl');
var weixinConfigCtrl = require('./../control/weixinConfigCtrl');
var Config = require('./../config/config.json');
var async = require('async');
//验证消息真实性
exports.check = function(req,res){
    var id = req.params.id;
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    Weixin.verify(id,signature,timestamp,nonce,echostr,function(err,result){
        res.send(result);
    });
};

//接收消息
exports.msgNotify = function(req,res){
//    res.set('Content-Type', 'text/xml');
    var id = req.params.id;
    var signature = req.body.signature;
    var timestamp = req.body.timestamp;
    var nonce = req.body.nonce;
    var msg = req.body.msg;
    async.auto({
        'check':function(cb){
            Weixin.check(id, timestamp, nonce,signature,function(err,result){
                cb(err,result);
            });
        },
        'parseXml':function(cb){
            var parseString = require('xml2js').parseString;
            parseString(msg, function (err, result) {
                cb(err,result);
            });
        },
        'sendMsg':['check','parseXml',function(cb,results){
            if(results.check){
                var msgObj = results.parseXml;
                console.log(msgObj);
                if(typeof(Weixin[msgObj.xml.MsgType[0]])==='function'){
                    Weixin[msgObj.xml.MsgType[0]](id,msgObj.xml,function(err,result){
                        cb(err,result);
                    });
                } else {
                    cb(null,'');
                }
            } else {
                cb(new Error('消息不一致'),null);
            }
        }]
    },function(err,results){
        if(err){
            res.send('');
        } else {
            console.log(results.sendMsg);
            res.send(results.sendMsg);
        }
    })

};

//获取AccessToken
exports.accesstoken = function(req,res){
    var id = req.params.id;
    Weixin.accessToken(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//通过code换取网页授权access_token
exports.codeAccesstoken = function(req,res){
    var id = req.params.id;
    var code = req.query.code;
    Weixin.codeAccessToken(id,code,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//创建分组
exports.createGroup = function(req,res){
    var id = req.params.id;
    var groupName = req.body.name;
    Weixin.createGroup(id,groupName,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//修改分组名
exports.updateGroup = function(req,res){
    var id = req.params.id;
    var groupID = req.body.groupid;
    var groupName = req.body.name;
    Weixin.updateGroup(id,groupID,groupName,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//查询所有分组
exports.groupList = function(req,res){
    var id = req.params.id;
    Weixin.groupList(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//查询用户所在分组
exports.getCusGroup = function(req,res){
    var id = req.params.id;
    var openID = req.query.openid;
    Weixin.getCusGroup(id,openID,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//移动用户分组
exports.moveGroup = function(req,res){
    var id = req.params.id;
    var openID = req.body.openid;
    var groupID = req.body.groupid;
    Weixin.moveGroup(id,openID,groupID,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//获取用户信息
exports.userInfo = function(req,res){
    var id = req.params.id;
    var openID = req.query.openid;
    Weixin.userInfo(id,openID,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//获取关注者列表
exports.userList = function(req,res){
    var id = req.params.id;
    var openID = req.query.openid;
    Weixin.userList(id,openID,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//自定义菜单创建接口
exports.createMenu = function(req,res){
    var id = req.params.id;
    Weixin.createMenu(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//自定义菜单查询接口
exports.getMenu = function(req,res){
    var id = req.params.id;
    Weixin.getMenu(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//自定义菜单删除接口
exports.deleteMenu = function(req,res){
    var id = req.params.id;
    Weixin.deleteMenu(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//创建二维码ticket
exports.createQRCode = function(req,res){
    var id = req.params.id;
    var type = req.body.type;
    var expire = req.body.expire;
    var sceneId = req.body.sceneId;
    Weixin.createQRCode(id,type,expire,sceneId,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//保存微信配置
exports.saveConfig = function(req,res){
    var id = req.params.id;
    var token = req.body.token;
    var appID = req.body.appID;
    var appsecret = req.body.appsecret;
    var partnerId = req.body.partnerId;
    var partnerKey = req.body.partnerKey;
    var paySignKey = req.body.paySignKey;
    var memberToken = req.body.memberToken;
    weixinConfigCtrl.save(id,token,appID,appsecret,partnerId,partnerKey,paySignKey,memberToken,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            global.weixin[id] = result;
            res.json({'error':0, 'data':result});
        }
    });
};

//微信配置详情
exports.configDetail = function(req,res){
    var id = req.params.id;
    weixinConfigCtrl.detail(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//上传多媒体文件
exports.uploadMedia = function(req,res){
    var id = req.params.id;
    var file = req.files.file;
    var type = req.body.type;
    Weixin.uploadMedia(id,file,type,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//多媒体文件列表
exports.mediaList = function(req,res){
    var id = req.params.id;
    MediaCtrl.list(id,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//下载多媒体文件
exports.getMedia = function(req,res){
    var id = req.params.id;
    var mediaId = req.query.mediaId;
    Weixin.getMedia(id,mediaId,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            result.pipe(res);
        }
    });
};

//上传图文消息素材
exports.uploadArticles = function(req,res){
    var id = req.params.id;
    var thumb_media_id = req.body.thumb_media_id;
    var author = req.body.author;
    var title = req.body.title;
    var content_source_url = req.body.content_source_url;
    var content = req.body.content;
    var digest = req.body.digest;
    var show_cover_pic = req.body.show_cover_pic;
    Weixin.uploadArticles(id,thumb_media_id,author,title,content_source_url,content,digest,show_cover_pic,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//根据分组进行图文群发
exports.groupSendArticle = function(req,res){
    var id = req.params.id;
    var articleID = req.body.articleID;
    var groupID = req.body.groupID;
    Weixin.groupSendArticle(id,articleID,groupID,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};

//发送模板消息
exports.sendOrderTemplate = function(req,res){
    var id = req.params.id;
    var tempId = Config.template.order;
    var toUser = req.body.toUser;
    var customerInfo = req.body.customerInfo;
    var orderID = req.body.orderID;
    var remark = req.body.remark;
    var orderDate = req.body.orderDate;

    //var data = JSON.parse(req.body.data);
    var data = {
        'first':{ 'value':'您有新的订单。','color':'#0A0A0A'},
        'tradeDateTime':{'value':orderDate,'color':'#0A0A0A'},
        'orderType':{'value':'新订单','color':'#0A0A0A'},
        'customerInfo':{'value':customerInfo,'color':'#0A0A0A'},
        'orderItemName':{'value':'订单号','color':'#0A0A0A'},
        'orderItemData':{'value':orderID,'color':'#0A0A0A'},
        'remark':{'value':remark,'color':'#0A0A0A'}
    };
    Weixin.sendTemplate(id,tempId,data,toUser,function(err,result){
        if(err){
            res.json({'error':1, 'errMsg':err.message});
        } else {
            res.json({'error':0, 'data':result});
        }
    });
};