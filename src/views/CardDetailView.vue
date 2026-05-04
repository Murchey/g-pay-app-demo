<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { CARD_COLORS, CARD_TYPE_LABELS } from '@/stores/types'
import CardItem from '@/components/CardItem.vue'
import TransactionItem from '@/components/TransactionItem.vue'

const route = useRoute()
const router = useRouter()
const cardStore = useCardStore()
const txnStore = useTransactionStore()

const cardId = computed(() => route.params.id as string)
const card = computed(() => cardStore.getCardById(cardId.value))
const transactions = computed(() => txnStore.getTransactionsByCard(cardId.value))
const totalSpent = computed(() =>
  transactions.value
    .filter((t) => t.type === 'payment' && t.status === 'success')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
)

function setDefault() {
  cardStore.setDefault(cardId.value)
}

function removeCard() {
  cardStore.removeCard(cardId.value)
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)]">
    <!-- Header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-4 flex items-center gap-3">
      <button @click="router.back()" class="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--gp-bg)] transition-colors">
        <svg class="w-6 h-6 text-[var(--gp-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-[var(--gp-dark)]">卡片详情</h1>
    </div>

    <div v-if="!card" class="px-5 pt-10 text-center">
      <p class="text-[var(--gp-gray)]">卡片不存在</p>
      <button @click="router.push('/')" class="mt-4 text-[var(--gp-blue)] font-medium">返回首页</button>
    </div>

    <template v-else>
      <!-- Card -->
      <div class="px-5 pt-4 mb-5">
        <CardItem :card="card" />
      </div>

      <!-- Actions -->
      <div class="px-5 mb-5 flex gap-3">
        <button
          @click="setDefault"
          :disabled="card.isDefault"
          class="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
          :class="card.isDefault
            ? 'bg-[var(--gp-bg)] text-[var(--gp-gray)] cursor-default'
            : 'bg-[var(--gp-blue)] text-white active:opacity-80'"
        >
          {{ card.isDefault ? '已设为默认' : '设为默认卡' }}
        </button>
        <button
          @click="router.push('/pay')"
          class="flex-1 py-3 rounded-xl text-sm font-medium bg-[var(--gp-green)] text-white active:opacity-80"
        >
          用此卡付款
        </button>
      </div>

      <!-- Card info -->
      <div class="px-5 mb-5">
        <div class="bg-[var(--gp-surface)] rounded-2xl p-4">
          <h3 class="text-sm font-semibold text-[var(--gp-dark)] mb-3">卡片信息</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">卡号</span>
              <span class="text-sm text-[var(--gp-dark)] font-mono">{{ card.cardNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">持卡人</span>
              <span class="text-sm text-[var(--gp-dark)]">{{ card.cardHolder }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">有效期</span>
              <span class="text-sm text-[var(--gp-dark)]">{{ card.expiryDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">卡类型</span>
              <span class="text-sm text-[var(--gp-dark)]">{{ CARD_TYPE_LABELS[card.cardType] }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">发卡行</span>
              <span class="text-sm text-[var(--gp-dark)]">{{ card.bankName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-[var(--gp-gray)]">累计消费</span>
              <span class="text-sm text-[var(--gp-dark)] font-semibold">¥{{ totalSpent.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions -->
      <div class="px-5 mb-5">
        <h3 class="text-sm font-semibold text-[var(--gp-dark)] mb-3 px-1">关联交易</h3>
        <div v-if="transactions.length === 0" class="bg-[var(--gp-surface)] rounded-2xl p-6 text-center">
          <p class="text-[var(--gp-gray)] text-sm">暂无交易记录</p>
        </div>
        <div v-else class="bg-[var(--gp-surface)] rounded-2xl px-4">
          <div v-for="(txn, idx) in transactions" :key="txn.id">
            <TransactionItem :transaction="txn" @delete="txnStore.deleteTransaction" />
            <div v-if="idx < transactions.length - 1" class="border-b border-[var(--gp-bg)]" />
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="px-5 pb-10">
        <button
          @click="removeCard"
          class="w-full py-3 rounded-xl text-sm font-medium text-[var(--gp-red)] bg-red-50 active:bg-red-100 transition-colors"
        >
          解绑此卡
        </button>
      </div>
    </template>
  </div>
</template>
