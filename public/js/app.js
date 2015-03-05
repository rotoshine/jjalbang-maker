(function($){
	'use strict';

	if(Modernizr.canvas){				
		var Ment = function(params){
			var that = this;

			this.style = {
				left : params.left,
				top: params.top,
				width: params.width,
				height: params.height
			};

			this.$el = $(params.target);
			
			this.getText = function(){
				return that.$el.val();
			};

			var key;
			for(key in this.style){
				this.$el.css(key, this.style[key] + 'px');
			}
		};

		var backgroundImage = new Image();
		backgroundImage.src = '/images/no_answer_trio.jpg';

		backgroundImage.addEventListener('load', function(){
			var canvas = document.getElementById('background');
			var context = canvas.getContext('2d');			
			
			context.drawImage(backgroundImage, 0, 0);
			var ments = [
				new Ment({
					target: '.ment-1',
					left: 160,
					top: 19,
					width: 48,
					height: 120
				}),
				new Ment({
					target: '.ment-2',
					left: 155,
					top: 177,
					width: 51,
					height: 88
				}),
				new Ment({
					target: '.ment-3',
					left: 376,
					top: 343,
					width: 52,
					height: 77
				}),
				new Ment({
					target: '.ment-4',
					left: 489,
					top: 346,
					width: 50,
					height: 85
				}),
				new Ment({
					target: '.ment-5',
					left: 192,
					top: 342,
					width: 57,
					height: 97
				}),
				new Ment({
					target: '.ment-6',
					left: 288,
					top: 344,
					width: 74,
					height: 73
				}),
				new Ment({
					target: '.ment-7',
					left: 12,
					top: 339,
					width: 54,
					height: 74
				}),
				new Ment({
					target: '.ment-8',
					left: 92,
					top: 341,
					width: 83,
					height: 102
				})
			];

			// 폰트크기 선택부분 초기화
			var fontSizes = [
				10,
				11,
				12,
				13,
				14
			];

			var DEFAULT_FONT_SIZE = fontSizes[2];
			var $fontSize = $('#font-size');
			var i, selected;

			for(i = 0; i < fontSizes.length; i++){
				if(fontSizes[i] === DEFAULT_FONT_SIZE){						
					selected = ' selected';
				}else{
					selected = '';
				}
				
				$fontSize.append('<option value="' + fontSizes[i] + 'px"' + selected + '>' + fontSizes[i] + '</option>');
				
			}
			var changeFontSize = function(fontSize){
				$('textarea').css('font-size', fontSize);
			}

			// events
			$fontSize.on('change', function(){
				changeFontSize($(this).val());
			});

			$('#generate-image').on('click', function(){					
				var canvas = document.getElementById('result');
				var context = canvas.getContext('2d');
				var i, j, ment, currentMentY, texts;

				context.drawImage(backgroundImage, 0, 0);
				context.font = $('#font-size').val() + ' 굴림';
				
				for(i = 0; i < ments.length; i++){
					ment = ments[i];
					// 왠지 모르겠는데 x랑 y가 묘하게 어긋남...보정하자..
					texts = ment.getText().split('\n');
					currentMentY = ment.style.top + 13;
					for(j = 0; j < texts.length; j++){
						context.fillText(texts[j], ment.style.left + 2, currentMentY);
						currentMentY = currentMentY + 13;	
					}							
				}

				this.href = canvas.toDataURL('image/png');				
				this.download = '개노답_삼형제.png';
			});
		}, false);			
	}else{
		alert('지원하지 않는 브라우저 입니다!');
	}
	
})(window.jQuery);