<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useCardStore } from '@/stores/cardStore'
import TransactionItem from '@/components/TransactionItem.vue'

const txnStore = useTransactionStore()
const cardStore = useCardStore()

const activeFilter = ref<'all' | 'payment' | 'refund'>('all')
const activeCardFilter = ref('all')

const filters = [
  { key: 'all' as const, label: '全部' },
  { key: 'payment' as const, label: '支出' },
  { key: 'refund' as const, label: '退款' },
]

const filteredTransactions = computed(() => {
  let result = txnStore.sortedTransactions
  if (activeFilter.value !== 'all') {
    result = result.filter((t) => t.type === activeFilter.value)
  }
  if (activeCardFilter.value !== 'all') {
    result = result.filter((t) => t.cardId === activeCardFilter.value)
  }
  return result
})

const groupedTransactions = computed(() => {
  const groups: Record<string, typeof filteredTransactions.value> = {}
  for (const txn of filteredTransactions.value) {
    const d = new Date(txn.date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
    let label: string
    if (diffDays === 0) label = '今天'
    else if (diffDays === 1) label = '昨天'
    else if (diffDays < 7) label = '本周'
    else if (diffDays < 30) label = '本月'
    else label = '更早'

    if (!groups[label]) groups[label] = []
    groups[label].push(txn)
  }
  return groups
})

const totalAmount = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => sum + t.amount, 0)
})
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)] pb-20">
    <!-- Header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-5">
      <h1 class="text-xl font-bold text-[var(--gp-dark)] mb-4">账单记录</h1>

      <!-- Summary -->
      <div class="bg-gradient-to-r from-[#4285f4] to-[#669df6] rounded-2xl p-4 text-white mb-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs opacity-80">总交易笔数</p>
            <p class="text-2xl font-bold">{{ filteredTransactions.length }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs opacity-80">净金额</p>
            <p class="text-2xl font-bold">
              {{ totalAmount >= 0 ? '+' : '' }}¥{{ Math.abs(totalAmount).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Type filter -->
      <div class="flex gap-2">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="activeFilter = f.key"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          :class="activeFilter === f.key
            ? 'bg-[var(--gp-blue)] text-white'
            : 'bg-[var(--gp-bg)] text-[var(--gp-gray)]'"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Card filter -->
      <div class="flex gap-2 mt-3 overflow-x-auto pb-1" style="scrollbar-width: none">
        <button
          @click="activeCardFilter = 'all'"
          class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
          :class="activeCardFilter === 'all'
            ? 'bg-[var(--gp-dark)] text-white'
            : 'bg-[var(--gp-surface)] text-[var(--gp-gray)] border border-[var(--gp-light-gray)]'"
        >
          全部卡片
        </button>
        <button
          v-for="card in cardStore.cards"
          :key="card.id"
          @click="activeCardFilter = card.id"
          class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
          :class="activeCardFilter === card.id
            ? 'bg-[var(--gp-dark)] text-white'
            : 'bg-[var(--gp-surface)] text-[var(--gp-gray)] border border-[var(--gp-light-gray)]'"
        >
          {{ card.bankName }}
        </button>
      </div>
    </div>

    <!-- Transaction list -->
    <div class="px-5 pt-3">
      <div v-if="filteredTransactions.length === 0" class="bg-[var(--gp-surface)] rounded-2xl p-10 text-center">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-[var(--gp-gray)] text-sm">暂无交易记录</p>
      </div>

      <template v-else>
        <div v-for="(txns, group) in groupedTransactions" :key="group" class="mb-4">
          <h3 class="text-xs font-medium text-[var(--gp-gray)] mb-2 px-1">{{ group }}</h3>
          <div class="bg-[var(--gp-surface)] rounded-2xl px-4">
            <div v-for="(txn, idx) in txns" :key="txn.id">
              <TransactionItem :transaction="txn" @delete="txnStore.deleteTransaction" />
              <div v-if="idx < txns.length - 1" class="border-b border-[var(--gp-bg)]" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
