<template>
  <div class="box">
    <h1>
      <span>S</span>
      <span>y</span>
      <span>n</span>
      <span>t</span>
      <span>h</span>
      <span>P</span>
      <span>o</span>
      <span>p</span>
      <span>G</span>
      <span>i</span>
      <span>r</span>
      <span>l</span>
      <span>s</span>
    </h1>
  </div>
</template>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: center;
  h1 {
    color: $pink;
    font-size: 4rem;
    @media(max-width:500px){
       font-size: 3rem;
    }
    @media(max-width:400px){
       font-size: 2rem;
    }

    span {
      margin: 0;
      padding: 0;
      animation: animate 3.2s linear infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }
      &:nth-child(2) {
        animation-delay: 0.25s;
      }
      &:nth-child(3) {
        animation-delay: 0.5s;
      }
      &:nth-child(4) {
        animation-delay: 0.75s;
      }
      &:nth-child(5) {
        animation-delay: 1s;
      }
      &:nth-child(6) {
        animation-delay: 1.25s;
      }
      &:nth-child(7) {
        animation-delay: 1.5s;
      }
      &:nth-child(8) {
        animation-delay: 1.75s;
      }
      &:nth-child(9) {
        animation-delay: 2s;
      }
      &:nth-child(10) {
        animation-delay: 2.25s;
      }
      &:nth-child(11) {
        animation-delay: 2.5s;
      }
      &:nth-child(12) {
        animation-delay: 2.75s;
      }
      &:nth-child(13) {
        animation-delay: 3s;
      }
    }
  }
}

@keyframes animate {
  0%,
  100% {
    color: $white;
    filter: blur(2px);
    text-shadow: 0 0 10px $pink, 0 0 20px $pink, 0 0 40px $pink, 0 0 80px $pink,
      0 0 120px $pink, 0 0 200px $pink, 0 0 300px $pink, 0 0 400px $pink;
  }
  5%,
  95% {
    color: $pink;
    filter: blur(0);
    text-shadow: none;
  }
}
</style>
