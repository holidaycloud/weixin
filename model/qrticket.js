/**
 * Created by zzy on 2014/11/25.
 */
var Schema = require('mongoose').Schema;

var qrTicketSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'ticket':String,
    'expireSeconds':Number,
    'url':String,
    'imageUrl':String,
    'createTime':{'type':Number,'default':Date.now}
});

var QRTicket = db.model('QRTicket', qrTicketSchema);
module.exports = QRTicket;