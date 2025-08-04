import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  IndianRupee, 
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";

export default function Reports() {
  const reportCategories = [
    {
      title: "Cash Reports",
      description: "Late fees, agent-wise, group-wise collections",
      icon: IndianRupee,
      reports: [
        { name: "Late Fee Report", status: "available" },
        { name: "Agent Performance", status: "available" },
        { name: "Group-wise Collection", status: "available" },
        { name: "Daily Cash Summary", status: "processing" },
      ]
    },
    {
      title: "Ledger Reports",
      description: "General ledger, sub-ledger, day book",
      icon: FileText,
      reports: [
        { name: "General Ledger", status: "available" },
        { name: "Sub Ledger", status: "available" },
        { name: "Day Book", status: "available" },
        { name: "Trial Balance", status: "available" },
      ]
    },
    {
      title: "Member Reports",
      description: "Balance, transactions, credit-debit statements",
      icon: Users,
      reports: [
        { name: "Member Balance", status: "available" },
        { name: "Transaction History", status: "available" },
        { name: "Credit-Debit Statement", status: "available" },
        { name: "Member Profile", status: "available" },
      ]
    },
    {
      title: "Chit Reports",
      description: "Form XIV, payment register, advance reports",
      icon: BarChart3,
      reports: [
        { name: "Form XIV", status: "available" },
        { name: "Payment Register", status: "available" },
        { name: "Payable Amount", status: "available" },
        { name: "Subscriber Report", status: "processing" },
        { name: "Cost Estimate", status: "available" },
        { name: "Advance Report", status: "available" },
      ]
    },
    {
      title: "Arrear Reports",
      description: "Group-wise, member-wise, area-wise arrears",
      icon: TrendingUp,
      reports: [
        { name: "Group-wise Arrears", status: "available" },
        { name: "Member-wise Arrears", status: "available" },
        { name: "Area-wise Arrears", status: "available" },
        { name: "Overdue Analysis", status: "available" },
      ]
    },
    {
      title: "GST Reports",
      description: "GST compliance and tax reports",
      icon: PieChart,
      reports: [
        { name: "GST Summary", status: "available" },
        { name: "Tax Collection", status: "available" },
        { name: "GST Returns", status: "processing" },
        { name: "Input Tax Credit", status: "available" },
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reports" subtitle="Generate and download comprehensive reports" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Reports Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">5</div>
                <p className="text-xs text-gray-500">In queue</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-xs text-gray-500">Auto-generated</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {category.reports.map((report, reportIndex) => (
                      <div key={reportIndex} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-sm">{report.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={report.status === 'available' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {report.status}
                          </Badge>
                          {report.status === 'available' && (
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Collection Summary</p>
                    <p className="text-sm text-gray-600">Auto-generated on 1st of every month</p>
                  </div>
                  <Badge variant="outline">Monthly</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Arrears Report</p>
                    <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                  </div>
                  <Badge variant="outline">Weekly</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Daily Cash Flow</p>
                    <p className="text-sm text-gray-600">Every day at 6:00 PM</p>
                  </div>
                  <Badge variant="outline">Daily</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
