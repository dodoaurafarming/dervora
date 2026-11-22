import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Sparkles,
  ClipboardList,
  CheckCheck,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useQuizStore } from '../../store/quizStore';
import { useRoutineStore } from '../../store/routineStore';

export type NotificationType = 'reminder' | 'update' | 'trending';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  icon: 'sun' | 'moon' | 'sparkles' | 'quiz';
  title: string;
  message: string;
  timeLabel: string;
  actionPath: string;
  actionLabel: string;
}

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const getStorageKey = (userId: number | string) => `dervora_notif_read_${userId}`;

export const NotificationDropdown: React.FC = () => {
  const { user, loginWithGoogle } = useAuth();
  const { completed } = useQuizStore();
  const { morning, night } = useRoutineStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalRoutineProducts = useMemo(() => {
    const morningCount = Object.values(morning || {}).filter(Boolean).length;
    const nightCount = Object.values(night || {}).filter(Boolean).length;
    return morningCount + nightCount;
  }, [morning, night]);

  useEffect(() => {
    if (!user) {
      setReadIds([]);
      return;
    }

    try {
      const raw = localStorage.getItem(getStorageKey(user.id));
      setReadIds(raw ? JSON.parse(raw) : []);
    } catch {
      setReadIds([]);
    }
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const notifications = useMemo<NotificationItem[]>(() => {
    if (!user) return [];

    const todayKey = getTodayKey();
    const hour = new Date().getHours();
    const items: NotificationItem[] = [];

    if (hour >= 5 && hour < 12) {
      items.push({
        id: `reminder-morning-${todayKey}`,
        type: 'reminder',
        icon: 'sun',
        title: 'Waktunya Skincare Pagi',
        message: 'Awali hari dengan cleanser lembut, moisturizer, dan sunscreen minimal SPF 30.',
        timeLabel: 'Pengingat Pagi',
        actionPath: '/my-routine',
        actionLabel: 'Buka Rutinitas',
      });
    } else if (hour >= 12 && hour < 17) {
      items.push({
        id: `reminder-sunscreen-${todayKey}`,
        type: 'reminder',
        icon: 'sun',
        title: 'Jangan Lupa Re-apply Sunscreen',
        message: 'Lindungi kulit dari paparan sinar UV dengan mengaplikasikan ulang sunscreen setiap 2–3 jam.',
        timeLabel: 'Pengingat Siang',
        actionPath: '/my-routine',
        actionLabel: 'Cek Rutinitas',
      });
    } else {
      items.push({
        id: `reminder-night-${todayKey}`,
        type: 'reminder',
        icon: 'moon',
        title: 'Waktunya Skincare Malam',
        message: 'Bersihkan sisa sunscreen dan polusi hari ini, lalu lanjutkan dengan serum serta pelembap malammu.',
        timeLabel: 'Pengingat Malam',
        actionPath: '/my-routine',
        actionLabel: 'Buka Rutinitas',
      });
    }

    if (!completed) {
      items.push({
        id: `reminder-quiz-${user.id}`,
        type: 'reminder',
        icon: 'quiz',
        title: 'Lengkapi Skin Quiz Kamu',
        message: 'Kenali tipe kulitmu agar Dervora bisa menghitung skor kecocokan untuk setiap produk.',
        timeLabel: 'Profil Kulit',
        actionPath: '/quiz',
        actionLabel: 'Mulai Quiz',
      });
    } else if (totalRoutineProducts === 0) {
      items.push({
        id: `reminder-empty-routine-${todayKey}`,
        type: 'reminder',
        icon: 'sparkles',
        title: 'Susun Rutinitas Pertamamu',
        message: 'Slot skincare pagi dan malam masih kosong. Tambahkan produk favoritmu agar lebih teratur.',
        timeLabel: 'Tips Rutinitas',
        actionPath: '/my-routine',
        actionLabel: 'Atur Rutinitas',
      });
    } else {
      items.push({
        id: `reminder-matches-${todayKey}`,
        type: 'reminder',
        icon: 'sparkles',
        title: 'Cek Produk Paling Cocok',
        message: 'Lihat rekomendasi produk yang paling sesuai dengan profil kulitmu saat ini.',
        timeLabel: 'Rekomendasi',
        actionPath: '/matches',
        actionLabel: 'Lihat Matches',
      });
    }

    return items;
  }, [user, completed, totalRoutineProducts]);

  const unreadCount = useMemo(() => {
    if (!user) return 0;
    return notifications.filter((item) => !readIds.includes(item.id)).length;
  }, [user, notifications, readIds]);

  const persistReadIds = (nextIds: string[]) => {
    setReadIds(nextIds);
    if (!user) return;
    try {
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(nextIds));
    } catch {
      return;
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      persistReadIds([...readIds, item.id]);
    }
    setIsOpen(false);
    navigate(item.actionPath);
  };

  const handleMarkAllRead = () => {
    const allIds = Array.from(new Set([...readIds, ...notifications.map((n) => n.id)]));
    persistReadIds(allIds);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    loginWithGoogle();
  };

  const renderIcon = (icon: NotificationItem['icon']) => {
    if (icon === 'sun') return <Sun size={16} className="text-amber-600" />;
    if (icon === 'moon') return <Moon size={16} className="text-indigo-600" />;
    if (icon === 'quiz') return <ClipboardList size={16} className="text-dervora-primary" />;
    return <Sparkles size={16} className="text-dervora-primary" />;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        className={`relative p-2 rounded-full transition-colors focus:outline-none ${
          isOpen
            ? 'bg-dervora-primary/10 text-dervora-primary'
            : 'text-dervora-dark hover:bg-dervora-primary/10 hover:text-dervora-primary'
        }`}
      >
        <Bell size={20} />
        {user && unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-dervora-cream" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-[76px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96 bg-white border border-dervora-beige rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-dervora-beige/70 bg-dervora-cream/50">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-dervora-primary">
                Notifikasi
              </h3>
              {user && unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-dervora-primary text-dervora-cream font-body text-[10px] font-semibold">
                  {unreadCount} baru
                </span>
              )}
            </div>

            {user && unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 font-body text-xs font-medium text-dervora-primary hover:underline"
              >
                <CheckCheck size={14} />
                Tandai dibaca
              </button>
            )}
          </div>

          {!user ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-dervora-primary/10 flex items-center justify-center mx-auto mb-3 text-dervora-primary">
                <Bell size={22} />
              </div>
              <h4 className="font-heading text-lg font-bold text-dervora-primary mb-1.5">
                Pengingat Skincare Personal
              </h4>
              <p className="font-body text-xs text-dervora-dark/70 leading-relaxed mb-5">
                Masuk ke akun Dervora untuk menerima pengingat rutinitas pagi, malam, serta rekomendasi perawatan sesuai kulitmu.
              </p>
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-dervora-primary text-dervora-cream font-heading text-sm font-semibold hover:bg-dervora-primary-dark transition-colors shadow-sm"
              >
                <LogIn size={16} />
                Masuk dengan Google
              </button>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto divide-y divide-dervora-beige/50">
                {notifications.map((item) => {
                  const isUnread = !readIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-dervora-cream/60 transition-colors ${
                        isUnread ? 'bg-dervora-cream/30' : 'bg-white'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-dervora-blush/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {renderIcon(item.icon)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-body text-[10px] font-semibold uppercase tracking-wider text-dervora-primary/80">
                            {item.timeLabel}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-dervora-primary flex-shrink-0" />
                          )}
                        </div>

                        <p className="font-body text-sm font-semibold text-dervora-dark leading-snug mb-1">
                          {item.title}
                        </p>

                        <p className="font-body text-xs text-dervora-dark/70 leading-relaxed mb-1.5">
                          {item.message}
                        </p>

                        <span className="inline-flex items-center gap-0.5 font-body text-xs font-medium text-dervora-primary">
                          {item.actionLabel}
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-dervora-beige/70 bg-dervora-cream/30 text-center">
                <p className="font-body text-[11px] text-dervora-dark/50">
                  Update fitur & produk hits akan tampil di sini
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};