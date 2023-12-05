<script setup lang="ts">

</script>

<template>
  <var-paper class="bkg-outer">
    <var-paper round class="bkg-inner-1"/>
    <var-paper :radius="30" class="bkg-inner-2"/>
    <var-paper round class="bkg-inner-3"/>
  </var-paper>
</template>

<style scoped>

.bkg-outer {
  background: linear-gradient(to right bottom, cyan, purple);
  opacity: 0.7;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: -1;
}

.bkg-inner-1 {
  filter: blur(5px);
  background: #1E90FF;
  opacity: 0.4;
  width: 30vmax;
  height: 30vmax;
  position: absolute;
  top: 12vh;
  left: 5vw;
}

.bkg-inner-2 {
  filter: blur(15px);
  background: linear-gradient(to right bottom, purple, #3eb489);
  opacity: 0.55;
  transform: rotate(30deg);
  position: absolute;
  width: 35vmax;
  height: 35vmax;
  top: 45vh;
  left: 45vw;
}

.bkg-inner-3 {
  filter: blur(10px);
  background: #FF1493;
  opacity: 0.6;
  position: absolute;
  width: 25vmax;
  height: 25vmax;
  top: 12vh;
  left: 80vw;
}

</style>