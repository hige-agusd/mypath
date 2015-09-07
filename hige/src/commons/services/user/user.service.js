angular.module('myPath')
  .factory('UserSrv', function($q,Call2ApiSrv,CultureSrv,SessionSrv) {

  var self = {},
      userData = false;

  self.getUserData = function(){
    var deferred = $q.defer();
    if(userData == false){
      Call2ApiSrv.makeGetSignCall('UserAccount/ClientAndTradingAccount',{}, 'json').then(function(response){
        userData = response;
        deferred.resolve(userData);
      },function(response){
        deferred.reject(response);
      });
    }else{
      deferred.resolve(userData);
    }
    return deferred.promise;
  }

  /*
  session/changePassword?
    UserName=3t999&
    Session=cc053279-d106-4dda-ba1b-50adad98e5b
  {
    NewPassword: "password1"
    Password: "password"
    UserName: "3t999"
  }
  */
  self.updatePassword = function(_old,_new){
    var deferred = $q.defer();

    var username = SessionSrv.getSessionParameter();

    Call2ApiSrv.makePostSignCall('session/changePassword',{},{
      'NewPassword': _new,
      'Password': _old,
      'UserName': username.UserName
    }, 'json').then(function(response){
      deferred.resolve(response);
    },function(response){
      deferred.reject(response);
    });

    return deferred.promise;
  }

  self.updateEmail = function(_new){
    var deferred = $q.defer();

    Call2ApiSrv.makePostSignCall('userAccount/save',{},{
      "personalEmailAddress": _new,
      "personalEmailAddressIsDirty": true
    }, 'json').then(function(response){
      deferred.resolve(response);
    },function(response){
      deferred.reject(response);
    });

    return deferred.promise;
  };

  return self;
});
