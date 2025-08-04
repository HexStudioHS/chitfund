import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AuctionForm from "@/components/forms/auction-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Gavel, Search, Calendar, IndianRupee, Clock } from "lucide-react";
import type { Auction } from "@shared/schema";

export default function Auctions() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: auctions, isLoading } = useQuery<Auction[]>({
    queryKey: ["/api/auctions"],
  });

  const { data: upcomingAuctions } = useQuery<Auction[]>({
    queryKey: ["/api/auctions/upcoming"],
  });

  const filteredAuctions = (auctions || []).filter((auction: Auction) =>
    auction.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: "roundNumber",
      header: "Round",
      cell: ({ row }: any) => (
        <Badge variant="outline">
          Round {row.original.roundNumber}
        </Badge>
      ),
    },
    {
      accessorKey: "groupId",
      header: "Group",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.groupId}</p>
        </div>
      ),
    },
    {
      accessorKey: "chitAmount",
      header: "Chit Amount",
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <IndianRupee className="h-3 w-3 mr-1" />
          {Number(row.original.chitAmount).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      cell: ({ row }: any) => (
        <div className="flex items-center text-green-600">
          <IndianRupee className="h-3 w-3 mr-1" />
          {Number(row.original.discountAmount || 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "auctionDate",
      header: "Auction Date",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(row.original.auctionDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge 
          variant={
            row.original.status === 'completed' ? 'default' :
            row.original.status === 'scheduled' ? 'outline' :
            row.original.status === 'pending' ? 'secondary' : 'destructive'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Auctions" subtitle="Manage auction schedules and results" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Auctions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(auctions || []).length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{(upcomingAuctions || []).length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(upcomingAuctions || []).filter((auction: Auction) => {
                    const auctionDate = new Date(auction.auctionDate);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return auctionDate <= weekFromNow;
                  }).length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {(auctions || []).filter((auction: Auction) => auction.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {upcomingAuctions && upcomingAuctions.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Upcoming Auctions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(upcomingAuctions || []).slice(0, 3).map((auction: Auction) => (
                    <div key={auction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Gavel className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Round {auction.roundNumber}</p>
                          <p className="text-sm text-gray-600">Amount: ₹{Number(auction.chitAmount).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(auction.auctionDate).toLocaleDateString()} at{' '}
                            {new Date(auction.auctionDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{auction.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Auctions</CardTitle>
                <AuctionForm />
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search auctions..."
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
                <DataTable columns={columns} data={filteredAuctions} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
