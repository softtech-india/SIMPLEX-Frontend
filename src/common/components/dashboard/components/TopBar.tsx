'user client'
import useCompanyStore from '@/store/useCompanyStore';
import { Menu, X, LogOut, User } from 'lucide-react';

interface TopBarProps {
  user: any;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  onToggleMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
  onLogout: () => void;
}

export default function TopBar({
  user,
  sidebarOpen,
  sidebarCollapsed,
  onToggleMobileSidebar,
  onToggleDesktopSidebar,
  onLogout,
}: TopBarProps) {

  const { companyName } = useCompanyStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="h-full flex items-center justify-between px-4">

        <div className="flex items-center gap-4">

          <button
            onClick={onToggleMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button
            onClick={onToggleDesktopSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* <div className="w-10 h-10 rounded-md flex items-center justify-center overflow-hidden">
              <img
                src="/images/home_logo.png"
                alt="Home Logo"
                className="w-full h-full object-contain"
              />
            </div> */}

            <span className="hidden sm:block text-lg font-semibold text-gray-700">
              {companyName || 'NA'}
            </span>
          </div>

        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg w-full sm:w-auto justify-between sm:justify-start">

            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <User className="w-4 h-4 text-gray-600 hidden md:block" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                {user?.username || "User"}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 sm:p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}
