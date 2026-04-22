import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  BarChart2,
  Users,
  Briefcase,
  Key,
  MapPin,
  Settings,
  Shield,
  Search,
  Star,
} from 'lucide-react';
import useIsMobile from '@/common/hooks/useIsMobile';
import { storageService } from '@/common/utility/storageService';

interface MenuItem {
  menuid: number;
  menuname: string;
  path?: string;
  text: string;
  icon?: string;
  isactive: boolean;
  items?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
  collapsed: boolean;
}

const ICONS: Record<string, any> = {
  Dashboard: Home,
  Admin: Settings,
  Configuration: Settings,
  'Financial Year': FileText,
  'User Wise Branch Mapping': MapPin,
  'Company Financial Year Mapping': BarChart2,
  'User Management': Users,
  'User Group': Key,
  User: Users,
  Company: Briefcase,
  Branch: MapPin,
  'User Priviledge': Shield,
  preferences: Settings,
};

// 🔍 Highlight
const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="bg-yellow-300 px-1 rounded">{part}</span>
      : part
  );
};

// 🔍 Filter
const filterMenus = (
  menus: MenuItem[],
  query: string
): { filtered: MenuItem[]; expandedIds: number[] } => {

  if (!query) return { filtered: menus, expandedIds: [] };

  const q = query.toLowerCase();
  const expandedIds: number[] = [];

  const recursive = (items: MenuItem[]): MenuItem[] =>
    items
      .map(item => {
        const children = item.items ? recursive(item.items) : [];
        const isMatch = item.menuname.toLowerCase().includes(q);

        if (isMatch || children.length > 0) {
          if (children.length > 0) expandedIds.push(item.menuid);
          return { ...item, items: children };
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];

  return { filtered: recursive(menus), expandedIds };
};

// ⭐ Menu Item
const MenuItemComponent: React.FC<any> = ({
  menu,
  collapsed,
  expandedMenus,
  toggleMenu,
  handleNavigation,
  routerPath,
  searchQuery,
  togglePin,
  pinnedMenus,
}) => {
  const hasSubMenus = (menu.items || []).length > 0;
  const isExpanded = expandedMenus[menu.menuid];
  const Icon = ICONS[menu.text] || FileText;
  const isActive = menu.path === routerPath;
  const isPinned = pinnedMenus.includes(menu.menuid);

  return (
    <div className="space-y-1">
      <button
        onClick={() => hasSubMenus ? toggleMenu(menu.menuid) : handleNavigation(menu.path)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
        ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <span className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          {!collapsed && (
            <span>{highlightText(menu.menuname, searchQuery)}</span>
          )}
        </span>

        {!collapsed && (
          <div className="flex items-center gap-2">
            {/* Pin */}
            <Star
              onClick={(e) => {
                e.stopPropagation();
                togglePin(menu.menuid);
              }}
              className={`w-4 h-4 ${isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
            />

            {hasSubMenus && (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </div>
        )}
      </button>

      {hasSubMenus && isExpanded && !collapsed && (
        <div className="ml-4 border-l pl-4 space-y-1">
          {(menu.items || []).map((child: MenuItem) => (
            <MenuItemComponent
              key={child.menuid}
              menu={child}
              collapsed={collapsed}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              handleNavigation={handleNavigation}
              routerPath={routerPath}
              searchQuery={searchQuery}
              togglePin={togglePin}
              pinnedMenus={pinnedMenus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({
  isOpen,
  onClose,
  menus = [],
  collapsed = false,
}: SidebarProps) {

  const router = useRouter();
  const isMobile = useIsMobile();

  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pinnedMenus, setPinnedMenus] = useState<number[]>([]);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const activeMenus = menus.filter(m => m.isactive);

  const { filtered: filteredMenus, expandedIds } = useMemo(() => {
    return filterMenus(activeMenus, debouncedQuery);
  }, [activeMenus, debouncedQuery]);

  // expand on search
  useEffect(() => {
    if (!debouncedQuery) return;

    const newExpanded: Record<number, boolean> = {};
    expandedIds.forEach(id => (newExpanded[id] = true));

    setExpandedMenus(prev =>
      JSON.stringify(prev) === JSON.stringify(newExpanded) ? prev : newExpanded
    );
  }, [debouncedQuery, expandedIds]);

  const toggleMenu = (id: number) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigation = (path?: string) => {
    if (path) router.push(path);
    if (isMobile) onClose();
  };
  // Pin logic
  useEffect(() => {
    const saved = storageService.getItem('pinned-menus');
    if (saved) setPinnedMenus(JSON.parse(saved));
  }, []);

  useEffect(() => {
    storageService.setItem('pinned-menus', JSON.stringify(pinnedMenus));
  }, [pinnedMenus]);

  const togglePin = (id: number) => {
    setPinnedMenus(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // flatten
  const flattenMenus = (menus: MenuItem[]): MenuItem[] =>
    menus.flatMap(menu => [
      menu,
      ...(menu.items ? flattenMenus(menu.items) : []),
    ]);

  const flatMenus = useMemo(() => flattenMenus(activeMenus), [activeMenus]);

  const pinnedItems = useMemo(
    () => flatMenus.filter(m => pinnedMenus.includes(m.menuid)),
    [flatMenus, pinnedMenus]
  );

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />}

      <aside
        className={`
          fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 z-30
          transition-all duration-300 ease-in-out overflow-y-auto
          ${collapsed ? 'md:w-16' : 'md:w-80'} w-80
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >

        {/* Search */}
        {!collapsed && (
          <div className="p-3">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                name='search'
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            </div>
          </div>
        )}

        {/* Pinned */}
        {!collapsed && pinnedItems.length > 0 && (
          <div className="px-3">
            <div className="text-xs text-gray-400 mb-2">Pinned</div>
            {pinnedItems.map(menu => (
              <MenuItemComponent
                key={menu.menuid}
                menu={menu}
                collapsed={collapsed}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                handleNavigation={handleNavigation}
                routerPath={router.pathname}
                searchQuery={debouncedQuery}
                togglePin={togglePin}
                pinnedMenus={pinnedMenus}
              />
            ))}
            <div className="border-b my-2" />
          </div>
        )}

        {/* No results */}
        {filteredMenus.length === 0 && (
          <div className="px-3 text-sm text-gray-500">No results found</div>
        )}

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {filteredMenus.map(menu => (
            <MenuItemComponent
              key={menu.menuid}
              menu={menu}
              collapsed={collapsed}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              handleNavigation={handleNavigation}
              routerPath={router.pathname}
              searchQuery={debouncedQuery}
              togglePin={togglePin}
              pinnedMenus={pinnedMenus}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}