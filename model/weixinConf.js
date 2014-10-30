/**
 * Created by zzy on 2014/10/20.
 */
var Schema = require('mongoose').Schema;

var confSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'token':String,
    'appID':String,
    'appsecret':String,
    'partnerId':String,
    'partnerKey':String,
    'paySignKey':String,
    'memberToken':String
});

var WeixinConf = db.model('WeixinConf', confSchema);
module.exports = WeixinConf;