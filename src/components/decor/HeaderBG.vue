<template>
  <div class="box">
    <div class="main">
      <video src="/video.mp4" autoplay loop muted type="mp4"></video>
      <img src="/mask.webp" alt="" class="mask" />
      <h2>Synth World</h2>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.box {
  .main {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 1280px) {
      height: 40vh;
    }
    @media (max-width: 990px) {
      height: 50vh;
    }
    @media (max-width: 610px) {
      height: 70vh;
    }
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      user-select: none;
      filter: invert(1);
      mix-blend-mode: multiply;
    }
    h2 {
      position: relative;
      z-index: 3;
      font-size: 10vw;
      color: $white;
      text-shadow: $text-shadow-header;
    }
  }
}
</style>
