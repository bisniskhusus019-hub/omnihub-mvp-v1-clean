import { useState } from 'react';
import { AlertTriangle, CheckCircle, Download, FileText, Hash, Lock, Package, Shield, User } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { generateDownloadToken } from '../lib/supabaseStub';
import type { Transaction } from '../App';

interface FulfillmentGatewayProps {
  product: typeof mockProducts[0] | any | null;
  transaction: Transaction | null;
}

function makeToken(prefix: string, seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return prefix + Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
}

function getProductImage(product: any) {
  return product.thumbnail_url || product.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900';
}

function getBuyer(transaction: Transaction | null) {
  return transaction?.buyer || transaction?.buyer_name || 'Guest Buyer';
}

function getDate(transaction: Transaction | null) {
  if (transaction?.date) return transaction.date;
  if (transaction?.created_at) return new Date(transaction.created_at).toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}

export default function FulfillmentGateway({ product, transaction }: FulfillmentGatewayProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const selectedProduct = product || mockProducts[0];
  const txnId = transaction?.id ?? 'txn_demo';
  const txnHash = transaction?.download_token || `TXN-${makeToken('', txnId + 'hash')}-${makeToken('', txnId + 'suffix')}`;
  const secureToken = transaction?.download_token || `SEC-${makeToken('', txnId + 'token')}${makeToken('', txnId + 'ext')}`;
  const isApproved = transaction?.payment_status === 'paid' || transaction?.order_status === 'fulfilled';

  const handleDownload = async () => {
    if (!isApproved) return;
    setDownloading(true);
    try {
      await generateDownloadToken(selectedProduct.id || 'product', txnHash);
    } catch (error) {
      console.error('Failed to generate download token:', error);
    }
    setTimeout(() => { setDownloading(false); setDownloaded(true); }, 1200);
  };

  if (!isApproved) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 rounded-2xl p-6 mb-6">
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><Lock size={24} className="text-amber-300" /></div>
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Order Request Received</h1>
              <p className="text-sm text-slate-400">Delivery is locked until the owner or seller approves this order.</p>
              {transaction && <p className="text-xs text-slate-500 mt-1">Requested by <span className="text-slate-300 font-medium">{getBuyer(transaction)}</span> · {getDate(transaction)}</p>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Hash size={13} className="text-cyan-400" /><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order Reference</span></div><p className="text-xs font-mono text-cyan-300 break-all">{txnHash}</p></div>
          <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Shield size={13} className="text-amber-400" /><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Status</span></div><span className="text-xs font-bold text-amber-300">Pending approval</span></div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-800/30"><Package size={15} className="text-cyan-400" /><span className="text-sm font-semibold text-white">Requested Product</span></div>
          <div className="p-5 flex gap-4"><div className="relative h-20 w-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700"><img src={getProductImage(selectedProduct)} alt={selectedProduct.title} className="w-full h-full object-cover" /></div><div><h3 className="text-sm font-bold text-white mb-2">{selectedProduct.title || transaction?.product_title || 'OmniHub Product'}</h3><p className="text-xs text-slate-400">The owner can review this order from Owner Control / transaction records.</p></div></div>
        </div>
        <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4"><div className="flex items-start gap-3"><AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-xs text-slate-400 leading-relaxed">This is intentional: OmniHub should not release private digital files before approval.</p></div></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
        <div className="relative flex items-start gap-4"><div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><CheckCircle size={24} className="text-emerald-400" /></div><div><h1 className="text-xl font-bold text-white mb-1">Order Approved</h1><p className="text-sm text-slate-400">Your digital asset is ready for secure delivery.</p></div></div>
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-800/30"><Package size={15} className="text-cyan-400" /><span className="text-sm font-semibold text-white">Your Digital Product</span></div>
        <div className="p-5">
          <div className="flex gap-4"><div className="relative h-20 w-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700"><img src={getProductImage(selectedProduct)} alt={selectedProduct.title} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><h3 className="text-sm font-bold text-white mb-2 leading-snug">{selectedProduct.title || transaction?.product_title || 'OmniHub Product'}</h3><div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400"><span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg"><FileText size={11} className="text-cyan-500" />Secure delivery</span><span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg"><User size={11} className="text-slate-500" />{getBuyer(transaction)}</span></div></div></div>
          <div className="mt-4 bg-slate-800 border border-amber-500/10 rounded-xl p-3"><div className="flex items-center gap-2 mb-1.5"><Lock size={11} className="text-amber-400" /><span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Secure Access Token</span></div><p className="text-xs font-mono text-amber-300 break-all">{secureToken}</p></div>
          <button onClick={handleDownload} disabled={downloading || downloaded} className={`w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${downloaded ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : downloading ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20'}`}>{downloading ? 'Preparing Secure Download...' : downloaded ? <><CheckCircle size={15} /> Download Complete</> : <><Download size={15} /> Download Digital Asset</>}</button>
        </div>
      </div>
    </div>
  );
}
