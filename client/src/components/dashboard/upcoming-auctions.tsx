import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, ChevronRight } from "lucide-react";
import type { Auction } from "@shared/schema";

export default function UpcomingAuctions() {
  const { data: auctions, isLoading } = useQuery({
    queryKey: ["/api/auctions/upcoming"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingAuctions = (auctions || []).slice(0, 3);

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Auctions</CardTitle>
          <Button variant="link" className="text-blue-600 text-sm font-medium">
            Schedule New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAuctions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upcoming auctions scheduled
            </div>
          ) : (
            upcomingAuctions.map((auction: Auction) => (
              <div key={auction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gavel className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Round {auction.roundNumber}</p>
                    <p className="text-sm text-gray-600">
                      Chit Amount: ₹{Number(auction.chitAmount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(auction.auctionDate).toLocaleDateString()} at{' '}
                      {new Date(auction.auctionDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      auction.status === 'scheduled' ? 'default' :
                      auction.status === 'pending' ? 'secondary' : 'outline'
                    }
                  >
                    {auction.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
