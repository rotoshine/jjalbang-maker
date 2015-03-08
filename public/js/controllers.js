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
        var i;

        $scope.fonts = [
            {
                name: '굴림',
                cssValue: '굴림'
            },
            {
                name: '나눔고딕',
                cssValue: 'Nanum Gothic',
                importUrl: 'http://fonts.googleapis.com/earlyaccess/nanumgothic.css'
            },
            {
                name: '나눔 브러시 스크립트',
                cssValue:'Nanum Brush Script',
                importUrl: 'http://fonts.googleapis.com/earlyaccess/nanumbrushscript.css'
            },
            {
                name: '제주 한라산',
                cssValue: 'Jeju Hallasan',
                importUrl: 'http://fonts.googleapis.com/earlyaccess/jejuhallasan.css'
            }
        ];

        $scope.fontSizes = [
            10,
            12,
            14,
            16,
            20,
            40
        ];

        $scope.selectedFont = '굴림';
        $scope.selectedFontSize = DEFAULT_FONT_SIZE;

        $scope.init = function(){
            $scope.source = sourceService.findById(parseInt($stateParams.id));

            backgroundImage = new Image();
            backgroundImage.src = $scope.source.imageUrl;

            console.log($scope.source);

            backgroundImage.addEventListener('load', function(){
                var canvas = document.getElementById('background');
                var context = canvas.getContext('2d');

                context.drawImage(backgroundImage, 0, 0);
            });

            // webFont Load
            var webFontFamilies = []
            var webFontUrls = [];
            for(i = 0; i < $scope.fonts.length; i++){
                if($scope.fonts[i].importUrl){
                    webFontFamilies.push($scope.fonts[i].cssValue);
                    webFontUrls.push($scope.fonts[i].importUrl);
                }
            }

            window.WebFont.load({
                custom: {
                    families: webFontFamilies,
                    urls: webFontUrls
                }
            });

            // ng-options로 생성된 font의 font를 변경
            setTimeout(function(){
                for(var i = 0; i < $scope.fonts.length; i++){
                    var $option = $('#font').find('option:eq(' + i + ')');
                    $option.css('font-family', $scope.fonts[i].cssValue);
                    console.log($option);
                }
            }, 0);

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

        function applyCutStyle(cssName, value){
            $('.cut').css(cssName, value);
        }
        $scope.applyFontSize = function(fontSize){
            applyCutStyle('font-size', fontSize + 'px');
        };

        $scope.applyFont = function(font){
            console.log(font);
            applyCutStyle('font-family', font);
        };

        $scope.generate = function($event){
            var data = imageService.generate($scope.source, backgroundImage, $scope.selectedFont, $scope.selectedFontSize);
            var target = $event.target;

            target.download = '짤생성_결과.jpg';
            target.href = data;
        }
    });