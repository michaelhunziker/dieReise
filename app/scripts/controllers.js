'use strict';

angular.module('dieReiseApp')

  .controller('dataFeedController', ['$scope', 'dataService', function($scope, dataService) {
    $scope.registerMessage = 'Das ist leider schon weg.';

    $scope.showContent = false;
    $scope.message = 'Loading ...';
    $scope.events = dataService.getEvents().query(
      function (response) {
        $scope.events = response;
        $scope.showContent = true;
      },
      function (response) {
        $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
      });

    $scope.event = {};
    $scope.fillModal = function(eventId, eventAvailable) {
      console.log(eventId);
      console.log(eventAvailable);
      if (eventAvailable === true) {
      $scope.event = dataService.getEvents().get({_id: eventId});
      }
      else {
        $scope.event = {name:'Schon weg', description:'Schon weg'};
      }
      console.log($scope.event);
    };

  }])

  .controller('GiftController', ['$scope', 'dataService', function($scope, dataService) {

    $scope.myGift = {firstName:'', lastName:'', email:'', date: ''};
    $scope.registerMessage = 'Vielen Dank für dein Geschenk!';

    $scope.sendForm = function() {
      $scope.myGift.date = new Date().toISOString();
      console.log($scope.myGift);
      $scope.event.registration.push($scope.myGift);
      dataService.getEvents().update({_id:$scope.event._id},$scope.event);
      $scope.event.available = false;

      $scope.myGiftForm.$setPristine();
      $scope.myGift = {firstName:'', lastName:'', email:'', date: ''};
      console.log($scope.myGift);

    };

    }])

;
