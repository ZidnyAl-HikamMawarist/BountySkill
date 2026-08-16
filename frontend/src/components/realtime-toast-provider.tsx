'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Scale,
  CreditCard,
  Star,
  X,
  Bell,
  Radio
} from 'lucide-react';

export interface RealtimeToast {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  bountyId?: string;
}

interface ToastContextType {
  toasts: RealtimeToast[];
  isConnected: boolean;
  dismissToast: (id: string) => void;
  triggerManualToast: (title: string, message: string, type?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Pure Web Audio API chime tone (resilient against browser autoplay restrictions)
function playNotificationChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio policy suppression catch
  }
}

export function RealtimeToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<RealtimeToast[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<RealtimeToast, 'id' | 'timestamp'>) => {
    const newToast: RealtimeToast = {
      ...toastData,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    playNotificationChime();
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 concurrent toasts

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 7000);
  }, [dismissToast]);

  const triggerManualToast = (title: string, message: string, type: string = 'INFO') => {
    addToast({ title, message, type });
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: any = null;
    let isUnmounted = false;

    function connect() {
      if (isUnmounted) return;
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          if (!isUnmounted) setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'CONNECTED' || data.type === 'PONG') return;

            addToast({
              type: data.type || 'INFO',
              title: data.title || 'Pemberitahuan SkillBounty',
              message: data.message || '',
              bountyId: data.bountyId
            });
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            setIsConnected(false);
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          if (!isUnmounted) {
            setIsConnected(false);
          }
        };
      } catch (err) {
        if (!isUnmounted) {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    }

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
    };
  }, [addToast]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'SUBMISSION_APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'SUBMISSION_REVISION':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'DISPUTE_RAISED':
      case 'DISPUTE_RESOLVED':
        return <Scale className="w-5 h-5 text-purple-400 shrink-0" />;
      case 'WITHDRAWAL_REQUESTED':
      case 'WITHDRAWAL_STATUS_CHANGED':
        return <CreditCard className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 'REVIEW_SUBMITTED':
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />;
      case 'BOUNTY_CREATED':
      case 'SUBMISSION_NEW':
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  const getToastBorder = (type: string) => {
    switch (type) {
      case 'SUBMISSION_APPROVED':
        return 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10';
      case 'SUBMISSION_REVISION':
        return 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10';
      case 'DISPUTE_RAISED':
      case 'DISPUTE_RESOLVED':
        return 'border-purple-500/40 bg-slate-900/95 shadow-purple-500/10';
      case 'WITHDRAWAL_STATUS_CHANGED':
        return 'border-cyan-500/40 bg-slate-900/95 shadow-cyan-500/10';
      case 'REVIEW_SUBMITTED':
        return 'border-amber-400/40 bg-slate-900/95 shadow-amber-400/10';
      default:
        return 'border-indigo-500/40 bg-slate-900/95 shadow-indigo-500/10';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, isConnected, dismissToast, triggerManualToast }}>
      {children}

      {/* Floating Realtime Toast Container in Top-Right Corner */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 animate-in slide-in-from-top-4 fade-in ${getToastBorder(
              toast.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getToastIcon(toast.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white truncate font-montserrat">{toast.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{toast.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed break-words">{toast.message}</p>
                {toast.bountyId && (
                  <a
                    href={`/bounties/${toast.bountyId}`}
                    className="inline-block mt-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Lihat detail bounty →
                  </a>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full bg-white/10 h-0.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-full animate-[shrink_7s_linear_forwards]" />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useRealtimeToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useRealtimeToast must be used within RealtimeToastProvider');
  return context;
}
