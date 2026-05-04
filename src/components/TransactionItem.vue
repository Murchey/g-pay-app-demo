<script setup lang="ts">
import { ref } from 'vue'
import type { Transaction } from '@/stores/types'

const props = defineProps<{
  transaction: Transaction
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const offsetX = ref(0)
const startX = ref(0)
const isDragging = ref(false)
const DELETE_THRESHOLD = 80

function onTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
  isDragging.value = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const dx = e.touches[0].clientX - startX.value
  offsetX.value = Math.min(0, Math.max(dx, -120))
}

function onTouchEnd() {
  isDragging.value = false
  if (offsetX.value < -DELETE_THRESHOLD) {
    offsetX.value = -80
  } else {
    offsetX.value = 0
  }
}

function handleDelete() {
  offsetX.value = 0
  emit('delete', props.transaction.id)
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount)
  return amount < 0 ? `-¥${abs.toFixed(2)}` : `+¥${abs.toFixed(2)}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`

  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${month}月${day}日`
}
</script>

<template>
  <div class="relative overflow-hidden rounded-lg">
    <div class="absolute right-0 top-0 bottom-0 w-20 bg-[var(--gp-red)] flex items-center justify-center">
      <button @click="handleDelete" class="text-white text-xs font-medium px-2 py-1">删除</button>
    </div>
    <div
      class="relative flex items-center gap-3 py-3 px-1 bg-[var(--gp-surface)] transition-transform z-10"
      :style="{ transform: `translateX(${offsetX}px)` }"
      :class="isDragging ? '' : 'transition-transform duration-200'"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="w-11 h-11 rounded-full bg-[var(--gp-bg)] flex items-center justify-center text-xl flex-shrink-0">
        {{ transaction.icon }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-center mb-0.5">
          <span class="text-sm font-medium text-[var(--gp-dark)] truncate">{{ transaction.merchant }}</span>
          <span
            class="text-sm font-semibold ml-2 flex-shrink-0"
            :class="transaction.amount < 0 ? 'text-[var(--gp-dark)]' : 'text-[var(--gp-green)]'"
          >
            {{ formatAmount(transaction.amount) }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-[var(--gp-gray)]">{{ formatDate(transaction.date) }}</span>
          <span
            v-if="transaction.status === 'pending'"
            class="text-xs text-[var(--gp-yellow)] bg-amber-50 px-1.5 py-0.5 rounded-full"
          >
            处理中
          </span>
          <span
            v-else-if="transaction.status === 'failed'"
            class="text-xs text-[var(--gp-red)] bg-red-50 px-1.5 py-0.5 rounded-full"
          >
            失败
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
