/**
 * Created by zzy on 2014/10/21.
 */
var Schema = require('mongoose').Schema;

var articleSchema = new Schema({
    'ent':{'type':Schema.Types.ObjectId,'index':true},
    'content':{},
    'media_id':String,
    'created_at':Number,
    'type':String
});

var Article = db.model('Article', articleSchema);
module.exports = Article;