var angular = require('angular');
angular
    .module('JBMaker')
    .config(function($stateProvider){
        $stateProvider
            .state('source', {
                url: '/source/:id',
                templateUrl: 'source.html',
                controller: 'SourceController'
            })
            .state('source extract', {
                url: '/source-extract',
                templateUrl: 'source-extract.html',
                controller: 'SourceExtractController'
            });
    });
