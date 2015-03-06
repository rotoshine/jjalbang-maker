'use strict';

var angular = require('angular');
angular
    .module('JBMaker')
    .controller('NavController', function($scope, sourceService){
        $scope.sources = sourceService.find();
    })
    .controller('SourceExtractController', function($scope){
        var canvas = document.getElementById('loaded-image');
        var context = canvas.getContext('2d');
        var image;

        $scope.source = null;
        $scope.init = function(){
            $scope.cuts = [];
            $scope.source = {
                cuts: []
            };
        };

        $scope.addCuts = function(params){
            $scope.source.cuts.push({
                x: params.x,
                y: params.y,
                width: params.width,
                height: params.height
            });

            $scope.$apply();
        };

        $scope.removeCut = function($index){
            $scope.source.cuts.splice($index, 1);
        };

        $scope.loadLocalImage = function(event){
            var URL = window.webkitURL || window.URL;
            var url = URL.createObjectURL(event.target.files[0]);

            image = new Image();

            image.src = url;

            image.addEventListener('load', function(){
                $('#loaded-image')
                    .attr('width', image.width)
                    .attr('height', image.height);

                context.drawImage(image, 0, 0);

                $scope.source.width = image.width;
                $scope.source.height = image.height;
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

        // angular에서 file의 ng-change 미지원으로 jquery 이용
        $('#local-image-file').on('change', $scope.loadLocalImage);

        var dragStartPoint = null;
        var isMouseDown = false;

        function getMousePosition(event){
            var rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function clearImage(){
            context.clearRect(0, 0, image.width, image.height);
            context.drawImage(image, 0, 0);
        }
        $('#loaded-image')
            .on('mousedown', function(event){
                isMouseDown = true;
                dragStartPoint = getMousePosition(event);
                console.log('mouse down!');
            })
            .on('mousemove', function(event){
                if(isMouseDown && image && dragStartPoint !== null){
                    console.log('move!!!');
                    context.strokeStyle = 'rgba(0,0,0,0.5)';
                    var currentPoint = getMousePosition(event);
                    clearImage();
                    context.strokeRect(dragStartPoint.x, dragStartPoint.y, currentPoint.x - dragStartPoint.x, currentPoint.y - dragStartPoint.y);
                }
            })
            .on('mouseup', function(event){
                console.log('mouse up!');
                var isMouseDown = false;
                var dragEndPoint = getMousePosition(event);
                clearImage();

                var width = dragEndPoint.x - dragStartPoint.x;
                var height = dragEndPoint.y - dragStartPoint.y;

                console.log(width);
                console.log(height);

                if(width > 30 && height > 30){
                    $scope.addCuts({
                        x: dragStartPoint.x,
                        y: dragStartPoint.y,
                        width: width,
                        height: height
                    });
                }

                dragStartPoint = null;
            });

    })
    .controller('SourceController', function($scope, $stateParams, sourceService, imageService, DEFAULT_FONT_SIZE){
        $scope.source = null;
        var backgroundImage = null;

        $scope.fontSizes = [
            10,
            12,
            14,
            16,
            20,
            40
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