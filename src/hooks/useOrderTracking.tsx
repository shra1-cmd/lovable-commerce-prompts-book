import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface TrackingEntry {
  id: string;
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export const useOrderTracking = (orderId: string) => {
  const [trackingData, setTrackingData] = useState<TrackingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTracking = async () => {
    if (!user || !orderId) {
      setTrackingData([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      setTrackingData(data || []);
    } catch (error) {
      console.error('Error fetching order tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [user, orderId]);

  return {
    trackingData,
    loading,
    fetchTracking,
  };
};