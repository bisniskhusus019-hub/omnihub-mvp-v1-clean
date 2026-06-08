import { Printer, Download, CheckCircle, Building2, User, Package } from 'lucide-react';
import { mockInvoice } from '../data/mockData';

export default function InvoiceSheet() {
  const inv = mockInvoice;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoice</h1>
          <p className="text-sm text-slate-400 mt-0.5">OmniHub Ledger v1.0</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all"
          >
            <Printer size={13} />
            Print
          </button>
          <button
            onClick={() => alert('PDF export — connect to PDF library to enable')}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download size={13} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Package size={14} className="text-slate-900" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">OmniHub Digital</div>
                  <div className="text-[10px] text-cyan-400 font-medium">Ledger v1.0</div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Professional Invoice</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <span className="text-lg font-bold text-white">Invoice {inv.number}</span>
                <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <CheckCircle size={10} />
                  {inv.status}
                </span>
              </div>
              <div className="space-y-0.5 text-xs text-slate-400">
                <div>Date Issued: <span className="text-slate-300">{inv.dateIssued}</span></div>
                <div>Due Date: <span className="text-slate-300">{inv.dateDue}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller & Buyer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 py-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={13} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From (Seller)</span>
            </div>
            <div className="space-y-0.5 text-sm">
              <p className="font-bold text-white">{inv.seller.name}</p>
              <p className="text-slate-300">{inv.seller.company}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{inv.seller.address}</p>
              <p className="text-slate-400 text-xs">{inv.seller.email}</p>
              <p className="text-slate-500 text-xs">Tax ID: {inv.seller.taxId}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={13} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To (Buyer)</span>
            </div>
            <div className="space-y-0.5 text-sm">
              <p className="font-bold text-white">{inv.buyer.name}</p>
              <p className="text-slate-300">{inv.buyer.company}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{inv.buyer.address}</p>
              <p className="text-slate-400 text-xs">{inv.buyer.email}</p>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="px-8 py-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-3">Description</th>
                  <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-3">Qty</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-3">Unit Price</th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-3 text-sm text-slate-200">{item.description}</td>
                    <td className="py-3 text-sm text-slate-400 text-center">{item.qty}</td>
                    <td className="py-3 text-sm text-slate-300 text-right">Rp {item.unitPrice.toLocaleString('id-ID')}</td>
                    <td className="py-3 text-sm font-semibold text-white text-right">Rp {item.total.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-200">Rp {inv.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processing Fee (3%)</span>
                <span className="text-slate-200">Rp {inv.processingFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-slate-700 pt-3 mt-3">
                <span className="text-white text-base">Grand Total</span>
                <span className="text-cyan-400 text-base">Rp {inv.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-800 bg-slate-800/20">
          <p className="text-xs text-slate-500 text-center">
            This invoice was generated by OmniHub Ledger v1.0 · Thank you for your purchase
          </p>
        </div>
      </div>
    </div>
  );
}
