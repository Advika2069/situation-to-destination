import { motion } from 'framer-motion';
import { Users, Star, MapPin, Heart, Calendar, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { travelerMatches } from '@/data/mock';

export default function TravelTogether() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Travel Together</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Find Travel Companions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Match with travelers heading to the same destination. Privacy-first — no personal data exposed.
          </p>
        </motion.div>

        {/* Match cards */}
        <div className="space-y-4">
          {travelerMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 hover:border-foreground/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-bold text-foreground shrink-0">
                  {match.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{match.name}</h4>
                    <div className="flex items-center gap-1 bg-foreground text-background rounded-full px-2.5 py-0.5">
                      <Star className="h-3 w-3" fill="currentColor" />
                      <span className="text-xs font-bold">{match.compatibility}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{match.destination}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{match.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {match.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-all">
                      <Heart className="h-3 w-3" />
                      Connect
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-center text-muted-foreground mt-8"
        >
          Privacy-first matching. No sensitive personal information is shared without your consent.
        </motion.p>
      </div>
    </AppShell>
  );
}
