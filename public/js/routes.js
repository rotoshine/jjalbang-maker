var angular = require('angular');
angular
    .module('JBMaker')
    .config(function($stateProvider){
        $stateProvider
            .state('source', {
                url: '/source/:id',
                templateUrl: 'source.html'
            });
    });
