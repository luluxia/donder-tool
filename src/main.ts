import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Search from './pages/Search.vue'
import Score from './pages/Score.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const routes = [
  { path: '/', redirect: '/search' },
  { path: '/search', component: Search },
  { path: '/score', component: Score },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
