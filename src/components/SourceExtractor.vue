<template>
  <div class="container">
    <div class="row">
      <label for="local-image-file">파일 선택</label>
      <input id="local-image-file" type="file" accept="image/*" v-on:change="loadLocalImage"/>
      <div class="edit-layer">
        <canvas id="loaded-image"></canvas>
        <div v-for="cut in source.cuts" class="cut-edit" v-bind:style="getStyle(cut)"
             v-on:click="removeCut(cut)"></div>
      </div>
    </div>
    <div class="row">
      <h3>추출된 데이터</h3>
      <pre>
{{source}}
                </pre>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery';

  export default {
    mounted() {
      this.canvas = document.getElementById('loaded-image');
      this.context = this.canvas.getContext('2d');
      this.dragStartPoint = null;
      this.isMouseDown = false;

      this.bindMouseEvent();
    },
    data() {
      return {
        cuts: [],
        source: {
          cuts: []
        }
      };
    },
    methods: {
      getStyle(cut) {
        return {
          left: `${cut.x}px`,
          top: `${cut.y}px`,
          width: `${cut.width}px`,
          height: `${cut.height}px`
        };
      },
      clearImage() {
        this.context.clearRect(0, 0, this.image.width, this.image.height);
        this.context.drawImage(this.image, 0, 0);
      },
      bindMouseEvent() {
        const image = this.image;

        const getMousePosition = (event) => {
          const rect = this.canvas.getBoundingClientRect();
          return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
        };

        $('#loaded-image')
          .on('mousedown', (event) => {
            this.isMouseDown = true;
            this.dragStartPoint = getMousePosition(event);
            console.log('mouse down!');
          })
          .on('mousemove', (event) => {
            if (this.isMouseDown && image && this.dragStartPoint !== null) {
              this.context.strokeStyle = 'rgba(0,0,0,0.5)';
              const currentPoint = getMousePosition(event);
              this.clearImage();
              this.context.strokeRect(
                this.dragStartPoint.x,
                this.dragStartPoint.y,
                currentPoint.x - this.dragStartPoint.x,
                currentPoint.y - this.dragStartPoint.y);
            }
          })
          .on('mouseup', (event) => {
            console.log('mouse up!');
            this.isMouseDown = false;
            const dragEndPoint = getMousePosition(event);
            this.clearImage();

            const width = dragEndPoint.x - this.dragStartPoint.x;
            const height = dragEndPoint.y - this.dragStartPoint.y;

            if (width > 30 && height > 20) {
              this.addCuts({
                x: this.dragStartPoint.x,
                y: this.dragStartPoint.y,
                width,
                height
              });
            }

            this.dragStartPoint = null;
          });
      },
      addCuts(params) {
        this.source.cuts.push({
          x: params.x,
          y: params.y,
          width: params.width,
          height: params.height
        });
      },
      removeCut(cut) {
        const index = this.source.cuts.indexOf(cut);
        this.source.cuts.splice(index, 1);
      },
      loadLocalImage(event) {
        const URL = window.URL;
        const url = URL.createObjectURL(event.target.files[0]);

        const image = new Image();

        image.src = url;

        image.addEventListener('load', () => {
          $('#loaded-image')
            .attr('width', image.width)
            .attr('height', image.height);

          this.context.drawImage(image, 0, 0);

          this.source.width = image.width;
          this.source.height = image.height;
        });

        this.image = image;
      }
    }
  };
</script>
<style>
  .cut-edit{
    border: 1px solid black;
    position: absolute;
    cursor:pointer;
  }
  .cut-edit:hover{
    background-color: rgba(0,0,0,0.3);
  }
</style>
