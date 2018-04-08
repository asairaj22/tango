//global variable
var Pa = Pa || {};

(function() {
  'use strict';

  angular
    .module('pa', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource',
        'ui.router', 'ui.bootstrap', 'toaster', 'ngStorage']);

})();

'use strict';

angular.module('pa')
  .controller('loginController', ["$scope", "toaster", function ($scope, toaster) {
    
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
  }])

  .controller('registerController', ["$scope", "toaster", "$state", function ($scope, toaster, $state) {

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
  }]);

/**
 * INSPINIA - Responsive Admin Theme
 * 2.5
 *
 * Custom scripts
 */

angular.element(document).ready(function ($timeout) {


  // Full height of sidebar
  function fix_height() {
    var heightWithoutNavbar = angular.element("body > #wrapper").height() - 61;
    angular.element(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

    var navbarHeigh = angular.element('nav.navbar-default').height();
    var wrapperHeigh = angular.element('#page-wrapper').height();

    if(navbarHeigh > wrapperHeigh){
      angular.element('#page-wrapper').css("min-height", navbarHeigh + "px");
    }

    if(navbarHeigh < wrapperHeigh){
      angular.element('#page-wrapper').css("min-height", angular.element(window).height()  + "px");
    }

    if (angular.element('body').hasClass('fixed-nav')) {
      if (navbarHeigh > wrapperHeigh) {
        angular.element('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
      } else {
        angular.element('#page-wrapper').css("min-height", angular.element(window).height() - 60 + "px");
      }
    }

  }

  angular.element(window).bind("load resize scroll", function() {
    if(!angular.element("body").hasClass('body-small')) {
      fix_height();
    }
  });

  // Move right sidebar top after scroll
  angular.element(window).scroll(function(){
    if (angular.element(window).scrollTop() > 0 && !angular.element('body').hasClass('fixed-nav') ) {
      angular.element('#right-sidebar').addClass('sidebar-top');
    } else {
      angular.element('#right-sidebar').removeClass('sidebar-top');
    }
  });

  $timeout(function(){
    fix_height();
  });

  // Minimalize menu when screen is less than 768px
  angular.element(window).bind("load resize", function() {
    if (angular.element(document).width() < 769) {
      angular.element('body').addClass('body-small')
    } else {
      angular.element('body').removeClass('body-small')
    }
  })

});

'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('pa')
    .directive('sideNavigation', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

            }
        };
    }])
    .directive('minimalizaSidebar', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: ["$scope", function ($scope) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }]
        };
    }])
    .directive('compareTo', function () {
        return {
          require: "ngModel",
          scope: {
            otherModelValue: "=compareTo"
          },
          link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
              ngModel.$validate();
            });
          }
        };
    });

  


(function() {
  'use strict';

  angular
    .module('pa')

})();

(function() {
  'use strict';

  routerConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
  angular
    .module('pa')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/views/common/content.html"
      })
      .state('login', {
        url: "/login",
        controller: 'loginController',
        templateUrl: "app/views/auth/login.html"
      })
      .state('register', {
        url: "/register",
        controller: 'registerController',
        templateUrl: "app/views/auth/register.html"
      });
    $urlRouterProvider.otherwise('/login');
  }

})();

'use strict';

angular.module('pa')
  .controller('indexController', function () {
	
	// sample objects for login
	var sampleObject = [{ 'username': 'test', 'password': 'test', 'email':'test@gmail.com', 'confirmPassword':'test', 'gender':'Male'}, { 'username': 'test1', 'password': 'test1', 'email':'test1@gmail.com', 'confirmPassword':'test1', 'gender':'Male'}];

    // Put the object into localStorage
    localStorage.setItem('sampleData', JSON.stringify(sampleObject));

  });

(function ()
{
    'use strict';

    angular.module('pa')

})();

angular.module("pa").run(["$templateCache", function($templateCache) {$templateCache.put("app/views/auth/login.html","<div class=\"middle-box text-center animated fadeInDown\"><img alt=\"image-logo\" src=\"assets/tango.png\" class=\"tango-logo\"><div class=\"row\"><div class=\"ibox float-e-margins\"><div class=\"ibox-title\"><p class=\"header\">State thy name and ye shall pass</p><p class=\"header\">Not a member yet? <a ui-sref=\"register\">Register</a> now -- it\'s fun and easy!</p></div><div class=\"ibox-content\"><div class=\"row\"><div class=\"col-sm-7 form\"><form role=\"form\" name=\"login\" novalidate=\"\" ng-submit=\"signupForm()\"><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"text\" ng-class=\"{submitted:login.submitted}\" placeholder=\"Username\" class=\"form-control btn-default\" name=\"username\" ng-model=\"user.username\" required=\"\"></div><div class=\"m-t-xs\" ng-show=\"login.username.$invalid && login.submitted\"><p class=\"text-danger pull-right\" ng-show=\"login.username.$error.required\"><i class=\"fa fa-times\"></i>Required field</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"password\" ng-class=\"{submitted:login.submitted}\" placeholder=\"Password\" class=\"form-control btn-default\" name=\"password\" ng-model=\"user.password\" required=\"\"> <span class=\"forgot-password\"><a>Forgot password?</a></span></div><div class=\"m-t-xs\" ng-show=\"login.password.$invalid && login.submitted\"><p class=\"text-danger pull-right\" ng-show=\"login.password.$error.required\"><i class=\"fa fa-times\"></i>Required field</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><label class=\"pull-left check-label\"><input icheck=\"\" type=\"checkbox\" ng-model=\"main.unCheck\"> Remember me</label> <button class=\"btn pull-right btn-enable\" type=\"submit\" ng-class=\"{gray: login.$invalid}\" ng-disabled=\"login.$invalid\"><strong>Login</strong></button></div></div></form></div><div class=\"col-sm-5 socail-login\"><button class=\"btn facebook-btn\"><i class=\"fa fa-facebook\"></i><span>Login with Facebook</span></button></div><div class=\"col-sm-5 socail-login-divider\"><p class=\"or\">OR</p></div><div class=\"col-sm-5 socail-login\"><button class=\"btn twitter-btn\"><i class=\"fa fa-twitter\"></i><span>Login with Twitter</span></button></div></div></div></div><div class=\"ibox float-e-margins\"><div class=\"ibox-title\"><p class=\"header\">Learn more!</p><p class=\"header\">Check out our demos quick guides to our app.</p></div><div class=\"ibox-content\"><div class=\"row content2\"><div class=\"video-item\"><img alt=\"image-video\" id=\"play-video\" class=\"icon-play-youtube\" src=\"assets/play-btn.png\"> <img alt=\"image-video\" class=\"icon-play-ytb-loading\" src=\"assets/reload.gif\"></div><figure responsive-video=\"\"><iframe id=\"video\" src=\"https://www.youtube.com/embed/nQRkUSmnxcQ?rel=0&modestbranding=0&showinfo=0\" width=\"700\" height=\"370\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe></figure></div></div></div></div></div><script type=\"text/javascript\">\r\n  $(document).ready(function() {\r\n    $(\".icon-play-ytb-loading\").show();\r\n    $(\'#play-video\').on(\'click\', function(ev) {\r\n      $(\".icon-play-youtube\").hide();\r\n      $(\"#video\")[0].src += \"&autoplay=1\";\r\n      ev.preventDefault();\r\n    });\r\n\r\n    $(\"iframe\").load(function(){ \r\n    $(\".icon-play-ytb-loading\").hide(); \r\n      $(this).contents().on(\"mousedown, mouseup, click\", function(){\r\n        $(\".ytp-button\").hide();\r\n        $(\".icon-play-youtube\").hide();\r\n      });\r\n    });\r\n  });\r\n</script>");
$templateCache.put("app/views/auth/register.html","<div class=\"middle-box text-center animated fadeInDown\"><img alt=\"image-logo\" src=\"assets/tango.png\" class=\"tango-logo\"><div class=\"row\"><div class=\"ibox float-e-margins\"><div class=\"ibox-title\"><p class=\"header\">Join Tango today.</p><p class=\"header\">It\'s free and always will be</p></div><div class=\"ibox-content\"><div class=\"row\"><div class=\"col-sm-7 form\"><form role=\"form\" name=\"register\" novalidate=\"\" ng-submit=\"signupForm()\"><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"email\" ng-pattern=\"/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/\" ng-class=\"{submitted:register.submitted}\" placeholder=\"Email\" class=\"form-control btn-default\" name=\"email\" ng-model=\"user.email\" required=\"\"></div><div class=\"m-t-xs\" ng-show=\"register.email.$invalid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.email.$error.required\"><i class=\"fa fa-times\"></i>Required field</p><p class=\"text-danger pull-right\" ng-show=\"register.email.$error.pattern\"><i class=\"fa fa-times\"></i>Invalid email id</p><p class=\"text-danger pull-right\" ng-show=\"register.email.$error.aleadyRegistered\"><i class=\"fa fa-times\"></i>Email already registered, <a>login</a></p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"text\" ng-class=\"{submitted:register.submitted}\" placeholder=\"Username\" class=\"form-control btn-default\" name=\"username\" ng-model=\"user.username\" ng-change=\"checkUsername(user.username)\" required=\"\"></div><div class=\"m-t-xs\" ng-show=\"register.username.$invalid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.username.$error.required\"><i class=\"fa fa-times\"></i>Required field</p><p class=\"text-danger pull-right\" ng-show=\"register.username.$error.aleadyRegisteredUsername\"><i class=\"fa fa-times\"></i>Username already taken</p></div><p class=\"text-success pull-right\" ng-if=\"successUsername\"><i class=\"fa fa-check\"></i>Avaliable</p></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"password\" ng-class=\"{submitted:register.submitted}\" placeholder=\"Password\" class=\"form-control btn-default\" name=\"password\" ng-model=\"user.password\" required=\"\"></div><div class=\"m-t-xs\" ng-show=\"register.password.$invalid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.password.$error.required\"><i class=\"fa fa-times\"></i>Required field</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><input type=\"password\" ng-class=\"{submitted:register.submitted}\" placeholder=\"Confirm Password\" class=\"form-control btn-default\" name=\"confirmPassword\" ng-model=\"user.confirmPassword\" compare-to=\"user.password\" required=\"\"></div><div class=\"m-t-xs\" ng-show=\"register.confirmPassword.$invalid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.confirmPassword.$error.required\"><i class=\"fa fa-times\"></i>Required field</p><p class=\"text-danger pull-right\" ng-show=\"register.confirmPassword.$error.compareTo\"><i class=\"fa fa-times\"></i>Didn\'t match</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><select class=\"select btn-default\" ng-model=\"user.gender\" ng-class=\"{submitted:register.submitted}\" ng-options=\"x for x in genders\" required=\"\" name=\"gender\"><option disabled=\"\" selected=\"\" value=\"\">Select a Gender</option></select></div><div class=\"m-t-xs\" ng-show=\"register.gender.$invalid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.gender.$error.required\"><i class=\"fa fa-times\"></i>Required field</p></div><div class=\"m-t-xs\" ng-show=\"register.gender.$valid && register.submitted\"><p class=\"text-danger pull-right\" ng-show=\"register.gender.$sucess.required\"><i class=\"fa fa-times\"></i>field</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><p class=\"policy-info\">By clicking Register, you agree to our <a>Terms</a> and that you have read our <a>Data Use Policy</a>, including our <a>Cookie User</a>.</p></div></div><div class=\"form-group\"><div class=\"col-sm-8 pad-0\"><a class=\"btn pull-left btn-enable\" ui-sref=\"login\"><strong>Back</strong></a> <button class=\"btn pull-right btn-enable\" ng-class=\"{gray: register.$invalid}\" type=\"submit\"><strong>Register</strong></button></div></div></form></div><div class=\"col-sm-5 socail-login\"><button class=\"btn facebook-btn\"><i class=\"fa fa-facebook\"></i><span>Register with Facebook</span></button></div><div class=\"col-sm-5 socail-login-divider\"><p class=\"or\">OR</p></div><div class=\"col-sm-5 socail-login\"><button class=\"btn twitter-btn\"><i class=\"fa fa-twitter\"></i><span>Register with Twitter</span></button></div></div></div></div><div class=\"ibox float-e-margins\"><div class=\"ibox-title\"><p class=\"header\">Learn more!</p><p class=\"header\">Check out our demos quick guides to our app.</p></div><div class=\"ibox-content\"><div class=\"row content2\"><div class=\"video-item\"><img alt=\"image-video\" id=\"play-video\" class=\"icon-play-youtube\" src=\"assets/play-btn.png\"> <img alt=\"image-video\" class=\"icon-play-ytb-loading\" src=\"assets/reload.gif\"></div><figure responsive-video=\"\"><iframe id=\"video\" src=\"https://www.youtube.com/embed/nQRkUSmnxcQ?rel=0&modestbranding=0&showinfo=0\" width=\"700\" height=\"370\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe></figure></div></div></div></div></div><script type=\"text/javascript\">\r\n  $(document).ready(function() {\r\n    $(\".icon-play-ytb-loading\").show();\r\n    $(\'#play-video\').on(\'click\', function(ev) {\r\n      $(\".icon-play-youtube\").hide();\r\n      $(\"#video\")[0].src += \"&autoplay=1\";\r\n      ev.preventDefault();\r\n    });\r\n\r\n    $(\"iframe\").load(function(){ \r\n    $(\".icon-play-ytb-loading\").hide(); \r\n      $(this).contents().on(\"mousedown, mouseup, click\", function(){\r\n        $(\".ytp-button\").hide();\r\n        $(\".icon-play-youtube\").hide();\r\n      });\r\n    });\r\n  });\r\n</script>");
$templateCache.put("app/views/common/content.html","<div id=\"wrapper\"><div ng-include=\"\'app/views/common/navigation.html\'\"></div><div id=\"page-wrapper\" class=\"gray-bg {{$state.current.name}}\"><div ng-include=\"\'app/views/common/topnavbar.html\'\"></div><div ui-view=\"\"></div><div ng-include=\"\'app/views/common/footer.html\'\"></div></div></div>");
$templateCache.put("app/views/common/footer.html","<div class=\"footer\"><div><strong>Pocket Accountant</strong> &copy; 2017</div></div>");
$templateCache.put("app/views/common/ibox_tools.html","<div class=\"ibox-tools\" uib-dropdown=\"\"><a ng-click=\"showhide()\"><i class=\"fa fa-chevron-up\"></i></a> <a uib-dropdown-toggle=\"\" href=\"\"><i class=\"fa fa-wrench\"></i></a><ul uib-dropdown-menu=\"\"><li><a href=\"\">Config option 1</a></li><li><a href=\"\">Config option 2</a></li></ul><a ng-click=\"closebox()\"><i class=\"fa fa-times\"></i></a></div>");
$templateCache.put("app/views/common/navigation.html","<nav class=\"navbar-default navbar-static-side\" role=\"navigation\" data-ng-controller=\"navigationController as cn\"><div class=\"sidebar-collapse\"><ul side-navigation=\"\" class=\"nav metismenu\" id=\"side-menu\"><li class=\"nav-header\"><div class=\"profile-element\" uib-dropdown=\"\"><a uib-dropdown-toggle=\"\" href=\"\"><span class=\"clear\"><span class=\"block m-t-xs\"><strong class=\"font-bold\">{{main.userName}}</strong></span> <span class=\"text-muted text-xs block\">Languages<b class=\"caret\"></b></span></span></a><ul uib-dropdown-menu=\"\" class=\"animated flipInX m-t-xs\"><li><a ng-click=\"cn.changeLanguage(\'en\')\">English</a></li><li><a ng-click=\"cn.changeLanguage(\'ar\')\">Arabic</a></li></ul></div><div class=\"logo-element\">IN+</div></li><li ui-sref-active=\"active\"><a><i class=\"fa fa-bars\"></i><span class=\"nav-label\" translate=\"\">Main Menu</span></a></li><li ui-sref-active=\"active\" ng-if=\"cn.isSuperUser\"><a><i class=\"fa fa-user\"></i> <span class=\"nav-label\" translate=\"\">Admin</span></a><ul class=\"nav nav-second-level collapse in\"><li><a ui-sref=\"index.updateOrganization\"><i class=\"fa fa-building\"></i> <span class=\"nav-small-span\" translate=\"\">Organization Profile</span></a></li><li><a ui-sref=\"index.users\"><i class=\"fa fa-user-plus\"></i><span class=\"nav-small-span\" translate=\"\">Users</span></a></li><li><a ui-sref=\"index.manageData\"><i class=\"fa fa-cog\"></i><span class=\"nav-small-span\" translate=\"\">Manage Data</span></a></li><li><a ui-sref=\"index.accountHead/list\"><i class=\"fa fa-columns\"></i><span class=\"nav-small-span\" translate=\"\">Account Heads</span></a></li></ul></li><li ui-sref-active=\"active\"><a ui-sref=\"index.invoice/list\"><i class=\"fa fa-laptop\"></i> <span class=\"nav-label\" translate=\"\">Invoice</span></a></li><li ui-sref-active=\"active\"><a ui-sref=\"index.purchase/list\"><i class=\"fa fa-shopping-bag\"></i> <span class=\"nav-label\" translate=\"\">Purchase</span></a></li><li ui-sref-active=\"active\"><a ui-sref=\"index.receipt/list\"><i class=\"fa fa-files-o\"></i> <span class=\"nav-label\" translate=\"\">Receipts</span></a></li><li ui-sref-active=\"active\"><a ui-sref=\"index.payment/list\"><i class=\"fa fa-cc-visa\"></i> <span class=\"nav-label\" translate=\"\">Payments</span></a></li><li ui-sref-active=\"active\"><a ui-sref=\"index.asset-expense/list\"><i class=\"fa fa-building-o\"></i> <span class=\"nav-label\" translate=\"\">Assets/Expenses</span></a></li><li ui-sref-active=\"active\"><a ui-sref=\"index.customers/list\"><i class=\"fa fa-user-plus\"></i> <span class=\"nav-label\" translate=\"\">Customer/Party</span></a></li><li ui-sref-active=\"active\"><a><i class=\"fa fa-book\"></i><span class=\"nav-label\" translate=\"\">Accounts</span></a><ul class=\"nav nav-second-level collapse in\"><li><a ui-sref=\"index.trialBalance\"><i class=\"fa fa-columns\"></i><span class=\"nav-small-span\" translate=\"\">Trial balance</span></a></li></ul><ul class=\"nav nav-second-level collapse in\"><li><a ui-sref=\"index.orgAccounts/list\"><i class=\"fa fa-book\"></i><span class=\"nav-small-span\" translate=\"\">Accounts list</span></a></li></ul></li><li ui-sref-active=\"active\"><a ui-sref=\"index.events\"><i class=\"fa fa-bell-o\"></i> <span class=\"nav-label\" translate=\"\">Events</span></a></li></ul></div></nav>");
$templateCache.put("app/views/common/topnavbar.html","<div class=\"row border-bottom\" ng-controller=\"navigationController as cn\"><nav class=\"navbar navbar-static-top white-bg\" role=\"navigation\" style=\"margin-bottom: 0\"><div class=\"navbar-header col-sm-4 col-xs-3\"><span minimaliza-sidebar=\"\"></span></div><div class=\"navbar-header statusMessage-nav col-sm-4 col-xs-5\"><div class=\"statusMessage\" ng-if=\"statusMessage\"><div id=\"statusMessageId\" class=\"{{statusMessage.type}}\">{{statusMessage.message}}</div></div></div><div class=\"navbar-header col-sm-4 col-xs-4\"><ul class=\"nav navbar-top-links navbar-right\"><li><a ng-click=\"cn.onLogout()\"><i class=\"fa fa-sign-out\"></i> Log out</a></li></ul></div></nav></div>");}]);
//# sourceMappingURL=../maps/scripts/app.js.map
