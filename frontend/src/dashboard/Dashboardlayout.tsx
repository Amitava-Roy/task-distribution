import React, { useEffect, useState } from "react";
import { UsersRound, ClipboardList, Menu } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAuthData } from "../config/authConfig";

// Define the types for our tabs
type TabId = "agents" | "tasks";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

// Navigation items configuration
const navItems: NavItem[] = [
  { id: "agents", label: "Agents", icon: UsersRound },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
];

// Props for navigation components
interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tabId: TabId) => void;
}

// Sidebar component for desktop view
const Sidebar: React.FC<NavigationProps> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    // Glassmorphism effect for the sidebar
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white/20 backdrop-blur-lg shadow-xl border-r border-white/30 transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-white/30">
        <h1 className="text-2xl font-semibold text-purple-800">Dashboard</h1>
      </div>
      <nav className="flex-grow p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => navigate(`/${item.id}`)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ease-in-out
                  ${
                    pathname.includes(item.id)
                      ? "bg-purple-600/80 text-white shadow-md"
                      : "hover:bg-white/30 text-purple-700 hover:text-purple-900"
                  }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Bottom Navigation component for mobile view
const BottomNavBar: React.FC<NavigationProps> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    // Glassmorphism effect for bottom nav
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-lg text-purple-700 flex justify-around p-2 border-t border-white/30 shadow-lg_top">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(`/${item.id}`)}
          className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200 ease-in-out w-1/2
            ${
              pathname.includes(item.id)
                ? "text-purple-700 bg-white/40 rounded-lg"
                : "text-purple-600 hover:text-purple-800 hover:bg-white/20"
            }`}
        >
          <item.icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// Mobile Header with Hamburger Menu
interface MobileHeaderProps {
  onMenuToggle: () => void;
}
const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle }) => {
  return (
    // Glassmorphism effect for mobile header
    <header className="md:hidden bg-white/20 backdrop-blur-lg text-purple-800 p-4 flex justify-between items-center sticky top-0 z-20 shadow-md border-b border-white/30">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-md hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
};

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabId>("agents");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const { token } = getAuthData();
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <div className="font-sans antialiased bg-gradient-to-tr from-fuchsia-100 via-purple-200 to-slate-300 min-h-screen text-slate-800">
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col flex-1 overflow-hidden">
          {" "}
          {/* This div is important for layout */}
          <MobileHeader onMenuToggle={handleMenuToggle} />
          <Outlet />
        </div>

        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
