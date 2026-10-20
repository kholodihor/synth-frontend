import type { Directive } from 'vue'

// Fades a block in from soft focus once it scrolls into view.
// Styles live in assets/main.scss (.reveal / .reveal.is-visible).
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer: IntersectionObserver | null = null

const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  )
  return observer
}

export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (reducedMotion() || !('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}
