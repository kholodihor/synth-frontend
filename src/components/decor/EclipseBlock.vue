<template>
  <div class="box">
    <div class="circle">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  background-color: $black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem auto;
  flex: 1 1 50%;

  .circle {
    position: relative;
    width: 60vh;
    height: 60vh;
    border-radius: 100%;
    background: linear-gradient($blue, $pink);
    animation: animate 0.5s linear infinite;
    @media (max-width: 1050px) {
      width: 50vh;
      height: 50vh;
    }
    @media (max-width: 560px) {
      width: 40vh;
      height: 40vh;
    }
    @media (max-width: 350px) {
      width: 30vh;
      height: 30vh;
    }

    &::after {
      content: '';
      position: absolute;
      top: 35px;
      left: 35px;
      right: 35px;
      bottom: 35px;
      border-radius: 100%;
      background-color: $black;
    }
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: linear-gradient($blue, $pink);

      &:nth-child(1) {
        filter: blur(5px);
      }
      &:nth-child(2) {
        filter: blur(10px);
      }
      &:nth-child(3) {
        filter: blur(20px);
      }
      &:nth-child(4) {
        filter: blur(55px);
      }
    }
  }
}

@keyframes animate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
