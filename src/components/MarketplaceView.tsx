import { useState } from 'react';
import { Search, Star, ShoppingCart, Store, Filter, Package, Briefcase, Tag } from 'lucide-react';
import { mockProducts } from '../data/mockData';

const categories = ['All', 'Digital Products', 'Services', 'Physical Goods'];

const categoryIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  All: Filter,
  'Digital Products': Package,
  Services: Briefcase,
  'Physical Goods': Tag,
};

type Product = typeof mockProducts[0];

interface MarketplaceViewProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

export default function MarketplaceView({ products, onBuy }: MarketplaceViewProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Marketplace</h1>
        <p className="text-sm text-slate-400">Discover digital products, services, and goods from verified creators.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products, services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${activeCategory === cat
                    ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }
                `}
              >
                <Icon size={13} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500 mb-4">
        Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of {products.length} products
      </p>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-slate-600 text-5xl mb-4">¯\_(ツ)_/¯</div>
          <p className="text-slate-400 text-sm">No products found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-2 py-1 rounded-lg border border-cyan-500/20 font-semibold">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  Rp {(product.price / 1000).toFixed(0)}K
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                {/* Title + description */}
                <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-2 leading-snug">{product.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 flex-1">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
                    />
                  ))}
                  <span className="text-[10px] text-slate-500 ml-0.5">{product.rating} ({product.sales} sold)</span>
                </div>

                {/* Seller */}
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-slate-300 truncate">{product.seller.name}</p>
                    <p className="text-[10px] text-slate-500">@{product.seller.username}</p>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                    <Store size={10} />
                    Store
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-bold text-cyan-400">Rp {product.price.toLocaleString('id-ID')}</div>
                    <div className="text-[10px] text-slate-500">≈ ${product.priceUSD}</div>
                  </div>
                  <button
                    onClick={() => onBuy(product)}
                    className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <ShoppingCart size={12} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
