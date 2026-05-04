import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/add-card',
      name: 'add-card',
      component: () => import('@/views/AddCardView.vue'),
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('@/views/PayView.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
    },
    {
      path: '/card/:id',
      name: 'card-detail',
      component: () => import('@/views/CardDetailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

export default router
