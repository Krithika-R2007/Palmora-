import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/context/RoleContext";
import { CompareProvider } from "@/context/CompareContext";
import { Nav } from "@/components/layout/Nav";
import { CompareDrawer } from "@/components/layout/CompareDrawer";
import { Home } from "@/pages/Home";
import { Discover } from "@/pages/Discover";
import { SalonDetail } from "@/pages/SalonDetail";
import { Book } from "@/pages/Book";
import { Marketplace } from "@/pages/Marketplace";
import { Dashboard } from "@/pages/Dashboard";
import { Help } from "@/pages/Help";
import { Compare } from "@/pages/Compare";
import { Admin } from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Router() {
  return (
    <>
      <Nav />
      <CompareDrawer />
      <div style={{ paddingTop: 100 }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/salon/:id" component={SalonDetail} />
          <Route path="/book" component={Book} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/help" component={Help} />
          <Route path="/compare" component={Compare} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RoleProvider>
          <CompareProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          </CompareProvider>
        </RoleProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
