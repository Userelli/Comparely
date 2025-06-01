import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  stripe_payment_method_id: string;
  card_type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentMethods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPaymentMethods([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "Error",
        description: "Failed to load payment methods.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (cardData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Call Stripe payment function
      const response = await fetch(
        'https://dyxoboyylifsmlaireuw.supabase.co/functions/v1/5e1228cd-5494-41e6-8830-6b7aad1f2fc9',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'add_payment_method',
            cardData
          })
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to add payment method');
      }

      // Parse expiry date
      const [month, year] = cardData.expiry.split('/');
      const fullYear = parseInt('20' + year);

      // Save to database
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          stripe_payment_method_id: result.paymentMethod.id,
          card_type: result.paymentMethod.type,
          last_four: result.paymentMethod.last4,
          expiry_month: parseInt(month),
          expiry_year: fullYear,
          is_default: paymentMethods.length === 0
        });

      if (error) throw error;
      
      await fetchPaymentMethods();
      return result.paymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };

  const removePaymentMethod = async (id: string) => {
    try {
      // Call Stripe function to remove
      await fetch(
        'https://dyxoboyylifsmlaireuw.supabase.co/functions/v1/5e1228cd-5494-41e6-8830-6b7aad1f2fc9',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'remove_payment_method',
            paymentMethodId: id
          })
        }
      );

      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, set all payment methods to non-default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected one as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    refetch: fetchPaymentMethods
  };
};
