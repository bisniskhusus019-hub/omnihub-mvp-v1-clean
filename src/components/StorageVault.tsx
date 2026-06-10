import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FileArchive,
  FileImage,
  FileLock2,
  FileText,
  Image,
  Link as LinkIcon,
  Lock,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import {
  createStorageSignedUrl,
  getStoragePublicUrl,
  listStorageBuckets,
  uploadStorageFile,
} from '../lib/supabaseStub';

const bucketBlueprints = [
  {
    name: 'product-thumbnails',
    label: 'Product Thumbnails',
    mode: 'Public',
    icon: Image,
    folder: 'products',
    purpose: 'Public marketplace images for products and services.',
    examples: 'JPG, PNG, WebP product covers',
  },
  {
    name: 'seller-avatars',
    label: 'Seller Avatars',
    mode: 'Public',
    icon: FileImage,
    folder: 'avatars',
    purpose: 'Public profile photos for seller trust and storefront identity.',
    examples: 'Profile images and small logos',
  },
  {
    name: 'seller-covers',
    label: 'Seller Covers',
    mode: 'Public',
    icon: Archive,
    folder: 'covers',
    purpose: 'Public cover banners for seller storefront pages.',
    examples: 'Shop banners, header graphics',
  },
  {
    name: 'digital-products',
    label: 'Digital Products',
    mode: 'Private',
    icon: FileLock2,
    folder: 'products',
    purpose: 'Protected files delivered only after checkout or manual approval.',
    examples: 'PDF, ZIP, templates, asset packs',
  },
  {
    name: 'payment-proofs',
    label: 'Payment Proofs',
    mode: 'Private',
    icon: FileText,
    folder: 'proofs',
    purpose: 'Private buyer payment evidence for manual QRIS / transfer validation.',
    examples: 'Screenshots, PDF receipts',
  },
];

type BucketStatus = {
  name: string;
  created_at?: string;
  public?: boolean;
};

function formatBytes(value: number) {
  if (!Number.isFinite(value)) return '0 B';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function StorageSetupSQL() {
  const setupSql = `-- OmniHub Storage Vault Buckets
insert into storage.buckets (id, name, public)
values
  ('product-thumbnails', 'product-thumbnails', true),
  ('seller-avatars', 'seller-avatars', true),
  ('seller-covers', 'seller-covers', true),
  ('digital-products', 'digital-products', false),
  ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = excluded.public;

-- Public read for public buckets
create policy if not exists "OmniHub public storage read"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('product-thumbnails', 'seller-avatars', 'seller-covers'));

-- Authenticated seller uploads to all OmniHub buckets
create policy if not exists "OmniHub authenticated storage upload"
on storage.objects for insert
to authenticated
with check (bucket_id in ('product-thumbnails', 'seller-avatars', 'seller-covers', 'digital-products', 'payment-proofs'));

-- Authenticated users can read protected objects through app flow
create policy if not exists "OmniHub authenticated private storage read"
on storage.objects for select
to authenticated
using (bucket_id in ('digital-products', 'payment-proofs'));

-- Authenticated users can update/delete their uploaded objects
create policy if not exists "OmniHub authenticated storage update"
on storage.objects for update
to authenticated
using (bucket_id in ('product-thumbnails', 'seller-avatars', 'seller-covers', 'digital-products', 'payment-proofs'));

create policy if not exists "OmniHub authenticated storage delete"
on storage.objects for delete
to authenticated
using (bucket_id in ('product-thumbnails', 'seller-avatars', 'seller-covers', 'digital-products', 'payment-proofs'));`;

  const copySql = async () => {
    await navigator.clipboard.writeText(setupSql);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-cyan-300" /> Storage Setup SQL
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Run this once in Supabase SQL Editor if the buckets/policies are not created yet.
          </p>
        </div>
        <button
          type="button"
          onClick={copySql}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
        >
          <Copy size={13} /> Copy SQL
        </button>
      </div>
      <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-4 text-[11px] leading-5 text-slate-300 whitespace-pre-wrap">
        {setupSql}
      </pre>
    </div>
  );
}

export default function StorageVault() {
  const [bucketStatuses, setBucketStatuses] = useState<BucketStatus[]>([]);
  const [selectedBucket, setSelectedBucket] = useState(bucketBlueprints[0].name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folder, setFolder] = useState(bucketBlueprints[0].folder);
  const [uploading, setUploading] = useState(false);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [message, setMessage] = useState('');
  const [lastUploadedPath, setLastUploadedPath] = useState('');
  const [lastUrl, setLastUrl] = useState('');

  const selectedBlueprint = useMemo(
    () => bucketBlueprints.find((bucket) => bucket.name === selectedBucket) || bucketBlueprints[0],
    [selectedBucket]
  );

  const bucketMap = useMemo(() => {
    return new Map(bucketStatuses.map((bucket) => [bucket.name, bucket]));
  }, [bucketStatuses]);

  const loadBuckets = async () => {
    setLoadingBuckets(true);
    const buckets = await listStorageBuckets();
    setBucketStatuses(buckets as BucketStatus[]);
    setLoadingBuckets(false);
  };

  useEffect(() => {
    loadBuckets();
  }, []);

  const handleBucketChange = (bucketName: string) => {
    const blueprint = bucketBlueprints.find((bucket) => bucket.name === bucketName);
    setSelectedBucket(bucketName);
    setFolder(blueprint?.folder || 'public');
    setMessage('');
    setLastUploadedPath('');
    setLastUrl('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Choose a file first before uploading.');
      return;
    }

    try {
      setUploading(true);
      setMessage('Uploading file to Supabase Storage...');
      setLastUrl('');

      const data = await uploadStorageFile({
        bucket: selectedBucket,
        file: selectedFile,
        folder,
      });

      const path = data?.path || '';
      setLastUploadedPath(path);

      if (selectedBlueprint.mode === 'Public') {
        const publicUrl = getStoragePublicUrl(selectedBucket, path);
        setLastUrl(publicUrl);
        setMessage('Upload complete. Public URL is ready.');
      } else {
        const signedUrl = await createStorageSignedUrl(selectedBucket, path, 3600);
        setLastUrl(signedUrl);
        setMessage('Upload complete. Private signed URL is ready for 1 hour.');
      }
    } catch (error: any) {
      setMessage(error?.message || 'Upload failed. Check bucket policy and login status.');
    } finally {
      setUploading(false);
    }
  };

  const copyLastUrl = async () => {
    if (!lastUrl) return;
    await navigator.clipboard.writeText(lastUrl);
    setMessage('URL copied.');
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-cyan-950/10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-4">
                <ShieldCheck size={13} /> Storage Vault Layer
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">OmniHub Storage Vault</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Manage public media, private digital products, and buyer payment proofs from one operational file control center.
              </p>
            </div>

            <button
              type="button"
              onClick={loadBuckets}
              disabled={loadingBuckets}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 disabled:opacity-60 transition-colors"
            >
              <RefreshCw size={16} className={loadingBuckets ? 'animate-spin' : ''} /> Refresh Buckets
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {bucketBlueprints.map((bucket) => {
            const Icon = bucket.icon;
            const exists = bucketMap.has(bucket.name);
            return (
              <div
                key={bucket.name}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <Icon size={18} className={bucket.mode === 'Public' ? 'text-cyan-300' : 'text-amber-300'} />
                  </div>
                  {exists ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-300">
                      <AlertCircle size={11} /> Missing
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{bucket.label}</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{bucket.name}</p>
                <p className="text-xs text-slate-400 leading-5 mt-3">{bucket.purpose}</p>
                <div className="mt-4 flex items-center gap-2 text-[11px]">
                  <span className={`rounded-full px-2 py-1 font-bold ${bucket.mode === 'Public' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-amber-500/10 text-amber-300'}`}>
                    {bucket.mode}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <UploadCloud size={18} className="text-cyan-300" /> Upload Test Console
                </h2>
                <p className="text-xs text-slate-500 mt-1">Use this to test seller media and digital product upload flow.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-bold text-slate-400">Target Bucket</span>
                <select
                  value={selectedBucket}
                  onChange={(event) => handleBucketChange(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                >
                  {bucketBlueprints.map((bucket) => (
                    <option key={bucket.name} value={bucket.name}>
                      {bucket.label} · {bucket.mode}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold text-slate-400">Folder Path</span>
                <input
                  value={folder}
                  onChange={(event) => setFolder(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
                  placeholder="products"
                />
              </label>
            </div>

            <div className="mt-4 rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 p-6">
              <input
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-950 hover:file:bg-cyan-400"
              />
              {selectedFile && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
                  <div className="font-bold text-white mb-1">{selectedFile.name}</div>
                  <div>{selectedFile.type || 'Unknown file type'} · {formatBytes(selectedFile.size)}</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60 transition-colors"
            >
              <UploadCloud size={16} /> {uploading ? 'Uploading...' : 'Upload to Vault'}
            </button>

            {message && (
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                {message}
              </div>
            )}

            {lastUploadedPath && (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Uploaded Path</div>
                <div className="font-mono text-xs text-cyan-300 break-all">{lastUploadedPath}</div>
                {lastUrl && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                      {selectedBlueprint.mode === 'Public' ? 'Public URL' : 'Private Signed URL'}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={lastUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-cyan-300 hover:border-cyan-500/50 break-all"
                      >
                        <LinkIcon size={13} /> Open URL
                      </a>
                      <button
                        type="button"
                        onClick={copyLastUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-cyan-500/50"
                      >
                        <Copy size={13} /> Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                {selectedBlueprint.mode === 'Public' ? <Download size={16} className="text-cyan-300" /> : <Lock size={16} className="text-amber-300" />}
                Selected Bucket Rules
              </h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Bucket</div>
                  <div className="text-slate-200 font-mono text-xs mt-1">{selectedBlueprint.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Access</div>
                  <div className="text-slate-300 text-xs leading-5 mt-1">
                    {selectedBlueprint.mode === 'Public'
                      ? 'Anyone with the file URL can view the asset. Upload still requires policy permission.'
                      : 'File should be protected and shared only through signed URLs or authenticated download flow.'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Examples</div>
                  <div className="text-slate-300 text-xs leading-5 mt-1">{selectedBlueprint.examples}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileArchive size={16} className="text-cyan-300" /> Test Checklist
              </h3>
              <div className="mt-4 space-y-3 text-xs text-slate-400">
                <div className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> Public image uploads return usable public URL.</div>
                <div className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> Private digital product uploads return signed URL only.</div>
                <div className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> Seller must be logged in before uploading.</div>
                <div className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-300 flex-shrink-0" /> Missing bucket means run Storage Setup SQL.</div>
              </div>
            </div>
          </div>
        </section>

        <StorageSetupSQL />
      </div>
    </div>
  );
}
