import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '../layouts/RootLayout.vue'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import SearchView from '../views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'products', name: 'products', component: ProductsView },
        {
          path: 'product/:slug',
          name: 'product',
          component: ProductDetailView,
        },
        { path: 'cart', name: 'cart', component: CartView },
        { path: 'search', name: 'search', component: SearchView },
      ],
    },
  ],
})

export default router
