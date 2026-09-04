import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Ticket,
  Megaphone,
  Star,
  ChevronRight,
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { localOffers } from '@/data/mock';
import { useAppStore } from '@/store/app-store';

const dashboardStats = [
  { label: 'Impressions', value: '2,340', change: '+12%', icon: <Eye className="h-4 w-4" /> },
  { label: 'Visits', value: '856', change: '+8%', icon: <Users className="h-4 w-4" /> },
  { label: 'Coupons Claimed', value: '189', change: '+24%', icon: <Ticket className="h-4 w-4" /> },
  { label: 'Revenue', value: '₹45,200', change: '+18%', icon: <TrendingUp className="h-4 w-4" /> },
];

const campaignData = [
  { month: 'Jul', impressions: 1800, claims: 120 },
  { month: 'Aug', impressions: 2100, claims: 156 },
  { month: 'Sep', impressions: 1900, claims: 134 },
  { month: 'Oct', impressions: 2500, claims: 198 },
  { month: 'Nov', impressions: 2800, claims: 220 },
  { month: 'Dec', impressions: 3200, claims: 267 },
];

export default function Business() {
  const [activeTab, setActiveTab] = useState<'offers' | 'dashboard'>('offers');
  const { claimedOffers, claimOffer } = useAppStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Business</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Business Ecosystem</h1>
          <p className="text-sm text-muted-foreground mt-1">Local offers, promotions, and business analytics.</p>
        </motion.div>

        {/* Tab switch */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('offers')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all border',
              activeTab === 'offers'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
            )}
          >
            <Megaphone className="h-3 w-3" /> Local Offers
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all border',
              activeTab === 'dashboard'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
            )}
          >
            <BarChart3 className="h-3 w-3" /> Dashboard
          </button>
        </div>

        {activeTab === 'offers' && (
          <div className="space-y-4">
            {localOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-32 sm:h-auto overflow-hidden shrink-0">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">{offer.businessName}</p>
                        <h4 className="text-sm font-semibold text-foreground">{offer.title}</h4>
                      </div>
                      <span className="shrink-0 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded">
                        {offer.discount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">
                          Code: <span className="font-mono font-bold text-foreground">{offer.code}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">{offer.claimed} claimed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          {copiedCode === offer.code ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy Code</>}
                        </button>
                        <button
                          onClick={() => claimOffer(offer.id)}
                          className={cn(
                            'flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all',
                            claimedOffers.includes(offer.id)
                              ? 'bg-foreground text-background'
                              : 'bg-foreground text-background hover:bg-foreground/90'
                          )}
                        >
                          {claimedOffers.includes(offer.id) ? <><Check className="h-3 w-3" /> Claimed</> : <><Ticket className="h-3 w-3" /> Claim Offer</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-muted-foreground mb-2">{stat.icon}</div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  <p className="text-[10px] text-emerald-600 font-medium mt-1">{stat.change}</p>
                </div>
              ))}
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">Campaign Performance</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="impressions" fill="var(--foreground)" radius={[4, 4, 0, 0]} opacity={0.3} />
                    <Bar dataKey="claims" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
