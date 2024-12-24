<template>
  <footer class="footer" role="contentinfo">
    <div class="divider" aria-hidden="true"></div>
    
    <nav class="social-links" aria-label="Social media links">
      <ul>
        <li>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
          >
            <div class="icon-wrapper">
              <span class="fab fa-facebook" aria-hidden="true"></span>
              <span class="sr-only">Facebook</span>
            </div>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our Twitter page"
          >
            <div class="icon-wrapper">
              <span class="fab fa-twitter" aria-hidden="true"></span>
              <span class="sr-only">Twitter</span>
            </div>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our Instagram page"
          >
            <div class="icon-wrapper">
              <span class="fab fa-instagram" aria-hidden="true"></span>
              <span class="sr-only">Instagram</span>
            </div>
          </a>
        </li>
        <li>
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our LinkedIn page"
          >
            <div class="icon-wrapper">
              <span class="fab fa-linkedin" aria-hidden="true"></span>
              <span class="sr-only">LinkedIn</span>
            </div>
          </a>
        </li>
      </ul>
    </nav>

    <div class="copyright">
      <p>Copyright {{ currentYear }} byCold</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear().toString())
</script>

<style scoped lang="scss">
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.footer {
  background-color: $black;
  padding: clamp(1.5rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.divider {
  width: min(80%, 1200px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($blue, 0.5),
    transparent
  );
}

.social-links {
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(0.5rem, 2vw, 1rem);
    padding: 0;
    margin: 0;
    list-style: none;

    @media (max-width: 480px) {
      flex-wrap: wrap;
    }

    li {
      perspective: 1000px;
    }

    a {
      display: block;
      text-decoration: none;
      color: rgba($white, 0.3);
      transition: color 0.3s ease;

      &:hover,
      &:focus-visible {
        color: $white;
        outline: none;

        .icon-wrapper {
          transform: translateZ(20px);
        }
      }
    }
  }
}

.icon-wrapper {
  width: clamp(40px, 8vw, 60px);
  height: clamp(40px, 8vw, 60px);
  display: grid;
  place-items: center;
  background-color: $black;
  border-radius: 8px;
  font-size: clamp(20px, 4vw, 30px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(45deg, transparent 50%, rgba($white, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  a:nth-child(1) &:hover { background-color: $purple; }
  a:nth-child(2) &:hover { background-color: $green; }
  a:nth-child(3) &:hover { background-color: $blue; }
  a:nth-child(4) &:hover { background-color: $pink; }
}

.copyright {
  text-align: center;
  color: rgba($white, 0.3);
  font-size: clamp(0.875rem, 2vw, 1rem);
  
  p {
    margin: 0;
  }
}
</style>
