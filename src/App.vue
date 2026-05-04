<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, watchEffect } from 'vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const tabs = [
  { name: '钱包', path: '/', icon: 'wallet' },
  { name: '付款', path: '/pay', icon: 'pay' },
  { name: '账单', path: '/transactions', icon: 'bill' },
  { name: '我的', path: '/profile', icon: 'user' },
]

const activeTab = computed(() => {
  const match = tabs.find((t) => t.path === route.path)
  return match ? match.path : '/'
})

const showNav = computed(() => route.name !== 'add-card' && route.name !== 'card-detail')

function navigate(path: string) {
  router.push(path)
}

watchEffect(() => {
  document.documentElement.classList.toggle('dark', userStore.darkMode)
})
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)] flex flex-col max-w-[430px] mx-auto relative">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <nav
      v-if="showNav"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[var(--gp-surface)]/95 backdrop-blur-lg border-t border-[var(--gp-light-gray)] flex justify-around items-center h-16 z-50"
    >
      <button
        v-for="tab in tabs"
        :key="tab.path"
        @click="navigate(tab.path)"
        class="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-all duration-200"
        :class="activeTab === tab.path ? 'text-[var(--gp-blue)]' : 'text-[var(--gp-gray)]'"
      >
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full transition-all duration-300"
          :class="activeTab === tab.path ? 'bg-[var(--gp-blue)]' : 'bg-transparent'"
        />
        <svg v-if="tab.icon === 'wallet'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <svg v-else-if="tab.icon === 'pay'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <svg v-else-if="tab.icon === 'bill'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <svg v-else-if="tab.icon === 'user'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-xs font-medium">{{ tab.name }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
