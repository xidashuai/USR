import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import localCache from '@/utils/cache'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/Main.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView/HomeView.vue')
  },
  {
    path: '/white',
    name: 'white',
    component: () => import('@/views/TheCanvas/TheCanvas.vue')
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(to => {
})

export default router
