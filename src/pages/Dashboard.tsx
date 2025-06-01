import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Trash2, FileText, Calendar, Plus, LogOut, User, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import BillingSettings from '@/components/BillingSettings';
import ProfileSettings from '@/components/ProfileSettings';
import SubscriptionManager from '@/components/SubscriptionManager';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const comparisons = [
    { id: 1, title: 'Contract v1 vs v2', date: '2024-01-15', status: 'completed', files: ['contract_v1.docx', 'contract_v2.docx'] },
    { id: 2, title: 'Proposal Draft', date: '2024-01-14', status: 'completed', files: ['proposal_draft.pdf', 'proposal_final.pdf'] }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: "Logged out successfully" });
      navigate('/');
    } catch (error) {
      toast({ title: "Error logging out", variant: "destructive" });
    }
  };

  const handleAction = (action: string, id?: number) => {
    switch(action) {
      case 'view': navigate('/compare'); break;
      case 'download': toast({ title: "Download started" }); break;
      case 'delete': toast({ title: "Comparison deleted" }); break;
      case 'new': navigate('/upload'); break;
      case 'pricing': navigate('/pricing'); break;
      default: toast({ title: `${action} feature coming soon` });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your document comparisons and account settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-[#0056b3]">Basic</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">0.5 GB</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Comparisons
                  <Button size="sm" className="bg-[#0056b3] hover:bg-[#004494]" onClick={() => handleAction('new')}>
                    <Plus className="w-4 h-4 mr-1" />New Comparison
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisons.map((comparison) => (
                    <div key={comparison.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">{comparison.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{comparison.date}</span>
                            <Badge variant="secondary">{comparison.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleAction('view', comparison.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction('download', comparison.id)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction('delete', comparison.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfileSettings>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />Profile Settings
                  </Button>
                </ProfileSettings>
                <BillingSettings>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />Billing & Payments
                  </Button>
                </BillingSettings>
                <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />Log Out
                </Button>
              </CardContent>
            </Card>
            
            <SubscriptionManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
