angular.module('myPath')
  .factory('ConfigSrv', function(ParamsSrv, $http, $q) {

    var self = {
      map: {}
    };

    var ie8Hack = {
      'live': {
        SrvUrl: 'https://ciapi.cityindex.com/TradingAPI/',
        StatementUrl: 'https://trade.loginandtrade.com/flashASP/host/progs/ViewStatement/ViewStatement'
      },
      'ppe': {
        SrvUrl: 'https://ciapipreprod.cityindextest9.co.uk/tradingapi/',
        StatementUrl: 'http://pkh-ppe-web01/flashASP/host/progs/ViewStatement/ViewStatement'
      },
      'qat': {
        SrvUrl: 'https://ciapiqat.cityindextest9.co.uk/tradingapi/',
        StatementUrl: 'http://pkh-qat-app01:8002/flashASP/host/progs/ViewStatement/ViewStatement'
      }
    }

    var ready = false,
        pending = [],
        envStr;

    if(ParamsSrv.ENV){
      if(ParamsSrv.ENV == 'ppe')
        ParamsSrv.ENV = 'preprod';
      envStr = '_'+ParamsSrv.ENV;
    }else{
      envStr = '';
    }

      $http.get('./config'+envStr+'.xml', {'type': 'xml'}).then(function(configStr){
	configStr = configStr.data;
        var config = (typeof is_ie == 'undefined')? $(configStr) : $($.parseXML(configStr));
	//var config = $(configStr);
        self.map['SrvUrl'] =  config.find('tradingApiURL').text();
        self.map['StatementUrl'] =  config.find('vsClientProxy').text();
        ready = true;
        _.each(pending,function(func){
          func();
        });
      });

    self.get = function(key){
      var deferred = $q.defer();
      if(!ready){
        pending.push(function(){
          deferred.resolve(self.map[key]);
        });
      }else{
        deferred.resolve(self.map[key]);
      }
      return deferred.promise;
    };

    return self;
  });
