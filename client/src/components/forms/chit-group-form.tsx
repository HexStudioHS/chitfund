import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChitGroupSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { z } from "zod";

type ChitGroupFormData = z.infer<typeof insertChitGroupSchema>;

interface ChitGroupFormProps {
  onSubmit: (data: ChitGroupFormData) => void;
  isLoading: boolean;
  defaultValues?: Partial<ChitGroupFormData>;
}

export default function ChitGroupForm({ onSubmit, isLoading, defaultValues }: ChitGroupFormProps) {
  const form = useForm<ChitGroupFormData>({
    resolver: zodResolver(insertChitGroupSchema),
    defaultValues: {
      groupName: '',
      chitAmount: '0',
      duration: 12,
      frequency: 'monthly',
      totalMembers: 10,
      currentRound: 1,
      monthlyContribution: '0',
      startDate: new Date(),
      status: 'active',
      ...defaultValues,
    },
  });

  const calculateMonthlyContribution = () => {
    const chitAmount = parseFloat(form.getValues('chitAmount')) || 0;
    const totalMembers = form.getValues('totalMembers') || 1;
    const contribution = chitAmount / totalMembers;
    form.setValue('monthlyContribution', contribution.toString());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chitAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chit Amount *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter chit amount"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      calculateMonthlyContribution();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="totalMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Members *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter total members"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value) || 0);
                      calculateMonthlyContribution();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Months) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter duration in months"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Frequency *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'active'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="tri-monthly">Tri-monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="monthlyContribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Contribution (Auto-calculated)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Monthly contribution"
                  {...field}
                  readOnly
                  className="bg-gray-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
