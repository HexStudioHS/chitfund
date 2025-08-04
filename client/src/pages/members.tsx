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
import MemberForm from "@/components/forms/member-form";
import { DataTable } from "@/components/ui/data-table";
import { UserPlus, Search, Phone, Mail } from "lucide-react";
import type { Member } from "@shared/schema";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const createMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      await apiRequest("POST", "/api/members", memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Member created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create member",
        variant: "destructive",
      });
    },
  });

  const filteredMembers = (members || []).filter((member: Member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  ) || [];

  const columns = [
    {
      accessorKey: "memberCode",
      header: "Member ID",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{`${row.original.firstName} ${row.original.lastName}`}</p>
          <p className="text-sm text-gray-500">{row.original.familyCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" />
            {row.original.phone}
          </div>
          {row.original.email && (
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-3 w-3 mr-1" />
              {row.original.email}
            </div>
          )}
        </div>
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
      accessorKey: "riskScore",
      header: "Risk Score",
      cell: ({ row }: any) => (
        <Badge variant={row.original.riskScore > 70 ? 'destructive' : row.original.riskScore > 40 ? 'outline' : 'default'}>
          {row.original.riskScore}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Members" subtitle="Manage member profiles and information" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Members</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                    </DialogHeader>
                    <MemberForm 
                      onSubmit={createMemberMutation.mutate}
                      isLoading={createMemberMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
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
                <DataTable columns={columns} data={filteredMembers} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
