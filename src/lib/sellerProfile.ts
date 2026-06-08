import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseStub';

export type SellerProfile = {
  id: string;
  auth_user_id: string | null;
  username: string;
  email: string;
  display_name: string;
  bio: string | null;
  headline: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  shop_name: string | null;
  shop_slug: string | null;
  shop_description: string | null;
  role: string | null;
};

function cleanUsername(email: string) {
  return email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '')
    .slice(0, 28);
}

function cleanShopSlug(username: string) {
  return `${username}-store`.replace(/[^a-z0-9-]+/g, '-');
}

export async function fetchSellerProfileByAuthId(authUserId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (error) {
    console.error('[sellerProfile] fetchSellerProfileByAuthId error:', error);
    return null;
  }

  return data as SellerProfile | null;
}

export async function ensureSellerProfile(session: Session | null) {
  if (!session?.user) return null;

  const existingProfile = await fetchSellerProfileByAuthId(session.user.id);
  if (existingProfile) return existingProfile;

  const email = session.user.email || `seller-${session.user.id}@omnihub.local`;
  const username = cleanUsername(email);
  const displayName = session.user.user_metadata?.display_name || username;

  const { data, error } = await supabase
    .from('users')
    .insert({
      auth_user_id: session.user.id,
      username,
      email,
      display_name: displayName,
      headline: 'OmniHub Solopreneur',
      bio: 'Building products, services, and digital business with OmniHub.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      cover_url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600',
      website_url: '',
      social_links: [],
      shop_name: `${displayName}'s Store`,
      shop_slug: cleanShopSlug(username),
      shop_description: 'My OmniHub digital shop.',
      role: 'seller',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[sellerProfile] ensureSellerProfile error:', error);
    return null;
  }

  return data as SellerProfile;
}
