export default function CheckoutSafe({ product, onComplete }: any) {
  const item = product || {};
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-black text-white">Order Request</h1>
        <p className="mt-2 text-sm text-slate-400">This MVP records interest and keeps delivery locked until owner review.</p>
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <div className="text-sm font-bold text-white">{item.title || 'OmniHub Product'}</div>
          <div className="text-xs text-slate-500 mt-1">{item.description || 'Product summary'}</div>
        </div>
        <button onClick={() => onComplete({ product_title: item.title, status: 'pending', order_status: 'manual_review', payment_status: 'pending', date: new Date().toISOString().split('T')[0] })} className="mt-5 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950">Create Pending Order</button>
      </div>
    </div>
  );
}
