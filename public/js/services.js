var angular = require('angular');
angular
    .module('JBMaker')
    .service('imageService', function(){
        return {
            generate: function(source, backgroundImage, fontSize){
                var canvas = document.getElementById('result');
                var context = canvas.getContext('2d');

                var i, j, cut, currentCutY, texts;

                context.drawImage(backgroundImage, 0, 0);
                context.font = fontSize + 'px 굴림';

                for(i = 0; i < source.cuts.length; i++){
                    cut = source.cuts[i];

                    if(cut.text !== undefined && typeof cut.text === 'string'){
                        // 왠지 모르겠는데 x랑 y가 묘하게 어긋남...보정하자..
                        texts = cut.text.split('\n');
                        currentCutY = cut.y + 13;
                        for(j = 0; j < texts.length; j++){
                            context.fillText(texts[j], cut.x + 2, currentCutY);
                            currentCutY = currentCutY + 13;
                        }
                    }
                }
            }
        };
    }).service('sourceService', function(){
        var sources = [
            {
                id: 1,
                name: '개노답 삼형제',
                imageUrl: '/images/no_answer_trio.jpg',
                width: 554,
                height: 625,
                cuts: [
                    {
                        x: 160,
                        y: 19,
                        width: 48,
                        height: 120,
                        text: ''
                    },
                    {
                        x: 155,
                        y: 177,
                        width: 51,
                        height: 88,
                        text: ''
                    },
                    {
                        x: 376,
                        y: 343,
                        width: 52,
                        height: 77,
                        text: ''
                    },
                    {
                        x: 489,
                        y: 346,
                        width: 50,
                        height: 85,
                        text: ''
                    },
                    {
                        x: 192,
                        y: 342,
                        width: 57,
                        height: 97,
                        text: ''
                    },
                    {
                        x: 288,
                        y: 344,
                        width: 74,
                        height: 73,
                        text: ''
                    },
                    {
                        x: 12,
                        y: 339,
                        width: 54,
                        height: 74,
                        text: ''

                    },
                    {
                        x: 92,
                        y: 341,
                        width: 83,
                        height: 102
                    }
                ]
            },
            {
                id: 2,
                name: '설명충',
                imageUrl: 'images/description_bug.jpg',
                width: 639,
                height: 986,
                cuts: [
                    {
                        x: 335,
                        y: 31,
                        width: 138,
                        height: 93,
                        text: ''
                    },
                    {
                        x: 66,
                        y: 280,
                        width: 93,
                        height: 131,
                        text: ''
                    },
                    {
                        x: 473,
                        y: 466,
                        width: 135,
                        height: 144,
                        text: ''
                    },
                    {
                        x: 167,
                        y: 449,
                        width: 100,
                        height: 104,
                        text: ''
                    },
                    {
                        x: 34,
                        y: 472,
                        widht: 116,
                        height: 112
                    }
                ]

            }
        ];

        return {
            find: function(){
                return angular.copy(sources);
            },
            findById: function(id){
                for(var i = 0; i < sources.length; i++){
                    if(sources[i].id === id){
                        return angular.copy(sources[i]);
                    }
                }
                return null;
            }
        };
    });