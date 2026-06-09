import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Link2,
  Trophy,
  MousePointerClick,
  BadgeDollarSign,
  Send,
  CheckCircle,
  Clock,
  Copy,
  Sparkles,
} from 'lucide-react';
import {
  createAffiliateRecord,
  fetchAffiliateApplications,
  fetchAffiliatePrograms,
  fetchAffiliates,
  submitAffiliateApplication,
} from '../lib/supabaseStub';

type Program = Record<string, any>;
type Affiliate = Record<string, any>;
type Application = Record<string, any>;

const fallbackProgram = {
  program_name: 'OmniHub Launch Partner Program',
  description: 'Recruit partners to promote seller products with trackable links and commission-ready workflows.',
  commission_rate: 20,
  cookie_days: 30,
};

export default function AffiliateCenter() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    audience_type: '',
    promotion_channel: '',
    reason: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [programRows, affiliateRows, applicationRows] = await Promise.all([
          fetchAffiliatePrograms(),
          fetchAffiliates(),
          fetchAffiliateApplications(),
        ]);
        setPrograms(programRows);
        setAffiliates(affiliateRows);
        setApplications(applicationRows);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activeProgram = programs[0] || fallbackProgram;
  const totalClicks = useMemo(() => affiliates.reduce((sum, item) => sum + Number(item.total_clicks || 0), 0), [affiliates]);
  const totalConversions = useMemo(
    () => affiliates.reduce((sum, item) => sum + Number(item.total_conversions || 0), 0),
    [affiliates]
  );
  const totalEarnings = useMemo(
    () => affiliates.reduce((sum, item) => sum + Number(item.total_earnings || 0), 0),
    [affiliates]
  );

  const set = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || saving) return;

    setSaving(true);
    try {
      const row = await submitAffiliateApplication({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        audience_type: form.audience_type.trim(),
        promotion_channel: form.promotion_channel.trim(),
        reason: form.reason.trim(),
      });
      setApplications((current) => [row, ...current]);
      setForm({ full_name: '', email: '', audience_type: '', promotion_channel: '', reason: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAffiliate = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const row = await createAffiliateRecord({
        display_name: `Partner ${affiliates.length + 1}`,
        email: `partner${Date.now()}@omnihub.test`,
        status: 'approved',
        payout_method: 'manual',
      });
      setAffiliates((current) => [row, ...current]);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(`https://omnihub.example/marketplace?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-3">
              <Sparkles size={12} />
              Affiliate Growth Engine
            </div>
            <h1 className="text-2xl font-bold text-white">Recruit affiliates and track partner growth</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Build a partner program for sellers, accept affiliate applications, issue referral codes, and prepare commission tracking.
            </p>
          </div>
          <button
            onClick={handleCreateAffiliate}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60"
          >
            <Users size={16} />
            Create Demo Affiliate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Commission</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
            <BadgeDollarSign size={22} className="text-cyan-400" />
            {Number(activeProgram.commission_rate || 0)}%
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Affiliates</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
            <Users size={22} className="text-cyan-400" />
            {affiliates.length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Clicks</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
            <MousePointerClick size={22} className="text-cyan-400" />
            {totalClicks}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Revenue Tracked</p>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
            <Trophy size={22} className="text-cyan-400" />
            Rp {totalEarnings.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="font-bold text-white">Public Affiliate Application</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Visitors can apply to become partners. Applications are saved to Supabase.
          </p>
          <div className="mt-4 space-y-3">
            <input
              value={form.full_name}
              onChange={(event) => set('full_name', event.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
            <input
              value={form.email}
              onChange={(event) => set('email', event.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
            <input
              value={form.audience_type}
              onChange={(event) => set('audience_type', event.target.value)}
              placeholder="Audience type"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
            <input
              value={form.promotion_channel}
              onChange={(event) => set('promotion_channel', event.target.value)}
              placeholder="Promotion channel"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
            <textarea
              value={form.reason}
              onChange={(event) => set('reason', event.target.value)}
              placeholder="Why do you want to join?"
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              onClick={handleSubmit}
              disabled={saving || !form.full_name.trim() || !form.email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={15} />
              Submit Application
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white">Approved Affiliates</h2>
                <p className="text-xs text-slate-500 mt-0.5">Referral codes and performance tracking.</p>
              </div>
              <Link2 size={18} className="text-cyan-400" />
            </div>
            <div className="divide-y divide-slate-800">
              {loading ? (
                <div className="p-5 text-sm text-slate-500">Loading affiliate data...</div>
              ) : affiliates.length === 0 ? (
                <div className="p-5 text-sm text-slate-500">No affiliates yet.</div>
              ) : (
                affiliates.map((affiliate) => (
                  <div key={affiliate.id || affiliate.referral_code} className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{affiliate.display_name}</h3>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                          {affiliate.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{affiliate.email}</p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-cyan-300">
                        <Link2 size={12} />
                        {affiliate.referral_code}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span>{Number(affiliate.total_clicks || 0)} clicks</span>
                      <span>•</span>
                      <span>{Number(affiliate.total_conversions || 0)} conversions</span>
                      <span>•</span>
                      <span>Rp {Number(affiliate.total_earnings || 0).toLocaleString('id-ID')}</span>
                      <button
                        onClick={() => handleCopy(affiliate.referral_code)}
                        className="ml-1 inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40"
                      >
                        {copiedCode === affiliate.referral_code ? <CheckCircle size={12} /> : <Copy size={12} />}
                        {copiedCode === affiliate.referral_code ? 'Copied' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white">Affiliate Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">Pending partner requests from the public form.</p>
              </div>
              <Clock size={18} className="text-cyan-400" />
            </div>
            <div className="divide-y divide-slate-800">
              {applications.length === 0 ? (
                <div className="p-5 text-sm text-slate-500">No applications yet.</div>
              ) : (
                applications.map((application) => (
                  <div key={application.id || application.email} className="p-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{application.full_name}</h3>
                      <p className="mt-1 text-xs text-slate-500">{application.email}</p>
                      <p className="mt-2 text-xs text-slate-400 leading-5">{application.reason || 'No reason submitted yet.'}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase text-amber-300">
                      <Clock size={12} />
                      {application.status || 'pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
