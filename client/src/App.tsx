import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Historico from "./pages/Historico";
import HistoricoRS from "./pages/HistoricoRS";
import Diploma from "./pages/Diploma";
import Profiles from "./pages/Profiles";
import AdminPDFManager from "./pages/AdminPDFManager";
import PublishedTemplateViewer from "./pages/PublishedTemplateViewer";
import AdminDashboard from "./pages/AdminDashboard";
import CNHCreator from "./pages/CNHCreator";
import HistoricoSP from "./pages/HistoricoSP";
import RecipeEditor from "./pages/RecipeEditor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/historico" component={Historico} />
      <Route path="/historico-rs" component={HistoricoRS} />
      <Route path="/diploma" component={Diploma} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/pdf-manager" component={AdminPDFManager} />
      <Route path="/template/:id" component={PublishedTemplateViewer} />
      <Route path="/create/cnh" component={CNHCreator} />
      <Route path="/historico-sp" component={HistoricoSP} />
      <Route path="/create/recipe" component={RecipeEditor} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
