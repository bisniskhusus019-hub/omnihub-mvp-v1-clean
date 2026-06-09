import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import {
  X,
  Image,
  Package,
  Briefcase,
  Tag,
  DollarSign,
  FileText,
  AlignLeft,
  Link,
} from 'lucide-react';
import { mockProducts, mockUser } from '../data/mockData';

type Product = typeof mockProducts[0] | any;
type ProductCategory = 'Digital Products' | 'Services' | 'Physical Goods';
type Currency = 'IDR' | 'USD';

interface AddProductModalProps {
  onSave: (product: Product) => void | Promise<void>;
  onClose: () => void;
  saving?: boolean;
}

const categoryOptions: {
  value: ProductCategory;
  icon: ComponentType<{ size: number; className?: string }>;
  label: string;
  desc: string;
}[] = [
  { value: 'Digital Products', icon: Package, label: 'Digital', desc: 'eBook, template, course' },
  { value: 'Services', icon: Briefcase, label: 'Service', desc: 'Consulting, design, freelance' },
  { value: 'Physical Goods', icon: Tag, label: 'Physical', desc: 'Handmade, merchandise' },
];

const IDR_RATE = 15600;
const fallbackImage = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function AddProductModal({ onSave, onClose, saving = false }: AddProductModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'IDR' as Currency,
    category: 'Digital Products' as ProductCategory,
    thumbnailUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localSaving, setLocalSaving] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isBusy = saving || localSaving;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, isBusy]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const set = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Product title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errs.price = 'Enter a valid price greater than 0.';
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0 || isBusy) {
      setErrors(errs);
      return;
    }

    const numPrice = Number(form.price);
    const price = form.currency === 'IDR' ? numPrice : Math.round(numPrice * IDR_RATE);
    const priceUSD = form.currency === 'USD' ? numPrice : Math.round(numPrice / IDR_RATE);

    const newProduct: Product = {
      id: 'prod_' + Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      price,
      priceUSD,
      category: form.category,
      product_type:
        form.category === 'Services'
          ? 'service'
          : form.category === 'Physical Goods'
          ? 'physical'
          : 'digital',
      currency: 'IDR',
      thumbnail_url: form.thumbnailUrl.trim() || fallbackImage,
      image: form.thumbnailUrl.trim() || fallbackImage,
      fileType: form.category === 'Digital Products' ? 'Digital File' : null,
      fileSize: null,
      seller: {
        id: mockUser.id,
        name: mockUser.name,
        username: mockUser.username,
        avatar: mockUser.avatar,
      },
      sales: 0,
      rating: 5.0,
    };

    try {
      setLocalSaving(true);
      await onSave(newProduct);
    } catch (error) {
      console.error('Add product save failed:', error);
      setErrors((current) => ({
        ...current,
        form: 'Product could not be saved. Check Supabase policy or try again.',
      }));
    } finally {
      setLocalSaving(false);
    }
  };

  const previewImage = form.thumbnailUrl.trim() || fallbackImage;

  return (
    <div
      ref={overlayRef}
      onClick={(event) => {
        if (event.target === overlayRef.current && !isBusy) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Add New Product</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to list your product</p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errors.form && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Product Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map(({ value, icon: Icon, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('category', value)}
                  className={`
                    flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-center transition-all
                    ${
                      form.category === value
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                    }
                  `}
                >
                  <Icon size={16} className={form.category === value ? 'text-cyan-400' : 'text-slate-500'} />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight hidden sm:block">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Ultimate Notion Dashboard Template"
                value={form.title}
                onChange={(event) => set('title', event.target.value)}
                maxLength={80}
                className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                  errors.title
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-cyan-500/60 focus:ring-cyan-500/20'
                }`}
              />
            </div>
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <AlignLeft size={14} className="absolute left-3.5 top-3 text-slate-500" />
              <textarea
                placeholder="Describe what buyers get, who it's for, and the key benefits..."
                value={form.description}
                onChange={(event) => set('description', event.target.value)}
                rows={3}
                maxLength={300}
                className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                  errors.description
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-cyan-500/60 focus:ring-cyan-500/20'
                }`}
              />
            </div>
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Price <span className="text-rose-400">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                {(['IDR', 'USD'] as Currency[]).map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => set('currency', currency)}
                    className={`px-3 py-2.5 text-xs font-bold transition-all ${
                      form.currency === currency ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  placeholder={form.currency === 'IDR' ? 'e.g. 299000' : 'e.g. 19'}
                  value={form.price}
                  onChange={(event) => set('price', event.target.value)}
                  min="1"
                  className={`w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                    errors.price
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-700 focus:border-cyan-500/60 focus:ring-cyan-500/20'
                  }`}
                />
              </div>
            </div>
            {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price}</p>}
            {form.price && !errors.price && !isNaN(Number(form.price)) && Number(form.price) > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {form.currency === 'IDR'
                  ? `≈ $${(Number(form.price) / IDR_RATE).toFixed(2)} USD`
                  : `≈ Rp ${(Number(form.price) * IDR_RATE).toLocaleString('id-ID')} IDR`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Thumbnail URL <span className="text-slate-600 font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                placeholder="https://images.pexels.com/..."
                value={form.thumbnailUrl}
                onChange={(event) => set('thumbnailUrl', event.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 relative">
              <img
                src={previewImage}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
                onError={(event) => {
                  (event.target as HTMLImageElement).src = fallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded-full">
                <Image size={9} />
                Preview
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isBusy}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-lg disabled:cursor-wait ${
              isBusy
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-cyan-500/20 hover:shadow-cyan-500/30'
            }`}
          >
            {isBusy ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
