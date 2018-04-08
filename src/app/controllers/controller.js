'use strict';

angular.module('pa')
  .controller('loginController', function ($scope, toaster) {
    
    $scope.user = {};
    $scope.signupForm = function () {
      $scope.login.submitted = true;
      if ($scope.login.$valid) {
        var isObject = false;
        var retrievedObject = JSON.parse(localStorage.getItem('sampleData'));
        angular.forEach(retrievedObject, function (value) {
          if(value.username === $scope.user.username && value.password === $scope.user.password) {
            isObject = true;
            toaster.success('Login successfully, Welcome to Tango!');
            return true;
          }
        });
        if(!isObject) {
          toaster.error('Kindly check your login credentials');
        }
      }
    }
  })

  .controller('registerController', function ($scope, toaster, $state) {

    $scope.user = {};
    $scope.genders = ['Male', 'Female'];

    // check username availability
    $scope.checkUsername = function (username) {
      var isUsername = false;
      $scope.successUsername = false;
      var retrievedObject = JSON.parse(localStorage.getItem('sampleData'));
      angular.forEach(retrievedObject, function (value) {
        if(value.username === username) {
          isUsername = true;
          return true;
        }
      });      
      if(username) {
        $scope.register.username.$invalid = isUsername ? true : false;
        $scope.register.username.$error.aleadyRegisteredUsername = isUsername ? true : false;
        $scope.successUsername = isUsername ? false : true;  
      }
    }

    $scope.signupForm = function () {
      $scope.register.submitted = true;
      if ($scope.register.$valid) {        
        var isObject = false;
        var isUsername = false;
        var retrievedObject = JSON.parse(localStorage.getItem('sampleData'));
        // Check email id is already registered or not
        angular.forEach(retrievedObject, function (value) {
          if(value.email === $scope.user.email) {
            isObject = true;
            return true;
          }
        });
        $scope.register.$invalid = isObject ? true : false;
        $scope.register.email.$invalid = isObject ? true : false;
        $scope.register.email.$error.aleadyRegistered = isObject ? true : false;
        
        // Check username is already registered or not?
        angular.forEach(retrievedObject, function (value) {
          if(value.username === $scope.user.username) {
            isUsername = true;
            return true;
          }
        });
        $scope.register.$invalid = isUsername ? true : false;
        $scope.register.username.$invalid = isUsername ? true : false;
        $scope.register.username.$error.aleadyRegisteredUsername = isUsername ? true : false; 

        // if new email and username, have to save
        if(!isObject && !isUsername) {
          retrievedObject.push($scope.user);
          localStorage.setItem('sampleData', JSON.stringify(retrievedObject));
          toaster.success('Registered successfully');
          $state.go('login');
        }
      }
    }
  });
