'use strict';

describe('Controllers :: Feedback', function(){
  var scope,
      controller,
      $httpBackend,
      translateSrv,
      feedbackSrv,
      uiSrv;

  beforeEach(function(){
    module('myPath');
  });

  beforeEach(inject(function($rootScope,$controller,$injector) {
    scope = $rootScope.$new();
    translateSrv = $injector.get('TranslateSrv');
    feedbackSrv = $injector.get('FeedbackSrv');
    uiSrv = $injector.get('UiSrv');
    controller = $controller('FeedbackCtrl', {
      $scope: scope,
      TranslateSrv: translateSrv,
      FeedbackSrv: feedbackSrv,
      UiSrv: uiSrv
    });

    var $httpBackend = $injector.get('$httpBackend')

    $httpBackend.whenGET(/.*\/main\.html.*/)
        .respond('<div></div>');
    $httpBackend.when('GET', /.*config.xml/)
            .respond('<?xml version="1.0" encoding="utf-8"?><flexITP><flexCharts><flexChartsURL>https://trade.loginandtrade.com/tp/charts</flexChartsURL><ratesUrl>push.cityindex.com</ratesUrl><ratesUrlControlPort>443</ratesUrlControlPort><ratesUrlPort>443</ratesUrlPort><historicUrl>https://ciapi.cityindex.com/TradingAPI/</historicUrl><marketSearchUrl>https://ciapi.cityindex.com/TradingAPI/</marketSearchUrl></flexCharts><tradingApiURL>https://ciapi.cityindex.com/TradingAPI/</tradingApiURL><vsClientProxy>https://ciapi.cityindex.com/ClientDocumentsProxy/ClientProxy</vsClientProxy><viewStWebApp>https://trade.loginandtrade.com/flashASP/host/progs/ViewStatement/ViewStatement</viewStWebApp><onlineFundinghtm>OnlineFundingView/transferfunds</onlineFundinghtm><onlineFundingWebApp>https://trade.loginandtrade.com/onlineFundingPCI</onlineFundingWebApp><lsc><serverURL>push.cityindex.com</serverURL><controlPort>443</controlPort><port>443</port></lsc></flexITP>');

  }));

  describe(':: Validate',function(){
    it(':: Type empty', function() {
        scope.send();
        expect(scope.feedback.error.noType).toBe(true);
    });

    it(':: Message empty', inject(function($controller) {
      scope.send();
      expect(scope.feedback.error.noMessage).toBe(true);
    }));

    it(':: Message Only', inject(function($controller) {
      scope.feedback.data.message = 'This is a test message.';
      scope.send();
      expect(scope.feedback.error.noType).toBe(true);
    }));

    it(':: Restart message', inject(function($controller) {
      scope.feedback.data.message = 'This is a test';
      scope.restart();
      expect(scope.feedback.data.message).toBe('');
    }));

    it(':: Type Only', inject(function($controller) {
        scope.feedback.data.type = {
            name: 'test'
        };
        scope.feedback.data.message = '';
        scope.send();
        expect(scope.feedback.error.noMessage).toBe(true);
    }));
  });
  describe(':: Send',function(){

    var $httpBackend;
    beforeEach(inject(function($rootScope,$controller,$injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', /.*\/message\/translation.*cultureId=\d{2}/)
          .respond({
            TranslationKeyValuePairs: []
          });
      $httpBackend.when('GET', /.*UserAccount\/ClientAndTradingAccount/)
          .respond({});
    }));

    it(':: Success', inject(function($controller) {
      scope.feedback.data.type = {
        name: 'test'
      };
      scope.feedback.data.message = 'aaa';
      $httpBackend.when('JSONP', /.*\/form\/process\/.*/)
          .respond({});
      scope.send();
      $httpBackend.flush();
      expect(scope.feedback.success).toBe(true);
    }));

    it(':: Faild show Modal', inject(function($controller) {
      scope.feedback.data.type = {
        name: 'test'
      };
      scope.feedback.data.message = 'aaa';
      $httpBackend.when('JSONP', /.*\/form\/process\/.*/)
          .respond(401,{});
      $httpBackend.expectGET('commons/components/alert/alert.html')
          .respond('');
      scope.send();
      $httpBackend.flush();
      expect(scope.feedback.success).toBe(false);
    }));
  });
});
