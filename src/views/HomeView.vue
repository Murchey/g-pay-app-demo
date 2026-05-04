<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { useUserStore } from '@/stores/userStore'
import CardItem from '@/components/CardItem.vue'
import TransactionItem from '@/components/TransactionItem.vue'

const router = useRouter()
const cardStore = useCardStore()
const txnStore = useTransactionStore()
const userStore = useUserStore()

const cardSwiperRef = ref<HTMLElement | null>(null)
const activeCardIndex = ref(0)

const quickActions = [
  { icon: '💳', label: '绑卡', path: '/add-card' },
  { icon: '💸', label: '付款', path: '/pay' },
  { icon: '📋', label: '账单', path: '/transactions' },
  { icon: '🔒', label: '安全', path: '' },
]

const totalSpent = computed(() => txnStore.getTotalSpent())
const totalRefunded = computed(() => txnStore.getTotalRefunded())

function formatCurrency(val: number): string {
  return `¥${val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function handleCardClick(id: string) {
  router.push(`/card/${id}`)
}

function handleQuickAction(path: string) {
  if (path) router.push(path)
}

function handleScroll() {
  if (!cardSwiperRef.value) return
  const scrollLeft = cardSwiperRef.value.scrollLeft
  const cardWidth = 300
  activeCardIndex.value = Math.round(scrollLeft / cardWidth)
}
</script>

<template>
  <div class="pb-20">
    <!-- Header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-[var(--gp-dark)]">Pay Demo</h1>
          <p class="text-sm text-[var(--gp-gray)] mt-1">欢迎回来，{{ userStore.user.name }}</p>
        </div>
        <button
          @click="router.push('/profile')"
          class="w-10 h-10 rounded-full bg-[var(--gp-blue)] flex items-center justify-center text-white font-medium active:opacity-80 transition-opacity"
        >
          {{ userStore.getInitial() }}
        </button>
      </div>

      <!-- Balance card -->
      <div class="bg-gradient-to-r from-[#4285f4] to-[#669df6] rounded-2xl p-5 text-white">
        <div class="text-sm opacity-80 mb-1">本月消费</div>
        <div class="text-3xl font-bold mb-4">{{ formatCurrency(totalSpent) }}</div>
        <div class="flex gap-4 text-sm">
          <div>
            <span class="opacity-70">退款 </span>
            <span class="font-medium">+{{ formatCurrency(totalRefunded) }}</span>
          </div>
          <div>
            <span class="opacity-70">卡片 </span>
            <span class="font-medium">{{ cardStore.totalCards }} 张</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="px-5 py-5">
      <div class="flex justify-around">
        <button
          v-for="action in quickActions"
          :key="action.label"
          @click="handleQuickAction(action.path)"
          class="flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div class="w-14 h-14 rounded-2xl bg-[var(--gp-surface)] shadow-sm flex items-center justify-center text-2xl">
            {{ action.icon }}
          </div>
          <span class="text-xs text-[var(--gp-gray)] font-medium">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Cards section -->
    <div class="px-5 mb-5">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-base font-semibold text-[var(--gp-dark)]">我的卡包</h2>
        <button
          @click="router.push('/add-card')"
          class="text-sm text-[var(--gp-blue)] font-medium active:opacity-60"
        >
          + 添加
        </button>
      </div>

      <div v-if="cardStore.cards.length === 0" class="bg-[var(--gp-surface)] rounded-2xl p-8 text-center">
        <div class="text-4xl mb-3">💳</div>
        <p class="text-[var(--gp-gray)] text-sm mb-4">还没有绑定任何卡片</p>
        <button
          @click="router.push('/add-card')"
          class="bg-[var(--gp-blue)] text-white px-6 py-2.5 rounded-full text-sm font-medium active:opacity-80"
        >
          立即绑卡
        </button>
      </div>

      <div v-else>
        <div
          ref="cardSwiperRef"
          @scroll="handleScroll"
          class="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
          style="-ms-overflow-style: none; scrollbar-width: none"
        >
          <div
            v-for="card in cardStore.cards"
            :key="card.id"
            class="snap-start flex-shrink-0 w-[72vw] max-w-[300px]"
          >
            <CardItem :card="card" @click="handleCardClick(card.id)" />
          </div>
        </div>
        <div class="flex justify-center gap-1.5 mt-2">
          <div
            v-for="(card, i) in cardStore.cards"
            :key="card.id"
            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
            :class="i === activeCardIndex ? 'bg-[var(--gp-blue)] w-4' : 'bg-[var(--gp-light-gray)]'"
          />
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="px-5">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-base font-semibold text-[var(--gp-dark)]">最近交易</h2>
        <button
          @click="router.push('/transactions')"
          class="text-sm text-[var(--gp-blue)] font-medium active:opacity-60"
        >
          查看全部
        </button>
      </div>

      <div class="bg-[var(--gp-surface)] rounded-2xl px-4">
        <div v-if="txnStore.recentTransactions.length === 0" class="py-8 text-center text-[var(--gp-gray)] text-sm">
          暂无交易记录
        </div>
        <template v-else>
          <div v-for="(txn, idx) in txnStore.recentTransactions" :key="txn.id">
            <TransactionItem :transaction="txn" @delete="txnStore.deleteTransaction" />
            <div v-if="idx < txnStore.recentTransactions.length - 1" class="border-b border-[var(--gp-bg)]" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
