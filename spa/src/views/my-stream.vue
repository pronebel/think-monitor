<template>
<div class="stream-src col-lg-3 col-md-5" v-el="streamSrc" v-on="mousemove: setSize">
  <div class="handle" v-el="container" v-on="dblclick: playCtrl">
  </div>
</div>
</template>

<script>
var log = require('../lib/log');
var WSAvcPlayer = require('../lib/wsAvc');
var Draggabilly = require('draggabilly/dist/draggabilly.pkgd.min.js');

module.exports = {
  props: ['wsUrl'],
  data: function() {
    return {
      playing: false
    }
  },
  methods: {
    playCtrl: function() {
      if (this.playing) {
        this.wsavc.stopPlay();
        this.playing = false;
      } else {
        this.wsavc.startPlay();
        this.playing = true;
      }
    },
    setSize: function() {
      this.$$.streamSrc.style.height = this.$$.streamSrc.clientWidth * this.itemRatio + 'px';
    }
  },
  ready: function() {
    log.INFO_TRACE(this.wsUrl);
    var wsUrl = this.wsUrl;
    var canvas = document.createElement("canvas");
    this.$$.container.appendChild(canvas);
    var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
    //var wsavc = new WSAvcPlayer(canvas, "canvas", 1, 35);
    wsavc.connect(wsUrl); 
    this.wsavc = wsavc;

    var draggie = new Draggabilly(this.$$.streamSrc, {
      handle: '.handle'
    });

    this.itemRatio = this.$$.streamSrc.clientHeight / this.$$.streamSrc.clientWidth;
  },
  beforeDestroy: function() {
    this.wsavc.disconnect();
  }
}
</script>

<style>
canvas { 
  width: inherit;
  height: inherit;
}
.stream-src {
  min-width: 320px;
  width: 320px;
  height: 180px;
  position: absolute;
  background: #AAA;
  padding: 2px;
  margin: 10px;
  resize: horizontal;
  overflow: hidden;
}
.stream-src .handle {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
}
</style>