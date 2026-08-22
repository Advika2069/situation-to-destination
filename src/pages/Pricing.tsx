import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'For occasional travelers',
    features: ['5 AI trip plans/month', 'Basic discovery', 'Map access', 'Transport comparison', 'Community support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Voyager',
    price: '₹299/mo',
    description: 'For regular travelers',
    features: ['Unlimited AI trip plans', 'Priority discovery', 'Offline packs', 'Expense splitting', 'Travel companions', 'Safety alerts', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Navigator',
    price: '₹799/mo',
    description: 'For families and groups',
    features: ['Everything in Voyager', 'Family dashboard', 'Multi-destination planning', 'Group expense management', 'Business listings', 'API access', 'Dedicated support'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">T</div>
            <span className="text-sm font-semibold tracking-tight">TravelOS</span>
          </a>
          <a href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Back to Home</a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Simple Pricing</h1>
          <p className="text-sm text-muted-foreground">Choose the plan that fits your travel needs.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={cn(
                'rounded-xl border bg-card p-6',
                plan.highlighted ? 'border-foreground' : 'border-border'
              )}
            >
              {plan.highlighted && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-foreground mb-3">
                  <Zap className="h-3 w-3" fill="currentColor" /> MOST POPULAR
                </div>
              )}
              <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{plan.price}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.description}</p>
              <button className={cn(
                'w-full rounded-lg px-4 py-2.5 text-xs font-medium transition-all mb-4',
                plan.highlighted
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'border border-border text-foreground hover:bg-card'
              )}>
                {plan.cta}
              </button>
              <div className="space-y-2">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
