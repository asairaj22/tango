'use strict';

angular.module('pa')
  .controller('indexController', function () {
	
	// sample objects for login
	var sampleObject = [{ 'username': 'test', 'password': 'test', 'email':'test@gmail.com', 'confirmPassword':'test', 'gender':'Male'}, { 'username': 'test1', 'password': 'test1', 'email':'test1@gmail.com', 'confirmPassword':'test1', 'gender':'Male'}];

    // Put the object into localStorage
    localStorage.setItem('sampleData', JSON.stringify(sampleObject));

  });
