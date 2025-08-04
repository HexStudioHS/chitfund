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
import ChitGroupForm from "@/components/forms/chit-group-form";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Search, Users, Calendar, IndianRupee } from "lucide-react";
import type { ChitGroup } from "@shared/schema";

export default function ChitGroups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery<ChitGroup[]>({
    queryKey: ["/api/chit-groups"],
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: any) => {
      await apiRequest("POST", "/api/chit-groups", groupData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chit-groups"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Chit group created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create chit group",
        variant: "destructive",
      });
    },
  });

  const filteredGroups = (groups || []).filter((group: ChitGroup) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.groupCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const columns = [
    {
      accessorKey: "groupCode",
      header: "Group ID",
    },
    {
      accessorKey: "groupName",
      header: "Group Name",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.groupName}</p>
          <p className="text-sm text-gray-500">Round {row.original.currentRound}</p>
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
      accessorKey: "members",
      header: "Members",
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Users className="h-3 w-3 mr-1" />
          {row.original.totalMembers}
        </div>
      ),
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {row.original.frequency}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(row.original.startDate).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Chit Groups" subtitle="Manage chit groups and their operations" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Chit Groups</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Chit Group</DialogTitle>
                    </DialogHeader>
                    <ChitGroupForm 
                      onSubmit={createGroupMutation.mutate}
                      isLoading={createGroupMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
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
                <DataTable columns={columns} data={filteredGroups} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
