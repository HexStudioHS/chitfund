import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Phone, 
  Globe, 
  DollarSign,
  Calendar,
  Users,
  Save,
  RefreshCw
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Company Settings
  const [companyName, setCompanyName] = useState("ChitFund Pro");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLicense, setCompanyLicense] = useState("");

  // System Settings
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [fiscalYearStart, setFiscalYearStart] = useState("April");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [auctionAlerts, setAuctionAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordPolicy, setPasswordPolicy] = useState("medium");
  const [loginAttempts, setLoginAttempts] = useState("5");

  // Chit Fund Settings
  const [defaultInterestRate, setDefaultInterestRate] = useState("12");
  const [defaultFineRate, setDefaultFineRate] = useState("2");
  const [auctionDuration, setAuctionDuration] = useState("30");
  const [minimumBidAmount, setMinimumBidAmount] = useState("100");

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      // In a real app, this would save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      return settings;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    const settings = {
      company: {
        name: companyName,
        address: companyAddress,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite,
        license: companyLicense,
      },
      system: {
        currency: defaultCurrency,
        dateFormat,
        timeZone,
        fiscalYearStart,
      },
      notifications: {
        email: emailNotifications,
        sms: smsNotifications,
        paymentReminders,
        auctionAlerts,
        systemAlerts,
      },
      security: {
        twoFactorAuth,
        sessionTimeout,
        passwordPolicy,
        loginAttempts,
      },
      chitFund: {
        defaultInterestRate,
        defaultFineRate,
        auctionDuration,
        minimumBidAmount,
      },
    };

    saveSettingsMutation.mutate(settings);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" subtitle="Configure system preferences" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="company" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="company" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  System
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="chitfund" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Chit Fund
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyLicense">License Number</Label>
                        <Input
                          id="companyLicense"
                          value={companyLicense}
                          onChange={(e) => setCompanyLicense(e.target.value)}
                          placeholder="Enter license number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Enter company address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyPhone">Phone</Label>
                        <Input
                          id="companyPhone"
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail">Email</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Website</Label>
                        <Input
                          id="companyWebsite"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="Enter website URL"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <SettingsIcon className="h-5 w-5 mr-2" />
                      System Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Time Zone</Label>
                        <Select value={timeZone} onValueChange={setTimeZone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Fiscal Year Start</Label>
                        <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="January">January</SelectItem>
                            <SelectItem value="April">April</SelectItem>
                            <SelectItem value="July">July</SelectItem>
                            <SelectItem value="October">October</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={smsNotifications}
                          onCheckedChange={setSmsNotifications}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Payment Reminders</Label>
                          <p className="text-sm text-gray-500">Send reminders for due payments</p>
                        </div>
                        <Switch
                          checked={paymentReminders}
                          onCheckedChange={setPaymentReminders}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Auction Alerts</Label>
                          <p className="text-sm text-gray-500">Notify about upcoming auctions</p>
                        </div>
                        <Switch
                          checked={auctionAlerts}
                          onCheckedChange={setAuctionAlerts}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">System Alerts</Label>
                          <p className="text-sm text-gray-500">Important system notifications</p>
                        </div>
                        <Switch
                          checked={systemAlerts}
                          onCheckedChange={setSystemAlerts}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                      />
                    </div>
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Password Policy</Label>
                        <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Security</SelectItem>
                            <SelectItem value="medium">Medium Security</SelectItem>
                            <SelectItem value="high">High Security</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Login Attempts</Label>
                      <Select value={loginAttempts} onValueChange={setLoginAttempts}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chitfund">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Chit Fund Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultInterestRate">Default Interest Rate (%)</Label>
                        <Input
                          id="defaultInterestRate"
                          type="number"
                          step="0.1"
                          value={defaultInterestRate}
                          onChange={(e) => setDefaultInterestRate(e.target.value)}
                          placeholder="Enter interest rate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="defaultFineRate">Default Fine Rate (%)</Label>
                        <Input
                          id="defaultFineRate"
                          type="number"
                          step="0.1"
                          value={defaultFineRate}
                          onChange={(e) => setDefaultFineRate(e.target.value)}
                          placeholder="Enter fine rate"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auctionDuration">Auction Duration (minutes)</Label>
                        <Input
                          id="auctionDuration"
                          type="number"
                          value={auctionDuration}
                          onChange={(e) => setAuctionDuration(e.target.value)}
                          placeholder="Enter auction duration"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minimumBidAmount">Minimum Bid Amount (₹)</Label>
                        <Input
                          id="minimumBidAmount"
                          type="number"
                          value={minimumBidAmount}
                          onChange={(e) => setMinimumBidAmount(e.target.value)}
                          placeholder="Enter minimum bid amount"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Current Configuration</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Interest Rate:</span>
                          <Badge variant="outline" className="ml-2">{defaultInterestRate}%</Badge>
                        </div>
                        <div>
                          <span className="text-blue-700">Fine Rate:</span>
                          <Badge variant="outline" className="ml-2">{defaultFineRate}%</Badge>
                        </div>
                        <div>
                          <span className="text-blue-700">Auction Duration:</span>
                          <Badge variant="outline" className="ml-2">{auctionDuration} min</Badge>
                        </div>
                        <div>
                          <span className="text-blue-700">Min Bid:</span>
                          <Badge variant="outline" className="ml-2">₹{minimumBidAmount}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saveSettingsMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
