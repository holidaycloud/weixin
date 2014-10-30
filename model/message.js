/**
 * Created by zzy on 2014/10/21.
 */
var Schema = require('mongoose').Schema;

var messageSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'key':String,
    'content':String,
    'created_at':{'type':Number,'default':Date.now}
});

var Message = db.model('Message', messageSchema);
module.exports = Message;