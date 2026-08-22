import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Globe, Shield, Clock, Star, Sparkles, ChevronRight, Play } from 'lucide-react';
import { SituationEngine } from '@/components/situation/SituationEngine';
import { AnalysisAnimation } from '@/components/situation/AnalysisAnimation';
import { ItineraryResults } from '@/components/situation/ItineraryResults';
import { useAppStore } from '@/store/app-store';
import { generateItinerary, generateSuggestions } from '@/services/ai-engine';

type Phase = 'input' | 'analyzing' | 'results';

export default function Landing() {
  const { isAnalyzing, setIsAnalyzing, itinerary, setItinerary, situation } = useAppStore();
  const [phase, setPhase] = useState<Phase>('input');
  const navigate = useNavigate();

  const handleAnalysisComplete = useCallback(() => {
    const result = generateItinerary(situation);
    setItinerary(result);
    setPhase('results');
    setIsAnalyzing(false);
  }, [situation, setItinerary, setIsAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing && phase === 'analyzing') {
      handleAnalysisComplete();
    }
  }, [isAnalyzing, phase, handleAnalysisComplete]);

  const handleSubmit = () => {
    setPhase('analyzing');
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
              T
            </div>
            <span className="text-sm font-semibold tracking-tight">TravelOS</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#demo" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
            <a href="/auth" className="text-xs font-medium text-foreground hover:text-foreground/80 transition-colors">
              Sign In
            </a>
          </nav>
          <a
            href="/auth"
            className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all"
          >
            Get Started
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI-Powered Travel Operating System
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            YOUR TRIP.
            <br />
            YOUR SITUATION.
            <br />
            <span className="text-muted-foreground">
              ONE INTELLIGENT TRAVEL OS.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed mb-10">
            Stop asking "where do you want to go?" TravelOS asks{" "}
            <strong className="text-foreground">"what is your travel situation?"</strong>{" "}
            — and builds your perfect journey from time, budget, interests, and context.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href="#demo"
              className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Try the Live Demo
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-card transition-all"
            >
              Explore Features
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { icon: <Zap className="h-3.5 w-3.5" />, label: 'AI Itinerary Builder' },
            { icon: <Globe className="h-3.5 w-3.5" />, label: 'Smart Discovery' },
            { icon: <Shield className="h-3.5 w-3.5" />, label: 'Safety First' },
            { icon: <Clock className="h-3.5 w-3.5" />, label: 'Time Optimization' },
            { icon: <Star className="h-3.5 w-3.5" />, label: 'Family-Friendly' },
          ].map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground"
            >
              {feat.icon}
              {feat.label}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Situation Engine Demo */}
      <section id="demo" className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            Describe Your Situation
          </h2>
          <p className="text-sm text-muted-foreground">
            Tell TravelOS what you need — and watch it build your perfect journey.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {phase === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SituationEngine onSubmit={handleSubmit} />
              </motion.div>
            )}

            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AnalysisAnimation />
              </motion.div>
            )}

            {phase === 'results' && itinerary && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ItineraryResults
                  itinerary={itinerary}
                  onViewMap={() => navigate('/map')}
                />

                {/* Next steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 pt-8 border-t border-border text-center"
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Continue Your Journey
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a href="/plan" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
                      Edit Itinerary <ChevronRight className="h-3 w-3" />
                    </a>
                    <a href="/move" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
                      Compare Transport <ChevronRight className="h-3 w-3" />
                    </a>
                    <a href="/map" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-card transition-all">
                      View on Map <ChevronRight className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => { setPhase('input'); setItinerary(null); }}
                      className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/90 transition-all"
                    >
                      <Play className="h-3 w-3" fill="currentColor" />
                      Try Another Scenario
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            Not Another Travel App.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            A complete operating system for travel — from situation to destination, every step intelligent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'AI Situation Engine',
              description: 'Describe your situation in natural language. AI analyzes time, budget, weather, interests, and builds the perfect itinerary.',
              icon: <Sparkles className="h-5 w-5" />,
            },
            {
              title: 'Smart Discovery',
              description: 'Destination cards with AI match scores, ratings, distance, budget fit, and best time to visit.',
              icon: <Globe className="h-5 w-5" />,
            },
            {
              title: 'Route Optimization',
              description: 'Automatically reduce distance, time, and cost. See before/after savings at a glance.',
              icon: <Zap className="h-5 w-5" />,
            },
            {
              title: 'Transport Hub',
              description: 'Compare bus, metro, Uber, Ola, Rapido, taxi, and bike options. Cheapest, fastest, best value.',
              icon: <Clock className="h-5 w-5" />,
            },
            {
              title: 'Food & Experiences',
              description: 'Curated food trails, heritage walks, photography spots, and local experiences tailored to you.',
              icon: <Star className="h-5 w-5" />,
            },
            {
              title: 'Safety Intelligence',
              description: 'Nearest hospital, police, pharmacy. Travel smart tips. Emergency contacts always accessible.',
              icon: <Shield className="h-5 w-5" />,
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 hover:border-foreground/20 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final message */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center rounded-2xl border border-border bg-card p-10 sm:p-16"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-3">
            YOUR JOURNEY IS MORE THAN A DESTINATION.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            TravelOS turns your situation into an intelligent travel experience. Built for families, optimized for every moment.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-foreground/90 transition-all"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background text-[8px] font-bold">T</div>
            <span className="text-xs font-medium text-muted-foreground">TravelOS v1.0</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Built with intelligence. Powered by your situation.
          </p>
        </div>
      </footer>
    </div>
  );
}
