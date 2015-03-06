var angular = require('angular');
angular
    .module('JBMaker')
    .controller('NavController', function($scope, sourceService){
        $scope.sources = sourceService.find();
    })
    .controller('SourceController', function($scope, $stateParams, sourceService, imageService, DEFAULT_FONT_SIZE){
        $scope.source = null;
        var backgroundImage = null;

        $scope.fontSizes = [
            10,
            11,
            12,
            13,
            14,
            15,
            16
        ];

        $scope.selectedFontSize = DEFAULT_FONT_SIZE;

        $scope.init = function(){
            console.log(parseInt($stateParams.id));
            $scope.source = sourceService.findById(parseInt($stateParams.id));

            backgroundImage = new Image();
            backgroundImage.src = $scope.source.imageUrl;

            backgroundImage.addEventListener('load', function(){
                var canvas = document.getElementById('background');
                var context = canvas.getContext('2d');

                context.drawImage(backgroundImage, 0, 0);
            });
        };

        $scope.getStyle = function(cut){
            var MEASURE = 'px';
            return {
                'left': cut.x + MEASURE,
                'top': cut.y + MEASURE,
                'width': cut.width + MEASURE,
                'height': cut.height + MEASURE
            };
        };

        $scope.applyFontSize = function(fontSize){
            $('.cut').css('font-size', fontSize + 'px');
        };

        $scope.generate = function($event){
            var data = imageService.generate($scope.source, backgroundImage, $scope.selectedFontSize);
            var target = $event.target;

            target.download = '짤생성_결과.jpg';
            target.href = data;
        }
    });