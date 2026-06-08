import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchUserProfile = async (username: string = "rangga.ai") => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("[supabase] fetchUserProfile error:", error);
    return null;
  }

  return data;
};

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
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
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] fetchProducts error:", error);
    return [];
  }

  return data || [];
};

export const createNewProduct = async (productData: Record<string, any>) => {
  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error("[supabase] createNewProduct error:", error);
    throw error;
  }

  return data;
};

export const processTransaction = async (
  transactionData: Record<string, any>
) => {
  const downloadToken = `dl_tok_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;

  const payload = {
    product_id: transactionData.product_id,
    seller_id: transactionData.seller_id,
    buyer_email: transactionData.buyer_email,
    buyer_name: transactionData.buyer_name,
    quantity: transactionData.quantity || 1,
    amount: transactionData.amount,
    currency: transactionData.currency || "IDR",
    payment_method: transactionData.payment_method || "manual",
    payment_status: transactionData.payment_status || "pending",
    order_status: transactionData.order_status || "created",
    download_token: downloadToken,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[supabase] processTransaction error:", error);
    throw error;
  }

  return data;
};

export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
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
        title,
        thumbnail_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] fetchTransactions error:", error);
    return [];
  }

  return data || [];
};

export const confirmPayment = async (transactionId: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      payment_status: "paid",
      order_status: "fulfilled",
      paid_at: new Date().toISOString(),
      fulfilled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    console.error("[supabase] confirmPayment error:", error);
    throw error;
  }

  return data;
};

export const generateInvoice = async (transactionData: Record<string, any>) => {
  console.log("[supabase] generateInvoice placeholder:", transactionData);

  return {
    invoice_number: `INV-${new Date().getFullYear()}-${Date.now()}`,
    transaction_id: transactionData.id,
    issued_at: new Date().toISOString(),
  };
};

export const generateDownloadToken = () => {
  return `dl_tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const subscribeToTransactions = (
  sellerId: string,
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(`seller-transactions-${sellerId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `seller_id=eq.${sellerId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
export const fetchCommunityPosts = async () => {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase] fetchCommunityPosts error:", error);
    return [];
  }

  return data || [];
};

export const createCommunityPost = async (postData: Record<string, any>) => {
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      channel: postData.channel || "general",
      title: postData.title,
      body: postData.body || "New topic posted from OmniHub Community.",
      upvotes: 0,
      comments_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[supabase] createCommunityPost error:", error);
    throw error;
  }

  return data;
};

export const updateCommunityPostUpvotes = async (
  postId: string,
  upvotes: number
) => {
  const { data, error } = await supabase
    .from("community_posts")
    .update({
      upvotes,
    })
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("[supabase] updateCommunityPostUpvotes error:", error);
    throw error;
  }

  return data;
};