import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Target, Heart, Briefcase } from 'lucide-react';

interface FreeTextInputProps {
  onComplete: (data: { goals: string; interests: string; skills: string }) => void;
  onBack: () => void;
}

const FreeTextInput = ({ onComplete, onBack }: FreeTextInputProps) => {
  const [goals, setGoals] = useState('');
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');

  const isValid = goals.trim().length > 0 || interests.trim().length > 0 || skills.trim().length > 0;

  const handleSubmit = () => {
    onComplete({ goals, interests, skills });
  };

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="gradient-card rounded-2xl shadow-elegant border border-border/50 p-6 mb-6 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Tell Us About Yourself</h1>
          <p className="text-muted-foreground">
            Share your career aspirations, interests, and skills. Our AI will analyze your input 
            to provide more personalized recommendations.
          </p>
        </div>

        {/* Input Cards */}
        <div className="space-y-6 mb-6">
          <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="goals" className="text-lg font-semibold text-foreground">Career Goals</Label>
                <p className="text-sm text-muted-foreground">What do you aspire to achieve in your career?</p>
              </div>
            </div>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="E.g., I want to become a leader in technology, helping to build innovative products that make a difference..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div 
            className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <Label htmlFor="interests" className="text-lg font-semibold text-foreground">Interests & Hobbies</Label>
                <p className="text-sm text-muted-foreground">What activities or topics excite you?</p>
              </div>
            </div>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="E.g., I love technology, gaming, and solving puzzles. I enjoy reading about science and exploring new ideas..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div 
            className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="skills" className="text-lg font-semibold text-foreground">Skills & Experience</Label>
                <p className="text-sm text-muted-foreground">What skills do you have? Any relevant experience?</p>
              </div>
            </div>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="E.g., Proficient in Python and JavaScript, experience with data analysis, strong communication skills, project management..."
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        {/* Tips */}
        <div className="gradient-card rounded-xl border border-border/50 p-4 mb-6 animate-fade-in bg-muted/30">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> The more detail you provide, the better our AI can match you with suitable careers. 
            Be specific about your interests and skills. All fields are optional - fill in what feels comfortable.
          </p>
        </div>

        {/* Navigation */}
        <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Assessment
            </Button>

            <Button 
              variant="hero"
              onClick={handleSubmit}
              disabled={!isValid}
              className="group"
            >
              Generate Recommendations
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTextInput;
