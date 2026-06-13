import { useEffect, useState } from 'react';
import BusinessOSLive from './BusinessOSLive';
import { supabase } from '../lib/supabaseStub';

export default function BusinessOS() {
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    let alive = true;

    const loadSeller = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const accountId = sessionData.session?.user?.id;
      if (!accountId) return;

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', accountId)
        .maybeSingle();

      if (alive) setSeller(data || null);
    };

    loadSeller();

    return () => {
      alive = false;
    };
  }, []);

  return <BusinessOSLive currentSeller={seller} />;
}
