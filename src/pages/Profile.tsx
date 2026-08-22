import { motion } from 'framer-motion';
import { User, Star, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/store/app-store';
import { travelDNA, demoUser } from '@/data/mock';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { travelDNA: dna } = useAppStore();

  const dnaEntries = Object.entries(dna).sort(([, a], [, b]) => b - a);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <User className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {user?.name || demoUser.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{demoUser.type} • {demoUser.budget} Budget</p>
        </motion.div>

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-foreground/10 flex items-center justify-center text-xl font-bold text-foreground">
              {(user?.name || demoUser.name).charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{user?.name || demoUser.name}</h3>
              <p className="text-xs text-muted-foreground">{demoUser.type}</p>
              <div className="flex gap-1.5 mt-1">
                {demoUser.interests.map((i) => (
                  <span key={i} className="text-[10px] bg-foreground/5 text-muted-foreground px-2 py-0.5 rounded-full">{i}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
              <Settings className="h-3 w-3" /> Edit Profile
            </button>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-all"
            >
              <LogOut className="h-3 w-3" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Travel DNA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Travel DNA</h3>
          <p className="text-xs text-muted-foreground mb-6">
            Your travel personality, based on trips and preferences.
          </p>
          <div className="space-y-3">
            {dnaEntries.map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground capitalize">{key}</span>
                  <span className="text-xs text-muted-foreground">{value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
