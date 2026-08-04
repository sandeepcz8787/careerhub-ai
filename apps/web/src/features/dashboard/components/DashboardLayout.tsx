import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes } from '@careerhub/shared';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useDarkMode } from '@shared/hooks/useDarkMode';
import { useAppDispatch, useAppSelector } from '@shared/hooks/useAppRedux';
import { Avatar } from '@shared/components/ui/Avatar';
import { Badge } from '@shared/components/ui/Badge';
import { Button } from '@shared/components/ui/Button';
import {
  toggleSidebar,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  toggleRightPanel,
  setSearchQuery,
  setNotificationFilter,
} from '../store/dashboardSlice';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useCareerProgress,
} from '../hooks/useDashboard';

// Define Side Navigation Items
interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: string[];
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    groupName: 'Core',
    items: [
      { label: 'Dashboard', href: Routes.DASHBOARD, icon: '📊' },
      { label: 'Profile', href: Routes.PROFILE, icon: '👤' },
    ],
  },
  {
    groupName: 'AI Services',
    items: [
      { label: 'Resume Builder', href: Routes.RESUME_BUILDER, icon: '📄' },
      { label: 'ATS Score', href: Routes.RESUME_CHECKER, icon: '🤖' },
      { label: 'Cover Letter', href: Routes.COVER_LETTER, icon: '✉️' },
    ],
  },
  {
    groupName: 'Applications',
    items: [
      { label: 'Job Tracker', href: Routes.JOB_TRACKER, icon: '💼' },
      { label: 'Internships', href: Routes.INTERNSHIP_TRACKER, icon: '🎓' },
      { label: 'Applications', href: '/applications', icon: '📁' },
    ],
  },
  {
    groupName: 'Preparation',
    items: [
      { label: 'Mock Interview', href: Routes.MOCK_INTERVIEW, icon: '🎯' },
      { label: 'Coding Challenges', href: Routes.CODING_CHALLENGES, icon: '💻' },
    ],
  },
  {
    groupName: 'Social & Network',
    items: [
      { label: 'Community', href: Routes.COMMUNITY, icon: '🤝' },
      { label: 'Referrals', href: Routes.REFERRAL_MARKETPLACE, icon: '🔗' },
      { label: 'Interview Experiences', href: Routes.INTERVIEW_EXPERIENCES, icon: '💬' },
    ],
  },
  {
    groupName: 'Tools',
    items: [
      { label: 'Messages', href: Routes.CHAT, icon: '🗣️' },
      { label: 'Notes', href: '/notes', icon: '📓' },
      { label: 'Analytics', href: '/analytics', icon: '📈' },
    ],
  },
  {
    groupName: 'Account',
    items: [
      { label: 'Settings', href: Routes.SETTINGS, icon: '⚙️' },
      { label: 'Help & Support', href: '/help', icon: '❓' },
    ],
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useDarkMode();

  // Select UI States from Redux
  const isSidebarCollapsed = useAppSelector((state) => state.dashboard.isSidebarCollapsed);
  const isMobileSidebarOpen = useAppSelector((state) => state.dashboard.isMobileSidebarOpen);
  const isRightPanelOpen = useAppSelector((state) => state.dashboard.isRightPanelOpen);
  const searchQuery = useAppSelector((state) => state.dashboard.searchQuery);

  // Queries
  const { data: notifications = [] } = useNotifications();
  const { data: checklist = [] } = useCareerProgress();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  // Dropdown States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Click outside hooks for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation support: ESC key to close open elements, '/' key to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
        dispatch(setMobileSidebarOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Derive breadcrumbs based on route
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, idx) => {
      const href = '/' + paths.slice(0, idx + 1).join('/');
      const label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { label, href, isLast: idx === paths.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadNotifs = notifications.filter((n) => !n.read);

  // Handle Logout action
  const handleLogout = async () => {
    await logout();
    navigate(Routes.LOGIN);
  };

  return (
    <div className="min-h-screen flex bg-[color:var(--bg-base)] text-[color:var(--text-primary)] transition-colors duration-200">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`hidden md:flex flex-col border-r border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] transition-all duration-300 z-30 fixed top-0 bottom-0 left-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand/Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[color:var(--border-subtle)]">
          <Link to={Routes.DASHBOARD} className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-extrabold text-lg shadow-md glow shrink-0">
              C
            </span>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-heading text-lg font-black tracking-tight text-[color:var(--text-primary)]"
              >
                CareerHub<span className="text-primary-500">.AI</span>
              </motion.span>
            )}
          </Link>
          
          {/* Collapse sidebar button */}
          {!isSidebarCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1 rounded-lg border border-[color:var(--border-default)] hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] transition-colors"
              aria-label="Collapse sidebar"
            >
              ◀
            </button>
          )}
          {isSidebarCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="absolute left-16 top-5 bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] w-6 h-6 rounded-full flex items-center justify-center shadow text-xs hover:bg-[color:var(--bg-subtle)]"
              aria-label="Expand sidebar"
            >
              ▶
            </button>
          )}
        </div>

        {/* Navigation Feed */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-black tracking-wider text-[color:var(--text-muted)] uppercase px-3 block mb-1.5">
                  {group.groupName}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-500 dark:text-primary-400 border-l-4 border-primary-500'
                        : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] border-l-4 border-transparent'
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    {!isSidebarCollapsed ? (
                      <span>{item.label}</span>
                    ) : (
                      // Collapsed tooltip
                      <div className="absolute left-16 bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] text-[10px] font-bold py-1 px-2.5 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout bottom section */}
        <div className="p-4 border-t border-[color:var(--border-subtle)] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar src={user?.profile?.avatarUrl || null} name={user?.profile?.displayName || 'User'} size={isSidebarCollapsed ? 'sm' : 'md'} />
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-[color:var(--text-primary)]">{user?.profile?.displayName || 'Candidate'}</p>
                <p className="text-[10px] text-[color:var(--text-muted)] truncate">{user?.email || 'user@careerhub.ai'}</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <Button variant="danger" size="xs" className="w-full font-bold text-xs" onClick={handleLogout}>
              Logout 🚪
            </Button>
          )}
          {isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-error-500/10 hover:bg-error-500 text-error-500 hover:text-white flex items-center justify-center transition-colors mx-auto"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(toggleMobileSidebar())}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[color:var(--bg-surface)] border-r border-[color:var(--border-subtle)] z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-[color:var(--border-subtle)]">
                <Link to={Routes.DASHBOARD} onClick={() => dispatch(toggleMobileSidebar())} className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-extrabold text-base shadow-sm">
                    C
                  </span>
                  <span className="font-heading text-base font-black text-[color:var(--text-primary)]">
                    CareerHub<span className="text-primary-500">.AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => dispatch(toggleMobileSidebar())}
                  className="p-1 rounded-lg text-[color:var(--text-secondary)]"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {navGroups.map((group) => (
                  <div key={group.groupName} className="space-y-1">
                    <span className="text-[9px] font-black tracking-wider text-[color:var(--text-muted)] uppercase block mb-1">
                      {group.groupName}
                    </span>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => dispatch(toggleMobileSidebar())}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-500 dark:text-primary-400 border-l-4 border-primary-500'
                              : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] border-l-4 border-transparent'
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-[color:var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user?.profile?.avatarUrl || null} name={user?.profile?.displayName || 'User'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-[color:var(--text-primary)]">{user?.profile?.displayName || 'User'}</p>
                    <p className="text-[10px] text-[color:var(--text-muted)] truncate">{user?.email || ''}</p>
                  </div>
                </div>
                <Button variant="danger" size="sm" className="w-full font-bold text-xs" onClick={handleLogout}>
                  Logout 🚪
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        } ${isRightPanelOpen ? 'xl:pr-80' : ''} pb-16 md:pb-0`}
      >
        {/* Sticky Topbar */}
        <header className="h-16 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          {/* Breadcrumbs & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleMobileSidebar())}
              className="p-2 -ml-2 rounded-xl text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] md:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              ☰
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[color:var(--text-muted)]">
              <Link to={Routes.DASHBOARD} className="hover:text-primary-500 transition-colors">
                Home
              </Link>
              {breadcrumbs.map((crumb) => (
                <div key={crumb.href} className="flex items-center gap-1.5">
                  <span className="text-[color:var(--text-disabled)]">/</span>
                  <Link
                    to={crumb.href}
                    className={crumb.isLast ? 'text-[color:var(--text-primary)] pointer-events-none' : 'hover:text-primary-500 transition-colors'}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Action Elements - Search, Notifications, Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Global Search box */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <span className="absolute left-3 top-2.5 text-xs text-[color:var(--text-muted)]">🔍</span>
              <input
                type="text"
                placeholder="Search resources... (Press /)"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full h-9 pl-8 pr-3 text-xs bg-[color:var(--bg-subtle)] border border-[color:var(--border-default)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-[color:var(--text-primary)] font-medium"
              />
            </div>

            {/* Dark Mode Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-all relative"
                aria-label="Notifications"
              >
                🔔
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-black animate-pulse shadow-sm">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 max-h-[380px] overflow-y-auto bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-2xl shadow-lg z-50 p-4 scrollbar-thin space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-[color:var(--border-subtle)]">
                      <span className="text-xs font-bold text-[color:var(--text-primary)]">Notifications</span>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={() => markAllRead()}
                          className="text-[10px] font-bold text-primary-500 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[color:var(--text-muted)] font-medium">
                        No notifications.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {notifications.slice(0, 4).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              notif.read
                                ? 'border-[color:var(--border-subtle)] bg-transparent'
                                : 'border-primary-100 bg-primary-50/5 dark:border-primary-900/10'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1.5 mb-0.5">
                              <h5 className={`text-xs font-bold leading-tight ${notif.read ? 'text-[color:var(--text-primary)]' : 'text-primary-500'}`}>
                                {notif.title}
                              </h5>
                              {!notif.read && (
                                <button
                                  onClick={() => markRead(notif.id)}
                                  className="text-[9px] font-bold text-primary-500 hover:underline shrink-0"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-[color:var(--text-muted)] leading-normal">
                              {notif.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      to={Routes.NOTIFICATIONS}
                      onClick={() => setIsNotifOpen(false)}
                      className="block text-center text-[10px] font-black text-primary-500 hover:underline pt-2 border-t border-[color:var(--border-subtle)]"
                    >
                      View All Notifications
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-left focus:outline-none"
              >
                <Avatar src={user?.profile?.avatarUrl || null} name={user?.profile?.displayName || 'User'} size="sm" className="cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-2xl shadow-lg z-50 p-2 text-left"
                  >
                    <div className="px-3.5 py-2.5 border-b border-[color:var(--border-subtle)] mb-1">
                      <p className="text-xs font-black text-[color:var(--text-primary)] truncate">{user?.profile?.displayName || 'Candidate'}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] truncate">{user?.email || 'user@careerhub.ai'}</p>
                      <Badge variant="primary" size="sm" className="mt-1.5 uppercase font-bold text-[8px] tracking-wide">
                        {user?.role || 'STUDENT'}
                      </Badge>
                    </div>

                    <Link
                      to={Routes.PROFILE}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-all"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to={Routes.SETTINGS}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-all"
                    >
                      ⚙️ Account Settings
                    </Link>
                    <Link
                      to="/settings/sessions"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-all"
                    >
                      🔑 Active Sessions
                    </Link>
                    
                    <hr className="border-[color:var(--border-subtle)] my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-error-500 hover:bg-error-500/10 transition-all text-left"
                    >
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle right checklist panel button */}
            <button
              onClick={() => dispatch(toggleRightPanel())}
              className={`p-2 rounded-xl border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-subtle)] transition-all hidden xl:block ${
                isRightPanelOpen ? 'bg-primary-500/10 border-primary-500 text-primary-500' : ''
              }`}
              title="Toggle checklist"
            >
              📋
            </button>
          </div>
        </header>

        {/* Main Scrolling Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── DESKTOP FIXED RIGHT UTILITY PANEL ── */}
      <AnimatePresence>
        {isRightPanelOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="hidden xl:flex flex-col w-80 border-l border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] fixed top-16 bottom-0 right-0 z-10 p-5 overflow-y-auto space-y-6 scrollbar-thin"
          >
            {/* Checklist items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-[color:var(--text-secondary)] tracking-wider">
                  Setup Progress
                </h3>
                <span className="text-[10px] font-bold text-success-600 bg-success-50 dark:bg-success-950/20 dark:text-success-400 px-2 py-0.5 rounded-full">
                  {Math.round((checklist.filter((s) => s.completed).length / (checklist.length || 1)) * 100)}%
                </span>
              </div>

              <div className="space-y-3">
                {checklist.map((step) => (
                  <div
                    key={step.id}
                    className="flex gap-2.5 text-xs text-[color:var(--text-primary)]"
                  >
                    <span className="mt-0.5 shrink-0">
                      {step.completed ? '💚' : '🔘'}
                    </span>
                    <div className="space-y-0.5">
                      <p className={`font-bold ${step.completed ? 'line-through text-[color:var(--text-muted)]' : ''}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[color:var(--text-muted)] leading-tight font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-[color:var(--border-subtle)]" />

            {/* Motivational Panel */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-left">
              <span className="text-2xl block mb-2">💡</span>
              <h4 className="text-xs font-bold text-[color:var(--text-primary)] mb-1">
                Tip of the Day
              </h4>
              <p className="text-[10px] text-[color:var(--text-secondary)] leading-relaxed font-semibold">
                An ATS-optimized resume increases your interview callback rate by up to 3x. Head over to ATS Checker in the sidebar to scan yours.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[color:var(--bg-surface)] border-t border-[color:var(--border-subtle)] z-40 flex items-center justify-around md:hidden shadow-lg">
        <Link
          to={Routes.DASHBOARD}
          className={`flex flex-col items-center justify-center text-center ${
            location.pathname === Routes.DASHBOARD ? 'text-primary-500' : 'text-[color:var(--text-secondary)]'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[9px] font-bold mt-0.5">Home</span>
        </Link>
        <Link
          to={Routes.RESUME_BUILDER}
          className={`flex flex-col items-center justify-center text-center ${
            location.pathname === Routes.RESUME_BUILDER ? 'text-primary-500' : 'text-[color:var(--text-secondary)]'
          }`}
        >
          <span className="text-lg">📄</span>
          <span className="text-[9px] font-bold mt-0.5">Resume</span>
        </Link>
        <Link
          to={Routes.JOB_TRACKER}
          className={`flex flex-col items-center justify-center text-center ${
            location.pathname === Routes.JOB_TRACKER ? 'text-primary-500' : 'text-[color:var(--text-secondary)]'
          }`}
        >
          <span className="text-lg">💼</span>
          <span className="text-[9px] font-bold mt-0.5">Jobs</span>
        </Link>
        <Link
          to={Routes.PROFILE}
          className={`flex flex-col items-center justify-center text-center ${
            location.pathname === Routes.PROFILE ? 'text-primary-500' : 'text-[color:var(--text-secondary)]'
          }`}
        >
          <span className="text-lg">👤</span>
          <span className="text-[9px] font-bold mt-0.5">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
