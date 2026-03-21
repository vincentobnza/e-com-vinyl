import { ref, onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 768

export function useMobile(breakpoint = MOBILE_BREAKPOINT) {
  const isMobile = ref(false)

  function update() {
    isMobile.value = window.innerWidth < breakpoint
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}
