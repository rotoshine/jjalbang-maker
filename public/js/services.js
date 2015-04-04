var angular = require('angular');
angular
    .module('JBMaker')
    .service('imageService', function(){
        return {
            generate: function(source, backgroundImage, font, fontSize){
                var canvas = document.getElementById('result');
                var context = canvas.getContext('2d');

                var i, j, cut, currentCutY, texts;

                var LINE_HEIGHT_RATIO = 1.42857151;
                var lineHeight = fontSize * LINE_HEIGHT_RATIO;

                console.log(lineHeight);
                context.drawImage(backgroundImage, 0, 0);
                context.font = fontSize + 'px ' + font;

                if(source.hasOwnProperty('fontColor')){
                    context.fillStyle = source.fontColor;
                }

                var cuts = source.cuts;

                for(i = 0; i < cuts.length; i++){
                    cut = cuts[i];

                    if(cut.text !== undefined && typeof cut.text === 'string'){
                        // 왠지 모르겠는데 x랑 y가 묘하게 어긋남...보정하자..
                        texts = cut.text.split('\n');
                        currentCutY = cut.y + fontSize;
                        console.log('currentCutY:' + currentCutY);
                        for(j = 0; j < texts.length; j++){
                            context.fillText(texts[j], cut.x + 2, currentCutY);
                            currentCutY = currentCutY + lineHeight;
                            console.log('next rendering y :' + currentCutY);
                        }
                    }
                }

                return canvas.toDataURL('image/png');
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
                imageUrl: '/images/description_bug.jpg',
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
                        width: 116,
                        height: 112
                    }
                ]
            },
            {
                id: 3,
                name: '도라에몽',
                imageUrl: '/images/도라에몽.jpg',
                width: 700,
                height: 498,
                cuts: [
                    {
                        x:89.5,
                        y:14,
                        width:539,
                        height:241
                    }
                ]
            },
            {
                id: 4,
                name: '그거해봐',
                imageUrl: '/images/doThat.png',
                width: 588,
                height: 846,
                cuts: [
                    {
                        x: 13.5,
                        y: 18,
                        width: 66,
                        height: 178
                    },
                    {
                        x: 12.5,
                        y: 552,
                        width: 257,
                        height: 37
                    },
                    {
                        x: 15.5,
                        y: 788,
                        width: 255,
                        height: 33
                    }                   
                ]
            },
            {
                id: 5,
                name: '이게 ~도 없는게',
                imageUrl: '/images/이게.jpg',
                cuts: [
                    {
                        x: 112.5,
                        y: 250,
                        width: 381,
                        height: 43
                    },
                    {
                        x: 104.5,
                        y: 517,
                        width: 396,
                        height: 72
                    },
                    {
                        x: 104.5,
                        y: 889,
                        width: 397,
                        height: 66
                    }
                ],
                width: 599,
                height: 1008
            },
            {
                id: 6,
                name: 'Civil War',
                imageUrl: '/images/시빌워.jpg',
                fontColor: '#FFFFFF',
                cutBackgroundColor: '#000000',
                cuts: [
                    {
                        x: 80.5,
                        y: 222,
                        width: 306,
                        height: 31
                    },
                    {
                        x: 75.5,
                        y: 477,
                        width: 300,
                        height: 27
                    }
                ],
                width: 447,
                height: 960
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