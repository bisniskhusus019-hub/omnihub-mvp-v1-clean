import { useMemo, useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  MousePointer,
  BarChart3,
  Plus,
  ArrowUpRight,
  Circle,
} from 'lucide-react';
import { mockStats, mockProducts } from '../data/mockData';
import AddProductModal from './AddProductModal';
import { createNewProduct } from '../lib/supabaseStub';
import type { Transaction } from '../App';

type Product = any;

interface MerchantDashboardProps {
  products: Product[];
  transactions: Transaction[];
  onAddProduct: (product: Product) => void;
  onBuy: (product: Product) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  completed: {
    label: 'Completed',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  paid: {
    label: 'Paid',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  fulfilled: {
    label: 'Fulfilled',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  pending: {
    label: 'Pending',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  created: {
    label: 'Created',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  refunded: {
    label: 'Refunded',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-400',
  },
  failed: {
    label: 'Failed',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-400',
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getProductImage(product: Product) {
  return (
    product.thumbnail_url ||
    product.image ||
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900'
  );
}

function getProductCategory(product: Product) {
  return product.category || product.product_type || 'Digital Product';
}

function getTransactionStatus(txn: any) {
  return (
    txn.status ||
    txn.payment_status ||
    txn.order_status ||
    'pending'
  ).toLowerCase();
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

export default function MerchantDashboard({
  products,
  transactions,
  onAddProduct,
}: MerchantDashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const sellerId = useMemo(() => {
    return (
      products.find((p) => p.seller_id)?.seller_id ||
      products.find((p) => p.seller?.id)?.seller?.id ||
      null
    );
  }, [products]);

  const paidTransactions = transactions.filter((txn: any) => {
    const status = getTransactionStatus(txn);
    return status === 'paid' || status === 'completed' || status === 'fulfilled';
  });

  const totalRevenueIDR = paidTransactions
    .filter((txn: any) => (txn.currency || 'IDR') === 'IDR')
    .reduce((sum: number, txn: any) => sum + Number(txn.amount || 0), 0);

  const totalRevenueUSD = paidTransactions
    .filter((txn: any) => txn.currency === 'USD')
    .reduce((sum: number, txn: any) => sum + Number(txn.amountUSD || txn.amount || 0), 0);

  const stats = [
    {
      label: 'Total Revenue',
      value:
        totalRevenueIDR > 0
          ? `Rp ${totalRevenueIDR.toLocaleString('id-ID')}`
          : `Rp ${(mockStats.totalRevenue / 1000).toFixed(0)}K`,
      sub: `≈ $${totalRevenueUSD || mockStats.totalRevenueUSD}`,
      icon: TrendingUp,
      change: '+18.4%',
      positive: true,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Total Sales',
      value: paidTransactions.length > 0
        ? paidTransactions.length.toString()
        : mockStats.totalSales.toString(),
      sub: 'all time',
      icon: ShoppingBag,
      change: '+12.1%',
      positive: true,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Active Link Clicks',
      value: mockStats.activeLinkClicks.toLocaleString(),
      sub: 'last 30 days',
      icon: MousePointer,
      change: '+5.7%',
      positive: true,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Conversion Rate',
      value: `${mockStats.conversionRate}%`,
      sub: 'click → purchase',
      icon: BarChart3,
      change: '-0.3%',
      positive: false,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  const myProducts = products.filter((product) => {
    if (sellerId && product.seller_id) return product.seller_id === sellerId;
    if (product.seller?.id) return product.seller.id === 'user_001';
    return true;
  });

  const handleSaveProduct = async (modalProduct: Product) => {
    setSavingProduct(true);

    try {
      if (!sellerId) {
        alert('Seller ID not found. Make sure at least one product from this seller exists in Supabase.');
        setSavingProduct(false);
        return;
      }

      const title = modalProduct.title || 'Untitled Product';
      const productType =
        modalProduct.product_type ||
        (modalProduct.category === 'Services' ? 'service' : 'digital');

      const payload = {
        seller_id: sellerId,
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
        category:
          savedProduct.product_type === 'service'
            ? 'Services'
            : savedProduct.product_type === 'physical'
            ? 'Physical Goods'
            : 'Digital Products',
        sales: 0,
        rating: 4.9,
        seller: modalProduct.seller || {
          id: sellerId,
          username: 'rangga.ai',
          display_name: 'Rangga Adhitya',
          avatar_url:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
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

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Merchant Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Welcome back, Rangga. Here's your overview.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            <Plus size={15} />
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}
                  >
                    <Icon size={16} className={stat.color} />
                  </div>

                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${
                      stat.positive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <ArrowUpRight
                      size={11}
                      className={stat.positive ? '' : 'rotate-90'}
                    />
                    {stat.change}
                  </span>
                </div>

                <div className="text-2xl font-bold text-white mb-0.5">
                  {stat.value}
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>{stat.label}</span>
                  <span className="text-slate-600">{stat.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <span className="text-xs text-slate-500">
              {transactions.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Buyer
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">
                    Product
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn: any, index) => {
                  const status = getTransactionStatus(txn);
                  const config = statusConfig[status] || statusConfig.pending;
                  const buyerName = getBuyerName(txn);

                  return (
                    <tr
                      key={txn.id}
                      className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                        index === transactions.length - 1 ? 'border-0' : ''
                      }`}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">
                            {buyerName
                              .split(' ')
                              .map((name: string) => name[0])
                              .join('')
                              .slice(0, 2)}
                          </div>

                          <span className="text-sm text-slate-200 font-medium">
                            {buyerName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-slate-400 max-w-[180px] truncate block">
                          {getProductTitle(txn)}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="text-sm font-semibold text-white">
                          {(txn.currency || 'IDR') === 'IDR'
                            ? `Rp ${Number(txn.amount || 0).toLocaleString('id-ID')}`
                            : `$${Number(txn.amountUSD || txn.amount || 0).toFixed(2)}`}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.color}`}
                        >
                          <Circle
                            size={5}
                            className={`fill-current ${config.dot.replace(
                              'bg-',
                              'text-'
                            )}`}
                          />
                          {config.label}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500">
                          {getTransactionDate(txn)}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      No transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Your Products</h2>
            <span className="text-xs text-slate-500">
              {myProducts.length} products
            </span>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 border-dashed rounded-2xl">
              <p className="text-sm text-slate-500">No products yet.</p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                + Add your first product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />

                    <span className="absolute top-2 left-2 text-[10px] bg-slate-900/80 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                      {getProductCategory(product)}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-cyan-400">
                        {(product.currency || 'IDR') === 'IDR'
                          ? `Rp ${Number(product.price || 0).toLocaleString('id-ID')}`
                          : `$${Number(product.price || 0).toFixed(2)}`}
                      </span>

                      <span className="text-xs text-slate-500">
                        {product.sales || product.total_sales || 0} sold
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddProductModal
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
          saving={savingProduct}
        />
      )}
    </>
  );
}