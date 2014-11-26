/**
 * Created by zzy on 2014/11/26.
 */
var Schema = require('mongoose').Schema;

var activitySchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'type':Number,
    'title':String,
    'desc':String,
    'image':String,
    'sceneId':String,
    'value':Number
});

var Activity = db.model('Activity', activitySchema);
module.exports = Article;