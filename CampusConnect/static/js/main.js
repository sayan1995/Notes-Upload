    angular.module('ngMailChimp', ['ngAria', 'ngMessages', 'ngAnimate'])
        .controller('SignUpController', function ($http) {
            var ctrl = this,
                newCustomer = { email:'', userName:'', college:'' },
                actions,
                MailChimpSubscription;
    
            var signup = function () {
                if( ctrl.signupForm.$valid) {
                    $http({
                        url: 'http://' + 'campusconnect' + '.' + 'us11' +'.list-manage.com/subscribe/post-json', 
                        method: "GET",
                        params: {NAME: ctrl.newCustomer.userName,
                                COLL : ctrl.newCustomer.college,
                                EMAIL : ctrl.newCustomer.email,
                                u : "35f503a1404877769e67c22f9",
                                id : "d5a2aab2f9"}
                    }).
        success(function(data, status) {
          ctrl.showSubmittedPrompt = true;
          clearForm();
        }).
        error(function(data, status) {
          ctrl.showSubmittedPrompt = true;
          clearForm();
      });
                    
                    
                    
    
                    //MailChimpSubscription.save(
            // Successfully sent data to MailChimp.
                    //function (response) {
                    //    if (response.result === 'error')
                    //    {
                    //        ctrl.showSubmittedPrompt = false;
                    //    }
                    //    else
                    //    {
                    //        ctrl.showSubmittedPrompt = true;
                    //        clearForm();
                    //    }
                    //},
                    //function (error) {
                    //    $log.error('MailChimp Error: %o', error);
                    //}
                    //);        
                }
            };
    
            var clearForm = function () {
                ctrl.newCustomer = { email:'', userName:'', college:'' }
                ctrl.params={}
                ctrl.signupForm.$setUntouched();
                ctrl.signupForm.$setPristine();
            };
    
            var getPasswordType = function () {
                return ctrl.signupForm.showPassword ? 'text' : 'password';
            };
    
            var toggleEmailPrompt = function (value) {
                ctrl.showEmailPrompt = value;
            };
    
            var toggleUsernamePrompt = function (value) {
                ctrl.showUsernamePrompt = value;
            };
    
            var toggleCollegePrompt = function (value) {
                ctrl.showCollegePrompt = value;
            };
    
            var hasErrorClass = function (field) {
                return ctrl.signupForm[field].$touched && ctrl.signupForm[field].$invalid;
            };
    
            var showMessages = function (field) {
                return ctrl.signupForm[field].$touched || ctrl.signupForm.$submitted
            };
    
            ctrl.showEmailPrompt = false;
            ctrl.showUsernamePrompt = false;
            ctrl.showCollegePrompt = false;
            ctrl.showSubmittedPrompt = false;
            ctrl.toggleEmailPrompt = toggleEmailPrompt;
            ctrl.toggleUsernamePrompt = toggleUsernamePrompt;
            ctrl.toggleCollegePrompt = toggleCollegePrompt;
            ctrl.getPasswordType = getPasswordType;
            ctrl.hasErrorClass = hasErrorClass;
            ctrl.showMessages = showMessages;
            ctrl.newCustomer = newCustomer;
            ctrl.signup = signup;
            ctrl.clearForm = clearForm;
        })
        .directive('validatePasswordCharacters', function () {
            return {
                require: 'ngModel',
                link: function ($scope, element, attrs, ngModel) {
                    ngModel.$validators.lowerCase = function (value) {
                        var pattern = /[a-z]+/;
                        return (typeof value !== 'undefined') && pattern.test(value);
                    };
                    ngModel.$validators.upperCase = function (value) {
                        var pattern = /[A-Z]+/;
                        return (typeof value !== 'undefined') && pattern.test(value);
                    };
                    ngModel.$validators.number = function (value) {
                        var pattern = /\d+/;
                        return (typeof value !== 'undefined') && pattern.test(value);
                    };
                    ngModel.$validators.specialCharacter = function (value) {
                        var pattern = /\W+/;
                        return (typeof value !== 'undefined') && pattern.test(value);
                    };
                    ngModel.$validators.eightCharacters = function (value) {
                        return (typeof value !== 'undefined') && value.length >= 8;
                    };
                }
            }
        })
    ;