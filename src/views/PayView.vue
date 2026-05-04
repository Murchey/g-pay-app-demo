<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { CATEGORY_ICONS } from '@/stores/types'
import { useRouter } from 'vue-router'

const router = useRouter()
const cardStore = useCardStore()
const txnStore = useTransactionStore()

const amount = ref('')
const merchant = ref('')
const selectedCategory = ref('dinning')
const selectedCardId = ref(cardStore.defaultCard?.id || '')
const showSuccess = ref(false)
const showConfirm = ref(false)

const categories = Object.entries(CATEGORY_ICONS).filter(([key]) => key !== 'other')
const recentPayees = [
  { name: '星巴克咖啡', icon: '☕' },
  { name: '美团外卖', icon: '🍽️' },
  { name: '滴滴出行', icon: '🚗' },
  { name: '京东商城', icon: '🛒' },
]

const selectedCard = computed(() => cardStore.getCardById(selectedCardId.value))
const amountNum = computed(() => parseFloat(amount.value) || 0)
const isValid = computed(() => amountNum.value > 0 && merchant.value.trim().length > 0 && selectedCardId.value)

function handleAmountInput(e: Event) {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/[^\d.]/g, '')
  const parts = val.split('.')
  if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
  if (parts[1] && parts[1].length > 2) val = parts[0] + '.' + parts[1].slice(0, 2)
  amount.value = val
}

function selectPayee(name: string, icon: string) {
  merchant.value = name
  const catKey = Object.entries(CATEGORY_ICONS).find(([_, v]) => v === icon)
  if (catKey) selectedCategory.value = catKey[0]
}

function confirmPay() {
  if (!isValid.value) return
  showConfirm.value = true
}

function doPay() {
  showConfirm.value = false
  txnStore.addTransaction({
    cardId: selectedCardId.value,
    amount: -amountNum.value,
    merchant: merchant.value,
    category: selectedCategory.value,
    icon: CATEGORY_ICONS[selectedCategory.value] || '📦',
    date: new Date().toISOString(),
    status: 'success',
    type: 'payment',
  })
  showSuccess.value = true
}

function resetForm() {
  amount.value = ''
  merchant.value = ''
  selectedCategory.value = 'dinning'
  showSuccess.value = false
  showConfirm.value = false
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)] pb-20">
    <!-- Header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-4">
      <h1 class="text-xl font-bold text-[var(--gp-dark)]">付款</h1>
      <p class="text-sm text-[var(--gp-gray)] mt-1">向商家或个人付款</p>
    </div>

    <!-- Success -->
    <div v-if="showSuccess" class="flex flex-col items-center justify-center px-5 pt-16">
      <div class="w-20 h-20 rounded-full bg-[var(--gp-green)] flex items-center justify-center mb-6 animate-bounce">
        <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-[var(--gp-dark)] mb-1">支付成功</h2>
      <p class="text-3xl font-bold text-[var(--gp-dark)] mb-2">¥{{ amountNum.toFixed(2) }}</p>
      <p class="text-sm text-[var(--gp-gray)] mb-8">{{ merchant }}</p>
      <div class="flex gap-3 w-full max-w-xs">
        <button @click="resetForm" class="flex-1 py-3 rounded-full font-medium border border-[var(--gp-light-gray)] text-[var(--gp-dark)] active:bg-[var(--gp-bg)]">
          继续付款
        </button>
        <button @click="goHome" class="flex-1 py-3 rounded-full font-medium bg-[var(--gp-blue)] text-white active:opacity-80">
          返回首页
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Amount -->
      <div class="px-5 pt-6 mb-6">
        <div class="bg-[var(--gp-surface)] rounded-2xl p-6 text-center">
          <p class="text-sm text-[var(--gp-gray)] mb-3">付款金额</p>
          <div class="flex items-center justify-center gap-1">
            <span class="text-3xl font-bold text-[var(--gp-dark)]">¥</span>
            <input
              :value="amount"
              @input="handleAmountInput"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              class="text-4xl font-bold text-[var(--gp-dark)] text-center w-48 outline-none bg-transparent placeholder:text-[var(--gp-light-gray)]"
            />
          </div>
        </div>
      </div>

      <!-- Quick payees -->
      <div class="px-5 mb-5">
        <h3 class="text-sm font-medium text-[var(--gp-gray)] mb-3">常用收款方</h3>
        <div class="flex gap-3">
          <button
            v-for="payee in recentPayees"
            :key="payee.name"
            @click="selectPayee(payee.name, payee.icon)"
            class="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div class="w-12 h-12 rounded-full bg-[var(--gp-surface)] shadow-sm flex items-center justify-center text-xl">
              {{ payee.icon }}
            </div>
            <span class="text-xs text-[var(--gp-gray)]">{{ payee.name.slice(0, 4) }}</span>
          </button>
        </div>
      </div>

      <!-- Merchant name -->
      <div class="px-5 mb-5">
        <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">收款方 / 商户名</label>
        <input
          v-model="merchant"
          type="text"
          placeholder="请输入收款方名称"
          class="w-full px-4 py-3.5 bg-[var(--gp-surface)] rounded-xl border border-[var(--gp-light-gray)] text-[var(--gp-dark)] focus:border-[var(--gp-blue)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 outline-none transition-all"
        />
      </div>

      <!-- Category -->
      <div class="px-5 mb-5">
        <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">消费类别</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="[key, icon] in categories"
            :key="key"
            @click="selectedCategory = key"
            class="px-3 py-1.5 rounded-full text-sm border transition-all"
            :class="selectedCategory === key
              ? 'bg-[var(--gp-blue)] text-white border-[var(--gp-blue)]'
              : 'bg-[var(--gp-surface)] text-[var(--gp-gray)] border-[var(--gp-light-gray)]'"
          >
            {{ icon }}
          </button>
        </div>
      </div>

      <!-- Select card -->
      <div class="px-5 mb-6">
        <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">付款卡</label>
        <div v-if="cardStore.cards.length === 0" class="bg-[var(--gp-surface)] rounded-2xl p-4 text-center">
          <p class="text-sm text-[var(--gp-gray)] mb-2">暂无可用卡片</p>
          <button @click="router.push('/add-card')" class="text-sm text-[var(--gp-blue)] font-medium">去绑卡</button>
        </div>
        <div v-else class="space-y-2">
          <button
            v-for="card in cardStore.cards"
            :key="card.id"
            @click="selectedCardId = card.id"
            class="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all"
            :class="selectedCardId === card.id
              ? 'border-[var(--gp-blue)] bg-[#e8f0fe]'
              : 'border-[var(--gp-light-gray)] bg-[var(--gp-surface)]'"
          >
            <div
              class="w-10 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
              :class="['card-gradient-1', 'card-gradient-2', 'card-gradient-3', 'card-gradient-4'][card.colorIndex]"
            >
              {{ card.cardType.slice(0, 2).toUpperCase() }}
            </div>
            <div class="flex-1 text-left">
              <div class="text-sm font-medium text-[var(--gp-dark)]">{{ card.bankName }}</div>
              <div class="text-xs text-[var(--gp-gray)]">{{ card.cardNumber }}</div>
            </div>
            <div
              v-if="selectedCardId === card.id"
              class="w-5 h-5 rounded-full bg-[var(--gp-blue)] flex items-center justify-center"
            >
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Pay button -->
      <div class="px-5">
        <button
          @click="confirmPay"
          :disabled="!isValid"
          class="w-full py-4 rounded-full font-medium text-base text-white transition-all"
          :class="isValid ? 'bg-[var(--gp-blue)] active:opacity-80 shadow-lg shadow-blue-200' : 'bg-[var(--gp-light-gray)] text-[var(--gp-gray)] cursor-not-allowed'"
        >
          确认付款
        </button>
        <p class="text-xs text-[var(--gp-gray)] text-center mt-3">
          🔒 此为演示应用，不会进行实际扣款
        </p>
      </div>

      <!-- Confirm modal -->
      <Teleport to="body">
        <div v-if="showConfirm" class="fixed inset-0 z-[100] flex items-end justify-center">
          <div class="absolute inset-0 bg-black/40" @click="showConfirm = false" />
          <div class="relative w-full max-w-[430px] bg-[var(--gp-surface)] rounded-t-3xl p-6 pb-10 animate-slide-up">
            <div class="w-10 h-1 bg-[var(--gp-light-gray)] rounded-full mx-auto mb-5" />
            <h3 class="text-lg font-bold text-[var(--gp-dark)] text-center mb-4">确认付款</h3>
            <div class="text-center mb-6">
              <p class="text-3xl font-bold text-[var(--gp-dark)]">¥{{ amountNum.toFixed(2) }}</p>
              <p class="text-sm text-[var(--gp-gray)] mt-1">{{ merchant }}</p>
              <p class="text-xs text-[var(--gp-gray)] mt-1">
                付款卡：{{ selectedCard?.bankName }} {{ selectedCard?.cardNumber }}
              </p>
            </div>
            <div class="flex gap-3">
              <button @click="showConfirm = false" class="flex-1 py-3.5 rounded-full font-medium border border-[var(--gp-light-gray)] text-[var(--gp-dark)]">
                取消
              </button>
              <button @click="doPay" class="flex-1 py-3.5 rounded-full font-medium bg-[var(--gp-blue)] text-white active:opacity-80">
                确认支付
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
