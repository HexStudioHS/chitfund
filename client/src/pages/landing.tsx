import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Users, TrendingUp, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Coins className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">ChitFund Pro</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete chit fund management system for modern financial institutions. 
            Manage members, groups, auctions, and payments with ease.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete member profiles with document verification, risk scoring, and family grouping.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Group Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage chit groups with flexible terms, automated calculations, and auction scheduling.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Coins className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Payment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated payment tracking, receipt generation, and comprehensive financial reporting.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Secure & Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Role-based access control, document management, and compliance with financial regulations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to modernize your chit fund operations?</h2>
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
