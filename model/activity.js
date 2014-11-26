/**
 * Created by zzy on 2014/11/26.
 */
var Schema = require('mongoose').Schema;

var activitySchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'name':String,
    'content':String,
    'type':String,
    'articles':[{
        'title':String,
        'desc':String,
        'image':String,
        'url':String
    }],
    'sceneId':String,
    'value':Number,
    'createDate':{'type':Number,'default':Date.now}
});

var Activity = db.model('Activity', activitySchema);
module.exports = Activity;