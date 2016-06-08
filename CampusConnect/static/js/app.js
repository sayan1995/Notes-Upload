'use strict';

/**
 * @ngdoc object
 * @name conferenceApp
 * @requires $routeProvider
 * @requires conferenceControllers
 * @requires ui.bootstrap
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 *
 */


var app = angular.module('conferenceApp',
    ['ngMaterial', 'conferenceControllers', 'ngRoute', 'ui.bootstrap']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/conference/create', {
                    templateUrl: '/partials/create_conferences.html',
                    controller: 'CreateConferenceCtrl'
                }).
                when('/conference/detail/:websafeConferenceKey', {
                    templateUrl: '/partials/conference_detail.html',
                    controller: 'ConferenceDetailCtrl'
                }).
                when('/profile', {
                    templateUrl: '/partials/profile.html',
                    controller: 'MyProfileCtrl',
                    
                }).
                when('/:abbr', {
                    templateUrl: '/partials/college.html',
                    controller: 'CollegeCtrl',
                    
                }).
                when('/:abbr/calendar', {
                    templateUrl: '/partials/calendar.html',
                    controller: 'CalendarCtrl',
                }).
                when('/:abbr/groups', {
                    templateUrl: '/partials/groups.html',
                    controller: 'GroupsCtrl',
                }).
                when('/:abbr/groups/:groupabbr', {
                    templateUrl: '/partials/group_name.html',
                    controller: 'GroupNameCtrl',
                }).
                when('/:abbr/groups/:groupabbr/:eventid/0', {
                    templateUrl: '/partials/news_desc.html',
                    controller: 'NewsCtrl',
                }).
                when('/:abbr/calendar/:eventid', {
                    templateUrl: '/partials/events_desc.html',
                    controller: 'EventsCtrl',
                }).
                when('/:abbr/groups/:groupabbr/:eventid/1', {
                    templateUrl: '/partials/events_desc.html',
                    controller: 'EventsCtrl',
                }).
                when('/', {
                    templateUrl: '/partials/show_conferences.html',
                    controller: 'GetCollegeCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

/**
 * @ngdoc filter
 * @name startFrom
 *
 * @description
 * A filter that extracts an array from the specific index.
 *
 */
app.filter('startFrom', function () {
    /**
     * Extracts an array from the specific index.
     *
     * @param {Array} data
     * @param {Integer} start
     * @returns {Array|*}
     */
    var filter = function (data, start) {
        return data.slice(start);
    }
    return filter;
});


/**
 * @ngdoc constant
 * @name HTTP_ERRORS
 *
 * @description
 * Holds the constants that represent HTTP error codes.
 *
 */
app.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401
});


/**
 * @ngdoc service
 * @name oauth2Provider
 *
 * @description
 * Service that holds the OAuth2 information shared across all the pages.
 *
 */
app.factory('oauth2Provider', function ($modal) {
    var oauth2Provider = {
        CLIENT_ID: '643812142533-9iems4drq93tq35gu0jknder4n423nkh.apps.googleusercontent.com',
        SCOPES: 'email profile',
        signedIn: false
    }

    /**
     * Calls the OAuth2 authentication method.
     */
    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    /**
     * Logs out the user.
     */
    oauth2Provider.signOut = function () {
        gapi.auth.signOut();
        // Explicitly set the invalid access token in order to make the API calls fail.
        gapi.auth.setToken({access_token: ''})
        oauth2Provider.signedIn = false;
    };

    /**
     * Shows the modal with Google+ sign in button.
     *
     * @returns {*|Window}
     */
    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        return modalInstance;
    };

    return oauth2Provider;
});

app.service('getCollegeShared',function() {
    var college_id = '';
    var college_name = '';
    return {
        setCollegeid: function(collegeid) {
            college_id = collegeid;
        },
        getCollegeid: function() {
            return college_id;
        },
        setCollegename: function(collegename) {
            college_name = collegename;
        },
        getCollegename: function() {
            return college_name;
        }
    }
});
app.service('getGroupShared',function() {
    var group_id = '';
    var group_name = '';
    return {
        setGroupid: function(groupid) {
            group_id = groupid;
        },
        getGroupid: function() {
            return group_id;
        },
        setGroupname: function(groupname) {
            group_name = groupname;
        },
        getGroupname: function() {
            return group_name;
        }
    }
});