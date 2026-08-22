import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Phone, Mail, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/store/app-store';
import { demoUser } from '@/data/mock';

export default function Profile() {
  const { user, signOut } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);
  const navigate = useNavigate();
  const { travelDNA: dna } = useAppStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName((user as Record<string, unknown>).firstName as string || '');
      setLastName((user as Record<string, unknown>).lastName as string || '');
      setPhone((user as Record<string, unknown>).phone as string || '');
      setEmail((user as Record<string, unknown>).email as string || '');
    }
  }, [user]);

  const dnaEntries = Object.entries(dna).sort(([, a], [, b]) => b - a);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile({
        firstName,
        lastName,
        phone,
        name: fullName || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Profile save error:', e);
    }
    setIsSaving(false);
  };

  const displayName = firstName || (user as Record<string, unknown>)?.name as string || demoUser.name;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <User className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal details and travel preferences.</p>
        </motion.div>

        {/* User Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-foreground/10 flex items-center justify-center text-xl font-bold text-foreground">
              {firstName ? firstName.charAt(0) : displayName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {firstName ? `${firstName} ${lastName}` : displayName}
              </h3>
              <p className="text-xs text-muted-foreground">{demoUser.type} • {demoUser.budget} Budget</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={email}
                  readOnly
                  placeholder="Email address"
                  className="w-full rounded-lg border border-border bg-muted/50 pl-9 pr-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : saved ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Travel DNA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Travel DNA</h3>
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
