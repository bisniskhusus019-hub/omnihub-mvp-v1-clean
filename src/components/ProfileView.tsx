import { Twitter, Linkedin, Instagram, Youtube, Download, Calendar, MessageCircle, Play, MapPin, Globe, ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { mockUser, mockSocials, mockLinks, mockProducts } from '../data/mockData';

type Product = typeof mockProducts[0];

interface ProfileViewProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

const socialIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

const linkIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  download: Download,
  calendar: Calendar,
  'message-circle': MessageCircle,
  play: Play,
};

export default function ProfileView({ products, onBuy }: ProfileViewProps) {
  const featuredProducts = products.filter(p => p.seller.id === 'user_001');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden mb-0 h-40 sm:h-52">
        <img src={mockUser.cover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      {/* Avatar + info */}
      <div className="relative px-4 pb-6">
        <div className="flex items-end gap-4 -mt-12 mb-4">
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            className="w-24 h-24 rounded-2xl border-4 border-slate-950 object-cover shadow-xl flex-shrink-0"
          />
          <div className="mb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{mockUser.name}</h1>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium">
                Creator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">@{mockUser.username}</p>
          </div>
        </div>

        {/* Headline */}
        <p className="text-sm font-medium text-cyan-300 mb-2">{mockUser.headline}</p>

        {/* Bio */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{mockUser.bio}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-5">
          <span className="flex items-center gap-1"><MapPin size={11} />{mockUser.location}</span>
          <span className="flex items-center gap-1"><Globe size={11} />{mockUser.website}</span>
        </div>

        {/* Social buttons */}
        <div className="flex gap-2 flex-wrap mb-6">
          {mockSocials.map(social => {
            const Icon = socialIcons[social.icon];
            return (
              <a
                key={social.id}
                href={social.url}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-xs text-slate-300 hover:text-white transition-all"
              >
                {Icon && <Icon size={12} />}
                <span className="hidden sm:inline">{social.handle}</span>
                <span className="sm:hidden">{social.platform.split('/')[0]}</span>
              </a>
            );
          })}
        </div>

        {/* Link buttons */}
        <div className="space-y-2.5 mb-8">
          {mockLinks.map(link => {
            const Icon = linkIcons[link.icon];
            return (
              <a
                key={link.id}
                href={link.url}
                className="flex items-center gap-3 w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/40 rounded-xl text-sm text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  {Icon && <Icon size={13} className="text-cyan-400" />}
                </div>
                <span className="flex-1 font-medium">{link.label}</span>
                <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Featured products */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5 group"
              >
                <div className="relative h-32 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute top-2 left-2 text-[10px] bg-slate-900/80 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-white mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-slate-400">{product.rating} ({product.sales} sold)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">Rp {product.price.toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => onBuy(product)}
                      className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <ShoppingCart size={10} />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
