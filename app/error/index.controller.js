(function () {
    'use strict';

    angular
        .module('app')
        .controller('Error.IndexController', Controller);

    function Controller($rootScope) {
        var vm = this;

        vm.error = null;

        initController();

        function initController() {
            vm.error =  $rootScope.httpErrors;
            delete $rootScope.httpErrors;
        }
    }

})();