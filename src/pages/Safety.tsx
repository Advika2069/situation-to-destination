import { motion } from 'framer-motion';
import { Shield, Phone, Navigation, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { emergencyServices } from '@/data/mock';

const travelTips = [
  { title: 'Keep copies of important documents', description: 'Store digital copies of your passport, ID, and booking confirmations in your phone and email.', status: 'tip' as const },
  { title: 'Share your itinerary', description: 'Send your trip details to a family member or friend before you leave.', status: 'tip' as const },
  { title: 'Carry basic medications', description: 'Pack paracetamol, band-aids, and any personal medications.', status: 'tip' as const },
  { title: 'Download offline maps', description: 'Download the travel pack for your destination before you lose connectivity.', status: 'tip' as const },
  { title: 'Know local emergency numbers', description: 'Police: 100 | Ambulance: 108 | Fire: 101 | Tourist Helpline: 1364', status: 'important' as const },
  { title: 'Stay aware of your surroundings', description: 'Keep valuables secure in crowded areas. Use hotel safes for extra cash and documents.', status: 'tip' as const },
  { title: 'Check weather before heading out', description: 'Weather affects safety — carry rain gear, sunscreen, or warm clothing as needed.', status: 'tip' as const },
];

export default function Safety() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Safety</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Safety & Emergency</h1>
          <p className="text-sm text-muted-foreground mt-1">Emergency services and practical travel advice.</p>
        </motion.div>

        {/* Emergency services */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">Nearby Emergency Services</h2>
          <div className="space-y-2">
            {emergencyServices.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{svc.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{svc.address}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Navigation className="h-2.5 w-2.5" /> {svc.distance} km
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" /> {svc.travelTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${svc.phone}`}
                    className="flex items-center gap-1 rounded-lg bg-foreground text-background px-3 py-2 text-[10px] font-medium hover:bg-foreground/90 transition-all"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </a>
                  <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[10px] font-medium text-foreground hover:bg-card transition-all">
                    <Navigation className="h-3 w-3" /> Navigate
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Travel Smart Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Travel Smart
          </h2>
          <div className="space-y-2">
            {travelTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {tip.status === 'important' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
