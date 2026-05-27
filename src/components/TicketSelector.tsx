import { useState } from 'react';
import { BadgeCheck, Calendar } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { track } from '../lib/analytics';

const DATES = [
  { id: '20jun', label: '20 de Junho de 2026', short: '20/06' },
  { id: '16jul', label: '16 de Julho de 2026', short: '16/07' },
] as const;

type DateId = typeof DATES[number]['id'];

const TICKETS = [
  {
    id: 'combo_amigo',
    label: 'Combo Amigo',
    description: '3 ingressos',
    price: 6000,
    display: 'R$ 60,00',
    badge: 'MELHOR VALOR',
    fixedQty: 3,
  },
  {
    id: 'combo_casal',
    label: 'Combo Casal',
    description: '2 ingressos',
    price: 7500,
    display: 'R$ 75,00',
    badge: null,
    fixedQty: 2,
  },
  {
    id: 'inteira',
    label: 'Inteira',
    description: '1 ingresso',
    price: 15000,
    display: 'R$ 150,00',
    badge: null,
    fixedQty: 1,
  },
  {
    id: 'meia',
    label: 'Meia Entrada',
    description: '1 ingresso',
    price: 7500,
    display: 'R$ 75,00',
    badge: null,
    fixedQty: 1,
  },
] as const;

type TicketId = typeof TICKETS[number]['id'];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export default function TicketSelector() {
  const [selectedDate, setSelectedDate] = useState<DateId | null>(null);
  const [selectedTicket, setSelectedTicketId] = useState<TicketId | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ticket = TICKETS.find(t => t.id === selectedTicket) ?? null;
  const date = DATES.find(d => d.id === selectedDate) ?? null;
  const totalAmount = ticket ? ticket.price : 0;

  const canCheckout = !!ticket && !!date;

  const pixItems = ticket && date
    ? [{ title: `${ticket.label} — Bruna Louise | Meus 15 Anos (${date.label})`, unitPrice: ticket.price, quantity: 1 }]
    : [];

  const selectedSummary = ticket && date
    ? `${ticket.label} · ${date.short}`
    : '';

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 space-y-6">

        {/* Date selector */}
        <div>
          <p className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3d0d25]" />
            Escolha a data
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DATES.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDate(selectedDate === d.id ? null : d.id)}
                className={`border-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all ${
                  selectedDate === d.id
                    ? 'border-[#3d0d25] bg-pink-50 text-[#3d0d25]'
                    : 'border-gray-200 text-gray-700 hover:border-pink-300'
                }`}
              >
                <span className="block text-base font-bold">{d.short}</span>
                <span className="block text-xs font-normal text-gray-500 mt-0.5">Às 20:00</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket selector */}
        <div>
          <p className="text-gray-700 font-semibold mb-3">Escolha o ingresso</p>
          <div className="space-y-3">
            {TICKETS.map(t => {
              const isSelected = selectedTicket === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(isSelected ? null : t.id)}
                  className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                    isSelected
                      ? 'border-[#3d0d25] bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      {t.badge && (
                        <span className="text-[10px] font-bold text-white bg-[#3d0d25] px-2 py-0.5 rounded-full uppercase tracking-wide mb-1.5 inline-block">
                          {t.badge}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-sm">{t.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">{t.display}</p>
                      <p className="text-xs text-gray-400">por combo</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            if (!canCheckout) return;
            setModalOpen(true);
            track('checkout_open', { summary: selectedSummary, total: totalAmount });
          }}
          disabled={!canCheckout}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors"
        >
          {canCheckout ? `Finalizar Compra — ${formatCurrency(totalAmount)}` : 'Selecione data e ingresso'}
        </button>

        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <BadgeCheck className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold text-green-800 leading-tight">Reembolso garantido</p>
            <p className="text-xs text-green-700 mt-0.5 leading-snug">
              Em caso de desistência, seu dinheiro será devolvido integralmente.
            </p>
          </div>
        </div>
      </div>

      {canCheckout && (
        <CheckoutModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedSummary={selectedSummary}
          items={pixItems}
          totalAmount={totalAmount}
        />
      )}
    </>
  );
}
