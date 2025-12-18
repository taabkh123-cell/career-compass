import { useEffect, useState } from 'react';
import { Brain, Sparkles, Target, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Brain, text: 'Analyzing personality profile...', duration: 1500 },
    { icon: Target, text: 'Processing your goals and interests...', duration: 1500 },
    { icon: Sparkles, text: 'Generating career recommendations...', duration: 1500 },
  ];

  useEffect(() => {
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, totalDuration / 100);

    let stepTimeout: NodeJS.Timeout;
    let elapsed = 0;

    const advanceStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) return;
      
      setCurrentStep(stepIndex);
      stepTimeout = setTimeout(() => {
        advanceStep(stepIndex + 1);
      }, steps[stepIndex].duration);
    };

    advanceStep(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Main Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse" />
            
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-4 rounded-full gradient-primary">
                <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
              </div>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/40 animate-pulse"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 200}ms`,
                  animationDuration: `${1500 + Math.random() * 1000}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Text */}
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">
          Analyzing Your Profile
        </h2>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 border border-primary/30' 
                    : isComplete 
                      ? 'bg-muted/50 text-muted-foreground' 
                      : 'text-muted-foreground/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary animate-pulse' : ''}`} />
                <span className={`text-sm ${isActive ? 'text-foreground font-medium' : ''}`}>
                  {step.text}
                </span>
                {isComplete && (
                  <span className="ml-auto text-xs text-secondary">✓</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
