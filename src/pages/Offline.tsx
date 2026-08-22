import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Wifi,
  WifiOff,
  Map,
  FileText,
  Hotel,
  MapPin,
  Shield,
  Bus,
  Languages,
  Ticket,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/store/app-store';

const packItems = [
  { id: 'map', label: 'Offline Map', icon: Map, size: '12 MB' },
  { id: 'itinerary', label: 'Itinerary', icon: FileText, size: '0.5 MB' },
  { id: 'hotels', label: 'Hotel Information', icon: Hotel, size: '2 MB' },
  { id: 'places', label: 'Saved Places', icon: MapPin, size: '3 MB' },
  { id: 'emergency', label: 'Emergency Services', icon: Shield, size: '0.5 MB' },
  { id: 'transport', label: 'Transport Routes', icon: Bus, size: '4 MB' },
  { id: 'phrases', label: 'Local Phrases', icon: Languages, size: '1 MB' },
  { id: 'bookings', label: 'Booking Info', icon: Ticket, size: '0.5 MB' },
];

export default function Offline() {
  const { offlineMode, setOfflineMode } = useAppStore();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number[]>([]);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress([]);
    let index = 0;
    const interval = setInterval(() => {
      if (index >= packItems.length) {
        clearInterval(interval);
        setDownloading(false);
        return;
      }
      setDownloadProgress((prev) => [...prev, index]);
      index++;
    }, 500);
  };

  const totalSize = '23.5 MB';
  const isComplete = downloadProgress.length === packItems.length;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Download className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Offline</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Offline Mode</h1>
          <p className="text-sm text-muted-foreground mt-1">Download your travel pack for offline access.</p>
        </motion.div>

        {/* Network status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {offlineMode ? (
                <WifiOff className="h-5 w-5 text-amber-500" />
              ) : (
                <Wifi className="h-5 w-5 text-emerald-500" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {offlineMode ? 'Offline Mode Active' : 'Online'}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {offlineMode ? 'Using downloaded data' : 'Connected to the internet'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all',
                offlineMode
                  ? 'bg-foreground text-background'
                  : 'border border-border text-foreground hover:bg-card'
              )}
            >
              {offlineMode ? 'Go Online' : 'Simulate Poor Network'}
            </button>
          </div>
        </motion.div>

        {/* Download pack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Travel Pack</h3>
              <p className="text-xs text-muted-foreground">Hyderabad • {totalSize}</p>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all',
                isComplete
                  ? 'bg-emerald-500 text-white'
                  : downloading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-foreground text-background hover:bg-foreground/90'
              )}
            >
              {isComplete ? (
                <><Check className="h-3 w-3" /> Downloaded</>
              ) : downloading ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Downloading...</>
              ) : (
                <><Download className="h-3 w-3" /> Download Pack</>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {packItems.map((item, i) => {
              const Icon = item.icon;
              const downloaded = downloadProgress.includes(i);
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 transition-all',
                    downloaded ? 'bg-emerald-500/5' : 'bg-foreground/5'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{item.size}</span>
                    {downloaded ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-border" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
