import { Link, useLocation } from "wouter";
import { Home, Search, Video, User } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 h-16">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center ${location === "/" ? "text-primary" : "text-gray-500"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/find-doctors">
          <a className={`flex flex-col items-center justify-center ${location === "/find-doctors" ? "text-primary" : "text-gray-500"}`}>
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Find</span>
          </a>
        </Link>
        <Link href="/telemedicine">
          <a className={`flex flex-col items-center justify-center ${location === "/telemedicine" ? "text-primary" : "text-gray-500"}`}>
            <Video className="h-5 w-5" />
            <span className="text-xs mt-1">Consult</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center justify-center ${location === "/profile" ? "text-primary" : "text-gray-500"}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
