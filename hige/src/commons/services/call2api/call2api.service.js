angular.module('myPath')
  .factory('Call2ApiSrv', function($q,HTTPSrv,$location,$window,SessionSrv,ConfigSrv) {

  var self = {};

  function extendSignParams(_params){
    return angular.extend({}, SessionSrv.getSessionParameter(),_params);
  }

  function makeSignCall(_method,_path,_params,_data, type){
    var deferred = $q.defer();
    ConfigSrv.get('SrvUrl').then(function(_base){
      HTTPSrv.request({
        method: _method,
        url: _base + _path,
        params: extendSignParams(_params),
        data: _data,
	responseType: type
      }).then(function(data){
        deferred.resolve(data);
      }, function(data){
        deferred.reject(data);
      });
    });
    return deferred.promise;
  }

  self.makeGetSignCall = function(_path,_params,type){
    return makeSignCall('GET',_path,_params,{},type);
  }

  self.makePostSignCall = function(_path,_params,_data,type){
    return makeSignCall('POST',_path,_params,_data,type);
  }

  return self;
})
