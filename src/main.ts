import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query';
import { addIcons, OhVueIcon } from 'oh-vue-icons'
import { BiPlus, BiCartDash, IoSearchOutline, RiUser6Line, HiPlusSm } from 'oh-vue-icons/icons'
import './index.css'

addIcons(BiPlus, BiCartDash, IoSearchOutline, RiUser6Line, HiPlusSm)

import App from './App.vue'
import router from './router'

const app = createApp(App).use(VueQueryPlugin)

app.component('v-icon', OhVueIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
