/**
 * Created by zzy on 2014/10/21.
 */
var Schema = require('mongoose').Schema;

var mediaSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'type':String,
    'media_id':String,
    'created_at':Number
});

var Media = db.model('Media', mediaSchema);
module.exports = Media;