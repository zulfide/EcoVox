import React, { useState, useEffect } from 'react';
import { User } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  updateUserInStorage,
  getHasSeenOnboarding,
  setHasSeenOnboarding,
  getCycleDay,
  setCycleDay,
} from './utils/storage';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DailyTaskView } from './components/DailyTaskView';
import { WasteScanView } from './components/WasteScanView';
import { OfficerPortalView } from './components/OfficerPortalView';
import { CanteenCatalogView } from './components/CanteenCatalogView';
import { BadgeCatalogView } from './components/BadgeCatalogView';
import { ForumView } from './components/ForumView';
import { OnboardingModal } from './components/OnboardingModal';
import { RestoreStreakModal } from './components/RestoreStreakModal';

export default function App() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [cycleDay, setCycleDayState] = useState<number>(() => getCycleDay());
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);

  // When user logs in or is present, verify role restrictions
  useEffect(() => {
    if (user) {
      // Validate permitted menu for role
      if (user.role === 'petugas') {
        const allowed = ['dashboard', 'waste_scan', 'officer_portal'];
        if (!allowed.includes(activeMenu)) {
          setActiveMenu('dashboard');
        }
      } else if (user.role === 'guru') {
        const allowed = ['dashboard', 'daily_task', 'forum', 'badge_catalog', 'officer_portal'];
        if (!allowed.includes(activeMenu)) {
          setActiveMenu('dashboard');
        }
      } else if (user.role === 'murid') {
        const allowed = ['dashboard', 'daily_task', 'forum', 'badge_catalog', 'scan_qr', 'canteen_catalog'];
        if (!allowed.includes(activeMenu)) {
          setActiveMenu('dashboard');
        }
      }

      // Check onboarding for first-time login
      if (!getHasSeenOnboarding(user.id)) {
        setShowOnboarding(true);
      }
    }
  }, [user, activeMenu]);

  // Handle Login
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveMenu('dashboard');
    if (!getHasSeenOnboarding(loggedInUser.id)) {
      setShowOnboarding(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setActiveMenu('dashboard');
  };

  // Close Onboarding
  const handleCloseOnboarding = () => {
    if (user) {
      setHasSeenOnboarding(user.id, true);
    }
    setShowOnboarding(false);
  };

  // Handle Restore Streak
  const handleRestoreStreak = () => {
    if (!user || !user.streakRestoreAvailable) return;
    const updated: User = {
      ...user,
      streak: user.streak + 1,
      streakRestoreAvailable: false,
    };
    updateUserInStorage(updated);
    setUser(updated);
  };

  // Advance Simulation Day for Rotations
  const handleAdvanceDay = () => {
    const nextDay = (cycleDay % 10) + 1;
    setCycleDay(nextDay);
    setCycleDayState(nextDay);

    // Reset daily task status for student on new day simulation
    if (user && user.role === 'murid') {
      const updated: User = {
        ...user,
        completedTasksToday: false,
        activeCycleDay: nextDay,
      };
      updateUserInStorage(updated);
      setUser(updated);
    }
  };

  // If not logged in, render LoginScreen FIRST (Rule 1)
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const isWasteTheme = activeMenu === 'waste_scan';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
        isWasteTheme ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Header */}
      <Header
        user={user}
        activeMenu={activeMenu}
        onLogout={handleLogout}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenRestoreStreak={() => setShowRestoreModal(true)}
        onNavigateToCanteen={() => setActiveMenu('canteen_catalog')}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Based Sidebar */}
        <Sidebar
          role={user.role}
          activeMenu={activeMenu}
          onSelectMenu={(menuId) => setActiveMenu(menuId)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Dashboard */}
          {activeMenu === 'dashboard' && (
            <DashboardView
              user={user}
              onNavigate={(menuId) => setActiveMenu(menuId)}
              cycleDay={cycleDay}
            />
          )}

          {/* Daily Task (Murid takes quiz; Guru monitors students) */}
          {activeMenu === 'daily_task' && (
            <DailyTaskView
              user={user}
              cycleDay={cycleDay}
              onAdvanceDay={handleAdvanceDay}
              onUserUpdated={(u) => setUser(u)}
            />
          )}

          {/* Buang Sampah / Smart Bin QR (For Murid and Petugas) */}
          {(activeMenu === 'waste_scan' || activeMenu === 'scan_qr') && (
            <WasteScanView
              user={user}
              onNavigateToPortal={() => setActiveMenu('officer_portal')}
            />
          )}

          {/* Portal Petugas Piket (For Petugas and Guru) */}
          {activeMenu === 'officer_portal' && (
            <OfficerPortalView
              currentUser={user}
              onStudentUpdated={(updatedStudent) => {
                if (user && user.id === updatedStudent.id) {
                  setUser(updatedStudent);
                }
              }}
            />
          )}

          {/* Kantin Sehat (Menu & Voucher Redemption) */}
          {activeMenu === 'canteen_catalog' && (
            <CanteenCatalogView
              user={user}
              onUserUpdated={(u) => setUser(u)}
            />
          )}

          {/* Katalog Badge & Nilai (Murid progress & Guru verification) */}
          {activeMenu === 'badge_catalog' && (
            <BadgeCatalogView
              user={user}
              onUserUpdated={(u) => setUser(u)}
            />
          )}

          {/* Forum Q&A & Modul */}
          {activeMenu === 'forum' && <ForumView user={user} />}
        </main>
      </div>

      {/* Interactive Mascot Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />

      {/* Restore Streak Modal */}
      <RestoreStreakModal
        isOpen={showRestoreModal}
        user={user}
        onClose={() => setShowRestoreModal(false)}
        onRestore={handleRestoreStreak}
      />
    </div>
  );
}
