import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronDown, ChevronRight, Home, FileText, BarChart2, Users, Briefcase, Key,
  MapPin, Settings, Shield, Search, Star, Boxes, Database, FolderTree, Layers3,
  Package, Receipt, Ruler, Shapes, Warehouse, ClipboardList, PackageCheck,
  ShoppingCart, BadgeDollarSign, FileCheck, ShoppingBag, Circle,
  X,
  Wallet,
  FileBarChart,
  Wrench
} from 'lucide-react';

import useIsMobile from '@/common/hooks/useIsMobile';
import { storageService } from '@/common/utility/storageService';
import Link from 'next/link';

/* =========================
   TYPES
========================= */
interface MenuItem {
  menuid: number;
  menuname: string;
  path?: string;
  text: string;
  isactive: boolean;
  items?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItemProps {
  menu: MenuItem;
  parentKey?: string;
  level?: number;
  collapsed: boolean;
  expandedMenus: Record<string, boolean>;
  toggleMenu: (menuKey: string, parentKey?: string) => void;
  handleNavigation: (path?: string) => void;
  routerPath: string;
  searchQuery: string;
  togglePin: (id: number) => void;
  pinnedMenus: number[];
  sectionColor?: string;
  onExpandRequest?: (menu: MenuItem, target: HTMLElement) => void;
}

/* =========================
   ICONS
========================= */
const ICONS: Record<string, any> = {
  Dashboard: Home,
  Admin: Settings,
  Configuration: Settings,
  Master: Database,
  Purchase: ShoppingCart,
  Sale: ShoppingBag,
  Accounts: Wallet,
  Reports: FileBarChart,
  Utility: Wrench,
};

/* =========================
   SECTION COLOURS
========================= */
// curated, muted palette — assigned deterministically per top-level section name
// so the same section always gets the same colour, and children inherit it
const SECTION_PALETTE = ['#4f46e5', '#0891b2', '#d97706', '#059669', '#7c3aed', '#2563eb', '#be185d'];

const getSectionColor = (name: string) => {
  if (/admin|config|setting|privilege|priviledge/i.test(name)) return '#64748b'; // neutral for settings-type sections
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SECTION_PALETTE[Math.abs(hash) % SECTION_PALETTE.length];
};

/* =========================
   HELPERS
========================= */
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} className="bg-amber-200/70 text-slate-900 rounded-[3px]">{part}</span>
      : part
  );
};

const getMenuKey = (menu: MenuItem, parentPath?: string) => {
  return parentPath ? `${parentPath}/${menu.menuid}` : `${menu.menuid}`;
};

/* =========================
   FILTER
========================= */
const filterMenus = (menus: MenuItem[], query: string) => {
  if (!query) return { filtered: menus, expandedKeys: [] as string[] };

  const q = query.toLowerCase();
  const expandedKeys: string[] = [];

  // build keys in the SAME "parentKey/menuid" format used by getMenuKey,
  // so the auto-expand set actually matches what MenuItemComponent looks up
  const recursive = (items: MenuItem[], parentPath?: string): MenuItem[] =>
    items
      .map((item: MenuItem) => {
        const key = parentPath ? `${parentPath}/${item.menuid}` : `${item.menuid}`;
        const children = item.items ? recursive(item.items, key) : [];
        const isMatch = item.menuname.toLowerCase().includes(q);

        if (isMatch || children.length > 0) {
          if (children.length > 0) expandedKeys.push(key);
          return { ...item, items: children };
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];

  return { filtered: recursive(menus), expandedKeys };
};

/* =========================
   MENU ITEM (RECURSIVE)
========================= */
const MenuItemComponent: React.FC<MenuItemProps> = ({
  menu,
  parentKey,
  level = 0,
  collapsed,
  expandedMenus,
  toggleMenu,
  handleNavigation,
  routerPath,
  searchQuery,
  togglePin,
  pinnedMenus,
  sectionColor,
  onExpandRequest,
}) => {
  const hasSubMenus = !!menu.items?.length;

  const menuKey = getMenuKey(menu, parentKey);
  const isExpanded = !!expandedMenus[menuKey];

  const isActive = menu.path === routerPath;
  const isPinned = pinnedMenus.includes(menu.menuid);
  const isTopLevel = level === 0;

  // top-level categories are fixed, so they get a meaningful icon from the map;
  // submenu names come from the database and can be anything, so every
  // submenu shares one consistent icon instead of trying to match each name
  const Icon = isTopLevel ? (ICONS[menu.text] || FileText) : Circle;

  // resolved once per top-level branch, then passed down unchanged so a whole
  // section (parent + all descendants) shares one colour family
  const resolvedColor = sectionColor || getSectionColor(menu.menuname);
  const iconOpacity = isTopLevel ? 1 : isActive ? 0.95 : 0.62;

  // fixed row padding — nesting depth is handled once by the parent wrapper below,
  // not compounded here, so children don't drift far right
  const indent = isTopLevel ? 8 : 6;
  const collapsedTop = collapsed && isTopLevel;

  const rowBase =
    'group relative w-full flex items-center rounded-md transition-colors duration-150';
  const rowJustify = collapsedTop ? 'justify-center' : 'justify-between';
  const rowSpacing = isTopLevel ? 'py-[7px] pr-2' : 'py-[5px] pr-2';
  const rowText = isTopLevel
    ? 'text-[13px] font-medium'
    : 'text-[12.5px] font-normal';
  const rowColor = isActive
    ? 'text-indigo-700'
    : isTopLevel
      ? 'text-slate-700 hover:text-slate-900'
      : 'text-slate-500 hover:text-slate-800';
  const rowBg = isActive ? 'bg-indigo-50' : 'hover:bg-slate-100/80';

  const content = (
    <>
      <span className="flex items-center gap-2 min-w-0">
        <span className={`flex items-center justify-center shrink-0 ${isTopLevel ? 'w-[16px] h-[16px]' : 'w-[14px] h-[14px]'}`}>
          <Icon
            className={isTopLevel ? 'w-[16px] h-[16px]' : 'w-[6px] h-[6px]'}
            color={resolvedColor}
            fill={isTopLevel ? 'none' : resolvedColor}
            style={{ opacity: iconOpacity }}
            strokeWidth={isTopLevel ? 2 : 1.75}
          />
        </span>
        {!collapsed && (
          <span className="truncate">{highlightText(menu.menuname, searchQuery)}</span>
        )}
      </span>

      {!collapsed && (
        <span className="flex items-center gap-1.5 shrink-0">
          <Star
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePin(menu.menuid);
            }}
            className={`w-[13px] h-[13px] transition-opacity ${isPinned
                ? 'text-amber-400 fill-amber-400 opacity-100'
                : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-400'
              }`}
          />
          {hasSubMenus &&
            (isExpanded ? (
              <ChevronDown size={14} className="text-slate-400" />
            ) : (
              <ChevronRight size={14} className="text-slate-400" />
            ))}
        </span>
      )}
    </>
  );

  return (
    <div className="relative">
      {isActive && !collapsed && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[16px] w-[3px] rounded-r-full"
          style={{ backgroundColor: resolvedColor }}
        />
      )}

      {!hasSubMenus ? (
        <Link
          href={menu.path || '#'}
          onClick={() => handleNavigation(menu.path)}
          className={`${rowBase} ${rowJustify} ${rowSpacing} ${rowText} ${rowColor} ${rowBg}`}
          style={{ paddingLeft: collapsedTop ? 0 : `${indent}px` }}
          title={collapsedTop ? menu.menuname : undefined}
        >
          {content}
        </Link>
      ) : (
        <button
          onClick={(e) => {
            // collapsed top-level items have nowhere to show an inline
            // expansion, so open a flyout panel next to the icon instead
            if (collapsedTop && onExpandRequest) {
              onExpandRequest(menu, e.currentTarget);
            } else {
              toggleMenu(menuKey, parentKey);
            }
          }}
          className={`${rowBase} ${rowJustify} ${rowSpacing} ${rowText} ${rowColor} ${rowBg}`}
          style={{ paddingLeft: collapsedTop ? 0 : `${indent}px` }}
          title={collapsedTop ? menu.menuname : undefined}
        >
          {content}
        </button>
      )}

      {hasSubMenus && isExpanded && !collapsed && (
        <div className="mt-0.5 space-y-0.5 ml-[10px] pl-[10px] border-l border-slate-200">
          {menu.items!.map((child: MenuItem) => (
            <MenuItemComponent
              key={child.menuid}
              menu={child}
              parentKey={menuKey}
              level={level + 1}
              collapsed={collapsed}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              handleNavigation={handleNavigation}
              routerPath={routerPath}
              searchQuery={searchQuery}
              togglePin={togglePin}
              pinnedMenus={pinnedMenus}
              sectionColor={resolvedColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================
   SIDEBAR
========================= */
export default function Sidebar({
  isOpen,
  onClose,
  menus = [],
  collapsed = false,
  setCollapsed,
}: SidebarProps) {

  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (router.pathname === '/dashboard') {
      setCollapsed(false);
    }
  }, [router.pathname, setCollapsed]);

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pinnedMenus, setPinnedMenus] = useState<number[]>([]);

  // flyout shown next to a top-level icon when the sidebar is collapsed and
  // that item has children (there's no room to expand inline in the icon rail)
  const [flyoutMenu, setFlyoutMenu] = useState<MenuItem | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const flyoutRef = useRef<HTMLDivElement | null>(null);

  const handleExpandRequest = (menu: MenuItem, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setFlyoutMenu(prev => (prev?.menuid === menu.menuid ? null : menu));
    setFlyoutTop(Math.min(rect.top, window.innerHeight - 320));
  };

  // close the flyout on outside click, or automatically if the sidebar expands
  useEffect(() => {
    if (!flyoutMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setFlyoutMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [flyoutMenu]);

  useEffect(() => {
    if (!collapsed) setFlyoutMenu(null);
  }, [collapsed]);

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const activeMenus = menus.filter(m => m.isactive);

  const { filtered: filteredMenus, expandedKeys } = useMemo(
    () => filterMenus(activeMenus, debouncedQuery),
    [activeMenus, debouncedQuery]
  );

  /* auto expand on search - keys already match the "parentKey/menuid" format
     that MenuItemComponent uses to look up expandedMenus */
  useEffect(() => {
    if (!debouncedQuery) return;

    const newExpanded: Record<string, boolean> = {};
    expandedKeys.forEach(key => (newExpanded[key] = true));

    setExpandedMenus(prev =>
      JSON.stringify(prev) === JSON.stringify(newExpanded) ? prev : newExpanded
    );
  }, [debouncedQuery, expandedKeys]);

  /* ACCORDION TOGGLE */
  const toggleMenu = (menuKey: string, parentPath?: string) => {
    setExpandedMenus(prev => {
      const isOpen = !!prev[menuKey];
      const updated = { ...prev };

      // close if already open
      if (isOpen) {
        delete updated[menuKey];
        return updated;
      }

      // ONLY close siblings (same parent path level)
      Object.keys(updated).forEach(key => {
        const keyParent = key.split('/').slice(0, -1).join('/');
        const currentParent = parentPath ?? '';

        if (keyParent === currentParent) {
          delete updated[key];
        }
      });

      updated[menuKey] = true;
      return updated;
    });
  };

  const handleNavigation = (path?: string) => {
    if (path === '/dashboard') {
      // Always open sidebar on Dashboard
      setCollapsed(false);
    } else {
      // Collapse sidebar on other pages
      setCollapsed(true);
    }

    if (isMobile) onClose();
  };

  /* PIN */
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden h-[50vh]"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 bottom-0 bg-white border-r border-slate-200 z-30
          transition-all duration-300 ease-in-out
          ${collapsed ? 'md:w-16' : 'md:w-[272px]'} w-[272px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          flex flex-col overflow-hidden
        `}
      >
        {/* Search */}
        {!collapsed && (
          <div className="shrink-0 px-2 pt-2.5 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu"
                name="search"
                className="w-full pl-7 pr-7 py-[6px] bg-slate-50 border border-slate-200 rounded-md text-[12.5px] text-slate-700 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-[13px] h-[13px]" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scroll area holds pinned + main menu together -> single scrollbar */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5
                         [&::-webkit-scrollbar]:w-1.5
                         [&::-webkit-scrollbar-track]:bg-transparent
                         [&::-webkit-scrollbar-thumb]:bg-slate-200
                         [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* Pinned */}
          {!collapsed && pinnedItems.length > 0 && (
            <div className="pb-2 mb-2 border-b border-slate-100">
              <div className="px-1.5 pb-1.5 text-[11px] font-medium text-slate-400">
                Pinned
              </div>
              <div className="space-y-0.5">
                {pinnedItems.map(menu => (
                  <MenuItemComponent
                    key={`pinned-${menu.menuid}`}
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
              </div>
            </div>
          )}

          {/* No results */}
          {filteredMenus.length === 0 && (
            <div className="px-1.5 py-2 text-[12.5px] text-slate-400">No results found</div>
          )}

          {/* Main menu */}
          <div className="space-y-0.5">
            {filteredMenus.map(menu => (
              <MenuItemComponent
                key={menu.menuid}
                menu={menu}
                parentKey={undefined}
                level={0}
                collapsed={collapsed}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                handleNavigation={handleNavigation}
                routerPath={router.pathname}
                searchQuery={debouncedQuery}
                togglePin={togglePin}
                pinnedMenus={pinnedMenus}
                onExpandRequest={handleExpandRequest}
              />
            ))}
          </div>
        </nav>
      </aside>

      {/* Flyout: shows a collapsed top-level item's children next to the icon rail */}
      {collapsed && flyoutMenu && (
        <div
          ref={flyoutRef}
          className="hidden md:block fixed z-40 w-[240px] max-h-[70vh] overflow-y-auto
                     bg-white border border-slate-200 rounded-lg shadow-lg py-2 px-2
                     [&::-webkit-scrollbar]:w-1.5
                     [&::-webkit-scrollbar-track]:bg-transparent
                     [&::-webkit-scrollbar-thumb]:bg-slate-200
                     [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{ left: '72px', top: `${Math.max(flyoutTop, 72)}px` }}
        >
          <div className="px-1.5 pb-1.5 mb-1 text-[12.5px] font-medium text-slate-700 border-b border-slate-100">
            {flyoutMenu.menuname}
          </div>
          <div className="space-y-0.5">
            {(flyoutMenu.items || []).map(child => (
              <MenuItemComponent
                key={child.menuid}
                menu={child}
                parentKey={undefined}
                level={1}
                collapsed={false}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                handleNavigation={(path) => {
                  handleNavigation(path);
                  setFlyoutMenu(null);
                }}
                routerPath={router.pathname}
                searchQuery=""
                togglePin={togglePin}
                pinnedMenus={pinnedMenus}
                sectionColor={getSectionColor(flyoutMenu.menuname)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
