import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface SubscriptionManagerProps {
  onPlanChange?: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onPlanChange }) => {
  const [subscription, setSubscription] = useState({
    plan: 'basic',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSubscription({
          plan: data.subscription_plan || 'basic',
          status: data.subscription_status || 'active'
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: 'premium',
          subscription_status: 'active'
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setSubscription({ plan: 'premium', status: 'active' });
      toast({
        title: "Subscription upgraded",
        description: "Welcome to Premium! Enjoy unlimited comparisons.",
      });
      onPlanChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade subscription.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = {
    basic: {
      name: 'Basic',
      price: 'Free',
      features: ['5 comparisons/month', 'Basic diff view', 'Email support'],
      color: 'bg-gray-100 text-gray-800'
    },
    premium: {
      name: 'Premium',
      price: '$9.99/month',
      features: ['Unlimited comparisons', 'Advanced diff view', 'Priority support', 'Export options'],
      color: 'bg-blue-100 text-blue-800'
    }
  };

  const currentPlan = plans[subscription.plan as keyof typeof plans] || plans.basic;

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge className={currentPlan.color}>
              {subscription.plan === 'premium' && <Crown className="w-4 h-4 mr-1" />}
              {currentPlan.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-lg font-semibold">{currentPlan.price}</p>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            {subscription.plan === 'basic' && (
              <Button 
                onClick={handleUpgrade} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Upgrading...' : 'Upgrade to Premium'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {subscription.plan === 'premium' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto" />
              <p className="font-medium">Premium Member</p>
              <p className="text-sm text-gray-600">Enjoy unlimited document comparisons</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManager;
