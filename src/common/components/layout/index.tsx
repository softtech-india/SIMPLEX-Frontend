import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TopBar from '../dashboard/components/TopBar';
import Sidebar from '../dashboard/components/Sidebar';
import Footer from '../dashboard/components/Footer';
import { MenuProvider } from '../../../context/MenuContext';
import useIsMobile from '@/common/hooks/useIsMobile';
import { getStorageItem } from '@/common/utility/storage';
import { storageService } from '@/common/utility/storageService';
import { useAppStorage } from '@/hooks/useAuthStorage';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userPrivilege, setUserPrivilege] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const isMobile = useIsMobile();
  const { refreshStorage } = useAppStorage();

  // Load user privilege from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('userPriviledge');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserPrivilege(parsed);
      } catch {
        // Malformed data fallback
        setUserPrivilege(null);
        router.replace('/');
      }
    } else {
      // No privilege found, redirect to login/home
      router.replace('/');
    }
    setIsLoading(false);
  }, [router]);

  // Auto close/collapse sidebar on route change based on device type
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobile) {
        setSidebarOpen(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [isMobile, router.events]);

  // Loading spinner during initial load
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If userPrivilege is null or falsy, render nothing (or you could render a message)
  if (!userPrivilege) return null;

  // Logout clears everything except pinned menus and redirects
  const logout = () => {
    const pinnedMenus = storageService.getItem("pinned-menus");

    localStorage.clear();

    if (pinnedMenus !== null) {
      storageService.setItem("pinned-menus", pinnedMenus);
    }
    
    refreshStorage(); 

    router.push("/");
  };

  // Sidebar toggles for mobile and desktop
  const onToggleMobileSidebar = () => setSidebarOpen(prev => !prev);
  const onToggleDesktopSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <MenuProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Top navigation bar */}
        <TopBar
          user={userPrivilege.user}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          onToggleMobileSidebar={onToggleMobileSidebar}
          onToggleDesktopSidebar={onToggleDesktopSidebar}
          onLogout={logout}
        />

        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            collapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            menus={userPrivilege.priviledges}
          />

          {/* Main content area */}
          <div
            className={`flex flex-col flex-1 transition-all duration-300
              ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-80'}`}
          >
            <main className="flex-1 overflow-y-auto overflow-x-auto p-2">
              <div className="w-full">
                {children}
              </div>
            </main>

            {/* Footer only on desktop */}
            {!isMobile && <Footer />}
          </div>
        </div>
      </div>
    </MenuProvider>
  );
}