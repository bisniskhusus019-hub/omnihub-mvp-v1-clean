import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[OmniHub] Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      seller_id,
      title,
      slug,
      description,
      product_type,
      price,
      currency,
      thumbnail_url,
      file_url,
      external_url,
      inventory_quantity,
      is_published,
      total_sales,
      view_count,
      created_at,
      users (
        id,
        username,
        display_name,
        avatar_url,
        shop_name,
        shop_slug
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] fetchProducts error:', error);
    return [];
  }

  return data || [];
};

export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      product_id,
      seller_id,
      buyer_email,
      buyer_name,
      quantity,
      amount,
      currency,
      payment_method,
      payment_status,
      order_status,
      download_token,
      created_at,
      products (
        id,
        title,
        thumbnail_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] fetchTransactions error:', error);
    return [];
  }

  return data || [];
};

export const createNewProduct = async (productData: Record<string, any>) => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: productData.seller_id,
      title: productData.title,
      slug: productData.slug,
      description: productData.description || '',
      product_type: productData.product_type || 'digital',
      price: Number(productData.price || 0),
      currency: productData.currency || 'IDR',
      thumbnail_url: productData.thumbnail_url || null,
      file_url: productData.file_url || null,
      external_url: productData.external_url || null,
      inventory_quantity: productData.inventory_quantity ?? null,
      is_published: productData.is_published ?? true,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] createNewProduct error:', error);
    throw error;
  }

  return data;
};

function createDownloadToken(productId: string, buyerEmail: string) {
  const safeEmail = buyerEmail || 'guest';
  return `dl_${productId}_${safeEmail}_${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_');
}

export const processTransaction = async (transactionData: Record<string, any>) => {
  const downloadToken = createDownloadToken(
    transactionData.product_id || 'product',
    transactionData.buyer_email || 'guest'
  );

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      product_id: transactionData.product_id,
      seller_id: transactionData.seller_id,
      buyer_email: transactionData.buyer_email,
      buyer_name: transactionData.buyer_name || 'Guest Buyer',
      quantity: transactionData.quantity || 1,
      amount: Number(transactionData.amount || 0),
      currency: transactionData.currency || 'IDR',
      payment_method: transactionData.payment_method || 'manual',
      payment_status: transactionData.payment_status || 'pending',
      order_status: transactionData.order_status || 'created',
      download_token: downloadToken,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] processTransaction error:', error);
    throw error;
  }

  return data;
};

export const confirmPayment = async (transactionId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      payment_status: 'paid',
      order_status: 'fulfilled',
    })
    .eq('id', transactionId)
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] confirmPayment error:', error);
    throw error;
  }

  return data;
};

export const fetchCommunityPosts = async () => {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] fetchCommunityPosts error:', error);
    return [];
  }

  return data || [];
};

export const createCommunityPost = async (postData: Record<string, any>) => {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: postData.user_id || null,
      channel: postData.channel || 'ch1',
      title: postData.title,
      body: postData.body || 'New topic posted from OmniHub Community.',
      upvotes: 0,
      comments_count: 0,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] createCommunityPost error:', error);
    throw error;
  }

  return data;
};

export const updateCommunityPostUpvotes = async (postId: string, upvotes: number) => {
  const { data, error } = await supabase
    .from('community_posts')
    .update({ upvotes })
    .eq('id', postId)
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] updateCommunityPostUpvotes error:', error);
    throw error;
  }

  return data;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('[supabase] getCurrentSession error:', error);
    return null;
  }

  return data.session;
};

export const signInWithEmail = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[supabase] signInWithEmail error:', error);
    throw error;
  }

  return data;
};

export const signUpWithEmail = async ({
  email,
  password,
  displayName,
  username,
}: {
  email: string;
  password: string;
  displayName: string;
  username: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('[supabase] signUpWithEmail error:', error);
    throw error;
  }

  const authUser = data.user;

  if (authUser) {
    const cleanUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9.]+/g, '');

    const { error: profileError } = await supabase.from('users').insert({
      auth_user_id: authUser.id,
      username: cleanUsername,
      email,
      display_name: displayName || cleanUsername,
      headline: 'OmniHub Solopreneur',
      bio: 'Building products, services, and digital business with OmniHub.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      cover_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600',
      website_url: '',
      social_links: [],
      shop_name: `${displayName || cleanUsername}'s Store`,
      shop_slug: `${cleanUsername}-store`,
      shop_description: 'My OmniHub digital shop.',
      role: 'seller',
    });

    if (profileError) {
      console.warn('[supabase] profile creation skipped or failed:', profileError.message);
    }
  }

  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[supabase] signOutUser error:', error);
    throw error;
  }

  return true;
};
