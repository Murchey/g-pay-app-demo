<script setup lang="ts">
import type { Card } from '@/stores/types'
import { CARD_COLORS, CARD_TYPE_LABELS } from '@/stores/types'

defineProps<{
  card: Card
  compact?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="relative rounded-2xl p-5 text-white cursor-pointer transition-transform duration-200 active:scale-[0.98] shadow-lg"
    :class="[CARD_COLORS[card.colorIndex]?.gradient || 'card-gradient-1', compact ? 'h-36' : 'h-44']"
    @click="$emit('click')"
  >
    <div class="absolute inset-0 rounded-2xl opacity-10 bg-white pointer-events-none" style="background-image: radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3), transparent 50%)" />

    <div class="relative flex flex-col justify-between h-full">
      <div class="flex justify-between items-start">
        <span class="text-sm font-medium opacity-90">{{ card.bankName }}</span>
        <span class="text-xs px-2 py-0.5 bg-white/20 rounded-full">
          {{ CARD_TYPE_LABELS[card.cardType] || card.cardType }}
        </span>
      </div>

      <div>
        <div class="font-mono text-lg tracking-wider mb-2">
          {{ card.cardNumber }}
        </div>
        <div class="flex justify-between items-end">
          <div>
            <div class="text-xs opacity-70 mb-0.5">持卡人</div>
            <div class="text-sm font-medium">{{ card.cardHolder }}</div>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-70 mb-0.5">有效期</div>
            <div class="text-sm font-medium">{{ card.expiryDate }}</div>
          </div>
          <div v-if="card.isDefault" class="ml-3">
            <span class="text-xs bg-white/30 px-2 py-0.5 rounded-full">默认</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
