import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Members from "@/pages/members";
import ChitGroups from "@/pages/chit-groups";
import Auctions from "@/pages/auctions";
import Payments from "@/pages/payments";
import Reports from "@/pages/reports";
import Staff from "@/pages/staff";
import Ledger from "@/pages/ledger";
import Settings from "@/pages/settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/members" component={Members} />
          <Route path="/chit-groups" component={ChitGroups} />
          <Route path="/auctions" component={Auctions} />
          <Route path="/payments" component={Payments} />
          <Route path="/reports" component={Reports} />
          <Route path="/staff" component={Staff} />
          <Route path="/ledger" component={Ledger} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
