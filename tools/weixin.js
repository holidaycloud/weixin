/**
 * Created by zzy on 2014/10/17.
 */
var httpsClient = require("./HttpsClient.js");
var httpClient = require("./HttpClient.js");
var config = require("./Config.js");
var us = require('underscore');
var parseString = require('xml2js').parseString;

var WeiXin = function () {
};
WeiXin.token = "RTACN";
WeiXin.ACCESS_TOKEN = "";
WeiXin.expressTime = 0;
WeiXin.sendMsg = {};
WeiXin.check = function (signature, timestamp, nonce) {
    var tmpArr = [WeiXin.token, timestamp, nonce];
//	console.log("Before Sort",tmpArr);
    tmpArr.sort();
//	console.log("After Sort",tmpArr);
    var str = tmpArr[0] + tmpArr[1] + tmpArr[2];
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    var mySign = shasum.digest('hex');
    if (mySign === signature) {
        return true;
    } else {
        return false;
    }
};

//get msg
WeiXin.message = function (xml, cb) {
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        var msgType = result.xml.MsgType[0];
        cb(err, WeiXin[msgType](result));
    });
};

WeiXin.text = function (xml) {
    return "<xml>" +
        "<ToUserName><![CDATA[" + xml.xml.FromUserName[0] + "]]></ToUserName>" +
        "<FromUserName><![CDATA[" + xml.xml.ToUserName[0] + "]]></FromUserName>" +
        "<CreateTime>" + new Date().getTime() + "</CreateTime>" +
        "<MsgType><![CDATA[text]]></MsgType>" +
        "<Content><![CDATA[你好]]></Content>" +
        "</xml>";
};

WeiXin.image = function (xml) {

};

WeiXin.voice = function (xml) {

};

WeiXin.video = function (xml) {

};

WeiXin.location = function (xml) {

};

WeiXin.link = function (xml) {

};

WeiXin.event = function (xml) {
    if ("CLICK" === xml.xml.Event[0]) {
        switch (xml.xml.EventKey[0]) {
            case 'HOT':
                return WeiXin.sendMsg['news'](xml.xml.FromUserName[0],xml.xml.ToUserName[0]);
                break;
            case 'PAY_ORDER':
                break;
        }
    } else if('subscribe'=== xml.xml.Event[0]) {
        return "<xml>"+
            "<ToUserName><![CDATA["+xml.xml.FromUserName[0]+"]]></ToUserName>"+
            "<FromUserName><![CDATA["+xml.xml.ToUserName[0]+"]]></FromUserName>"+
            "<CreateTime>"+new Date().getTime()+"</CreateTime>"+
            "<MsgType><![CDATA[text]]></MsgType>"+
            "<Content><![CDATA[感谢您关注万车游 服务号，我们将及时为您提供最优惠的自驾游休闲度假线路和产品！\n万车游平台由各级旅游管理部门支持，长三角自驾游专家委员会、长三角自驾游产业论坛组委会主办，竭诚为您服务！\n如需查看和转发万车游平台的历史消息，请点击屏幕右上角的图标，选择“查看历史消息”，在出现的页面中选择任一历史消息阅读，并可转发朋友圈和好友！]]></Content>"+
            "</xml>";
    }
};

//send msg
WeiXin.sendMsg.news = function (to, from) {
    console.log("send new "+to);
    return "<xml>"
        + "<ToUserName><![CDATA[" + to + "]]></ToUserName>"
        + "<FromUserName><![CDATA[" + from + "]]></FromUserName>"
        + "<CreateTime>" + new Date().getTime() + "</CreateTime>"
        + "<MsgType><![CDATA[news]]></MsgType>"
        + "<ArticleCount>4</ArticleCount>"
        + "<Articles>"
        + "<item>"
        + "<Title><![CDATA[长三角自驾游专家委员会在沪成立]]></Title>"
        + "<Description><![CDATA[长三角自驾游专家委员会在沪成立]]></Description>"
        + "<PicUrl><![CDATA[http://dd885.b0.upaiyun.com/eb42654a71d982c8e2d13905.jpg]]></PicUrl>"
        + "<Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MjM5NzE3NTA1Nw==&mid=200347437&idx=1&sn=3fa0757d7174a8e665ddffa8a618593e&scene=1&from=singlemessage&isappinstalled=0&key=e60cf81314c277c7b83f19ff1f6394fe3936dff8525e181fa9b1edecb310d202eb4554cfc888282b3851cfe094f8941e&ascene=0&uin=MjY3ODM1]]></Url>"
        + "</item>"
        + "<item>"
        + "<Title><![CDATA[让我告诉您：象山有多美]]></Title>"
        + "<Description><![CDATA[让我告诉您：象山有多美]]></Description>"
        + "<PicUrl><![CDATA[http://dd885.b0.upaiyun.com/09c684a85dadbe15ba9f17ec.jpg]]></PicUrl>"
        + "<Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA4MTM0MTQyNw==&mid=200123420&idx=1&sn=4da3c8904b5ce6201ce3e9d03ed02fa7#rd]]></Url>"
        + "</item>"
        + "<item>"
        + "<Title><![CDATA[“变形金刚”5月29日登临静安公园]]></Title>"
        + "<Description><![CDATA[“变形金刚”5月29日登临静安公园]]></Description>"
        + "<PicUrl><![CDATA[http://dd885.b0.upaiyun.com/ef038731275c9253fa653bf5.jpg]]></PicUrl>"
        + "<Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA4MTM0MTQyNw==&mid=200139459&idx=1&sn=73fa2e27d5a411a92546bbe2622bb209&scene=1&from=singlemessage&isappinstalled=0&key=bdc0fc08be7dd6d428144cdd531c0aa9b5fc03470cbafcbb351028e2d27fff6879b2459b68bdadfa3a45c5d55bf49617&ascene=0&uin=NDgyOTIyMjU1]]></Url>"
        + "</item>"
        + "<item>"
        + "<Title><![CDATA[白领特驾活动精彩抢先看]]></Title>"
        + "<Description><![CDATA[白领特驾活动精彩抢先看]]></Description>"
        + "<PicUrl><![CDATA[http://dd885.b0.upaiyun.com/ef038731275c9253fa653bf5.jpg]]></PicUrl>"
        + "<Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NjAyMzYyOQ==&mid=200290206&idx=1&sn=1978e32fc881d8216c13e8eda03b90b4&scene=1#rd]]></Url>"
        + "</item>"
        + "</Articles>"
        +"</xml>";
};

//get access token if express will request or not
WeiXin.getAT = function (fn) {
    if (new Date().getTime() > this.expressTime) {
        console.log("token need regenerate");
        var opt = {
            hostname: config.wx.wxhost,
            port: config.wx.wxport,
            path: "/cgi-bin/token?grant_type=client_credential&appid=" + config.wx.appID + "&secret=" + config.wx.appsecret,
            method: "GET"
        };
        new httpsClient(opt).getReq(function (err, response) {
            if (response.access_token) {
                WeiXin.ACCESS_TOKEN = response.access_token;
                WeiXin.expressTime = new Date().getTime() + response.expires_in * 1000;
                fn();
            }
        });
    } else {
        fn();
    }
}
//menu
WeiXin.createMenu = function (fn) {
    var params = {
        "button": [
            {
                "name": "预订",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "门票",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://sh.dd885.com/wap/productList/ticket&response_type=code&scope=snsapi_base&state=rta#wechat_redirect"
                    },
                    {
                        "type": "view",
                        "name": "联票",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://sh.dd885.com/wap/productList/ticketPackage&response_type=code&scope=snsapi_base&state=rta#wechat_redirect"
                    },
                    {
                        "type": "view",
                        "name": "自驾游套餐",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://sh.dd885.com/wap/productList/package&response_type=code&scope=snsapi_base&state=rta#wechat_redirect"
                    },
                    {
                        "type": "view",
                        "name": "主题活动",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://sh.dd885.com/promotion/ningbo/99&response_type=code&scope=snsapi_base&state=rta#wechat_redirect"
                    }
                ]
            },
            {
                "name": "权威发布",
                "sub_button": [
                    {
                        "type": "click",
                        "name": "近期热点",
                        "key": "HOT"
                    },
                    {
                        "type": "view",
                        "name": "优秀目的地",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzA4MTM0MTQyNw==&mid=200063436&idx=1&sn=58fa04cd3eefdae4632cfcf5ca431edf#rd"
                    },
                    {
                        "type": "view",
                        "name": "官方发布",
                        "url": "http://www.dd885.com/wap/govNotice"
                    }
                ]
            },
            {
                "name": "我",
                "sub_button": [
                    {
                        "type": "view",
                        "name": "已购买订单",
                        "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.wx.appID+"&redirect_uri=http://sh.dd885.com/wap/orders/all&response_type=code&scope=snsapi_base&state=rta#wechat_redirect"
                    },
                    {
                        "type":"view",
                        "name":"粉丝福利群",
                        "url": "http://weixin.qq.com/g/AfZKQBgEWGNHlqsK"
                    },
                    {
                        "type": "click",
                        "name": "维权",
                        "key": "CUSTOM"
                    }
                ]
            }
        ]};
    var opt = {
        hostname: config.wx.wxhost,
        port: config.wx.wxport,
        path: "/cgi-bin/menu/create?access_token=" + WeiXin.ACCESS_TOKEN,
        method: "POST"
    };
    new httpsClient(opt).postReq(params, function (err, response) {
        var errMsg = "";
        if (0 !== response.errcode) {
            errMsg = resonse.errmsg;
        }
        fn(errMsg);
    });
}

WeiXin.delMenu = function (fn) {
    var opt = {
        hostname: config.wx.wxhost,
        port: config.wx.wxport,
        path: "/cgi-bin/menu/delete?access_token=" + WeiXin.ACCESS_TOKEN,
        method: "GET"
    };
    new httpsClient(opt).getReq(function (err, response) {
        console.log("dele menu is " + WeiXin.ACCESS_TOKEN);
        var errMsg = "";
        if (0 !== response.errcode) {
            errMsg = resonse.errmsg;
        }
        fn(errMsg);
    });
}

//deliver notify
WeiXin.deliver = function(openid,transid,out_trade_no,cb){
    //postParams
    var params = {};
    params.appid = config.wx.appID;
    params.openid = openid;
    params.transid = transid;
    params.out_trade_no = out_trade_no;
    params.deliver_timestamp = Math.round((new Date().getTime()/1000)).toString();
    params.deliver_status = "1"; //1 deliver success  2 deliver failed,if failed then deliver_msg is set failed reason
    params.deliver_msg = "OK";
    params.appkey = config.wx.paySignKey; //only generate sign use it\
    var keys = ["appid","appkey","openid","transid","out_trade_no","deliver_timestamp","deliver_status","deliver_msg"];
    params.app_signature = WeiXin.generateSign(keys,params);
    params.sign_method = "sha1";
    //params delete appkey
    delete params.appkey;
    var opt = {
        hostname: config.wx.wxhost,
        port: config.wx.wxport,
        path: "/pay/delivernotify?access_token=" + WeiXin.ACCESS_TOKEN,
        method: "POST"
    };
    new httpsClient(opt).postReq(params,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            if(response.errcode!==0){
                cb(response.errcode,response.errmsg);
            }else{
                cb(null,response.errmsg);
            }

        }

    });
}

//customer
WeiXin.customer = function (data,cb) {
    parseString(data, function (err, result) {
        type = result.xml.MsgType[0];
        if(err){
            cb('error','数据异常无法解析');
        }else{
            var keys = ["appid","appkey","timestamp","openid"];
            var values = {};
            values.appid = config.wx.appID;
            values.appkey = config.wx.paySignKey;
            values.timestamp = result.xml.TimeStamp[0];
            values.openid = result.xml.OpenId[0];
            var sign = WeiXin.generateSign(keys,values);
            if(result.xml.AppSignature[0] === sign){
                WeiXin.customer[type](result,function(e,r){
                    if(e){
                        cb("error",r);
                    }else{
                        if(0===r.error){
                            cb(null,"success");
                        }else{
                            cb(r.error, r.errorMsg);
                        }
                    }
                });
            }else{
                cb('error','签名不正确',result.xml.AppSignature[0]+","+sign);
            }
        }
    });
}

//处理用户新增诉求
WeiXin.customer.request = function(result,cb){
    var params = {};
    params.openID = result.xml.OpenId[0];
    params.msgType = result.xml.MsgType[0];
    params.feedbackID = result.xml.FeedBackId[0];
    params.transID = result.xml.TransId[0];
    params.reason = result.xml.Reason[0];
    params.solution = result.xml.Solution[0];
    params.extInfo = result.xml.ExtInfo[0];
    var opt = {
        hostname: config.inf.host,
        port: config.inf.port,
        path: "/weixin/feedback/create",
        method: "POST"
    };
    new httpClient(opt).postReq(params,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//处理用户确认处理完毕
WeiXin.customer.confirm = function(result,cb){
    var params = {};
    params.msgType = result.xml.MsgType[0];
    var opt = {
        hostname: config.inf.host,
        port: config.inf.port,
        path: "/weixin/feedback/update/"+result.xml.FeedBackId[0],
        method: "POST"
    };
    new httpClient(opt).postReq(params,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//处理用户拒绝处理完毕
WeiXin.customer.reject = function(result,cb){
    var params = {};
    params.msgType = result.xml.MsgType[0];
    var opt = {
        hostname: config.inf.host,
        port: config.inf.port,
        path: "/weixin/feedback/update/"+result.xml.FeedBackId[0],
        method: "POST"
    };
    new httpClient(opt).postReq(params,function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            cb(null,response);
        }
    });
}

//feedback
WeiXin.feedback = function(openid,feedbackid,cb){
    var opt = {
        hostname: config.wx.wxhost,
        port: config.wx.wxport,
        path: "/payfeedback/update?access_token=" + WeiXin.ACCESS_TOKEN + "&openid=" + openid + "&feedbackid=" + feedbackid,
        method: "GET"
    };
    new httpsClient(opt).getReq(function (err, response) {
        if (err) {
            cb("error",err);
        }else{
            if(0!==response.errcode){
                cb(response.errcode,response.errmsg);
            }else{
                cb(null,"ok");
            }
        }
    });
}

//pay notify
WeiXin.payNotify = function(xml,cb){
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        if(err){
            cb("error",err);
        }else{
            var data = {};
            data.appid = result.xml.AppId[0];
            data.appkey = config.wx.paySignKey;
            data.timestamp = result.xml.TimeStamp[0];
            data.noncestr = result.xml.NonceStr[0];
            data.openid = result.xml.OpenId[0];
            data.issubscribe = result.xml.IsSubscribe[0];
            var keys = ["appid","appkey","timestamp","noncestr","openid","issubscribe"];
            var sign = WeiXin.generateSign(keys,data);
            if(result.xml.AppSignature[0]===sign){
                cb(null, data.openid);
            }else{
                cb("error","sign is not true,"+result.xml.AppSignature[0]+","+sign);
            }
        }
    });
}

//生成签名
WeiXin.generateSign = function(keys,values){
    keys.sort();
    //generator keyvalue string
    var str = "";
    var isFirst = true;
    keys.forEach(function(key){
        if(isFirst){
            str = key + "=" + values[key];
            isFirst = false;
        }else{
            str = str + "&" + key + "=" + values[key];
        }
    });
    //generate
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    var mySign = shasum.digest('hex');
    return mySign;
}

//oAuth2.0
WeiXin.oAuth = function(code,cb){
    var opt = {
        hostname: config.wx.wxhost,
        port: config.wx.wxport,
        path: "/sns/oauth2/access_token?appid="+config.wx.appID+"&secret="+config.wx.appsecret+"&code="+code+"&grant_type=authorization_code",
        method: "GET"
    };
    new httpsClient(opt).getReq(function (err, response) {
        if(err){
            cb('error',err);
        }else{
            cb(null,response.openid);
        }
    });
}
module.exports = WeiXin;