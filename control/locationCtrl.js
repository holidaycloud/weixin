/**
 * Created by zzy on 2014/11/25.
 */
var Location = require('./../model/location');
var LocationCtrl = function(){};
LocationCtrl.save = function(ent,openID,lat,lon,precision,fn){
    var location = new Location({
        'ent':ent,
        'openID':openID,
        'gps':{'lat':lat,'lon':lon},
        'precision':precision
    });
    location.save(function(err,res){
        fn(err,res);
    });
};

module.exports = LocationCtrl;