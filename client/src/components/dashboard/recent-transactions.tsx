import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@shared/schema";

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const recentTransactions = (transactions || []).slice(0, 5);

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
          <Button variant="link" className="text-blue-600 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Member</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Group</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                recentTransactions.map((transaction: Transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium">
                            {transaction.memberId.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">{transaction.groupId}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">
                      ₹{Number(transaction.amount).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          transaction.status === 'paid' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
