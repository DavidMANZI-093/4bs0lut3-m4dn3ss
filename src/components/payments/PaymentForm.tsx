'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'

interface PaymentFormProps {
  amount: number
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export default function PaymentForm({ 
  amount, 
  onSuccess, 
  onError, 
  onCancel 
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful payment
      const paymentId = `pay_${Date.now()}`
      onSuccess?.(paymentId)
    } catch (error) {
      onError?.('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
  }

  return (
    <Card title="Payment Information" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            ${amount.toFixed(2)}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">Total Amount</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({
              ...paymentData,
              cardNumber: formatCardNumber(e.target.value)
            })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({
                ...paymentData,
                expiryDate: formatExpiryDate(e.target.value)
              })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              CVV
            </label>
            <input
              type="text"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({
                ...paymentData,
                cvv: e.target.value.replace(/\D/g, '')
              })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="123"
              maxLength={4}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={paymentData.name}
            onChange={(e) => setPaymentData({
              ...paymentData,
              name: e.target.value
            })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={paymentData.email}
            onChange={(e) => setPaymentData({
              ...paymentData,
              email: e.target.value
            })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="flex space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-xs text-[var(--text-muted)] text-center flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Your payment information is secure and encrypted
      </div>
    </Card>
  )
}