import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { personalityQuestions, mandatoryQuestionCount } from '@/data/personalityQuestions';
import { ChevronLeft, ChevronRight, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalityTestProps {
  onComplete: (responses: Record<number, number>) => void;
  onBack: () => void;
}

const QUESTIONS_PER_PAGE = 5;

const PersonalityTest = ({ onComplete, onBack }: PersonalityTestProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showWarning, setShowWarning] = useState(false);

  const totalPages = Math.ceil(personalityQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, personalityQuestions.length);
  const currentQuestions = personalityQuestions.slice(startIndex, endIndex);

  // Calculate progress based on answered questions
  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / personalityQuestions.length) * 100;
  
  // Check mandatory questions on current page
  const mandatoryOnPage = currentQuestions.filter(q => q.mandatory);
  const answeredMandatoryOnPage = mandatoryOnPage.filter(q => responses[q.id] !== undefined).length;
  const allMandatoryAnsweredOnPage = answeredMandatoryOnPage === mandatoryOnPage.length;

  // Total mandatory answered
  const totalMandatoryAnswered = personalityQuestions
    .filter(q => q.mandatory && responses[q.id] !== undefined).length;

  // Check if can proceed to results (all mandatory answered)
  const allMandatoryAnswered = totalMandatoryAnswered === mandatoryQuestionCount;

  const handleResponse = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setShowWarning(false);
  };

  const handleNext = () => {
    // Check if mandatory questions on current page are answered
    if (!allMandatoryAnsweredOnPage) {
      setShowWarning(true);
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      setShowWarning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final page - submit if all mandatory answered
      if (allMandatoryAnswered) {
        onComplete(responses);
      } else {
        setShowWarning(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setShowWarning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  const likertLabels = [
    { value: 1, label: 'Strongly Disagree', short: 'SD' },
    { value: 2, label: 'Disagree', short: 'D' },
    { value: 3, label: 'Neutral', short: 'N' },
    { value: 4, label: 'Agree', short: 'A' },
    { value: 5, label: 'Strongly Agree', short: 'SA' },
  ];

  // Get unanswered mandatory questions on current page
  const unansweredMandatory = mandatoryOnPage.filter(q => responses[q.id] === undefined);

  return (
    <div className="min-h-screen gradient-hero py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="gradient-card rounded-2xl shadow-elegant border border-border/50 p-6 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Personality Assessment</h1>
              <p className="text-muted-foreground text-sm">
                Page {currentPage + 1} of {totalPages} • Questions {startIndex + 1}-{endIndex}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{answeredCount}/{personalityQuestions.length} Answered</p>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Star className="w-3 h-3 text-primary fill-primary" />
                {totalMandatoryAnswered}/{mandatoryQuestionCount} Required
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span>Required question</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-border"></div>
              <span>Optional question</span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {showWarning && unansweredMandatory.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 animate-fade-in flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Please answer required questions</p>
              <p className="text-xs text-destructive/80 mt-1">
                Questions marked with a star (★) must be answered before proceeding.
              </p>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {currentQuestions.map((question, index) => {
            const isAnswered = responses[question.id] !== undefined;
            const isMandatoryUnanswered = question.mandatory && !isAnswered && showWarning;
            
            return (
              <div 
                key={question.id}
                className={cn(
                  "gradient-card rounded-xl shadow-elegant border p-6 animate-slide-up transition-all duration-300",
                  isMandatoryUnanswered 
                    ? "border-destructive/50 ring-2 ring-destructive/20" 
                    : isAnswered 
                      ? "border-primary/30" 
                      : "border-border/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-primary font-semibold min-w-[24px]">{startIndex + index + 1}.</span>
                  <p className="text-foreground font-medium flex-1">{question.text}</p>
                  {question.mandatory && (
                    <Star 
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isAnswered 
                          ? "text-primary fill-primary" 
                          : isMandatoryUnanswered
                            ? "text-destructive fill-destructive animate-pulse-soft"
                            : "text-primary/50 fill-primary/30"
                      )} 
                    />
                  )}
                </div>

                {/* Desktop Likert Scale */}
                <div className="hidden sm:flex items-center justify-between gap-2">
                  {likertLabels.map(({ value, label }) => {
                    const isSelected = responses[question.id] === value;
                    return (
                      <button
                        key={value}
                        onClick={() => handleResponse(question.id, value)}
                        className={cn(
                          "flex-1 py-3 px-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-md"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Likert Scale */}
                <div className="sm:hidden grid grid-cols-5 gap-2">
                  {likertLabels.map(({ value, short, label }) => {
                    const isSelected = responses[question.id] === value;
                    return (
                      <button
                        key={value}
                        onClick={() => handleResponse(question.id, value)}
                        className={cn(
                          "py-3 px-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium flex flex-col items-center gap-1",
                          "active:scale-95",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-md"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        )}
                        title={label}
                      >
                        <span className="text-xs">{value}</span>
                        <span className="text-[10px]">{short}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Scale labels for mobile */}
                <div className="sm:hidden flex justify-between mt-2 text-[10px] text-muted-foreground px-1">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentPage === 0 ? 'Back' : 'Previous'}
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i < currentPage || allMandatoryAnsweredOnPage) {
                      setCurrentPage(i);
                      setShowWarning(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-200",
                    i === currentPage 
                      ? "bg-primary scale-125" 
                      : i < currentPage 
                        ? "bg-primary/50 hover:bg-primary/70" 
                        : "bg-muted hover:bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <Button 
              variant="hero"
              onClick={handleNext}
              className="group hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {currentPage === totalPages - 1 ? 'Complete Assessment' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Page info for mobile */}
          <div className="sm:hidden text-center mt-3 text-xs text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;
