import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Clock } from 'lucide-react';

interface UsageLimitsProps {
  children: React.ReactNode;
}

const UsageLimits: React.FC<UsageLimitsProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const usageData = {
    storage: { used: 2.4, limit: 10, percentage: 24 },
    apiCalls: { used: 156, limit: 1000, percentage: 15.6 }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Usage & Limits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <HardDrive className="w-4 h-4" />
                <span>Storage Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{usageData.storage.used} GB used</span>
                  <span>{usageData.storage.limit} GB limit</span>
                </div>
                <Progress value={usageData.storage.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Clock className="w-4 h-4" />
                <span>API Calls (This Month)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{usageData.apiCalls.used} used</span>
                  <span>{usageData.apiCalls.limit} limit</span>
                </div>
                <Progress value={usageData.apiCalls.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Usage resets on the 1st of each month. Upgrade your plan for higher limits.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsageLimits;
