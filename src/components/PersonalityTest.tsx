import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { personalityQuestions } from '@/data/personalityQuestions';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalityTestProps {
  onComplete: (responses: Record<number, number>) => void;
  onBack: () => void;
}

const QUESTIONS_PER_PAGE = 5;

const PersonalityTest = ({ onComplete, onBack }: PersonalityTestProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});

  const totalPages = Math.ceil(personalityQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, personalityQuestions.length);
  const currentQuestions = personalityQuestions.slice(startIndex, endIndex);

  const progress = ((currentPage + 1) / totalPages) * 100;
  const answeredOnPage = currentQuestions.filter(q => responses[q.id] !== undefined).length;
  const allAnsweredOnPage = answeredOnPage === currentQuestions.length;

  const handleResponse = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  const likertLabels = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly Agree',
  ];

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="gradient-card rounded-2xl shadow-elegant border border-border/50 p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Personality Assessment</h1>
              <p className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {totalPages} • Question {startIndex + 1}-{endIndex} of {personalityQuestions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{Math.round(progress)}% Complete</p>
              <p className="text-xs text-muted-foreground">{answeredOnPage}/{currentQuestions.length} answered</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {currentQuestions.map((question, index) => (
            <div 
              key={question.id}
              className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="text-foreground font-medium mb-4">
                <span className="text-primary mr-2">{startIndex + index + 1}.</span>
                {question.text}
              </p>

              {/* Desktop Likert Scale */}
              <div className="hidden sm:flex items-center justify-between gap-2">
                {likertLabels.map((label, i) => {
                  const value = i + 1;
                  const isSelected = responses[question.id] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleResponse(question.id, value)}
                      className={cn(
                        "flex-1 py-3 px-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Likert Scale */}
              <div className="sm:hidden space-y-2">
                {likertLabels.map((label, i) => {
                  const value = i + 1;
                  const isSelected = responses[question.id] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleResponse(question.id, value)}
                      className={cn(
                        "w-full py-3 px-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium text-left",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="inline-block w-6 text-center mr-2">{value}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentPage === 0 ? 'Back' : 'Previous'}
            </Button>

            <div className="flex gap-2">
              {currentPage < totalPages - 1 && (
                <Button 
                  variant="ghost" 
                  onClick={handleNext}
                  className="text-muted-foreground"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Page
                </Button>
              )}
              
              <Button 
                variant="hero"
                onClick={handleNext}
                disabled={!allAnsweredOnPage && currentPage === totalPages - 1}
                className="group"
              >
                {currentPage === totalPages - 1 ? 'Complete Assessment' : 'Next Page'}
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;
