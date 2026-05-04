<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/cardStore'
import { CARD_COLORS, CARD_TYPE_LABELS } from '@/stores/types'

const router = useRouter()
const cardStore = useCardStore()

const cardNumber = ref('')
const cardHolder = ref('')
const expiryDate = ref('')
const cardType = ref<'visa' | 'mastercard' | 'unionpay' | 'amex'>('visa')
const bankName = ref('')
const selectedColor = ref(0)
const step = ref(1)
const showSuccess = ref(false)

const maskedNumber = computed(() => {
  const clean = cardNumber.value.replace(/\s/g, '')
  if (clean.length <= 4) return clean
  return clean.replace(/(.{4})/g, '$1 ').trim()
})

const isValidStep1 = computed(() => {
  const clean = cardNumber.value.replace(/\s/g, '')
  return clean.length >= 13 && clean.length <= 19
})

const isValidStep2 = computed(() => {
  return cardHolder.value.trim().length > 0 &&
    expiryDate.value.length === 5 &&
    bankName.value.trim().length > 0
})

function handleCardNumberInput(e: Event) {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/[^\d]/g, '')
  if (val.length > 19) val = val.slice(0, 19)
  cardNumber.value = val

  if (val.startsWith('4')) cardType.value = 'visa'
  else if (val.startsWith('5')) cardType.value = 'mastercard'
  else if (val.startsWith('6')) cardType.value = 'unionpay'
  else if (val.startsWith('3')) cardType.value = 'amex'
}

function handleExpiryInput(e: Event) {
  const target = e.target as HTMLInputElement
  let val = target.value.replace(/[^\d]/g, '')
  if (val.length >= 2) {
    val = val.slice(0, 2) + '/' + val.slice(2, 4)
  }
  expiryDate.value = val.slice(0, 5)
}

function nextStep() {
  if (step.value === 1 && isValidStep1.value) step.value = 2
}

function prevStep() {
  if (step.value === 2) step.value = 1
}

function submitCard() {
  if (!isValidStep2.value) return

  const clean = cardNumber.value.replace(/\s/g, '')
  const last4 = clean.slice(-4)
  cardStore.addCard({
    cardNumber: `**** **** **** ${last4}`,
    cardHolder: cardHolder.value,
    expiryDate: expiryDate.value,
    cardType: cardType.value,
    bankName: bankName.value,
    colorIndex: selectedColor.value,
  })
  showSuccess.value = true
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--gp-bg)]">
    <!-- Header -->
    <div class="bg-[var(--gp-surface)] px-5 pt-12 pb-4 flex items-center gap-3">
      <button @click="showSuccess ? goHome() : (step === 1 ? goHome() : prevStep())" class="w-10 h-10 rounded-full flex items-center justify-center active:bg-[var(--gp-bg)] transition-colors">
        <svg class="w-6 h-6 text-[var(--gp-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-[var(--gp-dark)]">添加银行卡</h1>
    </div>

    <!-- Success screen -->
    <div v-if="showSuccess" class="flex flex-col items-center justify-center px-5 pt-20">
      <div class="w-20 h-20 rounded-full bg-[var(--gp-green)] flex items-center justify-center mb-6 animate-bounce">
        <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-[var(--gp-dark)] mb-2">绑卡成功！</h2>
      <p class="text-sm text-[var(--gp-gray)] mb-8">您的银行卡已成功绑定</p>
      <button
        @click="goHome"
        class="w-full max-w-xs bg-[var(--gp-blue)] text-white py-3 rounded-full font-medium active:opacity-80 transition-opacity"
      >
        返回首页
      </button>
    </div>

    <!-- Step 1: Card number -->
    <div v-else-if="step === 1" class="px-5 pt-6">
      <!-- Card preview -->
      <div
        class="rounded-2xl p-5 text-white h-44 mb-8 shadow-lg transition-all duration-300"
        :class="CARD_COLORS[selectedColor]?.gradient || 'card-gradient-1'"
      >
        <div class="flex flex-col justify-between h-full">
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium opacity-90">{{ bankName || '银行名称' }}</span>
            <span class="text-xs px-2 py-0.5 bg-white/20 rounded-full">
              {{ CARD_TYPE_LABELS[cardType] }}
            </span>
          </div>
          <div>
            <div class="font-mono text-lg tracking-wider mb-2">
              {{ maskedNumber || '•••• •••• •••• ••••' }}
            </div>
            <div class="flex justify-between items-end">
              <div>
                <div class="text-xs opacity-70 mb-0.5">持卡人</div>
                <div class="text-sm font-medium">{{ cardHolder || '姓名' }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs opacity-70 mb-0.5">有效期</div>
                <div class="text-sm font-medium">{{ expiryDate || 'MM/YY' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">卡号</label>
        <input
          :value="maskedNumber"
          @input="handleCardNumberInput"
          type="text"
          inputmode="numeric"
          placeholder="请输入银行卡号"
          class="w-full px-4 py-3.5 bg-[var(--gp-surface)] rounded-xl border border-[var(--gp-light-gray)] text-[var(--gp-dark)] text-base font-mono focus:border-[var(--gp-blue)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 outline-none transition-all"
        />
        <p v-if="cardNumber.length > 0 && !isValidStep1" class="text-xs text-[var(--gp-red)] mt-1.5">
          请输入有效的银行卡号（13-19位）
        </p>
      </div>

      <button
        @click="nextStep"
        :disabled="!isValidStep1"
        class="w-full py-3.5 rounded-full font-medium text-white transition-all"
        :class="isValidStep1 ? 'bg-[var(--gp-blue)] active:opacity-80' : 'bg-[var(--gp-light-gray)] text-[var(--gp-gray)] cursor-not-allowed'"
      >
        下一步
      </button>
    </div>

    <!-- Step 2: Card details -->
    <div v-else class="px-5 pt-6">
      <!-- Color selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">卡片颜色</label>
        <div class="flex gap-3">
          <button
            v-for="(color, i) in CARD_COLORS"
            :key="i"
            @click="selectedColor = i"
            class="w-10 h-10 rounded-full transition-all"
            :class="[
              color.gradient,
              selectedColor === i ? 'ring-2 ring-offset-2 ring-[var(--gp-blue)] scale-110' : 'opacity-60'
            ]"
          />
        </div>
      </div>

      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">持卡人姓名</label>
          <input
            v-model="cardHolder"
            type="text"
            placeholder="请输入持卡人姓名"
            class="w-full px-4 py-3.5 bg-[var(--gp-surface)] rounded-xl border border-[var(--gp-light-gray)] text-[var(--gp-dark)] focus:border-[var(--gp-blue)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 outline-none transition-all"
          />
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">有效期</label>
            <input
              :value="expiryDate"
              @input="handleExpiryInput"
              type="text"
              inputmode="numeric"
              placeholder="MM/YY"
              maxlength="5"
              class="w-full px-4 py-3.5 bg-[var(--gp-surface)] rounded-xl border border-[var(--gp-light-gray)] text-[var(--gp-dark)] font-mono focus:border-[var(--gp-blue)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 outline-none transition-all"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">银行</label>
            <input
              v-model="bankName"
              type="text"
              placeholder="如：中国银行"
              class="w-full px-4 py-3.5 bg-[var(--gp-surface)] rounded-xl border border-[var(--gp-light-gray)] text-[var(--gp-dark)] focus:border-[var(--gp-blue)] focus:ring-2 focus:ring-[var(--gp-blue)]/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-[var(--gp-dark)] mb-2">卡类型</label>
          <div class="flex gap-2">
            <button
              v-for="(label, key) in CARD_TYPE_LABELS"
              :key="key"
              @click="cardType = key as any"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
              :class="cardType === key
                ? 'bg-[var(--gp-blue)] text-white border-[var(--gp-blue)]'
                : 'bg-[var(--gp-surface)] text-[var(--gp-gray)] border-[var(--gp-light-gray)]'"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="prevStep"
          class="flex-1 py-3.5 rounded-full font-medium bg-[var(--gp-surface)] border border-[var(--gp-light-gray)] text-[var(--gp-dark)] active:bg-[var(--gp-bg)]"
        >
          上一步
        </button>
        <button
          @click="submitCard"
          :disabled="!isValidStep2"
          class="flex-1 py-3.5 rounded-full font-medium text-white transition-all"
          :class="isValidStep2 ? 'bg-[var(--gp-blue)] active:opacity-80' : 'bg-[var(--gp-light-gray)] text-[var(--gp-gray)] cursor-not-allowed'"
        >
          绑定
        </button>
      </div>

      <p class="text-xs text-[var(--gp-gray)] text-center mt-4 leading-relaxed">
        🔒 您的卡片信息将被安全加密存储<br />此为演示应用，不会进行实际扣款
      </p>
    </div>
  </div>
</template>
