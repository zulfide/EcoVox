import React from 'react';
import { User } from '../types';
import { SUBJECTS, CANTEEN_ITEMS } from '../data/mockData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  UtensilsCrossed,
  Award,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  onNavigate: (menuId: string) => void;
  cycleDay: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  cycleDay,
}) => {
  const currentSubject = SUBJECTS[(cycleDay - 1) % SUBJECTS.length];

  // Render Student Dashboard
  if (user.role === 'murid') {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Siklus Vokasi Hari ke-{cycleDay} dari 10</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Selamat Datang, {user.name}!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Tingkatkan kompetensi kejuruanmu lewat 1 Daily Task hari ini, jaga api streak harian, dan kumpulkan poin daur ulang di Smart Bin untuk menikmati sajian Kantin Sehat.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('daily_task')}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {user.completedTasksToday
                    ? 'Lihat Hasil Daily Task'
                    : `Kerjakan Daily Task: ${currentSubject.name}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('scan_qr')}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-emerald-400" />
                <span>QR Buang Sampah</span>
              </button>
            </div>
          </div>

          {/* Decorative Background Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        </div>

        {/* 3 Core Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Task Mapel Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  user.completedTasksToday
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {user.completedTasksToday ? 'Sudah Selesai' : 'Belum Selesai'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {currentSubject.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {currentSubject.description}
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Format: 5 PG + 5 PG Kompleks</span>
              <button
                type="button"
                onClick={() => onNavigate('daily_task')}
                className="text-cyan-600 font-semibold hover:text-cyan-700 flex items-center gap-1"
              >
                <span>Buka</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smart Bin / Eco Waste Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {user.wasteCanteenPointsEarned} / 50 Poin
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Bank Sampah & Smart Bin
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Setorkan botol plastik & kertas ke petugas piket untuk dapat poin kantin (maksimal 50 poin).
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Maks. 4 poin badge/setor</span>
              <button
                type="button"
                onClick={() => onNavigate('scan_qr')}
                className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Tunjukkan QR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kantin Sehat Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                Saldo: {user.canteenPoints} Poin
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Kantin Sehat SMK
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Tukarkan poin daur ulangmu dengan Nasi Pecel, Nasi Campur, Air Mineral, atau Es Teh Segar.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Mulai dari 20 poin</span>
              <button
                type="button"
                onClick={() => onNavigate('canteen_catalog')}
                className="text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
              >
                <span>Pilih Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Kantin Sehat Quick Strip */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Katalog Menu Kantin Sehat
              </h3>
              <p className="text-xs text-slate-500">
                Pilihan makanan dan minuman bergizi yang siap ditukar dengan poinmu
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('canteen_catalog')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CANTEEN_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-cyan-300 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                  {item.points} Poin
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('canteen_catalog')}
                  className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition"
                >
                  Tukarkan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Guru Dashboard
  if (user.role === 'guru') {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Guru Hero */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 md:p-8 border border-slate-800 shadow-lg">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
              <Users className="w-3.5 h-3.5" />
              <span>Portal Guru Vokasi</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Halo, {user.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Pantau progres pengerjaan Daily Task siswa kelas binaan, lakukan verifikasi klaim badge kejuruan, dan bagikan materi pembelajaran di forum tanya jawab.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('daily_task')}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Monitoring Daily Task Siswa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('badge_catalog')}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-blue-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Verifikasi Badge Siswa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guru Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Aktif
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Monitoring Kehadiran Tugas
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cek daftar siswa yang sudah atau belum menyelesaikan Daily Task hari ini secara real-time.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('daily_task')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Buka Data Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                1 Menunggu
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Verifikasi Badge Siswa
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Validasi bukti setoran tugas & pencapaian badge dari siswa secara digital.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('badge_catalog')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Verifikasi Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                Siaga
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Portal Petugas Piket
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Akses cadangan untuk verifikasi fisik pemilahan sampah di stasiun Smart Bin.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('officer_portal')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>Masuk Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Petugas (Guru Piket) Dashboard
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Petugas Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 md:p-8 border border-emerald-900/60 shadow-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Stasiun Smart Bin & Piket Sekolah</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Selamat Bertugas, {user.name}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Lakukan verifikasi fisik sampah anorganik yang disetorkan siswa, timbang secara akurat, dan validasi via Portal Petugas Piket agar poin masuk ke akun siswa secara aman dan anti-curang.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('officer_portal')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Buka Portal Petugas Piket (Live Scan)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('waste_scan')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-emerald-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span>Status Smart Bin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Petugas Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Smart Bin Gedung A
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Sensor Kapasitas: 42% terisi &middot; Status sensor aktif
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full w-[42%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Smart Bin Bengkel Otomotif
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Sensor Kapasitas: 65% terisi &middot; Status sensor aktif
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-teal-500 h-2 rounded-full w-[65%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">
            SOP Anti-Curang
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Wajib verifikasi fisik langsung di tempat sebelum menyetujui poin di portal. Maksimal 50 poin kantin per siswa.
          </p>
        </div>
      </div>
    </div>
  );
};
