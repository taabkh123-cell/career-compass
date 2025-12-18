import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sparkles, Brain, Target, Shield } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const [showEthicsModal, setShowEthicsModal] = useState(false);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Career Guidance</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Discover Your
            <span className="text-gradient block">Ideal Career Path</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Combining personality science and natural language processing to provide 
            personalized, explainable career recommendations tailored to your unique profile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => setShowEthicsModal(true)}
              className="group"
            >
              Start Career Counseling
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => setShowEthicsModal(true)}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Personality Assessment"
            description="Complete a scientifically-validated Big Five personality test to understand your core traits."
            delay="0ms"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="NLP Analysis"
            description="Our AI analyzes your goals, interests, and skills to identify career-relevant patterns."
            delay="100ms"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Explainable Recommendations"
            description="Get personalized career matches with clear explanations of why each fits your profile."
            delay="200ms"
          />
        </div>
      </div>

      {/* Ethics Modal */}
      <Dialog open={showEthicsModal} onOpenChange={setShowEthicsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="font-display text-2xl">Participant Information Sheet</DialogTitle>
            </div>
            <DialogDescription asChild>
              <div className="text-left space-y-4 text-muted-foreground">
                <p className="font-medium text-foreground">
                  You are invited to participate in a research project exploring AI-powered career counseling.
                </p>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Purpose of the Study</h4>
                  <p>This project aims to develop and evaluate an AI system that provides personalized career recommendations using personality assessments and natural language processing.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">What You Will Do</h4>
                  <p>You will complete a personality questionnaire (approximately 10-15 minutes) and provide text inputs about your career goals, interests, and skills. The system will then generate personalized career recommendations.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Voluntary Participation</h4>
                  <p>Your participation is entirely voluntary. You may withdraw at any time without giving a reason, and you may skip any questions you prefer not to answer.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Data Anonymity</h4>
                  <p>No personal identifying information is collected. All data is processed anonymously and used solely for research purposes. No login or account creation is required.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Confidentiality</h4>
                  <p>Your responses will be kept confidential and stored securely. Results will only be reported in aggregate form in academic publications.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Contact Information</h4>
                  <p>For questions about this research, please contact the project supervisor, Dr. Imtias Ahmed, through the University of West London.</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEthicsModal(false)}>
              Close
            </Button>
            <Button variant="hero" onClick={onStart}>
              I Understand, Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="gradient-card rounded-xl p-6 shadow-elegant border border-border/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
      {icon}
    </div>
    <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default LandingPage;
