import React, { useState } from 'react';
import { User, CanteenItem, CanteenVoucher } from '../types';
import { CANTEEN_ITEMS } from '../data/mockData';
import {
  getStoredCanteenVouchers,
  saveCanteenVouchers,
  updateUserInStorage,
  getStoredBadges,
  saveBadges,
} from '../utils/storage';
import {
  UtensilsCrossed,
  Coins,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  Ticket,
  Clock,
  X,
} from 'lucide-react';

interface CanteenCatalogViewProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

export const CanteenCatalogView: React.FC<CanteenCatalogViewProps> = ({
  user,
  onUserUpdated,
}) => {
  const [selectedItem, setSelectedItem] = useState<CanteenItem | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<CanteenVoucher | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'menu' | 'vouchers'>('menu');

  const myVouchers = getStoredCanteenVouchers().filter((v) => v.studentId === user.id);

  const handleRedeem = (item: CanteenItem) => {
    setErrorMessage(null);

    if (user.canteenPoints < item.points) {
      setErrorMessage(
        `Poin Anda tidak mencukupi (${user.canteenPoints} Poin). Anda membutuhkan ${item.points} Poin untuk menukarkan ${item.name}.`
      );
      setSelectedItem(item);
      return;
    }

    // Deduct points
    const updatedUser: User = {
      ...user,
      canteenPoints: user.canteenPoints - item.points,
    };

    // Generate Voucher
    const newVoucher: CanteenVoucher = {
      id: `voucher_${Date.now()}`,
      voucherCode: `KANTIN-${item.id.replace('item_', '').toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      studentId: user.id,
      studentName: user.name,
      itemId: item.id,
      itemName: item.name,
      pointsCost: item.points,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'aktif',
    };

    const vouchers = getStoredCanteenVouchers();
    vouchers.unshift(newVoucher);
    saveCanteenVouchers(vouchers);

    // Update Kantin Champion Badge progress
    const badges = getStoredBadges();
    const canteenBadge = badges.find((b) => b.id === 'badge_canteen_champion');
    if (canteenBadge) {
      canteenBadge.currentCount = Math.min(2, canteenBadge.currentCount + 1);
      if (canteenBadge.currentCount >= canteenBadge.targetCount) {
        canteenBadge.isUnlocked = true;
      }
      saveBadges(badges);
    }

    updateUserInStorage(updatedUser);
    onUserUpdated(updatedUser);

    setSelectedItem(null);
    setActiveVoucher(newVoucher);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 md:p-8 border border-amber-500 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 text-amber-100 text-xs font-semibold mb-3 border border-amber-300/30">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Kantin Sehat SMK Surabaya</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Tukar Poin Makanan & Minuman
          </h2>
          <p className="text-xs md:text-sm text-amber-50/90 leading-relaxed">
            Daur ulang botol dan kertasmu menjadi asupan nutrisi bergizi. Pilih menu sehat favoritmu dan tukarkan kuponnya di kasir kantin sekolah.
          </p>
        </div>

        {/* User Balance Box */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
          <div className="text-xs text-amber-100 font-medium">Saldo Poin Anda</div>
          <div className="text-2xl font-extrabold font-mono text-white flex items-center justify-end gap-1.5 mt-0.5">
            <Coins className="w-5 h-5 text-amber-200" />
            <span>{user.canteenPoints} Poin</span>
          </div>
          <div className="text-[11px] text-amber-100/80 mt-1">
            {myVouchers.length} Kupon Pernah Ditukar
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewTab('menu')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              viewTab === 'menu'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog Menu Kantin ({CANTEEN_ITEMS.length})
          </button>
          <button
            onClick={() => setViewTab('vouchers')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              viewTab === 'vouchers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            <span>Kupon Saya ({myVouchers.length})</span>
          </button>
        </div>
      </div>

      {/* View: Menu Catalog */}
      {viewTab === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CANTEEN_ITEMS.map((item) => {
            const canAfford = user.canteenPoints >= item.points;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                      {item.category}
                    </span>
                    <span className="text-sm font-extrabold font-mono text-emerald-700 flex items-center gap-1">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      {item.points} Poin
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRedeem(item)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 active:scale-95'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200/80 cursor-pointer'
                    }`}
                  >
                    <span>{canAfford ? 'Tukarkan Menu' : `Kurang ${item.points - user.canteenPoints} Poin`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Vouchers */}
      {viewTab === 'vouchers' && (
        <div className="space-y-4">
          {myVouchers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <div className="font-bold text-slate-700 text-sm">Belum Ada Kupon</div>
              <p className="text-xs text-slate-400 mt-1">
                Tukarkan poin kantinmu dengan Nasi Pecel, Nasi Campur, Air Mineral, atau Es Teh!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-[11px] font-mono text-amber-700 font-bold">
                        {voucher.voucherCode}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {voucher.itemName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Ditukar pada {voucher.createdAt}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif
                    </span>
                  </div>

                  {/* Simulated barcode */}
                  <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                    <div className="h-6 flex items-center gap-0.5">
                      <div className="w-1 h-6 bg-slate-800" />
                      <div className="w-0.5 h-6 bg-slate-800" />
                      <div className="w-1.5 h-6 bg-slate-800" />
                      <div className="w-0.5 h-6 bg-slate-800" />
                      <div className="w-2 h-6 bg-slate-800" />
                      <div className="w-0.5 h-6 bg-slate-800" />
                      <div className="w-1 h-6 bg-slate-800" />
                      <div className="w-1.5 h-6 bg-slate-800" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      Tunjukkan ke kasir kantin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Redemption Confirmation Modal / Insufficient Points Modal */}
      {selectedItem && errorMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-1">
              Poin Belum Mencukupi
            </h3>
            <p className="text-xs text-slate-600 text-center leading-relaxed mb-5">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Voucher Success Modal */}
      {activeVoucher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Kupon Berhasil Ditukarkan!
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Silakan perlihatkan kode kupon ini kepada petugas kantin sekolah.
            </p>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 mb-5 text-center">
              <div className="text-xs text-amber-800 font-medium">Menu Pesanan:</div>
              <div className="text-base font-extrabold text-slate-900 mb-2">
                {activeVoucher.itemName}
              </div>
              <div className="bg-white py-2 px-3 rounded-lg border border-amber-300 font-mono font-bold text-sm text-amber-900 tracking-wider">
                {activeVoucher.voucherCode}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveVoucher(null)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition"
            >
              Tutup & Simpan Kupon
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
