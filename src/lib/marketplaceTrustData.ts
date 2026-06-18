import { supabase } from './supabaseStub';

function isUuid(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function requireUuid(value: unknown, label: string) {
  if (!isUuid(value)) throw new Error(`${label} must be a Supabase UUID. Local demo rows are kept in frontend state only.`);
  return value as string;
}

export async function saveWishlistIntent(productId: unknown, note = 'Saved from OmniHub marketplace') {
  const validProductId = requireUuid(productId, 'product_id');
  const { data: sessionData } = await supabase.auth.getSession();
  const authUserId = sessionData.session?.user?.id;

  if (!authUserId) throw new Error('Wishlist requires seller/buyer login before database sync. Saved locally for guest users.');

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single();

  if (!profile?.id) throw new Error('User profile not found for wishlist sync. Saved locally.');

  const { data, error } = await supabase
    .from('wishlists')
    .upsert({ user_id: profile.id, product_id: validProductId, note }, { onConflict: 'user_id,product_id' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function submitProductReviewIntent(input: Record<string, any>) {
  const productId = requireUuid(input.product_id, 'product_id');
  const sellerId = isUuid(input.seller_id) ? input.seller_id : null;
  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: productId,
      seller_id: sellerId,
      reviewer_name: input.reviewer_name || 'Guest Buyer',
      reviewer_email: input.reviewer_email || null,
      rating: Number(input.rating || 5),
      title: input.title || 'Review intent from marketplace',
      body: input.body || 'Buyer clicked review from OmniHub marketplace. Pending moderation.',
      status: 'pending',
      source: 'marketplace',
      metadata: input.metadata || {},
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function submitProductReport(input: Record<string, any>) {
  const productId = requireUuid(input.product_id, 'product_id');
  const { data, error } = await supabase
    .from('product_reports')
    .insert({
      product_id: productId,
      reporter_email: input.reporter_email || null,
      reason: input.reason || 'Marketplace trust report',
      details: input.details || 'Buyer clicked report from OmniHub marketplace. Owner review needed.',
      status: 'open',
      metadata: input.metadata || {},
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
