<template>
  <div class="container">
    <div class="row">
      <ul>
        <li>생성을 눌러도 이미지 저장이 안 뜨는 경우 아래 생성된 이미지를 우클릭 - 저장하십시오.</li>
        <li>줄바꿈은 엔터로 해야 생성되는 이미지에서도 제대로 됩니다.</li>
        <li>구글 크롬에 최적화 되어 있습니다.</li>
        <li>문의는 <a href="https://twitter.com/winterwolf0412" target="_blank">@winterwolf0412</a></li>
      </ul>
    </div>
    <div class="row">
      <span>
          <label for="font-size">글자크기</label>
          <select id="font-size" v-model="selectedFontSize" v-on:change="applyFontSize(selectedFontSize)">
            <option v-for="fontSize in fontSizes" v-bind:value="fontSize">
              {{fontSize}}
            </option>
          </select>
      </span>
      <span>
        <label for="font">글꼴</label>
        <select id="font" v-model="selectedFont" v-on:change="applyFont(selectedFont)">
          <option v-for="font in fonts" v-model="selectedFont" v-bind:value="font">
            {{font.name}}
          </option>
        </select>
      </span>
      <span class="buttons">
        <a id="generate-image" class="btn btn-primary" href="#" v-on:click="generate()">생성</a>
      </span>
    </div>
    <div class="row">
      <div class="edit-layer" v-bind:style="editLayerStyle">
        <canvas id="background"></canvas>
        <textarea v-for="cut in source.cuts"
                  v-bind:style="getStyle(cut)"
                  v-model="cut.text"
                  class="cut"
                  placeholder="대사를 입력하세요."></textarea>
      </div>
    </div>
    <div class="row">
      <canvas id="result"></canvas>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import sources from '../assets/sources';
  import fonts from '../assets/fonts';
  import fontSizes from '../assets/fontSizes';

  const routeChange = '$route.params.sourceId';

  export default {
    mounted() {
      this.drawImageToCanvas();
      this.loadWebFonts();
    },
    data() {
      const source = sources.find(s =>
        s.id === parseInt(this.$route.params.sourceId, 10)
      );

      return {
        backgroundImage: null,
        selectedFont: fonts[0],
        selectedFontSize: fontSizes[0],
        source,
        fonts,
        fontSizes,
        resultCanvas: null,
        editLayerStyle: {
          width: `${source.width}px`,
          height: `${source.height}px`
        },
        canvasStyle: {
          width: source.width,
          height: source.height
        }
      };
    },
    methods: {
      loadWebFonts() {
        const webFontFamilies = [];
        const webFontUrls = [];

        this.fonts.forEach((font) => {
          if (font.importUrl) {
            webFontFamilies.push(font.cssValue);
            webFontUrls.push(font.importUrl);
          }
        });

        if (window.WebFont) {
          window.WebFont.load({
            custom: {
              families: webFontFamilies,
              urls: webFontUrls
            }
          });
        } else {
          throw new Error('WebFont lib not loaded!');
        }
      },
      drawImageToCanvas() {
        this.backgroundImage = new Image();
        this.backgroundImage.src = this.source.imageUrl;

        this.backgroundImage.addEventListener('load', () => {
          const canvas = document.getElementById('background');
          canvas.width = this.source.width;
          canvas.height = this.source.height;

          const context = canvas.getContext('2d');
          context.drawImage(this.backgroundImage, 0, 0);
        });

        // clear result canvas
        this.clearResultCanvas();
      },
      clearResultCanvas() {
        const canvas = document.getElementById('result');
        canvas.width = this.source.width;
        canvas.height = this.source.height;

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.resultCanvas = null;
      },
      getStyle(cut) {
        return {
          left: `${cut.x}px`,
          top: `${cut.y}px`,
          width: `${cut.width}px`,
          height: `${cut.height}px`,
          'background-color': this.source.cutBackgroundColor || '#FFFFFF',
          color: this.source.fontColor || '#000000'
        };
      },
      applyCutStyle(cssName, value) {
        $('.cut').css(cssName, value);
      },
      applyFontSize(fontSize) {
        this.applyCutStyle('font-size', `${fontSize}px`);
      },
      applyFont(font) {
        this.applyCutStyle('font-family', font.cssValue);
      },
      generate() {
        const source = this.source;
        const canvas = document.getElementById('result');
        this.resultCanvas = canvas;
        canvas.width = source.width;
        canvas.height = source.height;

        const context = canvas.getContext('2d');

        let currentCutY;

        const LINE_HEIGHT_RATIO = 1.42857151;
        const lineHeight = this.selectedFontSize * LINE_HEIGHT_RATIO;

        context.drawImage(this.backgroundImage, 0, 0);
        context.font = `${this.selectedFontSize}px ${this.selectedFont.cssValue}`;

        if (source.fontColor) {
          context.fillStyle = source.fontColor;
        }

        const cuts = source.cuts;

        cuts.forEach((cut) => {
          if (cut.text !== undefined && typeof cut.text === 'string') {
            // 왠지 모르겠는데 x랑 y가 묘하게 어긋남...보정하자..
            const texts = cut.text.split('\n');
            currentCutY = cut.y + this.selectedFontSize;

            texts.forEach((text) => {
              context.fillText(text, cut.x + 2, currentCutY);
              currentCutY += lineHeight;
            });
          }
        });

        // watermark 찍기
        context.lineWidth = 1;
        context.font = '16px 나눔고딕';
        context.fillText('@winterwolf0412', source.width - 125, source.height - 12);

        const result = canvas.toDataURL('image/png');

        $('#generate-image')
          .attr('download', '짤생성_결과.png')
          .attr('href', result);
      }
    },
    watch: {
      [routeChange](newId) {
        const source = sources.find(s =>
          s.id === parseInt(newId, 10)
        );

        this.source = source;

        this.drawImageToCanvas();
      }
    }
  };
</script>
<style>
  .edit-layer {
    position: relative;
  }

  .cut {
    position: absolute;
    background-color: #ffffff;
    border: none;
    font-family: '굴림', serif;
    font-size: 12px;
  }
</style>
