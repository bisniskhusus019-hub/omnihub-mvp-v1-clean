import { useState } from 'react';
import { CheckCircle, Shield, Download, FileText, Lock, AlertTriangle, Hash, Package, User } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { generateDownloadToken } from '../lib/supabaseStub';
import type { Transaction } from '../App';

interface FulfillmentGatewayProps {
  product: typeof mockProducts[0] | null;
  transaction: Transaction | null;
}

function makeToken(prefix: string, seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return prefix + Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
}

export default function FulfillmentGateway({ product, transaction }: FulfillmentGatewayProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const selectedProduct = product || mockProducts[0];

  // Stable values derived from transaction id — same on every render
  const txnId = transaction?.id ?? 'txn_demo';
  const [txnHash] = useState(() => 'TXN-' + makeToken('', txnId + 'hash') + '-' + makeToken('', txnId + 'suffix'));
  const [secureToken] = useState(() => 'SEC-' + makeToken('', txnId + 'token') + makeToken('', txnId + 'ext'));

  const handleDownload = async () => {
    setDownloading(true);
    await generateDownloadToken(selectedProduct.id, txnHash);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Success banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Order Fulfilled Successfully!</h1>
            <p className="text-sm text-slate-400">Your purchase has been confirmed and your digital asset is ready for download.</p>
            {transaction && (
              <p className="text-xs text-slate-500 mt-1">
                Purchased by <span className="text-slate-300 font-medium">{transaction.buyer}</span> · {transaction.date}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transaction info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash size={13} className="text-cyan-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction Hash</span>
          </div>
          <p className="text-xs font-mono text-cyan-300 break-all">{txnHash}</p>
        </div>
        <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={13} className="text-emerald-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">Secure Link Verified</span>
          </div>
        </div>
      </div>

      {/* Product delivery box */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-800/30">
          <Package size={15} className="text-cyan-400" />
          <span className="text-sm font-semibold text-white">Your Digital Product</span>
        </div>

        <div className="p-5">
          <div className="flex gap-4">
            <div className="relative h-20 w-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-2 leading-snug">{selectedProduct.title}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400">
                {selectedProduct.fileType && (
                  <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg">
                    <FileText size={11} className="text-cyan-500" />
                    {selectedProduct.fileType}
                  </span>
                )}
                {selectedProduct.fileSize && selectedProduct.fileSize !== '—' && (
                  <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg">
                    <Package size={11} className="text-slate-500" />
                    {selectedProduct.fileSize}
                  </span>
                )}
                {transaction && (
                  <span className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg">
                    <User size={11} className="text-slate-500" />
                    {transaction.buyer}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Secure token */}
          <div className="mt-4 bg-slate-800 border border-amber-500/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Lock size={11} className="text-amber-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Secure Access Token</span>
            </div>
            <p className="text-xs font-mono text-amber-300 break-all">{secureToken}</p>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading || downloaded}
            className={`
              w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all
              ${downloaded
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : downloading
                  ? 'bg-slate-700 text-slate-400 cursor-wait'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 animate-pulse hover:animate-none'
              }
            `}
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                Preparing Secure Download...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle size={15} />
                Download Complete
              </>
            ) : (
              <>
                <Download size={15} />
                Download Digital Asset
              </>
            )}
          </button>
        </div>
      </div>

      {/* Anti-piracy notice */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-300 mb-1">Anti-Piracy Protection Notice</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              This digital asset is protected by OmniHub Token-Bound Access technology. Your unique secure token ({secureToken.substring(0, 12)}...) is bound to your transaction identity.
              Downloads are limited to <strong className="text-slate-300">3 attempts</strong> and expire after <strong className="text-slate-300">72 hours</strong>.
              Unauthorized redistribution or sharing of this file is strictly prohibited and traceable to your purchase record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
