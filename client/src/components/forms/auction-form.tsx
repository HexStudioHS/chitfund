import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Gavel } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ChitGroup, InsertAuction } from "@shared/schema";

interface AuctionFormProps {
  trigger?: React.ReactNode;
}

export default function AuctionForm({ trigger }: AuctionFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [roundNumber, setRoundNumber] = useState<string>("");
  const [chitAmount, setChitAmount] = useState<string>("");
  const [auctionDate, setAuctionDate] = useState<Date>();
  const [auctionTime, setAuctionTime] = useState<string>("10:00");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chitGroups } = useQuery<ChitGroup[]>({
    queryKey: ["/api/chit-groups"],
  });

  const createAuctionMutation = useMutation({
    mutationFn: async (data: InsertAuction) => {
      const response = await apiRequest("POST", "/api/auctions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auctions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions/upcoming"] });
      toast({
        title: "Success",
        description: "Auction scheduled successfully",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule auction",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedGroup("");
    setRoundNumber("");
    setChitAmount("");
    setAuctionDate(undefined);
    setAuctionTime("10:00");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup || !roundNumber || !chitAmount || !auctionDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = auctionTime.split(':');
    const combinedDateTime = new Date(auctionDate);
    combinedDateTime.setHours(parseInt(hours), parseInt(minutes));

    const auctionData: InsertAuction = {
      groupId: selectedGroup,
      roundNumber: parseInt(roundNumber),
      chitAmount: chitAmount,
      auctionDate: combinedDateTime,
      status: 'scheduled' as const,
    };

    createAuctionMutation.mutate(auctionData);
  };

  const selectedGroupData = chitGroups?.find(group => group.id === selectedGroup);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Gavel className="h-4 w-4 mr-2" />
            Schedule Auction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group">Chit Group *</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a chit group" />
              </SelectTrigger>
              <SelectContent>
                {chitGroups?.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.groupName} ({group.groupCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roundNumber">Round Number *</Label>
              <Input
                id="roundNumber"
                type="number"
                min="1"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                placeholder="Enter round number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chitAmount">Chit Amount *</Label>
              <Input
                id="chitAmount"
                type="number"
                step="0.01"
                value={chitAmount}
                onChange={(e) => setChitAmount(e.target.value)}
                placeholder={selectedGroupData ? selectedGroupData.chitAmount : "Enter amount"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auction Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !auctionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {auctionDate ? format(auctionDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={auctionDate}
                    onSelect={setAuctionDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="auctionTime">Time *</Label>
              <Input
                id="auctionTime"
                type="time"
                value={auctionTime}
                onChange={(e) => setAuctionTime(e.target.value)}
              />
            </div>
          </div>

          {selectedGroupData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Group Details</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Total Members: {selectedGroupData.totalMembers}</p>
                <p>Current Round: {selectedGroupData.currentRound}</p>
                <p>Monthly Contribution: ₹{Number(selectedGroupData.monthlyContribution).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAuctionMutation.isPending}>
              {createAuctionMutation.isPending ? "Scheduling..." : "Schedule Auction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
