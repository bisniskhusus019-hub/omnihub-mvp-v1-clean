import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import ProfileView from './components/ProfileView';
import MerchantDashboard from './components/MerchantDashboard';
import MarketplaceView from './components/MarketplaceView';
import CheckoutGateway from './components/CheckoutGateway';
import FulfillmentGateway from './components/FulfillmentGateway';
import InvoiceSheet from './components/InvoiceSheet';
import CommunityForum from './components/CommunityForum';
import KanbanBoard from './components/KanbanBoard';
import AISupportWidget from './components/AISupportWidget';
import { mockProducts, mockTransactions } from './data/mockData';
import { PowerOff } from 'lucide-react';
import { fetchProducts, fetchTransactions } from './lib/supabaseStub';

type Product = any;
export type Transaction = any;

type View =
  | 'profile'
  | 'dashboard'
  | 'marketplace'
  | 'checkout'
  | 'community'
  | 'fulfillment'
  | 'invoice'
  | 'kanban';

function DisabledModuleCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
        <PowerOff size={24} className="text-slate-600" />
      </div>
      <h2 className="text-lg font-bold text-slate-400 mb-2">
        {name} is Disabled
      </h2>
      <p className="text-sm text-slate-600 text-center max-w-sm">
        This module is currently turned off. Enable it from the sidebar module toggles to access this feature.
      </p>
    </div>
  );
}

function normalizeProduct(row: any): Product {
  return {
    ...row,
    id: row.id,
    seller_id: row.seller_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    product_type: row.product_type || 'digital',
    price: Number(row.price || 0),
    currency: row.currency || 'IDR',
    thumbnail_url: row.thumbnail_url,
    file_url: row.file_url,
    external_url: row.external_url,
    inventory_quantity: row.inventory_quantity,
    is_published: row.is_published,
    total_sales: row.total_sales || 0,
    view_count: row.view_count || 0,

    seller: {
      username: row.users?.username || row.seller?.username || 'seller',
      display_name: row.users?.display_name || row.seller?.display_name || 'OmniHub Seller',
      avatar_url:
        row.users?.avatar_url ||
        row.seller?.avatar_url ||
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      shop_name: row.users?.shop_name || 'OmniHub Store',
      shop_slug: row.users?.shop_slug || 'omnihub-store',
    },

    category:
      row.product_type === 'service'
        ? 'Services'
        : row.product_type === 'physical'
        ? 'Physical Goods'
        : 'Digital Products',

    rating: 4.9,
    sales: row.total_sales || 0,
    file_size: row.file_size || 'Digital Delivery',
  };
}

function normalizeTransaction(row: any): Transaction {
  return {
    ...row,
    id: row.id,
    buyer_name: row.buyer_name || 'Guest Buyer',
    buyer_email: row.buyer_email,
    product_title: row.product_title || row.products?.title || 'OmniHub Product',
    amount: Number(row.amount || 0),
    currency: row.currency || 'IDR',
    payment_method: row.payment_method || 'manual',
    payment_status: row.payment_status || 'pending',
    order_status: row.order_status || 'created',
    download_token: row.download_token,
    created_at: row.created_at,
  };
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('profile');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);

  const [modules, setModules] = useState({
    marketplace: true,
    community: true,
    kanban: true,
    invoice: true,
    aiSupport: true,
  });

  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const [supabaseProducts, supabaseTransactions] = await Promise.all([
          fetchProducts(),
          fetchTransactions(),
        ]);

        if (supabaseProducts && supabaseProducts.length > 0) {
          setProducts(supabaseProducts.map(normalizeProduct));
          setSelectedProduct(normalizeProduct(supabaseProducts[0]));
        } else {
          setSelectedProduct(mockProducts[0]);
        }

        if (supabaseTransactions && supabaseTransactions.length > 0) {
          setTransactions(supabaseTransactions.map(normalizeTransaction));
        }

        console.log('[OmniHub] Supabase data loaded successfully');
      } catch (error) {
        console.error('[OmniHub] Failed to load Supabase data:', error);
        setSelectedProduct(mockProducts[0]);
      } finally {
        setIsLoadingSupabase(false);
      }
    };

    loadSupabaseData();
  }, []);

  const handleToggleModule = (key: string) => {
    setModules((prev) => ({
      ...prev,
      [key]: !(prev as Record<string, boolean>)[key],
    }));
  };

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('checkout');
  };

  const handleCheckoutComplete = (txn: Transaction) => {
    const normalizedTxn = normalizeTransaction({
      ...txn,
      product_title: txn.product_title || selectedProduct?.title,
      product_id: txn.product_id || selectedProduct?.id,
      seller_id: txn.seller_id || selectedProduct?.seller_id,
      amount: txn.amount || selectedProduct?.price,
      currency: txn.currency || selectedProduct?.currency,
      payment_status: txn.payment_status || 'paid',
      order_status: txn.order_status || 'fulfilled',
    });

    setTransactions((prev) => [normalizedTxn, ...prev]);
    setCompletedTransaction(normalizedTxn);
    setActiveView('fulfillment');
  };

  const renderView = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileView products={products} onBuy={handleBuy} />;

      case 'dashboard':
        return (
          <MerchantDashboard
            products={products}
            transactions={transactions}
            onAddProduct={handleAddProduct}
            onBuy={handleBuy}
          />
        );

      case 'marketplace':
        return modules.marketplace ? (
          <MarketplaceView products={products} onBuy={handleBuy} />
        ) : (
          <DisabledModuleCard name="Marketplace" />
        );

      case 'checkout':
        return (
          <CheckoutGateway
            product={selectedProduct || products[0] || mockProducts[0]}
            onComplete={handleCheckoutComplete}
          />
        );

      case 'fulfillment':
        return (
          <FulfillmentGateway
            product={selectedProduct || products[0] || mockProducts[0]}
            transaction={completedTransaction}
          />
        );

      case 'community':
        return modules.community ? (
          <CommunityForum />
        ) : (
          <DisabledModuleCard name="Community" />
        );

      case 'invoice':
        return modules.invoice ? (
          <InvoiceSheet />
        ) : (
          <DisabledModuleCard name="Invoice" />
        );

      case 'kanban':
        return modules.kanban ? (
          <KanbanBoard />
        ) : (
          <DisabledModuleCard name="Kanban" />
        );

      default:
        return <ProfileView products={products} onBuy={handleBuy} />;
    }
  };

  return (
    <>
      <AppShell
        activeView={activeView}
        setActiveView={(v) => setActiveView(v as View)}
        modules={modules}
        toggleModule={handleToggleModule}
      >
        {isLoadingSupabase ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-cyan-300">
              Loading OmniHub data...
            </div>
          </div>
        ) : (
          renderView()
        )}
      </AppShell>

      <AISupportWidget enabled={modules.aiSupport} />
    </>
  );
}