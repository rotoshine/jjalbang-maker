<template>
  <div class="image-generator">
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
      <span>
        <label for="font-align">글꼴 정렬</label>
        <select id="font-align" v-model="selectedTextAlign" v-on:change="applyTextAlign(selectedTextAlign)">
          <option value="left">좌</option>
          <option value="right">우</option>
          <option value="center">중앙</option>
        </select>
      </span>
      <span>
        <label for="font-weight">굵게</label>
        <input type="checkbox" id="font-weight" v-model="selectedFontWeight" v-on:change="applyFontWeight(selectedFontWeight)">
      </span>
    </div>
    <div class="canvas-container">
      <div class="row">
        <a class="generate-image btn btn-primary btn-lg" v-on:click="generate($event)">생성</a>
      </div>
      <div class="row" v-if="$parent.isLogin">
        <div class="well upload-info">
          이미지 생성 후 이곳에 공유 url이 만들어집니다.
          <div v-if="!isNowUploading && isUploadComplete">
            <div>
              이미지 공유 url: <a v-bind:href="resultUrl" target="_blank">{{resultUrl}}</a>
            </div>
            <div>
              <a class="btn btn-primary"
                  target="_blank"
                  v-bind:href="twitterShareText"
                  data-size="large"><i class="fa fa-twitter" /> 트위터에 공유하기</a>
            </div>
          </div>
          <div v-else-if="isNowUploading && !isUploadComplete">
            <i class="fa fa-spinner fa-pulse"></i> 이미지 공유 url을 생성 중입니다..
          </div>
        </div>
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
      <div class="row" style="display:none;">
        <canvas id="result"></canvas>
      </div>
      <div class="row" v-if="Object.keys(currentCreatedImages).length > 0">
        <h3>최근 생성된 이미지</h3>
        <ul>
          <li v-for="(image, key) in currentCreatedImages">
            <a href="#" v-on:click="applyImage(image)">{{key}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';
  import _ from 'lodash';
  import sources from '../assets/sources';
  import fonts, { findByCssValue } from '../assets/fonts';
  import fontSizes from '../assets/fontSizes';

  const routeChange = '$route.params.sourceId';

  export default {
    mounted() {
      this.loadWebFonts();
      this.initialize();
    },
    data() {
      const source = sources.find(s =>
        s.id === parseInt(this.$route.params.sourceId, 10)
      );

      return {
        backgroundImage: null,
        selectedFont: source.defaultFontCssValue ?
          findByCssValue(source.defaultFontCssValue) : fonts[0],
        selectedFontSize: source.defaultFontSize ? source.defaultFontSize : fontSizes[0],
        selectedTextAlign: source.defaultTextAlign ? source.defaultTextAlign : 'left',
        selectedFontWeight: source.defaultFontWeight === 'bold',
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
        },
        isUploadComplete: false,
        isNowUploading: false,
        resultUrl: '',
        twitterShareText: null,
        currentCreatedImages: {}
      };
    },
    methods: {
      initialize() {
        this.isUploadComplete = false;
        this.isNowUploading = false;
        this.drawSourceImageToCanvas();
        this.applyDefaultStyles();
        this.initCutsStyles();
        this.loadFromFirebase();
      },
      loadWebFonts() {
        const webFontFamilies = [];
        const webFontUrls = [];

        this.fonts.forEach((font) => {
          if ( font.importUrl ) {
            webFontFamilies.push(font.cssValue);
            webFontUrls.push(font.importUrl);
          }
        });

        if ( window.WebFont ) {
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
      drawSourceImageToCanvas() {
        this.backgroundImage = new Image();
        this.backgroundImage.src = this.source.imageUrl;

        this.backgroundImage.addEventListener('load', () => {
          const canvas = document.getElementById('background');
          canvas.width = this.source.width;
          canvas.height = this.source.height;

          const context = canvas.getContext('2d');
          context.drawImage(this.backgroundImage, 0, 0);

          $('.canvas-container').width(this.source.width);
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
      applyTextAlign(textAlign) {
        this.applyCutStyle('text-align', textAlign);
      },
      applyFontWeight(fontWeight) {
        this.applyCutStyle('font-weight', fontWeight ? 'bold' : 'normal');
      },
      initCutsStyles() {
        this.applyFont(this.selectedFont);
        this.applyFontSize(this.selectedFontSize);
        this.applyTextAlign(this.selectedTextAlign);
        this.applyFontWeight(this.selectedFontWeight);
      },
      applyDefaultStyles() {
        this.selectedFontSize = this.source.defaultFontSize ?
          this.source.defaultFontSize : fontSizes[0];
        this.selectedTextAlign = this.source.defaultTextAlign ?
          this.source.defaultTextAlign : 'left';
      },
      generate($event) {
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

        if ( source.fontColor ) {
          context.fillStyle = source.fontColor;
        }

        const cuts = source.cuts;

        context.textAlign = this.selectedTextAlign;

        cuts.forEach((cut) => {
          if ( cut.text !== undefined && typeof cut.text === 'string' ) {
            // 왠지 모르겠는데 x랑 y가 묘하게 어긋남...보정하자..
            const texts = cut.text.split('\n');
            currentCutY = cut.y + this.selectedFontSize;

            let cutX = cut.x;
            if ( this.selectedTextAlign === 'center' ) {
              const centerPosition = cut.width / 2;
              cutX += centerPosition;
            }
            texts.forEach((text) => {
              context.fillText(text, cutX + 2, currentCutY);
              currentCutY += lineHeight;
            });
          }
        });

        // watermark 찍기
        context.lineWidth = 1;
        context.font = '16px 나눔고딕';
        context.fillText('@winterwolf0412', source.width - 125, source.height - 12);

        const result = canvas.toDataURL('image/png');

        $($event.target)
          .attr('download', `${this.source.name}-${new Date().getTime()}.png`)
          .attr('href', result);
        if ( this.$parent.isLogin ) {
          this.save();
        }
      },
      applyImage(image) {
        this.selectedFontSize = image.fontSize;
        this.selectedFont = findByCssValue(image.fontCssValue || image.fontStyle);
        this.selectedTextAlign = image.textAlign;
        this.source.cuts = image.cuts;
      },
      loadFromFirebase() {
        const { firebase } = window;
        firebase.database().ref(`jjal/${this.source.id}`)
          .orderByChild('createdAt')
          .limitToLast(10)
          .on('value', (snapshot) => {
            this.currentCreatedImages = snapshot.val();
          });
      },
      save() {
        this.resultUrl = '';
        this.twitterShareText = '';

        // 모든 cut 데이터가 유효한 경우에만 저장
        const { firebase } = window;
        const { source } = this;
        const { cuts } = source;

        if ( cuts.every(cut => !_.isEmpty(cut.text)) ) {
          const dbRef = firebase.database().ref(`jjal/${source.id}`);
          dbRef.push({
            id: source.id,
            cuts: source.cuts,
            fontSize: this.selectedFontSize,
            fontCssValue: this.selectedFont.cssValue,
            textAlign: this.selectedTextAlign,
            createdAt: new Date().getTime()
          }).then((snapshot) => {
            this.isNowUploading = true;
            console.log('db update complete. file upload start...');
            const fileName = snapshot.key;
            const storageRef = firebase.storage().ref();
            document.getElementById('result').toBlob((blob) => {
              storageRef.child(`result/${source.id}/${fileName}`).put(blob, {
                sourceId: source.id
              }).then(() => {
                console.log('file upload complete!');
                this.isUploadComplete = true;
                this.isNowUploading = false;
                this.resultUrl = `${location.href}/result/${fileName}`;

                const twitterIntentUrl = 'https://twitter.com/intent/tweet';
                const twitteIntentParams = [
                  `text=${this.$parent.displayName}님이 만든 짤방입니다. ${this.resultUrl}`,
                  'via=winterwolf0412'
                ];

                this.twitterShareText = `${twitterIntentUrl}?${twitteIntentParams.join('&')}`;
              });
            });
          });
        }
      }
    },
    watch: {
      [routeChange](newId) {
        const source = sources.find(s =>
          s.id === parseInt(newId, 10)
        );

        this.source = source;
        this.initialize();
      }
    }
  };
</script>
<style>
  .image-generator {
    padding-top: 20px;
  }

  .edit-layer {
    position: relative;
  }

  .cut {
    position: absolute;
    background-color: #ffffff;
    border: none;
    font-family: '굴림', serif;
    font-size: 12px;
    overflow-y: hidden;
    resize: none;
  }

  .generate-image {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
