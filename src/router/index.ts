import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '../layouts/RootLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../feature/auth/views/Login.vue'
import RegisterView from '../feature/auth/views/Register.vue'
import CartPage from '../feature/cart/pages/Cart.vue'
import SearchPage from '../feature/search/pages/Search.vue'
import ProductsPage from '../feature/home/pages/Products.vue'
import ProductDetailPage from '../feature/product/pages/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [{ path: '', name: 'home', component: HomeView }],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsPage,
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: ProductDetailPage,
    },
  ],
})

export default router
