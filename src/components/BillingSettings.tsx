import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useAppContext } from '@/contexts/AppContext';
import PaymentMethodDialog from './PaymentMethodDialog';

interface BillingSettingsProps {
  children: React.ReactNode;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const { toast } = useToast();
  const { usage } = useAppContext();
  const {
    paymentMethods,
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  } = usePaymentMethods();

  const handlePaymentMethodAdded = async (newPaymentMethod: any) => {
    try {
      await addPaymentMethod(newPaymentMethod);
      setShowAddPayment(false);
      toast({
        title: "Payment method added",
        description: "Your payment method has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemovePayment = async (id: string) => {
    try {
      await removePaymentMethod(id);
      toast({
        title: "Payment method removed",
        description: "The payment method has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive"
      });
    }
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const usagePercentage = (usage.used / usage.limit) * 100;
  const remaining = Math.max(0, usage.limit - usage.used);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Billing & Usage</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            
            {/* Current Plan Usage */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Current Plan - {usage.plan === 'free' ? 'Free' : 'Pro'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {usage.limit} comparisons/month
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {usage.used} used
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {remaining} remaining
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usage this month</span>
                      <span>{usage.used}/{usage.limit}</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Payment Methods</h3>
                <Button 
                  onClick={() => setShowAddPayment(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
              
              {loading ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-500">Loading payment methods...</p>
                  </CardContent>
                </Card>
              ) : paymentMethods.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No payment methods added yet</p>
                    <p className="text-sm text-gray-400 mb-4">Add a bank card for automatic monthly subscription payments.</p>
                    <Button 
                      onClick={() => setShowAddPayment(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className={method.is_default ? 'ring-2 ring-blue-500' : ''}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{method.card_type} •••• {method.last_four}</p>
                              {method.is_default && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires {formatExpiry(method.expiry_month, method.expiry_year)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.is_default && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemovePayment(method.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <PaymentMethodDialog 
        open={showAddPayment} 
        onOpenChange={setShowAddPayment}
        onPaymentMethodAdded={handlePaymentMethodAdded}
      />
    </>
  );
};

export default BillingSettings;
