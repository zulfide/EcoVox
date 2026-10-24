import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Award,
  QrCode,
  ShieldCheck,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeMenu,
  onSelectMenu,
}) => {
  const isWasteTheme = activeMenu === 'waste_scan';

  // Navigation Items defined strictly per role
  const getNavItems = () => {
    if (role === 'petugas') {
      // Petugas: STRICTLY ONLY 3 MENUS
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'waste_scan',
          label: 'Buang Sampah',
          icon: Trash2,
        },
        {
          id: 'officer_portal',
          label: 'Portal Petugas Piket',
          icon: ShieldCheck,
        },
      ];
    }

    if (role === 'guru') {
      // Guru: Dashboard, Forum Q&A & Modul, Katalog Badge, Daily Task (Monitoring), Portal Petugas Piket
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'daily_task',
          label: 'Daily Task (Monitoring)',
          icon: CalendarCheck,
        },
        {
          id: 'forum',
          label: 'Forum Q&A & Modul',
          icon: MessageSquare,
        },
        {
          id: 'badge_catalog',
          label: 'Katalog Badge (Verifikasi)',
          icon: Award,
        },
        {
          id: 'officer_portal',
          label: 'Portal Petugas Piket',
          icon: ShieldCheck,
        },
      ];
    }

    // Murid: Dashboard, Daily Task, Forum Q&A, Katalog Badge & Nilai, Scan QR (Buang Sampah & Kantin), Kantin Sehat
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        id: 'daily_task',
        label: 'Daily Task',
        icon: CalendarCheck,
      },
      {
        id: 'forum',
        label: 'Forum Q&A',
        icon: MessageSquare,
      },
      {
        id: 'badge_catalog',
        label: 'Katalog Badge & Nilai',
        icon: Award,
      },
      {
        id: 'scan_qr',
        label: 'Scan QR Buang Sampah',
        icon: QrCode,
      },
      {
        id: 'canteen_catalog',
        label: 'Kantin Sehat',
        icon: UtensilsCrossed,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col justify-between border-r transition-colors duration-300 select-none ${
        isWasteTheme
          ? 'bg-slate-950 border-emerald-900/40 text-slate-300'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      {/* Top Menu List */}
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? isWasteTheme
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Information (CLEAN: No Reset Demo Data, No Ekspor, No Impor) */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-200">
              SMK Surabaya Vokasi
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pendidikan kejuruan terpadu dan kepedulian lingkungan sekolah.
          </p>
        </div>
      </div>
    </aside>
  );
};
