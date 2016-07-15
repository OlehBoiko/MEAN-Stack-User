(function () {
    'use strict';

    angular
        .module('app')
        .controller('User.IndexController', Controller);

    function Controller($window, $stateParams, UserService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
                // get user by id
                UserService.GetById($stateParams.id).then(function (users) {
                    vm.user = users;
                });

        }

    }

})();