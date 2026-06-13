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

function getProductImage(product: Product) {
  return (
    product.thumbnail_url ||
    product.image ||
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900'
  );
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
  return (
    product.seller?.name ||
    product.seller?.display_name ||
    product.users?.display_name ||
    'OmniHub Seller'
  );
}

function getSellerUsername(product: Product) {
  return product.seller?.username || product.users?.username || 'seller';
}

function getSellerAvatar(product: Product) {
  return (
    product.seller?.avatar ||
    product.seller?.avatar_url ||
    product.users?.avatar_url ||
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
  );
}

export default function MarketplaceView({ products, onBuy }: MarketplaceViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [language, setLanguage] = useState(() => loadGlobalPreference('omnihub_language', DEFAULT_LANGUAGE));
  const [currency, setCurrency] = useState(() => loadGlobalPreference('omnihub_currency', DEFAULT_CURRENCY));

  const filtered = products.filter((product) => {
    const category = getProductCategory(product);
    const title = product.title || '';
    const description = product.description || '';
    const matchCat = activeCategory === 'All' || category === activeCategory;
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{translate(language, 'marketplace')}</h1>
          <p className="text-sm text-slate-400">
            {translate(language, 'discover')}
          </p>
          <p className="mt-2 text-[11px] text-emerald-400 font-semibold">
            {translate(language, 'globalReady')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          <label className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
              <Globe2 size={11} /> Language
            </div>
            <select
              value={language}
              onChange={(event) => updateLanguage(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
            >
              {supportedLanguages.map((item) => (
                <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">
                  {item.nativeLabel}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
              <Coins size={11} /> Currency
            </div>
            <select
              value={currency}
              onChange={(event) => updateCurrency(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 focus:outline-none"
            >
              {supportedCurrencies.map((item) => (
                <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">
                  {item.code} — {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={translate(language, 'search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = categoryIcons[category];

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${
                    activeCategory === category
                      ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }
                `}
              >
                <Icon size={13} />
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        {translate(language, 'showing')} <span className="text-slate-300 font-medium">{filtered.length}</span> of {products.length} {translate(language, 'products')}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-slate-600 text-5xl mb-4">¯\_(ツ)_/¯</div>
          <p className="text-slate-400 text-sm">No products found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const category = getProductCategory(product);
            const price = getProductPrice(product);
            const sourceCurrency = getProductCurrency(product);
            const convertedPrice = convertMoney(price, sourceCurrency, currency);
            const formattedSourcePrice = formatMoney(price, sourceCurrency);
            const formattedConvertedPrice = formatMoney(convertedPrice, currency);
            const rating = Number(product.rating || 4.9);
            const sold = Number(product.sales || product.total_sales || 0);

            return (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-2 py-1 rounded-lg border border-cyan-500/20 font-semibold">
                    {category}
                  </span>
                  <span className="absolute top-3 right-3 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    {formattedConvertedPrice}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1">
                    {product.description || 'Premium OmniHub marketplace listing.'}
                  </p>

                  <div className="flex items-center gap-1.5 mb-3">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={10}
                        className={index < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
                      />
                    ))}
                    <span className="text-[10px] text-slate-500 ml-0.5">
                      {rating} ({sold} sold)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                    <img
                      src={getSellerAvatar(product)}
                      alt={getSellerName(product)}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-slate-300 truncate">
                        {getSellerName(product)}
                      </p>
                      <p className="text-[10px] text-slate-500">@{getSellerUsername(product)}</p>
                    </div>
                    <button className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                      <Store size={10} />
                      Store
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-cyan-400">
                        {formattedConvertedPrice}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Base: {formattedSourcePrice}
                      </div>
                    </div>
                    <button
                      onClick={() => onBuy(product)}
                      className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <ShoppingCart size={12} />
                      {translate(language, 'buyNow')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
