<template>
  <div class="curtain" :class="{ active: showMenu }">
    <HeaderBG class="headerBG" />
    <span></span>
    <span></span>
    <span></span>
    <ul>
      <div class="fireflies">
        <Fireflies />
      </div>
      <nav>
        <li>
          <RouterLink to="/login">Login</RouterLink>
        </li>
        <li>
          <RouterLink to="/register">Register</RouterLink>
        </li>
        <li v-if="userStore._id">
          <RouterLink :to="'/account/profile/' + userStore._id">Profile</RouterLink>
        </li>
        <li>
          <RouterLink to="/bands">Synthpop Bands</RouterLink>
        </li>
      </nav>
    </ul>
    <div class="toggle" @click="showMenu = !showMenu">
      <i v-if="!showMenu" class="fas fa-bars"></i>
      <i v-if="showMenu" class="fas fa-times"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import HeaderBG from '@/components/decor/HeaderBG.vue';
import Fireflies from '@/components/decor/Fireflies.vue';

const userStore = useUserStore()
const showMenu = ref(false);
</script>

<style scoped lang="scss">
.curtain {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    display: block;
    transform-origin: bottom left;
    transition: 0.5s;
    transform: rotate(-90deg);
    z-index: 2;

    &:nth-of-type(1) {
      background: $pink;
      transform: rotate(-90deg);
      transition-delay: 0.2s;
    }

    &:nth-of-type(2) {
      background: $blue;
      transform: rotate(-90deg);
      transition-delay: 0.1s;
    }

    &:nth-of-type(3) {
      background: $black;
      transform: rotate(-90deg);
      transition-delay: 0s;
    }
  }

  &.active span:nth-of-type(1) {
    z-index: 3;
    transition-delay: 0s;
  }

  &.active span:nth-of-type(2) {
    z-index: 4;
    transition-delay: 0.1s;
  }

  &.active span:nth-of-type(3) {
    z-index: 5;
    transition-delay: 0.2s;
  }

  &.active span {
    transform: rotate(0deg);
  }

  .headerBG {
    z-index: 1;
    position: relative;
  }

  .toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    background: transparent;
    z-index: 10000;
    cursor: pointer;
    transition: 0.5s;

    i {
      font-size: 2.5rem;
      color: $purple;
      transition: all 0.3s ease;

      &:hover {
        color: #fff;
        text-shadow: $text-shadow-header;
      }
    }
  }

  ul {
    position: absolute;
    z-index: 100;
    transition: 0.5s;
    visibility: hidden;
    opacity: 0;
    transition-delay: 0s;
    z-index: 8;

    li {
      list-style: none;
      margin: 10px 0;
      z-index: 8;

      a {
        text-decoration: none;
        color: $white;
        font-size: 2rem;
        text-transform: uppercase;
        text-align: center;
        display: block;
        font-family: consolas;

        &:hover {
          color: $blue;
          text-shadow: 0 0 15px $blue;
        }
      }
    }

    .fireflies {
      z-index: 6;
    }
  }

  &.active ul {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.5s;
  }
}
</style>