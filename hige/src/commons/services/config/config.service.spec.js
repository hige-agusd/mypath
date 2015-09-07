'use strict';
describe('Service :: Config', function(){
  beforeEach(module('myPath'));
  describe(':: Env param',function(){
    var httpBackend,injector;
    beforeEach(inject(function ($injector,$httpBackend) {
      httpBackend = $httpBackend;
      injector = $injector;
      $httpBackend.whenGET(/.*\/config.*/)
        .respond(
          '<?xml version="1.0" encoding="utf-8"?>' +
          '<flexITP>' +
            '<tradingApiURL>a</tradingApiURL>' +
          '</flexITP>');
    }));

    it(':: Undefined',function(){
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.get('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('a');
    })

    it(':: Defined',function(){
      var paramsSrv = injector.get('ParamsSrv');
      paramsSrv.ENV = 'live';
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.get('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('a');
    })

    it(':: Defined at PPE',function(){
      var paramsSrv = injector.get('ParamsSrv');
      paramsSrv.ENV = 'ppe';
      var service = injector.get('ConfigSrv');
      var srvUrl;
      service.get('SrvUrl').then(function(_srvUrl){
        srvUrl = _srvUrl;
      });
      httpBackend.flush();
      expect(srvUrl).toBe('a');
    })
  })
});
