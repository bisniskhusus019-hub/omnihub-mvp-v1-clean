import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Circle,
  Copy,
  Link2,
  Megaphone,
  MessageSquare,
  MousePointer,
  Package,
  Plus,
  ShoppingBag,
  Store,
  TrendingUp,
} from 'lucide-react';
import AddProductModal from './AddProductModal';
import { createNewProduct } from '../lib/supabaseStub';
import type { Transaction } from '../App';
import type { SellerProfile } from '../lib/sellerProfile';

type Product = any;

interface MerchantDashboardProps {
  products: Product[];
  transactions: Transaction[];
  currentSeller?: SellerProfile | null;
  onAddProduct: (product: Product) => void;
  onBuy: (product: Product) => void;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  paid: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  fulfilled: { label: 'Fulfilled', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  pending: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  created: { label: 'Created', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  manual_review: { label: 'Manual Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  refunded: { label: 'Refunded', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
  failed: { label: 'Failed', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getBaseUrl() {
  if (typeof window === 'undefined') return 'https://omnihub-mvp-v1-clean.vercel.app';
  return window.location.origin;
}

function getProductImage(product: Product) {
  return product.thumbnail_url || product.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900';
}

function getProductCategory(product: Product) {
  if (product.category) return product.category;
  if (product.product_type === 'service') return 'Services';
  if (product.product_type === 'physical') return 'Physical Goods';
  return 'Digital Products';
}

function getTransactionStatus(txn: any) {
  return (txn.status || txn.payment_status || txn.order_status || 'pending').toLowerCase();
}

function getBuyerName(txn: any) {
  return txn.buyer || txn.buyer_name || 'Guest Buyer';
}

function getProductTitle(txn: any) {
  return txn.product || txn.product_title || txn.products?.title || 'OmniHub Product';
}

function getTransactionDate(txn: any) {
  if (txn.date) return txn.date;
  if (txn.created_at) return new Date(txn.created_at).toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}

function formatPrice(value: number, currency = 'IDR') {
  return currency === 'IDR' ? `Rp ${value.toLocaleString('id-ID')}` : `$${value.toFixed(2)}`;
}

export default function MerchantDashboard({ products, transactions, currentSeller, onAddProduct, onBuy }: MerchantDashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const sellerId = currentSeller?.id || null;

  const sellerTransactions = useMemo(() => {
    if (!sellerId) return transactions;
    return transactions.filter((txn: any) => !txn.seller_id || txn.seller_id === sellerId);
  }, [sellerId, transactions]);

  const paidTransactions = sellerTransactions.filter((txn: any) => {
    const status = getTransactionStatus(txn);
    return status === 'paid' || status === 'completed' || status === 'fulfilled';
  });

  const totalRevenueIDR = paidTransactions
    .filter((txn: any) => (txn.currency || 'IDR') === 'IDR')
    .reduce((sum: number, txn: any) => sum + Number(txn.amount || 0), 0);

  const totalRevenueUSD = paidTransactions
    .filter((txn: any) => txn.currency === 'USD')
    .reduce((sum: number, txn: any) => sum + Number(txn.amountUSD || txn.amount || 0), 0);

  const myProducts = useMemo(() => {
    if (!sellerId) return products.slice(0, 6);
    return products.filter((product) => product.seller_id === sellerId || product.seller?.id === sellerId);
  }, [sellerId, products]);

  const growthScore = Math.min(100, 30 + myProducts.length * 12 + paidTransactions.length * 8);
  const serviceCount = myProducts.filter((product) => getProductCategory(product) === 'Services').length;
  const digitalCount = myProducts.filter((product) => getProductCategory(product) === 'Digital Products').length;

  const stats = [
    { label: 'Revenue', value: totalRevenueIDR > 0 ? formatPrice(totalRevenueIDR, 'IDR') : 'Rp 0', sub: `USD tracked: $${totalRevenueUSD}`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Orders', value: sellerTransactions.length.toString(), sub: `${paidTransactions.length} paid/fulfilled`, icon: ShoppingBag, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Listings', value: myProducts.length.toString(), sub: `${digitalCount} digital · ${serviceCount} service`, icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Growth Score', value: `${growthScore}%`, sub: 'marketplace + affiliate + community', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const copyGrowthLink = async (product: Product, type: 'product' | 'affiliate' | 'community') => {
    const base = getBaseUrl();
    const slug = product.slug || slugify(product.title || product.id || 'product');
    const url =
      type === 'affiliate'
        ? `${base}/?view=marketplace&product=${slug}&ref=PARTNER_CODE`
        : type === 'community'
        ? `${base}/?view=community&topic=${slug}`
        : `${base}/?view=marketplace&product=${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(`${product.id}-${type}`);
    setTimeout(() => setCopied(null), 1400);
  };

  const handleSaveProduct = async (modalProduct: Product) => {
    setSavingProduct(true);

    try {
      if (!currentSeller?.id) {
        alert('Seller profile is still loading. Please wait a moment, then try again.');
        return;
      }

      const title = modalProduct.title || 'Untitled Product';
      const productType = modalProduct.product_type || (modalProduct.category === 'Services' ? 'service' : 'digital');
      const payload = {
        seller_id: currentSeller.id,
        title,
        slug: modalProduct.slug || `${slugify(title)}-${Date.now()}`,
        description: modalProduct.description || '',
        product_type: productType,
        price: Number(modalProduct.price || 0),
        currency: modalProduct.currency || 'IDR',
        thumbnail_url: modalProduct.thumbnail_url || modalProduct.image || '',
        file_url: modalProduct.file_url || null,
        external_url: modalProduct.external_url || null,
        inventory_quantity: modalProduct.inventory_quantity ?? null,
        is_published: true,
      };

      const savedProduct = await createNewProduct(payload);
      const normalizedProduct = {
        ...modalProduct,
        ...savedProduct,
        id: savedProduct.id,
        seller_id: savedProduct.seller_id,
        title: savedProduct.title,
        slug: savedProduct.slug,
        description: savedProduct.description,
        product_type: savedProduct.product_type,
        price: Number(savedProduct.price || 0),
        currency: savedProduct.currency || 'IDR',
        thumbnail_url: savedProduct.thumbnail_url,
        image: savedProduct.thumbnail_url || modalProduct.image,
        category: savedProduct.product_type === 'service' ? 'Services' : savedProduct.product_type === 'physical' ? 'Physical Goods' : 'Digital Products',
        sales: 0,
        rating: 4.9,
        seller: {
          id: currentSeller.id,
          username: currentSeller.username,
          display_name: currentSeller.display_name,
          avatar_url: currentSeller.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
          shop_name: currentSeller.shop_name || `${currentSeller.display_name}'s Store`,
          shop_slug: currentSeller.shop_slug || `${currentSeller.username}-store`,
        },
      };

      onAddProduct(normalizedProduct);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to save product to Supabase. Check console or RLS policy.');
    } finally {
      setSavingProduct(false);
    }
  };

  const checklist = [
    { label: 'Publish at least one digital product or service', ready: myProducts.length > 0 },
    { label: 'Share affiliate-ready marketplace link', ready: myProducts.length > 0 },
    { label: 'Post product/service promo inside Community', ready: myProducts.length > 0 },
    { label: 'Review order and manual fulfillment queue', ready: sellerTransactions.length > 0 },
  ];

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-3">
                <Store size={12} /> Seller Growth Cockpit
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white">Welcome back, {currentSeller?.display_name || 'Seller'}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Manage products, services, order review, affiliate promotion, and community growth from one seller workspace.
              </p>
              {!currentSeller && <p className="text-xs text-amber-300 mt-2">Seller profile is being prepared. Product creation unlocks after profile sync.</p>}
            </div>
            <button onClick={() => setShowModal(true)} disabled={!currentSeller} className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-black px-5 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-cyan-500/20">
              <Plus size={16} /> Add Product / Service
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}><Icon size={16} className={stat.color} /></div>
                  <span className="text-xs font-semibold flex items-center gap-0.5 text-emerald-400"><ArrowUpRight size={11} />Live</span>
                </div>
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500 flex items-center justify-between gap-2"><span>{stat.label}</span><span className="text-slate-600 text-right">{stat.sub}</span></div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-black text-white flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Seller Growth Checklist</h2>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  <CheckCircle2 size={15} className={item.ready ? 'text-emerald-300' : 'text-slate-600'} />
                  <p className="text-xs text-slate-300 leading-5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-sm font-black text-white flex items-center gap-2"><Megaphone size={16} className="text-cyan-300" /> Growth Channels</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Marketplace', desc: 'Your product/service listing is the main sales asset.', icon: ShoppingBag },
                { title: 'Affiliate', desc: 'Partners can promote eligible listings with referral links.', icon: Link2 },
                { title: 'Community', desc: 'Use discussions to explain offers, answer questions, and build trust.', icon: MessageSquare },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <Icon size={17} className="text-cyan-300" />
                    <h3 className="mt-3 text-sm font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <span className="text-xs text-slate-500">{sellerTransactions.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Buyer</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Product</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {sellerTransactions.map((txn: any, index) => {
                  const status = getTransactionStatus(txn);
                  const config = statusConfig[status] || statusConfig.pending;
                  const buyerName = getBuyerName(txn);
                  return (
                    <tr key={txn.id || index} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${index === sellerTransactions.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-6 py-3.5"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">{buyerName.split(' ').map((name: string) => name[0]).join('').slice(0, 2)}</div><span className="text-sm text-slate-200 font-medium">{buyerName}</span></div></td>
                      <td className="px-6 py-3.5 hidden sm:table-cell"><span className="text-sm text-slate-400 max-w-[180px] truncate block">{getProductTitle(txn)}</span></td>
                      <td className="px-6 py-3.5"><span className="text-sm font-semibold text-white">{formatPrice(Number(txn.amount || 0), txn.currency || 'IDR')}</span></td>
                      <td className="px-6 py-3.5"><span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.color}`}><Circle size={5} className={`fill-current ${config.dot.replace('bg-', 'text-')}`} />{config.label}</span></td>
                      <td className="px-6 py-3.5 hidden md:table-cell"><span className="text-xs text-slate-500">{getTransactionDate(txn)}</span></td>
                    </tr>
                  );
                })}
                {sellerTransactions.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">No transactions yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Your Products & Growth Assets</h2>
            <span className="text-xs text-slate-500">{myProducts.length} listings</span>
          </div>
          {myProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 border-dashed rounded-2xl">
              <p className="text-sm text-slate-500">No products yet for this seller account.</p>
              <button onClick={() => setShowModal(true)} disabled={!currentSeller} className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">+ Add your first product or service</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map((product) => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
                  <div className="relative h-36 overflow-hidden">
                    <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <span className="absolute top-2 left-2 text-[10px] bg-slate-900/80 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">{getProductCategory(product)}</span>
                    <span className="absolute bottom-2 left-2 text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">Affiliate-ready</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{product.title}</h3>
                    <div className="flex items-center justify-between"><span className="text-base font-bold text-cyan-400">{formatPrice(Number(product.price || 0), product.currency || 'IDR')}</span><span className="text-xs text-slate-500">{product.sales || product.total_sales || 0} sold</span></div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button onClick={() => onBuy(product)} className="inline-flex items-center justify-center gap-1 rounded-xl bg-cyan-500 px-2 py-2 text-[11px] font-black text-slate-950"><ShoppingBag size={12} />Preview</button>
                      <button onClick={() => copyGrowthLink(product, 'product')} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 px-2 py-2 text-[11px] font-bold text-slate-300"><Store size={12} />{copied === `${product.id}-product` ? 'Copied' : 'Store'}</button>
                      <button onClick={() => copyGrowthLink(product, 'affiliate')} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 px-2 py-2 text-[11px] font-bold text-slate-300"><Copy size={12} />{copied === `${product.id}-affiliate` ? 'Copied' : 'Affiliate'}</button>
                      <button onClick={() => copyGrowthLink(product, 'community')} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 px-2 py-2 text-[11px] font-bold text-slate-300"><MessageSquare size={12} />{copied === `${product.id}-community` ? 'Copied' : 'Community'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <AddProductModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveProduct} isSaving={savingProduct} />
    </>
  );
}
