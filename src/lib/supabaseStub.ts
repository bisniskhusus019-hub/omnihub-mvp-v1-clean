import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_TIMEOUT_MS = 6000;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[OmniHub] Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

function withTimeout<T>(promise: Promise<T>, label: string, fallback: T): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[supabase] ${label} timed out. Using OmniHub fallback data.`);
      resolve(fallback);
    }, SUPABASE_TIMEOUT_MS);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export const fetchProducts = async () => {
  return withTimeout(
    (async () => {
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
    })(),
    'fetchProducts',
    []
  );
};

export const fetchTransactions = async () => {
  return withTimeout(
    (async () => {
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
    })(),
    'fetchTransactions',
    []
  );
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

function createDownloadTokenValue(productId: string, buyerEmail: string) {
  const safeEmail = buyerEmail || 'guest';
  return `dl_${productId}_${safeEmail}_${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_');
}

export const processTransaction = async (transactionData: Record<string, any>) => {
  const downloadToken = createDownloadTokenValue(
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

export const generateDownloadToken = async (productId: string, transactionHash: string) => {
  const token = createDownloadTokenValue(productId || 'product', transactionHash || 'txn');
  return token;
};

export const listStorageBuckets = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase.storage.listBuckets();

      if (error) {
        console.error('[supabase] listStorageBuckets error:', error);
        return [];
      }

      return data || [];
    })(),
    'listStorageBuckets',
    []
  );
};

function sanitizeStorageFileName(fileName: string) {
  const [rawName, ...rest] = fileName.split('.');
  const extension = rest.length ? `.${rest.pop()}` : '';
  const safeName = (rawName || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return `${safeName || 'file'}-${Date.now()}${extension.toLowerCase()}`;
}

export const uploadStorageFile = async ({
  bucket,
  file,
  folder = 'public',
}: {
  bucket: string;
  file: File;
  folder?: string;
}) => {
  const safeFolder = folder.replace(/[^a-zA-Z0-9-_/.]+/g, '-').replace(/^\/+|\/+$/g, '') || 'public';
  const filePath = `${safeFolder}/${sanitizeStorageFileName(file.name)}`;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    console.error('[supabase] uploadStorageFile error:', error);
    throw error;
  }

  return data;
};

export const getStoragePublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const createStorageSignedUrl = async (bucket: string, path: string, expiresInSeconds = 3600) => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds, {
    download: true,
  });

  if (error) {
    console.error('[supabase] createStorageSignedUrl error:', error);
    throw error;
  }

  return data.signedUrl;
};

export const fetchCommunityPosts = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[supabase] fetchCommunityPosts error:', error);
        return [];
      }

      return data || [];
    })(),
    'fetchCommunityPosts',
    []
  );
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

export const fetchAffiliatePrograms = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase
        .from('affiliate_programs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[supabase] fetchAffiliatePrograms error:', error);
        return [];
      }

      return data || [];
    })(),
    'fetchAffiliatePrograms',
    []
  );
};

export const fetchAffiliates = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('total_earnings', { ascending: false });

      if (error) {
        console.error('[supabase] fetchAffiliates error:', error);
        return [];
      }

      return data || [];
    })(),
    'fetchAffiliates',
    []
  );
};

export const fetchAffiliateApplications = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase
        .from('affiliate_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[supabase] fetchAffiliateApplications error:', error);
        return [];
      }

      return data || [];
    })(),
    'fetchAffiliateApplications',
    []
  );
};

export const submitAffiliateApplication = async (applicationData: Record<string, any>) => {
  const { data, error } = await supabase
    .from('affiliate_applications')
    .insert({
      full_name: applicationData.full_name,
      email: applicationData.email,
      audience_type: applicationData.audience_type || '',
      promotion_channel: applicationData.promotion_channel || '',
      reason: applicationData.reason || '',
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] submitAffiliateApplication error:', error);
    throw error;
  }

  return data;
};

export const createAffiliateRecord = async (affiliateData: Record<string, any>) => {
  const referralCode = affiliateData.referral_code || `OMNI${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase
    .from('affiliates')
    .insert({
      user_id: affiliateData.user_id || null,
      display_name: affiliateData.display_name,
      email: affiliateData.email,
      status: affiliateData.status || 'approved',
      referral_code: referralCode,
      payout_method: affiliateData.payout_method || 'manual',
      payout_details: affiliateData.payout_details || '',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase] createAffiliateRecord error:', error);
    throw error;
  }

  return data;
};

export const getCurrentSession = async () => {
  return withTimeout(
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[supabase] getCurrentSession error:', error);
        return null;
      }

      return data.session;
    })(),
    'getCurrentSession',
    null
  );
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
    const baseUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9.]+/g, '');
    const cleanUsername = `${baseUsername}-${authUser.id.slice(0, 6)}`.toLowerCase();

    const { error: profileError } = await supabase.from('users').insert({
      auth_user_id: authUser.id,
      username: cleanUsername,
      email,
      display_name: displayName || baseUsername,
      headline: 'OmniHub Solopreneur',
      bio: 'Building products, services, and digital business with OmniHub.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      cover_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600',
      website_url: '',
      social_links: [],
      shop_name: `${displayName || baseUsername}'s Store`,
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
