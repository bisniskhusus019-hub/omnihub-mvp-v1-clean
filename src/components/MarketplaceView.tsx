import { useState } from 'react';
import type { ComponentType } from 'react';
import {
  Search,
  Star,
  ShoppingCart,
  Store,
  Filter,
  Package,
  Briefcase,
  Tag,
  Globe2,
  Coins,
  Heart,
  MessageSquare,
  Megaphone,
  Link2,
  ShieldCheck,
  Flag,
  CheckCircle2,
} from 'lucide-react';
import { mockProducts } from '../data/mockData';
import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  convertMoney,
  formatMoney,
  loadGlobalPreference,
  saveGlobalPreference,
  supportedCurrencies,
  supportedLanguages,
  translate,
} from '../lib/globalization';

const categories = ['All', 'Digital Products', 'Services', 'Physical Goods'];

const categoryIcons: Record<string, ComponentType<{ size: number; className?: string }>> = {
  All: Filter,
  'Digital Products': Package,
  Services: Briefcase,
  'Physical Goods': Tag,
};

type Product = typeof mockProducts[0] | any;

interface MarketplaceViewProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

function getBaseUrl() {
  if (typeof window === 'undefined') return 'https://omnihub-mvp-v1-clean.vercel.app';
  return window.location.origin;
}

function getProductImage(product: Product) {
  return product.thumbnail_url || product.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900';
}

function getProductCategory(product: Product) {
  return product.category || product.product_type || 'Digital Products';
}

function getProductPrice(product: Product) {
  return Number(product.price || 0);
}

function getProductCurrency(product: Product) {
  return product.currency || 'IDR';
}

function getSellerName(product: Product) {
  return product.seller?.name || product.seller?.display_name || product.users?.display_name || 'OmniHub Seller';
}

function getSellerUsername(product: Product) {
  return product.seller?.username || product.users?.username || 'seller';
}

function getSellerAvatar(product: Product) {
  return product.seller?.avatar || product.seller?.avatar_url || product.users?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300';
}

function getProductSlug(product: Product) {
  return product.slug || String(product.title || product.id || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function MarketplaceView({ products, onBuy }: MarketplaceViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [language, setLanguage] = useState(() => loadGlobalPreference('omnihub_language', DEFAULT_LANGUAGE));
  const [currency, setCurrency] = useState(() => loadGlobalPreference('omnihub_currency', DEFAULT_CURRENCY));
  const [copied, setCopied] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [reportedIds, setReportedIds] = useState<string[]>([]);

  const filtered = products.filter((product) => {
    const category = getProductCategory(product);
    const title = product.title || '';
    const description = product.description || '';
    const sellerName = getSellerName(product);
    const matchCat = activeCategory === 'All' || category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = title.toLowerCase().includes(q) || description.toLowerCase().includes(q) || sellerName.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const updateLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    saveGlobalPreference('omnihub_language', nextLanguage);
  };

  const updateCurrency = (nextCurrency: string) => {
    setCurrency(nextCurrency);
    saveGlobalPreference('omnihub_currency', nextCurrency);
  };

  const copyLink = async (product: Product, type: 'product' | 'affiliate' | 'community') => {
    const base = getBaseUrl();
    const slug = getProductSlug(product);
    const url = type === 'affiliate' ? `${base}/?view=marketplace&product=${slug}&ref=PARTNER_CODE` : type === 'community' ? `${base}/?view=community&topic=${slug}` : `${base}/?view=marketplace&product=${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(`${product.id}-${type}`);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleList = (id: string, list: string[], setter: (next: string[]) => void) => {
    setter(list.includes(id) ? list.filter((item) => item !== id) : [id, ...list]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-cyan-300 mb-3">
              <Megaphone size={12} /> Multi-purpose Marketplace
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">{translate(language, 'marketplace')}</h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-6">Discover digital products, seller services, storefronts, affiliate-ready offers, saved offers, reviews, and community-promotable listings in one growth network.</p>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-2 max-w-4xl">
              {['Buy products', 'Hire services', 'Save offers', 'Review trust', 'Discuss in community'].map((item) => <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] font-bold text-slate-300">{item}</div>)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <label className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1"><Globe2 size={11} /> Language</div><select value={language} onChange={(event) => updateLanguage(event.target.value)} className="w-full bg-transparent text-sm text-slate-200 focus:outline-none">{supportedLanguages.map((item) => <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">{item.nativeLabel}</option>)}</select></label>
            <label className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1"><Coins size={11} /> Currency</div><select value={currency} onChange={(event) => updateCurrency(event.target.value)} className="w-full bg-transparent text-sm text-slate-200 focus:outline-none">{supportedCurrencies.map((item) => <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">{item.code} — {item.label}</option>)}</select></label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Saved offers</p><p className="mt-1 text-2xl font-black text-white">{savedIds.length}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Review intents</p><p className="mt-1 text-2xl font-black text-white">{reviewedIds.length}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Trust reports</p><p className="mt-1 text-2xl font-black text-white">{reportedIds.length}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified sellers</p><p className="mt-1 text-2xl font-black text-white">{Math.min(products.length, 12)}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Search products, services, sellers, templates, offers..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all" /></div>
        <div className="flex gap-2 flex-wrap">{categories.map((category) => { const Icon = categoryIcons[category]; return <button key={category} onClick={() => setActiveCategory(category)} className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'}`}><Icon size={13} />{category}</button>; })}</div>
      </div>

      <p className="text-xs text-slate-500 mb-4">{translate(language, 'showing')} <span className="text-slate-300 font-medium">{filtered.length}</span> of {products.length} {translate(language, 'products')}</p>

      {filtered.length === 0 ? <div className="text-center py-16"><div className="text-slate-600 text-5xl mb-4">¯\_(ツ)_/¯</div><p className="text-slate-400 text-sm">No products found. Try a different search.</p></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const id = String(product.id);
            const category = getProductCategory(product);
            const price = getProductPrice(product);
            const sourceCurrency = getProductCurrency(product);
            const convertedPrice = convertMoney(price, sourceCurrency, currency);
            const formattedSourcePrice = formatMoney(price, sourceCurrency);
            const formattedConvertedPrice = formatMoney(convertedPrice, currency);
            const rating = Number(product.rating || 4.9);
            const sold = Number(product.sales || product.total_sales || 0);
            const eligible = category === 'Digital Products' || category === 'Services' || product.product_type === 'digital' || product.product_type === 'service';
            const isSaved = savedIds.includes(id);
            const isReviewed = reviewedIds.includes(id);
            const isReported = reportedIds.includes(id);
            return (
              <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group flex flex-col">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-2 py-1 rounded-lg border border-cyan-500/20 font-semibold">{category}</span>
                  <span className="absolute top-3 right-3 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg">{formattedConvertedPrice}</span>
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">{eligible && <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 backdrop-blur-sm text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold"><Megaphone size={10} />Affiliate-ready</span>}<span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/15 backdrop-blur-sm text-blue-300 px-2 py-1 rounded-lg border border-blue-500/20 font-bold"><ShieldCheck size={10} />Verified</span></div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-2 mb-1.5"><h3 className="text-sm font-bold text-white line-clamp-2 leading-snug flex-1">{product.title}</h3><button onClick={() => toggleList(id, savedIds, setSavedIds)} className={`rounded-lg border px-2 py-1 ${isSaved ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-slate-700 text-slate-400'}`}><Heart size={13} className={isSaved ? 'fill-current' : ''} /></button></div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1">{product.description || 'Premium OmniHub marketplace listing.'}</p>
                  <div className="flex items-center gap-1.5 mb-3">{[...Array(5)].map((_, index) => <Star key={index} size={10} className={index < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />)}<span className="text-[10px] text-slate-500 ml-0.5">{rating} ({sold} sold)</span></div>
                  <div className="grid grid-cols-3 gap-2 mb-3"><div className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-[10px] text-slate-400"><CheckCircle2 size={12} className="text-emerald-300 mb-1" />Seller checked</div><div className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-[10px] text-slate-400"><ShieldCheck size={12} className="text-blue-300 mb-1" />Trust layer</div><div className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-[10px] text-slate-400"><Star size={12} className="text-amber-300 mb-1" />Review-ready</div></div>
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800"><img src={getSellerAvatar(product)} alt={getSellerName(product)} className="w-6 h-6 rounded-full object-cover border border-slate-700" /><div className="flex-1 min-w-0"><p className="text-[11px] font-medium text-slate-300 truncate">{getSellerName(product)}</p><p className="text-[10px] text-slate-500">@{getSellerUsername(product)}</p></div><button onClick={() => copyLink(product, 'product')} className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"><Store size={10} />Store</button></div>
                  <div className="grid grid-cols-2 gap-2 mb-3"><button onClick={() => copyLink(product, 'affiliate')} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-[11px] font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40"><Link2 size={12} />{copied === `${product.id}-affiliate` ? 'Copied' : 'Affiliate link'}</button><button onClick={() => copyLink(product, 'community')} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950 px-2 py-2 text-[11px] font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40"><MessageSquare size={12} />{copied === `${product.id}-community` ? 'Copied' : 'Discuss'}</button></div>
                  <div className="grid grid-cols-2 gap-2 mb-3"><button onClick={() => toggleList(id, reviewedIds, setReviewedIds)} className={`inline-flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-bold ${isReviewed ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-700 bg-slate-950 text-slate-300'}`}><Star size={12} />{isReviewed ? 'Review queued' : 'Review'}</button><button onClick={() => toggleList(id, reportedIds, setReportedIds)} className={`inline-flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-bold ${isReported ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-slate-700 bg-slate-950 text-slate-300'}`}><Flag size={12} />{isReported ? 'Reported' : 'Report'}</button></div>
                  <div className="flex items-center justify-between gap-2"><div><div className="text-base font-bold text-cyan-400">{formattedConvertedPrice}</div><div className="text-[10px] text-slate-500">Base: {formattedSourcePrice}</div></div><button onClick={() => onBuy(product)} className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"><ShoppingCart size={12} />{translate(language, 'buyNow')}</button></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
