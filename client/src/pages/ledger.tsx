import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Download, Filter, BookOpen, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { ChitGroup, Member } from "@shared/schema";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: string;
  status: string;
  receiptNumber: string;
  memberName: string;
  groupName: string;
  notes: string;
}

interface LedgerSummary {
  totalCredits: string;
  totalDebits: string;
  balance: string;
  transactionCount: number;
}

export default function Ledger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: chitGroups } = useQuery<ChitGroup[]>({
    queryKey: ["/api/chit-groups"],
  });

  const { data: members } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const ledgerParams = new URLSearchParams();
  if (selectedGroup) ledgerParams.append('groupId', selectedGroup);
  if (selectedMember) ledgerParams.append('memberId', selectedMember);
  if (startDate) ledgerParams.append('startDate', startDate.toISOString());
  if (endDate) ledgerParams.append('endDate', endDate.toISOString());

  const { data: ledgerEntries, isLoading } = useQuery<LedgerEntry[]>({
    queryKey: ["/api/ledger", ledgerParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/ledger?${ledgerParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Failed to fetch ledger entries');
      return response.json();
    },
  });

  const summaryParams = new URLSearchParams();
  if (selectedGroup) summaryParams.append('groupId', selectedGroup);
  if (selectedMember) summaryParams.append('memberId', selectedMember);

  const { data: ledgerSummary } = useQuery<LedgerSummary>({
    queryKey: ["/api/ledger/summary", summaryParams.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/ledger/summary?${summaryParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error('Failed to fetch ledger summary');
      return response.json();
    },
  });

  const filteredEntries = (ledgerEntries || []).filter((entry: LedgerEntry) =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
      cell: ({ row }: any) => (
        <div className="font-mono text-sm">
          {row.original.receiptNumber || '-'}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.description}</p>
          {row.original.notes && (
            <p className="text-xs text-gray-500">{row.original.notes}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "memberName",
      header: "Member",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.memberName || '-'}
        </div>
      ),
    },
    {
      accessorKey: "groupName",
      header: "Group",
      cell: ({ row }: any) => (
        <div className="text-sm">
          {row.original.groupName || '-'}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => (
        <Badge 
          variant={
            row.original.type === 'payment' || row.original.type === 'bonus' ? 'default' :
            row.original.type === 'withdrawal' || row.original.type === 'fine' ? 'destructive' : 'secondary'
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => {
        const isCredit = row.original.type === 'payment' || row.original.type === 'bonus';
        return (
          <div className={`flex items-center font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
            {isCredit ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            ₹{Number(row.original.amount).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge 
          variant={
            row.original.status === 'paid' ? 'default' :
            row.original.status === 'pending' ? 'secondary' : 'destructive'
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const clearFilters = () => {
    setSelectedGroup("");
    setSelectedMember("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Ledger" subtitle="Financial transaction records" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Total Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{ledgerSummary?.totalCredits || '0L'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                  Total Debits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ₹{ledgerSummary?.totalDebits || '0L'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                  Net Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{ledgerSummary?.balance || '0L'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {ledgerSummary?.transactionCount || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Chit Group</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="All groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All groups</SelectItem>
                      {chitGroups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.groupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="All members" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All members</SelectItem>
                      {members?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ledger Entries */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ledger Entries</CardTitle>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
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
                <DataTable columns={columns} data={filteredEntries} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
