import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction } from './types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    cardId: 'card-1',
    amount: -128.5,
    merchant: '星巴克咖啡',
    category: 'coffee',
    icon: '☕',
    date: '2026-05-04T10:30:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-2',
    cardId: 'card-1',
    amount: -3599.0,
    merchant: '苹果官方旗舰店',
    category: 'shopping',
    icon: '🛒',
    date: '2026-05-03T14:20:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-3',
    cardId: 'card-2',
    amount: 3599.0,
    merchant: '苹果官方旗舰店 (退款)',
    category: 'shopping',
    icon: '🛒',
    date: '2026-05-02T09:00:00',
    status: 'success',
    type: 'refund',
  },
  {
    id: 'txn-4',
    cardId: 'card-2',
    amount: -56.8,
    merchant: '海底捞火锅',
    category: 'dinning',
    icon: '🍽️',
    date: '2026-05-01T19:45:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-5',
    cardId: 'card-1',
    amount: -23.5,
    merchant: '滴滴出行',
    category: 'transport',
    icon: '🚗',
    date: '2026-04-30T08:15:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-6',
    cardId: 'card-3',
    amount: -199.0,
    merchant: '万达影城',
    category: 'entertainment',
    icon: '🎬',
    date: '2026-04-29T20:00:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-7',
    cardId: 'card-1',
    amount: -89.9,
    merchant: '美团外卖',
    category: 'dinning',
    icon: '🍽️',
    date: '2026-04-28T12:30:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-8',
    cardId: 'card-2',
    amount: -2680.0,
    merchant: '携程旅行',
    category: 'travel',
    icon: '✈️',
    date: '2026-04-27T16:00:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-9',
    cardId: 'card-3',
    amount: -45.0,
    merchant: '叮当快药',
    category: 'health',
    icon: '💊',
    date: '2026-04-26T11:20:00',
    status: 'success',
    type: 'payment',
  },
  {
    id: 'txn-10',
    cardId: 'card-1',
    amount: -1280.0,
    merchant: '京东商城',
    category: 'shopping',
    icon: '🛒',
    date: '2026-04-25T09:00:00',
    status: 'pending',
    type: 'payment',
  },
]

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([...MOCK_TRANSACTIONS])

  const sortedTransactions = computed(() =>
    [...transactions.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  const recentTransactions = computed(() => sortedTransactions.value.slice(0, 5))

  function getTransactionsByCard(cardId: string) {
    return sortedTransactions.value.filter((t) => t.cardId === cardId)
  }

  function addTransaction(txn: Omit<Transaction, 'id'>): Transaction {
    const newTxn: Transaction = { ...txn, id: generateId() }
    transactions.value.unshift(newTxn)
    return newTxn
  }

  function deleteTransaction(id: string) {
    const idx = transactions.value.findIndex((t) => t.id === id)
    if (idx !== -1) transactions.value.splice(idx, 1)
  }

  function getTotalSpent(): number {
    return transactions.value
      .filter((t) => t.type === 'payment' && t.status === 'success')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }

  function getTotalRefunded(): number {
    return transactions.value
      .filter((t) => t.type === 'refund' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return {
    transactions,
    sortedTransactions,
    recentTransactions,
    getTransactionsByCard,
    addTransaction,
    deleteTransaction,
    getTotalSpent,
    getTotalRefunded,
  }
})
