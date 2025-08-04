import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricCard from "@/components/dashboard/metric-card";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import UpcomingAuctions from "@/components/dashboard/upcoming-auctions";
import PaymentSummary from "@/components/dashboard/payment-summary";
import RecentAlerts from "@/components/dashboard/recent-alerts";
import { Users, LayersIcon, IndianRupee, Gavel } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics, isLoading: metricsLoading } = useQuery<{
    totalMembers: number;
    activeGroups: number;
    monthlyCollections: string;
    pendingAuctions: number;
    paymentSummary: {
      collected: string;
      pending: string;
      overdue: string;
      collectionRate: number;
    };
  }>({
    queryKey: ["/api/dashboard/metrics"],
    enabled: isAuthenticated,
  });

  const dashboardMetrics = metrics || {
    totalMembers: 0,
    activeGroups: 0,
    monthlyCollections: '0L',
    pendingAuctions: 0,
    paymentSummary: {
      collected: '0L',
      pending: '0L',
      overdue: '0L',
      collectionRate: 0
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" subtitle="Welcome back" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Members"
              value={dashboardMetrics.totalMembers}
              change="12% from last month"
              trend="up"
              icon={Users}
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <MetricCard
              title="Active Chit Groups"
              value={dashboardMetrics.activeGroups}
              change="8% from last month"
              trend="up"
              icon={LayersIcon}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <MetricCard
              title="Monthly Collections"
              value={`₹${dashboardMetrics.monthlyCollections}`}
              change="3% from last month"
              trend="down"
              icon={IndianRupee}
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <MetricCard
              title="Pending Auctions"
              value={dashboardMetrics.pendingAuctions}
              change="Next: Tomorrow"
              trend="neutral"
              icon={Gavel}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              <RecentTransactions />
              <UpcomingAuctions />
            </div>

            <div className="space-y-6">
              <PaymentSummary paymentSummary={dashboardMetrics.paymentSummary} />
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
