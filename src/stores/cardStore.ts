import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card } from './types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

const MOCK_CARDS: Card[] = [
  {
    id: 'card-1',
    cardNumber: '4285 **** **** 1234',
    cardHolder: '张三',
    expiryDate: '12/28',
    cardType: 'visa',
    bankName: '中国银行',
    colorIndex: 0,
    isDefault: true,
  },
  {
    id: 'card-2',
    cardNumber: '5412 **** **** 5678',
    cardHolder: '张三',
    expiryDate: '06/27',
    cardType: 'mastercard',
    bankName: '招商银行',
    colorIndex: 1,
    isDefault: false,
  },
  {
    id: 'card-3',
    cardNumber: '6222 **** **** 9012',
    cardHolder: '张三',
    expiryDate: '03/29',
    cardType: 'unionpay',
    bankName: '工商银行',
    colorIndex: 2,
    isDefault: false,
  },
]

export const useCardStore = defineStore('cards', () => {
  const cards = ref<Card[]>([...MOCK_CARDS])

  const defaultCard = computed(() => cards.value.find((c) => c.isDefault) || cards.value[0])

  const totalCards = computed(() => cards.value.length)

  function addCard(card: Omit<Card, 'id' | 'isDefault'>): Card {
    if (cards.value.length === 0) {
      card.isDefault = true
    }
    const newCard: Card = {
      ...card,
      id: generateId(),
      isDefault: card.isDefault ?? false,
    }
    cards.value.push(newCard)
    return newCard
  }

  function removeCard(id: string) {
    const idx = cards.value.findIndex((c) => c.id === id)
    if (idx === -1) return
    const wasDefault = cards.value[idx].isDefault
    cards.value.splice(idx, 1)
    if (wasDefault && cards.value.length > 0) {
      cards.value[0].isDefault = true
    }
  }

  function setDefault(id: string) {
    cards.value.forEach((c) => (c.isDefault = c.id === id))
  }

  function getCardById(id: string): Card | undefined {
    return cards.value.find((c) => c.id === id)
  }

  function maskCardNumber(fullNumber: string): string {
    const clean = fullNumber.replace(/\s/g, '')
    const last4 = clean.slice(-4)
    return `**** **** **** ${last4}`
  }

  return { cards, defaultCard, totalCards, addCard, removeCard, setDefault, getCardById, maskCardNumber }
})
