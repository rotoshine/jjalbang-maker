'use strict';
window.jQuery = window.$ = require('jquery');

var angular = require('angular');
var Modernizr = require('modernizr');

if(Modernizr.canvas) {
    var app = angular.module('JBMaker', [require('ui-router')]);

    app
        .config(function ($urlRouterProvider, $locationProvider) {
            $urlRouterProvider
                .otherwise('/source/1');
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');
        })
        .constant('DEFAULT_FONT_SIZE', 12);

    require('./controllers.js');
    require('./routes.js');
    require('./services.js');

    require('bootstrap');
}else{
    alert('지원하지 않는 브라우저입니다. 최신 브라우저로 접속하세요.');
}
