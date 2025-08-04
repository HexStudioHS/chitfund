import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Coins, 
  LayoutDashboard, 
  Users, 
  LayersIcon, 
  Gavel, 
  CreditCard, 
  BookOpen, 
  BarChart3, 
  Bus, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Chit Groups", href: "/chit-groups", icon: LayersIcon },
  { name: "Auctions", href: "/auctions", icon: Gavel },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Staff", href: "/staff", icon: Bus },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Coins className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChitFund Pro</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors",
                  isActive
                    ? "text-white bg-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                  <item.icon className="mr-3 w-5 h-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
