import { Link, useLocation } from "wouter";
import { useState, useContext } from "react";
import { 
  Hospital, 
  Menu,
  UserCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/App";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useContext(UserContext);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <Hospital className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-primary ml-2">MediConnect</span>
              </a>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/">
                <a className={`border-b-2 ${location === "/" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} px-1 pt-1 pb-3 text-sm font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/find-doctors">
                <a className={`border-b-2 ${location === "/find-doctors" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} px-1 pt-1 pb-3 text-sm font-medium`}>
                  Find Doctors
                </a>
              </Link>
              <Link href="/telemedicine">
                <a className={`border-b-2 ${location === "/telemedicine" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} px-1 pt-1 pb-3 text-sm font-medium`}>
                  Telemedicine
                </a>
              </Link>
              <Link href="/insurance-help">
                <a className={`border-b-2 ${location === "/insurance-help" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} px-1 pt-1 pb-3 text-sm font-medium`}>
                  Insurance Help
                </a>
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            {user ? (
              <Link href="/profile">
                <a className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  <UserCircle className="mr-1 h-5 w-5" />
                  {user.firstName} {user.lastName}
                </a>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <a className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Sign In</a>
                </Link>
                <Link href="/register">
                  <Button className="ml-4" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`block pl-3 pr-4 py-2 text-base font-medium ${location === "/" ? "bg-primary-50 border-l-4 border-primary text-primary-700" : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}>
                Home
              </a>
            </Link>
            <Link href="/find-doctors">
              <a className={`block pl-3 pr-4 py-2 text-base font-medium ${location === "/find-doctors" ? "bg-primary-50 border-l-4 border-primary text-primary-700" : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}>
                Find Doctors
              </a>
            </Link>
            <Link href="/telemedicine">
              <a className={`block pl-3 pr-4 py-2 text-base font-medium ${location === "/telemedicine" ? "bg-primary-50 border-l-4 border-primary text-primary-700" : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}>
                Telemedicine
              </a>
            </Link>
            <Link href="/insurance-help">
              <a className={`block pl-3 pr-4 py-2 text-base font-medium ${location === "/insurance-help" ? "bg-primary-50 border-l-4 border-primary text-primary-700" : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"}`}>
                Insurance Help
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <UserCircle className="h-8 w-8 text-gray-400" />
              </div>
              {user ? (
                <div className="ml-3">
                  <Link href="/profile">
                    <a className="text-base font-medium text-gray-800">{user.firstName} {user.lastName}</a>
                  </Link>
                  <p className="text-sm font-medium text-gray-500">{user.email}</p>
                </div>
              ) : (
                <div className="ml-3">
                  <Link href="/login">
                    <a className="text-base font-medium text-gray-800">Sign In</a>
                  </Link>
                  <p className="text-sm font-medium text-gray-500">or <Link href="/register"><a className="text-primary">Register</a></Link></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
