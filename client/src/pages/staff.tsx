import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { UserPlus, Search, Shield, Users, TrendingUp, Award } from "lucide-react";
import type { User } from "@shared/schema";

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");

  // For now, we'll use the current user data as staff data
  // In a real implementation, you'd have a separate staff endpoint
  const { data: currentUser, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const staffMembers: User[] = currentUser ? [currentUser] : [];

  const filteredStaff = staffMembers.filter((staff: User) =>
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-3">
          <img 
            src={row.original.profileImageUrl || `https://ui-avatars.com/api/?name=${row.original.firstName}+${row.original.lastName}&background=random`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{`${row.original.firstName} ${row.original.lastName}`}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => (
        <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Staff Management" subtitle="Manage staff members and their roles" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Total Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-gray-500">Active members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">1</div>
                <p className="text-xs text-gray-500">Admin access</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Collection Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-xs text-gray-500">Field agents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">95%</div>
                <p className="text-xs text-gray-500">Avg. collection rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={currentUser?.profileImageUrl || `https://ui-avatars.com/api/?name=${currentUser?.firstName || 'Admin'}+${currentUser?.lastName || 'User'}&background=random`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{currentUser ? `${currentUser.firstName || 'Admin'} ${currentUser.lastName || 'User'}` : 'Admin User'}</p>
                        <p className="text-sm text-gray-600">{currentUser?.role || 'Administrator'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">100% Collection Rate</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member Management</span>
                    <Badge variant="default">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Financial Reports</span>
                    <Badge variant="default">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auction Management</span>
                    <Badge variant="default">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff Management</span>
                    <Badge variant="default">Full Access</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Staff Members</CardTitle>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search staff..."
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
                <DataTable columns={columns} data={filteredStaff} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
