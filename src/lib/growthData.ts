import { supabase } from './supabaseStub';

export async function getWorkflows() {
  const { data } = await supabase.from('automation_workflows').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getCalendar() {
  const { data } = await supabase.from('content_calendar_items').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getTickets() {
  const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getArticles() {
  const { data } = await supabase.from('knowledge_base_articles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getFeedback() {
  const { data } = await supabase.from('feedback_items').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function addWorkflow(row: Record<string, any>) {
  const { data, error } = await supabase.from('automation_workflows').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addCalendar(row: Record<string, any>) {
  const { data, error } = await supabase.from('content_calendar_items').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

export async function addTicket(row: Record<string, any>) {
  const { data, error } = await supabase.from('support_tickets').insert(row).select('*').single();
  if (error) throw error;
  return data;
}

const FALLBACK_TIMEOUT_MS = 6000;

function withTimeout<T>(promise: Promise<T>, label: string, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[growthData] ${label} timed out. Using local fallback.`);
      resolve(fallback);
    }, FALLBACK_TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function logAndReturn<T>(label: string, error: unknown, fallback: T) {
  console.warn(`[growthData] ${label} skipped:`, error);
  return fallback;
}

export async function fetchServiceRequests() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchServiceRequests', error, []);
    return data || [];
  })(), 'fetchServiceRequests', []);
}

export async function createServiceRequest(input: Record<string, any>) {
  const { data, error } = await supabase.from('service_requests').insert({
    requester_name: input.requester_name || 'Guest Buyer',
    requester_email: input.requester_email || null,
    title: input.title,
    category: input.category || 'Service',
    budget_label: input.budget_label || 'Flexible',
    timeline_label: input.timeline_label || 'Flexible',
    description: input.description || '',
    status: input.status || 'open',
    offer_count: input.offer_count || 0,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function createServiceOffer(input: Record<string, any>) {
  const { data, error } = await supabase.from('service_offers').insert({
    request_id: input.request_id,
    seller_name: input.seller_name || 'OmniHub Seller',
    offer_title: input.offer_title || 'Seller offer',
    offer_message: input.offer_message || '',
    price_label: input.price_label || 'Flexible',
    status: 'sent',
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateServiceRequestOfferCount(requestId: string, offerCount: number, status = 'reviewing') {
  const { data, error } = await supabase.from('service_requests').update({ offer_count: offerCount, status, updated_at: new Date().toISOString() }).eq('id', requestId).select('*').single();
  if (error) throw error;
  return data;
}

export async function fetchPromotionCoupons() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('promotion_coupons').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchPromotionCoupons', error, []);
    return data || [];
  })(), 'fetchPromotionCoupons', []);
}

export async function createPromotionCoupon(input: Record<string, any>) {
  const { data, error } = await supabase.from('promotion_coupons').insert({
    code: input.code,
    discount_label: input.discount_label || 'Custom deal',
    target_type: input.target_type || 'marketplace',
    status: input.status || 'draft',
    usage_count: input.usage_count || 0,
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function fetchProductBundles() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('product_bundles').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchProductBundles', error, []);
    return data || [];
  })(), 'fetchProductBundles', []);
}

export async function fetchCampaignPlans() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('campaign_plans').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchCampaignPlans', error, []);
    return data || [];
  })(), 'fetchCampaignPlans', []);
}

export async function createCampaignPlan(input: Record<string, any>) {
  const { data, error } = await supabase.from('campaign_plans').insert({
    title: input.title,
    channel: input.channel || 'Marketplace + Community + Affiliate',
    goal: input.goal || 'Drive seller visibility and buyer action',
    status: input.status || 'draft',
    tasks: input.tasks || ['Prepare offer angle', 'Create promo copy', 'Track result'],
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function fetchPlatformNotifications() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('platform_notifications').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchPlatformNotifications', error, []);
    return data || [];
  })(), 'fetchPlatformNotifications', []);
}

export async function markPlatformNotificationRead(notificationId: string) {
  const { data, error } = await supabase.from('platform_notifications').update({ read_at: new Date().toISOString() }).eq('id', notificationId).select('*').single();
  if (error) throw error;
  return data;
}

export async function fetchCreditLedgerEntries() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('credit_ledger_entries').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchCreditLedgerEntries', error, []);
    return data || [];
  })(), 'fetchCreditLedgerEntries', []);
}

export async function fetchDisputeCases() {
  return withTimeout((async () => {
    const { data, error } = await supabase.from('dispute_cases').select('*').order('created_at', { ascending: false });
    if (error) return logAndReturn('fetchDisputeCases', error, []);
    return data || [];
  })(), 'fetchDisputeCases', []);
}

export async function createDisputeCase(input: Record<string, any>) {
  const { data, error } = await supabase.from('dispute_cases').insert({
    title: input.title,
    buyer_email: input.buyer_email || null,
    reason: input.reason || 'Manual owner review needed',
    status: 'open',
    priority: input.priority || 'normal',
  }).select('*').single();
  if (error) throw error;
  return data;
}

export async function updateDisputeCaseStatus(disputeId: string, status: string) {
  const { data, error } = await supabase.from('dispute_cases').update({ status, updated_at: new Date().toISOString(), resolved_at: status === 'resolved' ? new Date().toISOString() : null }).eq('id', disputeId).select('*').single();
  if (error) throw error;
  return data;
}
