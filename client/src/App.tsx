import "./index.css";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, createContext } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

import Home from "@/pages/Home";
import FindDoctors from "@/pages/FindDoctors";
import BookAppointment from "@/pages/BookAppointment";
import Telemedicine from "@/pages/Telemedicine";
import InsuranceHelp from "@/pages/InsuranceHelp";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import DoctorManagement from "@/pages/admin/DoctorManagement";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/not-found";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-doctors" component={FindDoctors} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/book-appointment/:doctorId" component={BookAppointment} />
      <Route path="/telemedicine" component={Telemedicine} />
      <Route path="/insurance-help" component={InsuranceHelp} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/doctors" component={DoctorManagement} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <MobileNav />
        </div>
        <Toaster />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
