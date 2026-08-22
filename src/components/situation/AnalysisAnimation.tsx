import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analysisSteps } from '@/services/ai-engine';
import { useAppStore } from '@/store/app-store';

export function AnalysisAnimation() {
  const { isAnalyzing, setIsAnalyzing } = useAppStore();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCompletedSteps([]);
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    const totalDuration = analysisSteps.reduce((s, step) => s + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      if (stepIndex >= analysisSteps.length) {
        clearInterval(interval);
        setIsAnalyzing(false);
        return;
      }

      elapsed += 100;
      setProgress(Math.min(100, (elapsed / totalDuration) * 100));
      setCurrentStep(stepIndex);

      const stepEnd = analysisSteps
        .slice(0, stepIndex + 1)
        .reduce((s, step) => s + step.duration, 0);

      if (elapsed >= stepEnd) {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAnalyzing, setIsAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground mb-4">
            <Loader2 className="h-3 w-3 animate-spin" />
            AI ANALYZING YOUR SITUATION
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Building your perfect journey...
          </h3>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-border mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {analysisSteps.map((step, i) => {
            const isCompleted = completedSteps.includes(i);
            const isCurrent = i === currentStep && !isCompleted;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex items-center gap-3 py-2 px-3 rounded-lg transition-all',
                  isCompleted && 'text-foreground',
                  isCurrent && 'text-foreground bg-foreground/5',
                  !isCompleted && !isCurrent && 'text-muted-foreground/40'
                )}
              >
                <div className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                  isCompleted
                    ? 'bg-foreground border-foreground text-background'
                    : isCurrent
                    ? 'border-foreground/40'
                    : 'border-border'
                )}>
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : isCurrent ? (
                    <motion.div
                      className="h-2 w-2 rounded-full bg-foreground"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : null}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-muted-foreground ml-auto"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
