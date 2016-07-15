(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('error', {
                url: '/error',
                templateUrl: 'error/index.html',
                controller: 'Error.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'error' }
            })
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'users/index.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'users' }
            })
            .state('view', {
                url: '/user/:id',
                templateUrl: 'view/index.html',
                controller: 'User.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'users-view' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });

        $httpProvider.interceptors.push(function ($q, $window, $location, $rootScope) {
            return {

                responseError: function (rejection) {

                    if (rejection.status === 403) {
                        $rootScope.httpErrors = {'status':rejection.status, 'message':rejection.statusText};
                        $location.path('/error').replace();
                    }

                    if (rejection.status === 404) {
                        $rootScope.httpErrors = {'status':rejection.status, 'message':rejection.statusText};
                        $location.path('/error').replace();
                    }

                    if (rejection.status >= 500 || rejection.status == -1) {
                        $rootScope.httpErrors = {'status':rejection.status, 'message':rejection.statusText};
                        $location.path('/error').replace();
                    }

                    return $q.reject(rejection);
                }
            };
        });

    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();