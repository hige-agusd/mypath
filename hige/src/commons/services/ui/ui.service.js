angular.module('myPath')
  .factory('UiSrv', function($modal,$location) {

  var self = {
    Types: {
      Error: 'error',
      Success: 'success'
    }
  };

  var currentTheme = false;

  self.getTheme = function(){
    if(currentTheme == false){
      currentTheme = $location.search().TH || 'dark';
    }
    return currentTheme;
  }

  self.showModal = function(params){
    return $modal.open({
      templateUrl: 'commons/components/alert/alert.html',
      controller: 'AlertCtrl',
      size: params.size,
      resolve: {
        params: function() {
          return params;
        }
      }
    });
  }

  return self;
})
