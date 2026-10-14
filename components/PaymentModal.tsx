'use client'

import { useState, useEffect } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'requisites'>('qr')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldKey)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const requisites = [
    { label: 'Получатель', value: 'Бахарева Елена Арсеньевна', copyable: false },
    { label: 'Банк', value: 'АО "ТБанк"', copyable: false },
    { label: 'Номер счета', value: '40817810500010579844', copyable: true },
    { label: 'БИК', value: '044525974', copyable: true },
    { label: 'Корр. счет', value: '30101810145250000974', copyable: true },
    { label: 'ИНН банка', value: '7710140679', copyable: true },
    { label: 'КПП банка', value: '771301001', copyable: true },
  ]

  const paymentPurpose =
    'Перевод средств по договору № 5143024338 Бахарева Елена Арсеньевна НДС не облагается'

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all"
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
          Оплата услуг
        </h3>
        <p className="text-xs text-gray-500 text-center mb-5">
          Выберите удобный способ перевода
        </p>

        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            QR-код (СБП)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requisites')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
              activeTab === 'requisites'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Банковские реквизиты
          </button>
        </div>

        {activeTab === 'qr' && (
          <div className="flex flex-col items-center text-center">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 shadow-inner mb-3">
              <img
                src="/qr-code.png"
                alt="QR-код для оплаты"
                className="w-56 h-auto rounded-xl object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mb-1">
              Отсканируйте код камерой смартфона или в приложении любого банка
            </p>
            <p className="text-[11px] text-gray-400">
              Перевод через Систему быстрых платежей (СБП)
            </p>
          </div>
        )}

        {activeTab === 'requisites' && (
          <div className="space-y-3">
            <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/70 p-3 space-y-2 text-xs">
              {requisites.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      {item.label}
                    </span>
                    <span className="font-mono text-gray-800 text-xs break-all">
                      {item.value}
                    </span>
                  </div>
                  {item.copyable && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="shrink-0 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-100 active:scale-95 transition cursor-pointer"
                    >
                      {copiedField === item.label ? 'Скопировано!' : 'Копировать'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Назначение платежа (обязательно)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentPurpose, 'purpose')}
                  className="rounded bg-amber-200/70 px-2 py-0.5 text-[10px] font-semibold text-amber-900 hover:bg-amber-300 active:scale-95 transition cursor-pointer"
                >
                  {copiedField === 'purpose' ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <p className="font-mono text-gray-800 text-[11px] leading-relaxed">
                {paymentPurpose}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-gray-100 pt-3 text-center">
          <p className="text-[11px] text-gray-400 mb-3">
            После совершения оплаты сохраните чек или отправьте квитанцию Елене
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}