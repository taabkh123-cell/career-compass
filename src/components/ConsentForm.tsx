import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, ChevronRight } from 'lucide-react';

interface ConsentFormProps {
  onConsent: () => void;
  onBack: () => void;
}

const ConsentForm = ({ onConsent, onBack }: ConsentFormProps) => {
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  const allConsented = consent1 && consent2 && consent3;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl w-full gradient-card rounded-2xl shadow-elegant border border-border/50 p-8 animate-scale-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl gradient-primary">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Informed Consent</h1>
            <p className="text-muted-foreground text-sm">Please review and confirm the following</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <Checkbox 
              id="consent1" 
              checked={consent1} 
              onCheckedChange={(checked) => setConsent1(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="consent1" className="text-foreground cursor-pointer leading-relaxed">
              I understand that my participation is <strong>voluntary</strong> and that I am free to withdraw at any time, without giving a reason.
            </Label>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <Checkbox 
              id="consent2" 
              checked={consent2} 
              onCheckedChange={(checked) => setConsent2(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="consent2" className="text-foreground cursor-pointer leading-relaxed">
              I understand that my responses will be <strong>anonymous</strong> and no personally identifiable information will be collected.
            </Label>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <Checkbox 
              id="consent3" 
              checked={consent3} 
              onCheckedChange={(checked) => setConsent3(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="consent3" className="text-foreground cursor-pointer leading-relaxed">
              I <strong>consent</strong> to participate in this research project and have read the participant information sheet.
            </Label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            Back to Home
          </Button>
          <Button 
            variant="hero"
            onClick={onConsent}
            disabled={!allConsented}
            className="flex-1 group"
          >
            Begin Assessment
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {!allConsented && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Please confirm all statements to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default ConsentForm;
