import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
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
import AuthPage from './components/AuthPage';
import { mockProducts, mockTransactions } from './data/mockData';
import { Lock, PowerOff } from 'lucide-react';
import {
  fetchProducts,
  fetchTransactions,
  getCurrentSession,
  signOutUser,
  supabase,
} from './lib/supabaseStub';
import { ensureSellerProfile } from './lib/sellerProfile';
import type { SellerProfile } from './lib/sellerProfile';

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
  | 'kanban'
  | 'auth';

const protectedViews: View[] = ['dashboard', 'invoice', 'kanban'];

function DisabledModuleCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
        <PowerOff size={24} className="text-slate-600" />
      </div>
      <h2 className="text-lg font-bold text-slate-400 mb-2">{name} is Disabled</h2>
      <p className="text-sm text-slate-600 text-center max-w-sm">
        This module is currently turned off. Enable it from the sidebar module toggles to access this feature.
      </p>
    </div>
  );
}

function SellerGate({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-2xl shadow-cyan-950/20">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-4">
          <Lock size={24} className="text-cyan-300" />
        </div>
        <h2 className="text-xl font-bold text-white">Seller workspace locked</h2>
        <p className="mt-2 text-sm text-slate-400 leading-6">
          Marketplace, community, and checkout stay public for buyers. Login is required only for seller operations.
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="mt-5 inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          Login / Register Seller
        </button>
      </div>
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
      id: row.users?.id || row.seller?.id || row.seller_id,
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
  const [activeView, setActiveView] = useState<View>('marketplace');
  const [previousPublicView, setPreviousPublicView] = useState<View>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [currentSeller, setCurrentSeller] = useState<SellerProfile | null>(null);

  const [modules, setModules] = useState({
    marketplace: true,
    community: true,
    kanban: true,
    invoice: true,
    aiSupport: true,
  });

  const isAuthenticated = Boolean(session);

  useEffect(() => {
    const loadSession = async () => {
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      const seller = await ensureSellerProfile(currentSession);
      setCurrentSeller(seller);
    };

    loadSession();

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      const seller = await ensureSellerProfile(nextSession);
      setCurrentSeller(seller);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

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
      } catch (error) {
        console.error('[OmniHub] Failed to load Supabase data:', error);
        setSelectedProduct(mockProducts[0]);
      } finally {
        setIsLoadingSupabase(false);
      }
    };

    loadSupabaseData();
  }, []);

  useEffect(() => {
    if (!protectedViews.includes(activeView)) {
      setPreviousPublicView(activeView);
    }
  }, [activeView]);

  const openAuth = () => {
    if (!protectedViews.includes(activeView)) {
      setPreviousPublicView(activeView);
    }
    setActiveView('auth');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setSession(null);
    setCurrentSeller(null);
    setActiveView('marketplace');
  };

  const handleAuthSuccess = async () => {
    const currentSession = await getCurrentSession();
    setSession(currentSession);
    const seller = await ensureSellerProfile(currentSession);
    setCurrentSeller(seller);
    setActiveView('dashboard');
  };

  const handleSetActiveView = (view: View) => {
    if (protectedViews.includes(view) && !isAuthenticated) {
      openAuth();
      return;
    }
    setActiveView(view);
  };

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
      case 'auth':
        return (
          <AuthPage
            onBack={() => setActiveView(previousPublicView || 'marketplace')}
            onSuccess={handleAuthSuccess}
          />
        );
      case 'profile':
        return <ProfileView products={products} onBuy={handleBuy} />;
      case 'dashboard':
        return isAuthenticated ? (
          <MerchantDashboard
            products={products}
            transactions={transactions}
            currentSeller={currentSeller}
            onAddProduct={handleAddProduct}
            onBuy={handleBuy}
          />
        ) : (
          <SellerGate onLogin={openAuth} />
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
        return modules.community ? <CommunityForum /> : <DisabledModuleCard name="Community" />;
      case 'invoice':
        return isAuthenticated ? (
          modules.invoice ? <InvoiceSheet /> : <DisabledModuleCard name="Invoice" />
        ) : (
          <SellerGate onLogin={openAuth} />
        );
      case 'kanban':
        return isAuthenticated ? (
          modules.kanban ? <KanbanBoard /> : <DisabledModuleCard name="Kanban" />
        ) : (
          <SellerGate onLogin={openAuth} />
        );
      default:
        return <MarketplaceView products={products} onBuy={handleBuy} />;
    }
  };

  return (
    <>
      <AppShell
        activeView={activeView}
        setActiveView={(view) => handleSetActiveView(view as View)}
        modules={modules}
        toggleModule={handleToggleModule}
        isAuthenticated={isAuthenticated}
        onSignInClick={openAuth}
        onSignOut={handleSignOut}
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
