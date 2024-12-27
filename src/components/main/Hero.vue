<template>
  <div class="curtain" :class="{ active: showMenu }" :aria-expanded="showMenu" role="navigation">
    <HeaderBG class="headerBG" />
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>

    <nav class="nav-menu" :class="{ visible: showMenu }">
      <div class="fireflies" aria-hidden="true">
        <Fireflies />
      </div>
      <ul>
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
      </ul>
    </nav>

    <button class="toggle" @click="showMenu = !showMenu" :aria-label="showMenu ? 'Close menu' : 'Open menu'">
      <i :class="showMenu ? 'fas fa-times' : 'fas fa-bars'" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import HeaderBG from '@/components/decor/HeaderBG.vue'
import Fireflies from '@/components/decor/Fireflies.vue'

const userStore = useUserStore()
const showMenu = ref(false)

// Close menu on escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showMenu.value) {
    showMenu.value = false
  }
}

window.addEventListener('keydown', handleEscape)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
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
    will-change: transform;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(-90deg);
    z-index: 2;

    &:nth-of-type(1) {
      background: $pink;
      transition-delay: 0.2s;
    }

    &:nth-of-type(2) {
      background: $blue;
      transition-delay: 0.1s;
    }

    &:nth-of-type(3) {
      background: $black;
      transition-delay: 0s;
    }
  }

  &.active {
    span {
      transform: rotate(0deg);

      &:nth-of-type(1) {
        z-index: 3;
        transition-delay: 0s;
      }

      &:nth-of-type(2) {
        z-index: 4;
        transition-delay: 0.1s;
      }

      &:nth-of-type(3) {
        z-index: 5;
        transition-delay: 0.2s;
      }
    }
  }

  .headerBG {
    z-index: 1;
    position: relative;
  }
}

.toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  background: transparent;
  border: none;
  padding: 0;
  z-index: 10000;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 2px;
  }

  i {
    font-size: 2.5rem;
    color: $purple;
    transition: color 0.3s ease;

    &:hover {
      color: $white;
      text-shadow: $text-shadow-header;
    }
  }
}

.nav-menu {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 0.5s, opacity 0.5s;
  z-index: 8;

  &.visible {
    visibility: visible;
    opacity: 1;
    transition-delay: 0.5s;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;

    li {
      margin: 1.5rem 0;
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;

      @for $i from 1 through 4 {
        &:nth-child(#{$i}) {
          transition-delay: #{$i * 0.1}s;
        }
      }

      a {
        display: inline-block;
        text-decoration: none;
        color: $white;
        font-size: clamp(1.5rem, 4vw, 2rem);
        text-transform: uppercase;
        font-family: consolas;
        padding: 0.5rem 1rem;
        transition: color 0.3s ease, text-shadow 0.3s ease;

        &:hover,
        &:focus-visible {
          color: $blue;
          text-shadow: 0 0 15px $blue;
        }
      }
    }
  }

  &.visible li {
    transform: translateY(0);
    opacity: 1;
  }

  .fireflies {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
}
</style>