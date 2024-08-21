<template>
  <div class="box">
    <div class="divider"></div>
    <ul>
      <li>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span class="fab fa-facebook"></span>
        </a>
      </li>
      <li>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span class="fab fa-twitter"></span>
        </a>
      </li>
      <li>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span class="fab fa-instagram"></span>
        </a>
      </li>
      <li>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span class="fab fa-linkedin"></span>
        </a>
      </li>
    </ul>
    <div class="copy">
      <p>Copyright &copy; {{ currentYear }} byCold</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentYear: string = new Date().getFullYear().toString()
</script>

<style scoped lang="scss">
.divider {
  width: 80%;
}

.box {
  background-color: $black;
  padding: 2rem;

  ul {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    margin-bottom: 3rem;

    li {
      list-style: none;
      position: relative;
      width: 60px;
      height: 60px;
      margin: 0 10px;

      span {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex !important;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 0.3);
        background: $black;
        font-size: 30px !important;
        transition: 0.3s;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 10px;
        background: $black;
        transform-origin: top;
        transform: skewX(-41deg);
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -9px;
        width: 9px;
        height: 100%;
        background: #2a2a2a;
        transform-origin: right;
        transform: skewY(-49deg);
      }

      &:hover span {
        z-index: 1000;
        transition: 0.5s;
        color: $white;
        box-shadow: -1px 1px 1px rgba(255, 255, 255, 0.5);
      }

      &:hover span:nth-child(5) {
        transform: translate(40px, -40px);
        opacity: 1;
      }

      &:hover span:nth-child(4) {
        transform: translate(30px, -30px);
        opacity: 0.8;
      }

      &:hover span:nth-child(3) {
        transform: translate(20px, -20px);
        opacity: 0.6;
      }

      &:hover span:nth-child(2) {
        transform: translate(10px, -10px);
        opacity: 0.4;
      }

      &:hover span:nth-child(1) {
        transform: translate(0px, 0px);
        opacity: 0.2;
      }

      &:nth-child(1):hover span {
        background: $purple;
      }

      &:nth-child(2):hover span {
        background: $green;
      }

      &:nth-child(3):hover span {
        background: $blue;
      }

      &:nth-child(4):hover span {
        background: $pink;
      }
    }
  }

  .copy {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      color: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
