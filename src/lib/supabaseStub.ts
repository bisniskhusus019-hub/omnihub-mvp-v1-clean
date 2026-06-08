import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        username