import { motion } from 'framer-motion';
import { Users, Star, MapPin, Globe, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { guides } from '@/data/mock';
import { useAppStore } from '@/store/app-store';

export default function Guides() {
  const { bookedGuides, bookGuide } = useAppStore();
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Guides & Drivers</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Local Guides</h1>
          <p className="text-sm text-muted-foreground mt-1">Verified guides and drivers for your trip.</p>
        </motion.div>

        <div className="space-y-4">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-foreground/10 flex items-center justify-center text-xl font-bold text-foreground shrink-0">
                  {guide.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{guide.name}</h4>
                    {guide.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                        <CheckCircle className="h-2.5 w-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {guide.type === 'both' ? 'Guide + Driver' : guide.type === 'guide' ? 'Guide' : 'Driver'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">{guide.description}</p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" fill="currentColor" /> {guide.rating}</span>
                    <span>{guide.tripCount} trips</span>
                    <span>{guide.reviewCount} reviews</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{guide.languages.join(', ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {guide.specialization.map((s) => (
                      <span key={s} className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-lg font-bold text-foreground">₹{guide.pricePerHour}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">per hour</span>
                    </div>
                    <button
                      onClick={() => bookGuide(guide.id)}
                      className={cn(
                        'rounded-lg px-4 py-2 text-xs font-medium transition-all',
                        bookedGuides.includes(guide.id)
                          ? 'bg-foreground text-background'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      )}
                    >
                      {bookedGuides.includes(guide.id) ? '✓ Booked' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
