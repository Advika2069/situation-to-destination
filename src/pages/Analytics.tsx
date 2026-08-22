import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, MapPin, Wallet, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppShell } from '@/components/layout/AppShell';
import { analyticsData } from '@/data/mock';

const COLORS = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#aaaaaa', '#d0d0d0'];

export default function Analytics() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="font-medium uppercase tracking-wider">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Travel Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Insights from your travel patterns.</p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <StatCard icon={<MapPin className="h-4 w-4" />} label="Total Trips" value={analyticsData.totalTrips.toString()} />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Distance" value={`${analyticsData.totalDistance} km`} />
          <StatCard icon={<Wallet className="h-4 w-4" />} label="Spent" value={`₹${analyticsData.totalSpent.toLocaleString()}`} />
          <StatCard icon={<Star className="h-4 w-4" />} label="Saved" value={`₹${analyticsData.moneySaved.toLocaleString()}`} />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly spending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Spending</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlySpending}>
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
                  <Bar dataKey="amount" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Favorite categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Favorite Categories</h3>
            <div className="h-52 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.favoriteCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {analyticsData.favoriteCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {analyticsData.favoriteCategories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] text-muted-foreground">{cat.name}</span>
                    <span className="text-[10px] font-bold text-foreground">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Transport distribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Transport Distribution</h3>
            <div className="space-y-3">
              {analyticsData.transportDistribution.map((t, i) => (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${t.value}%`, backgroundColor: COLORS[i] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity distribution */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Activity Distribution</h3>
            <div className="space-y-3">
              {analyticsData.activityDistribution.map((a, i) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{a.name}</span>
                    <span className="text-xs text-muted-foreground">{a.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${a.value}%`, backgroundColor: COLORS[i] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-muted-foreground mb-2">{icon}</div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
