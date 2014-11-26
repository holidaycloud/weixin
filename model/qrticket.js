/**
 * Created by zzy on 2014/11/25.
 */
var Schema = require('mongoose').Schema;

var qrTicketSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'ticket':String,
    'sceneId':Number,
    'expireSeconds':Number,
    'url':String,
    'imageUrl':String,
    'createTime':{'type':Number,'default':Date.now}
});
qrTicketSchema.index({'ent':1,'sceneId':1},{unique:true});
var QRTicket = db.model('QRTicket', qrTicketSchema);
module.exports = QRTicket;