import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '../layouts/RootLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [{ path: '', name: 'home', component: HomeView }],
    },
  ],
})

export default router
