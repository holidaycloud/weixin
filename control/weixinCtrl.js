/**
 * Created by zzy on 2014/10/17.
 */
var async = require('async');
var weixinConfigCtrl = require('./weixinConfigCtrl');
var mediaCtrl = require('./mediaCtrl');
var articleCtrl = require('./articleCtrl');
var Weixin = function () {};
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

//获取配置文件
Weixin.checkConfig = function (id,fn) {
    if (!global.weixin.id) {
        weixinConfigCtrl.detail(id,function(err,result){
            console.log('获取配置文件',err,result);
            if(!err&&result){
                global.weixin[id] = result;
            } else {
                console.log('未找到配置文件');
            }
            fn(err,null);
        });
    }
};

//初始化验证
Weixin.verify = function (id, signature, timestamp, nonce, echostr,fn) {
    Weixin.check(id, timestamp, nonce,signature,function(err,res){
        if(res){
            fn(null,echostr);
        } else {
            fn(null,null);
        }
    });
};

//验证
Weixin.check = function (id, timestamp, nonce,signature,fn) {
    Weixin.checkConfig(id,function(err,res){
        if(err){
            fn(null,false);
        } else {
            var tmpArr = [global.weixin[id].token, timestamp, nonce];
            tmpArr.sort();
            var str = tmpArr[0] + tmpArr[1] + tmpArr[2];
            var crypto = require('crypto');
            var shasum = crypto.createHash('sha1');
            shasum.update(str);
            var mySign = shasum.digest('hex');
            fn(null,mySign === signature)
        }
    });
};

//通过code换取网页授权access_token
Weixin.codeAccessToken = function(id,code,fn){
    console.log(id,code);
    async.auto({
        'checkConfig':function(cb){
            Weixin.checkConfig(id,function(err,result){
                cb(err,result);
            });
        },
        'getAccessToken':['checkConfig',function(cb){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/sns/oauth2/access_token?grant_type=authorization_code&appid='+global.weixin[id].appID+'&secret='+global.weixin[id].appsecret+'&code='+code,
                method: 'GET'
            };

            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    fn(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                fn(e,null);
            });
        }]
    },function(err,results){
        console.log(err,results);
        fn(err,results.getAccessToken);
    });
};

//获取AccessToken
Weixin.accessToken = function(id,fn){
    async.auto({
        'checkConfig':function(cb){
            Weixin.checkConfig(id,function(err,result){
                cb(err,result);
            });
        },
        'getAccessToken':['checkConfig',function(cb){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/token?grant_type=client_credential&appid='+global.weixin[id].appID+'&secret='+global.weixin[id].appsecret,
                method: 'GET'
            };

            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    result.startTime = Date.now();
                    global.weixin[id].accessToken = result;
                    fn(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                fn(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getAccessToken);
    });
};

//创建分组
Weixin.createGroup = function(id,name,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'createGroup':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/groups/create?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write('{"group":{"name":"'+name+'"}}');
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.createGroup);
    });
};

//修改分组名
Weixin.updateGroup = function(id,groupID,name,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'updateGroup':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/groups/update?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write('{"group":{"id":"'+groupID+'","name":"'+name+'"}}');
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.updateGroup);
    });
};

//查询所有分组
Weixin.groupList = function(id,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getGroups':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/groups/get?access_token='+results.getAccessToken.access_token,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getGroups);
    });
};

//查询用户所在分组
Weixin.getCusGroup = function(id,openID,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getCusGroup':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/groups/getid?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            console.log(results.getAccessToken.access_token);
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write('{"openid":"'+openID+'"}');
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getCusGroup);
    });
};

//移动用户分组
Weixin.moveGroup = function(id,openID,groupID,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'updateGroup':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/groups/members/update?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            var content = {
                'openid':openID,
                'to_groupid':groupID
            };
            req.write(JSON.stringify(content));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.updateGroup);
    });
};

//获取用户基本信息
Weixin.userInfo = function(id,openID,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getUser':['getAccessToken',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/user/info?access_token='+results.getAccessToken.access_token+'&openid='+openID,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getUser)
    });
};

//获取关注者列表
Weixin.userList = function(id,openID,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getUsers':['getAccessToken',function(cb,results){
            var path = '/cgi-bin/user/get?access_token='+results.getAccessToken.access_token;
            if(openID){
                path+='&next_openid'+openID;
            }
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: path,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getUsers);
    });
};

//自定义菜单创建接口
Weixin.createMenu = function(id,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getMenu':function(cb){
            cb(null, {
                "button":[
                    {
                        "type":"click",
                        "name":"今日歌曲",
                        "key":"V1001_TODAY_MUSIC"
                    },
                    {
                        "name":"菜单",
                        "sub_button":[
                            {
                                "type":"view",
                                "name":"搜索",
                                "url":"http://www.soso.com/"
                            },
                            {
                                "type":"view",
                                "name":"视频",
                                "url":"http://v.qq.com/"
                            },
                            {
                                "type":"click",
                                "name":"赞一下我们",
                                "key":"V1001_GOOD"
                            }]
                    }]
            });
        },
        'createMenu':['getAccessToken','getMenu',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/menu/create?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write(JSON.stringify(results.getMenu));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.createMenu);
    });
};

//自定义菜单查询接口
Weixin.getMenu = function(id,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getMenu':['getAccessToken',function(cb,results){
            var path = '/cgi-bin/menu/get?access_token='+results.getAccessToken.access_token;
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: path,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getMenu);
    });
};

//自定义菜单删除接口
Weixin.deleteMenu = function(id,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'deleteMenu':['getAccessToken',function(cb,results){
            var path = '/cgi-bin/menu/delete?access_token='+results.getAccessToken.access_token;
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: path,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.deleteMenu)
    });
};

//生成带参数的二维码
Weixin.createQRCode = function(id,type,expire,sceneId,stream,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'createQRCodeTicket':['getAccessToken',function(cb,results){
            var content = {
                'action_info':{'scene':{'scene_id':sceneId}}
            };
            if(type==='QR_SCENE'){
                content.action_name='QR_SCENE';
                content.expire_seconds = expire;
            } else {
                content.action_name='QR_LIMIT_SCENE';
            }
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/qrcode/create?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write(JSON.stringify(content));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }],
        'getQRCode':['createQRCodeTicket',function(cb,results){
            var path = '/cgi-bin/showqrcode?ticket='+results.createQRCodeTicket.ticket;
            var https = require('https');
            var options = {
                hostname: 'mp.weixin.qq.com',
                port: 443,
                path: path,
                method: 'GET'
            };
            var req = https.request(options, function(res) {
                cb(null,res);
            });
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.getQRCode);
    });
};

//事件推送
Weixin.event = function(id,obj,fn){
    var eventType = obj.Event[0];
    console.log('-----接收到事件推送-----',eventType);
    var to = obj.ToUserName[0];
    var from = obj.FromUserName[0];
    var createTime = obj.CreateTime[0];
    if(eventType==="subscribe"){
        var fs = require('fs');
        var ejs = require('ejs');
        var str = fs.readFileSync('./views/articles.ejs').toString();
        var appID = global.weixin[id].appID;
        var renderStr = ejs.render(str,{
            'from':from,
            'to':to,
            'articles':[
                {
                    'title':'test',
                    'description':'test',
                    'picurl':'http://holidaycloud.b0.upaiyun.com/211c76f5e52d166fb80c53a4cc2c21f4.jpg',
                    'url':'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appID+'&redirect_uri=http://pinyuan.holidaycloud.cn/customerWeixinBind&response_type=code&scope=snsapi_base&state=baolong#wechat_redirect'
                }
            ]
        });
        console.log('-----返回事件推送结果-----',renderStr);
        fn(null,renderStr);
    } else {
        fn(null,'');
    }
};

//上传多媒体文件
Weixin.uploadMedia = function(id,file,type,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'uploadMedia':['getAccessToken',function(cb,results){
            var request = require('request');
            var fs = require('fs');
            var r = request.post({
                url: 'http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token='+results.getAccessToken.access_token+'&type='+type,
                headers: {
                    'accept': '*/*'
                }
            }, function (err, res, body) {
                if (err) {
                    cb(err,null);
                } else {
                    var result = JSON.parse(body);
                    cb(null,result);
                }
            });
            var form = r.form();
            form.append('media', fs.createReadStream(file.path));
            form.append('hack', '');
        }],
        'saveMedia':['uploadMedia',function(cb,results){
            var obj = results.uploadMedia;
            obj.ent = id;
            mediaCtrl.save(obj,function(err,media){
                cb(err,media);
            });
        }]
    },function(err,results){
        fn(err,results.saveMedia);
    });
};
module.exports = Weixin;

//下载多媒体文件
Weixin.getMedia = function(id,mediaId,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getMedia':['getAccessToken',function(cb,results){
            var request = require('request');
            var r = request('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token='+results.getAccessToken.access_token+'&media_id='+mediaId);
            cb(null,r);
        }]
    },function(err,results){
        fn(err,results.getMedia);
    });
};

//上传图文消息素材
Weixin.uploadArticles = function(id,thumb_media_id,author,title,content_source_url,content,digest,show_cover_pic,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'createArticles':function(cb){
            var articles = [];
            for(var i in thumb_media_id){
                var obj = {};
                obj.thumb_media_id = thumb_media_id[i];
                obj.title = title[i];
                obj.content = content[i];
                if(author[i]){
                    obj.author = author[i];
                }
                if(content_source_url[i]){
                    obj.content_source_url = content_source_url[i];
                }
                if(digest[i]){
                    obj.digest = digest[i];
                }
                if(show_cover_pic[i]){
                    obj.show_cover_pic = show_cover_pic[i];
                }
                articles.push(obj);
            }
            cb(null,{'articles':articles});
        },
        'uploadArticles':['getAccessToken','createArticles',function(cb,results){
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/media/uploadnews?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write(JSON.stringify(results.createArticles));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }],
        'saveArticles':['createArticles','uploadArticles',function(cb,results){
            var obj = {
                'ent':id,
                'content':results.createArticles,
                'media_id':results.uploadArticles.media_id,
                'created_at':results.uploadArticles.create_at,
                'type':results.uploadArticles.type
            };
            articleCtrl.save(obj,function(err,res){
                cb(err,res);
            });
        }]
    },function(err,results){
        fn(err,results.saveArticles);
    });
};

//根据分组进行图文群发
Weixin.groupSendArticle = function(id,articleID,groupID,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    cb(err,res);
                });
            }
        },
        'getArticles':function(cb){
            articleCtrl.getMediaId(articleID,function(err,res){
                cb(err,res);
            });
        },
        'sendMsg':['getAccessToken','getArticles',function(cb,results){
            var content = {
                'mpnews':{
                    "media_id":results.getArticles.media_id
                },
                "msgtype":"mpnews"
            };
            if(groupID){
                content.filter = {
                    'group_id':groupID
                }
            } else {
                content.filter = {
                    'group_id':0
                }
            }
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/message/mass/sendall?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write(JSON.stringify(content));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        console.log(err,results);
        fn(err,results.sendMsg);
    });
};

//发送模板消息
Weixin.sendTemplate = function(id,tempId,data,toUser,fn){
    async.auto({
        'getAccessToken':function(cb){
            if(global.weixin[id]&&global.weixin[id].accessToken&&global.weixin[id].accessToken.startTime+(global.weixin[id].accessToken.expires_in*1000)>Date.now()){
                cb(null,global.weixin[id].accessToken);
            } else {
                Weixin.accessToken(id,function(err,res){
                    console.log(err,res);
                    cb(err,res);
                });
            }
        },
        'sendMsg':['getAccessToken',,function(cb,results){
            var sendData = {
                "touser":toUser,
                "template_id":tempId,
                "url":"http://weixin.qq.com/download",
                "topcolor":"#FF0000",
                "data":data
            }
            var https = require('https');
            var options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: '/cgi-bin/message/template/send?access_token='+results.getAccessToken.access_token,
                method: 'POST'
            };
            var req = https.request(options, function(res) {
                res.setEncoding('utf8');
                var _data="";
                res.on('data', function(chunk) {
                    _data+=chunk;
                });
                res.on('end',function(){
                    var result = JSON.parse(_data);
                    cb(null,result);
                });
            });
            req.write(JSON.stringify(sendData));
            req.end();
            req.on('error', function(e) {
                cb(e,null);
            });
        }]
    },function(err,results){
        fn(err,results.sendMsg);
    });
};
module.exports = Weixin;