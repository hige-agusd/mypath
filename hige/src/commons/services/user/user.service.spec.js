'use strict';

describe('Service :: User', function(){
  var service;

  beforeEach(module('myPath'));

  // instantiate service
  beforeEach(inject(function (_UserSrv_,$injector) {
    service = _UserSrv_;
    var $httpBackend = $injector.get('$httpBackend')

    $httpBackend.whenGET(/.*\/main\.html.*/)
        .respond('<div ></div>');
    $httpBackend.when('GET', /.*config.xml/)
        .respond('<?xml version="1.0" encoding="utf-8"?><flexITP><flexCharts><flexChartsURL>https://trade.loginandtrade.com/tp/charts</flexChartsURL><ratesUrl>push.cityindex.com</ratesUrl><ratesUrlControlPort>443</ratesUrlControlPort><ratesUrlPort>443</ratesUrlPort><historicUrl>https://ciapi.cityindex.com/TradingAPI/</historicUrl><marketSearchUrl>https://ciapi.cityindex.com/TradingAPI/</marketSearchUrl></flexCharts><tradingApiURL>https://ciapi.cityindex.com/TradingAPI/</tradingApiURL><vsClientProxy>https://ciapi.cityindex.com/ClientDocumentsProxy/ClientProxy</vsClientProxy><viewStWebApp>https://trade.loginandtrade.com/flashASP/host/progs/ViewStatement/ViewStatement</viewStWebApp><onlineFundinghtm>OnlineFundingView/transferfunds</onlineFundinghtm><onlineFundingWebApp>https://trade.loginandtrade.com/onlineFundingPCI</onlineFundingWebApp><lsc><serverURL>push.cityindex.com</serverURL><controlPort>443</controlPort><port>443</port></lsc></flexITP>');

  }));

  describe(':: getUserData()',function(){
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it(':: Success',function(){
      $httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond({});
      var user;
      service.getUserData().then(function(_user){
        user = _user;
      });
      $httpBackend.flush();
      expect(user).toEqual({});
    })

    it(':: Cached',function(done){
      $httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond({});
      var user;
      service.getUserData().then(function(_user){
        user = _user;
        service.getUserData().then(function(_user){
          done();
        });
      });
      $httpBackend.flush();
    })

    it(':: Error',function(done){
      $httpBackend.expectGET(/.*UserAccount\/ClientAndTradingAccount.*/).respond(401,'');
      var user;
      service.getUserData().then(function(){},function(){
        done();
      });
      $httpBackend.flush();
    })
  })

  describe(':: updatePassword()',function(done){
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it(':: Success',function(){
      $httpBackend.expectPOST(/.*session\/changePassword.*/).respond({});
      service.updatePassword('a','a').then(done);
      $httpBackend.flush();
    })
  })

  describe(':: updateEmail()',function(done){
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
    }));
    it(':: Success',function(){
      $httpBackend.expectPOST(/.*userAccount\/save.*/).respond({});
      service.updateEmail('a').then(done);
      $httpBackend.flush();
    })
  })
});
