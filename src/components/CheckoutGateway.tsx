import { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Shield,
  Lock,
  User,
  Mail,
  Phone,
  ChevronRight,
  Coins,
} from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { processTransaction, confirmPayment } from '../lib/supabaseStub';
import type { Transaction } from '../App';
import {
  DEFAULT_CURRENCY,
  convertMoney,
  formatMoney,
  loadGlobalPreference,
  saveGlobalPreference,
  supportedCurrencies,
} from '../lib/globalization';

interface CheckoutGatewayProps {
  product: typeof mockProducts[0] | any | null;
  onComplete: (txn: Transaction) => void;
}

export default function CheckoutGateway({
  product,
  onComplete,
}: CheckoutGatewayProps) {
  const selectedProduct = product || mockProducts[0];
  const productCurrency = selectedProduct.currency || 'IDR';
  const [currency, setCurrency] = useState<string>(() =>
    loadGlobalPreference('omnihub_currency', selectedProduct.currency || DEFAULT_CURRENCY)
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const getProductImage = () => {
    return (
      selectedProduct.thumbnail_url ||
      selectedProduct.image ||
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900'
    );
  };

  const getProductCategory = () => {
    return (
      selectedProduct.category ||
      selectedProduct.product_type ||
      'Digital Product'
    );
  };

  const getBaseAmount = () => Number(selectedProduct.price || 0);
  const getProcessingFee = () => 0;

  const baseAmount = getBaseAmount();
  const convertedBaseAmount = convertMoney(baseAmount, productCurrency, currency);
  const processingFee = getProcessingFee();
  const totalAmount = convertedBaseAmount + processingFee;
  const price = formatMoney(convertedBaseAmount, currency);
  const sourcePrice = formatMoney(baseAmount, productCurrency);
  const totalPrice = formatMoney(totalAmount, currency);

  const updateCurrency = (nextCurrency: string) => {
    setCurrency(nextCurrency);
    saveGlobalPreference('omnihub_currency', nextCurrency);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdTxn = await processTransaction({
        product_id: selectedProduct.id,
        seller_id: selectedProduct.seller_id || selectedProduct.seller?.id || null,
        buyer_email: form.email,
        buyer_name: form.name || 'Guest Buyer',
        quantity: 1,
        amount: totalAmount,
        currency,
        payment_method: currency === 'IDR' ? 'qris' : 'card_preview',
        payment_status: 'pending',
        order_status: 'created',
      });

      const confirmedTxn = await confirmPayment(createdTxn.id);

      const newTransaction: Transaction = {
        ...confirmedTxn,

        id: confirmedTxn.id,
        product_id: selectedProduct.id,
        seller_id: selectedProduct.seller_id || selectedProduct.seller?.id || null,

        buyer: confirmedTxn.buyer_name || form.name || 'Guest Buyer',
        buyer_name: confirmedTxn.buyer_name || form.name || 'Guest Buyer',
        buyer_email: confirmedTxn.buyer_email || form.email,

        product: selectedProduct.title,
        product_title: selectedProduct.title,

        amount: Number(confirmedTxn.amount || totalAmount),
        amountUSD: convertMoney(totalAmount, currency, 'USD'),

        status: 'completed',
        payment_status: 'paid',
        order_status: 'fulfilled',

        date: new Date().toISOString().split('T')[0],
        currency,
        download_token: confirmedTxn.download_token,
      };

      setLoading(false);
      onComplete(newTransaction);
    } catch (error) {
      console.error('Checkout failed:', error);
      setLoading(false);
      alert(
        'Checkout failed. Please check Supabase table permissions or transaction payload.'
      );
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Secure Checkout
        </h1>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <Lock size={11} />
          <span>256-bit SSL encrypted transaction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Currency
            </label>

            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Coins size={13} className="text-cyan-400" />
                <span>Choose buyer display currency</span>
              </div>
              <select
                value={currency}
                onChange={(event) => updateCurrency(event.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
              >
                {supportedCurrencies.map((item) => (
                  <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">
                    {item.code} — {item.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[10px] text-slate-500 leading-4">
                Base seller price: {sourcePrice}. Global currency preview is for checkout display and MVP testing.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Buyer Information
              </label>

              <div className="space-y-3">
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        email: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {currency === 'IDR' ? (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone size={15} className="text-cyan-400" />
                  <span className="text-sm font-semibold text-white">
                    QRIS Payment
                  </span>
                </div>

                <div className="flex items-center justify-center bg-white rounded-xl p-4 mb-3">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) =>
                      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
                        const seed = (row * 10 + col) * 7 + 3;

                        return seed % 3 !== 0 ? (
                          <rect
                            key={`${row}-${col}`}
                            x={col * 12}
                            y={row * 12}
                            width="11"
                            height="11"
                            fill="#0f172a"
                          />
                        ) : null;
                      })
                    )}

                    <rect x="0" y="0" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="3" />
                    <rect x="84" y="0" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="3" />
                    <rect x="0" y="84" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="3" />
                    <rect x="6" y="6" width="24" height="24" fill="#0f172a" />
                    <rect x="90" y="6" width="24" height="24" fill="#0f172a" />
                    <rect x="6" y="90" width="24" height="24" fill="#0f172a" />
                  </svg>
                </div>

                <p className="text-xs text-center text-slate-400">
                  Scan with your banking or e-wallet app
                </p>

                <p className="text-xs text-center font-bold text-cyan-400 mt-1">
                  {price}
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={15} className="text-cyan-400" />
                  <span className="text-sm font-semibold text-white">
                    Card Payment Preview
                  </span>
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="Card Number  1234 5678 9012 3456" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM / YY" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                    <input type="text" placeholder="CVV" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                  </div>
                  <input type="text" placeholder="Cardholder Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield size={15} />
                  Complete Secure Checkout
                  <ChevronRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            Order Summary
          </label>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="relative h-40 overflow-hidden">
              <img src={getProductImage()} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs bg-slate-900/80 text-cyan-400 px-2 py-1 rounded-lg border border-cyan-500/20 font-medium">
                {getProductCategory()}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-bold text-white mb-1">{selectedProduct.title}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{selectedProduct.description}</p>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Seller base price</span>
                  <span className="text-slate-200">{sourcePrice}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Buyer currency</span>
                  <span className="text-slate-200">{price}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Processing fee</span>
                  <span className="text-slate-200">{formatMoney(processingFee, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-cyan-400">{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5">
            <Shield size={12} className="text-emerald-400 flex-shrink-0" />
            <span>
              Your payment is protected by OmniHub Secure Pay. Instant delivery after confirmation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
