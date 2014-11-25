/**
 * Created by zzy on 2014/11/25.
 */
var Schema = require('mongoose').Schema;

var locationSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'openID':String,
    'createTime':{'type':Number,'default':Date.now},
    'gps':{'lat':Number,'lon':Number},
    'precision':Number
});

var Location = db.model('Location', locationSchema);
module.exports = Location;