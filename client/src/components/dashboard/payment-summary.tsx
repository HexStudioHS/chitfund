import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSummaryProps {
  paymentSummary?: {
    collected: string;
    pending: string;
    overdue: string;
    collectionRate: number;
  };
}

export default function PaymentSummary({ paymentSummary }: PaymentSummaryProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Collected</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ₹{paymentSummary?.collected || '0L'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ₹{paymentSummary?.pending || '0L'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ₹{paymentSummary?.overdue || '0L'}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Collection Rate</span>
              <span className="text-sm font-bold text-green-600">
                {paymentSummary?.collectionRate || 0}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
