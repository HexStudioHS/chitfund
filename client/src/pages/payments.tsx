import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PaymentForm from "@/components/forms/payment-form";
import { DataTable } from "@/components/ui/data-table";
import { CreditCard, Search, IndianRupee, Receipt, AlertTriangle } from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      await apiRequest("POST", "/api/transactions", paymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  const filteredTransactions = (transactions || []).filter((transaction: Transaction) =>
    transaction.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const paidTransactions = (transactions || []).filter((t: Transaction) => t.status === 'paid');
  const pendingTransactions = (transactions || []).filter((t: Transaction) => t.status === 'pending');
  const overdueTransactions = (transactions || []).filter((t: Transaction) => 
    t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()
  );

  const totalPaid = paidTransactions.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
  const totalPending = pendingTransactions.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
  const totalOverdue = overdueTransactions.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

  const columns = [
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Receipt className="h-3 w-3 mr-1" />
          {row.original.receiptNumber || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: "memberId",
      header: "Member",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.memberId}</p>
        </div>
      ),
    },
    {
      accessorKey: "groupId",
      header: "Group",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => (
        <div className="flex items-center font-medium">
          <IndianRupee className="h-3 w-3 mr-1" />
          {Number(row.original.amount).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge 
          variant={
            row.original.status === 'paid' ? 'default' :
            row.original.status === 'pending' ? 'secondary' : 'destructive'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: "paidDate",
      header: "Paid Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.paidDate ? new Date(row.original.paidDate).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Payments" subtitle="Track and manage all payment transactions" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Total Collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{(totalPaid / 100000).toFixed(1)}L
                </div>
                <p className="text-xs text-gray-500">{paidTransactions.length} payments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ₹{(totalPending / 100000).toFixed(1)}L
                </div>
                <p className="text-xs text-gray-500">{pendingTransactions.length} pending</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ₹{(totalOverdue / 100000).toFixed(1)}L
                </div>
                <p className="text-xs text-gray-500">{overdueTransactions.length} overdue</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {totalPaid + totalPending > 0 ? 
                    Math.round((totalPaid / (totalPaid + totalPending)) * 100) : 0}%
                </div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Transactions</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Record New Payment</DialogTitle>
                    </DialogHeader>
                    <PaymentForm 
                      onSubmit={createPaymentMutation.mutate}
                      isLoading={createPaymentMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={columns} data={filteredTransactions} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
