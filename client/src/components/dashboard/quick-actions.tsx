import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuctionForm from "@/components/forms/auction-form";
import { UserPlus, PlusCircle, CreditCard, FileText, Gavel } from "lucide-react";

export default function QuickActions() {
  const handleAddMember = () => {
    // Navigate to members page or open modal
    window.location.href = '/members';
  };

  const handleCreateGroup = () => {
    // Navigate to chit groups page or open modal
    window.location.href = '/chit-groups';
  };

  const handleRecordPayment = () => {
    // Navigate to payments page or open modal
    window.location.href = '/payments';
  };

  const handleGenerateReport = () => {
    // Navigate to reports page
    window.location.href = '/reports';
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-gray-200 hover:bg-gray-50"
            onClick={handleAddMember}
          >
            <UserPlus className="text-blue-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Member</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-gray-200 hover:bg-gray-50"
            onClick={handleCreateGroup}
          >
            <PlusCircle className="text-green-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Create Group</span>
          </Button>
          
          <AuctionForm 
            trigger={
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border border-gray-200 hover:bg-gray-50"
              >
                <Gavel className="text-orange-600 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Schedule Auction</span>
              </Button>
            }
          />
          
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto border border-gray-200 hover:bg-gray-50"
            onClick={handleRecordPayment}
          >
            <CreditCard className="text-blue-600 text-2xl mb-2" />
            <span className="text-sm font-medium text-gray-700">Record Payment</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
