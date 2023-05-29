<template>
    <div class="box">
      <div class="glow" v-for="n in 5" :key="n">
        <span style="--i: 1"></span>
        <span style="--i: 2"></span>
        <span style="--i: 3"></span>
      </div>
    </div>
  </template>
  
  <style scoped lang="scss">
  .glow {
    min-width: 53rem;
    height: 100%;
    transform-origin: right;
    animation: glow_movement 5s linear infinite;
    &:nth-child(even) {
      transform-origin: left;
    }
    span {
      position: absolute;
      top: calc(80px * var(--i));
      left: calc(80px * var(--i));
      right: calc(80px * var(--i));
      bottom: calc(80px * var(--i));
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -8px;
        width: 12px;
        height: 12px;
        background: #ac0;
        border-radius: 50%;
      }
      i {
        color: #ac0;
      }
      &:nth-child(3n + 1)::before {
        background: $blue;
        box-shadow: 0 0 15px $blue, 0 0 25px $blue, 0 0 35px $blue, 0 0 45px $blue,
          0 0 55px $blue, 0 0 0 4px $blue;
      }
      &:nth-child(3n + 2)::before {
        background: $pink;
        box-shadow: 0 0 10px $pink, 0 0 20px $pink, 0 0 30px $pink, 0 0 40px $pink,
          0 0 0 4px $pink;
      }
      &:nth-child(3n + 3)::before {
        background: $purple;
        box-shadow: 0 0 10px $purple, 0 0 20px $purple, 0 0 30px $purple,
          0 0 40px $purple, 0 0 0 4px $purple;
      }
      &:nth-child(3n + 1) {
        animation: animate 10s alternate infinite;
      }
      &:nth-child(3n + 2) {
        animation: animate_reverse 3s alternate infinite;
      }
      &:nth-child(3n + 3) {
        animation: animate 8s alternate infinite;
      }
    }
  }
  @keyframes glow_movement {
    0% {
      transform: rotate(0deg);
      filter: hue-rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      filter: hue-rotate(360deg);
    }
  }
  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes animate_reverse {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  </style>