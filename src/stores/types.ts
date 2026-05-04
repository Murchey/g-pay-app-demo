export interface Card {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cardType: 'visa' | 'mastercard' | 'unionpay' | 'amex'
  bankName: string
  colorIndex: number
  isDefault: boolean
}

export interface Transaction {
  id: string
  cardId: string
  amount: number
  merchant: string
  category: string
  icon: string
  date: string
  status: 'success' | 'pending' | 'failed'
  type: 'payment' | 'refund'
}

export const CARD_COLORS = [
  { gradient: 'card-gradient-1', name: '经典蓝' },
  { gradient: 'card-gradient-2', name: '清新绿' },
  { gradient: 'card-gradient-3', name: '活力红' },
  { gradient: 'card-gradient-4', name: '阳光金' },
]

export const CARD_TYPE_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  unionpay: '银联',
  amex: 'American Express',
}

export const CATEGORY_ICONS: Record<string, string> = {
  dinning: '🍽️',
  shopping: '🛒',
  transport: '🚗',
  entertainment: '🎬',
  education: '📚',
  health: '💊',
  groceries: '🥦',
  travel: '✈️',
  coffee: '☕',
  other: '📦',
}
