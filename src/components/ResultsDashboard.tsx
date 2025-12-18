import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Star, RefreshCw, ChevronDown, ChevronUp,
  Briefcase, GraduationCap, TrendingUp, DollarSign,
  Brain, Sparkles, Target
} from 'lucide-react';
import { PersonalityScores, CareerRecommendation, ExtractedProfile } from '@/utils/careerUtils';
import { traitDescriptions } from '@/data/personalityQuestions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ResultsDashboardProps {
  personalityScores: PersonalityScores;
  profile: ExtractedProfile;
  recommendations: CareerRecommendation[];
  onRestart: () => void;
}

const ResultsDashboard = ({ 
  personalityScores, 
  profile, 
  recommendations, 
  onRestart 
}: ResultsDashboardProps) => {
  const [expandedCareer, setExpandedCareer] = useState<string | null>(recommendations[0]?.career.id || null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const traitData = [
    { key: 'O' as const, name: 'Openness', color: 'bg-blue-500' },
    { key: 'C' as const, name: 'Conscientiousness', color: 'bg-green-500' },
    { key: 'E' as const, name: 'Extraversion', color: 'bg-yellow-500' },
    { key: 'A' as const, name: 'Agreeableness', color: 'bg-pink-500' },
    { key: 'N' as const, name: 'Neuroticism', color: 'bg-purple-500' },
  ];

  const handleDownloadPDF = () => {
    // Create a simple text report
    let report = "AI-POWERED CAREER COUNSELOR REPORT\n";
    report += "=====================================\n\n";
    report += "PERSONALITY PROFILE\n";
    report += "-------------------\n";
    traitData.forEach(trait => {
      report += `${trait.name}: ${Math.round(personalityScores[trait.key] * 100)}%\n`;
    });
    report += "\nEXTRACTED SKILLS & INTERESTS\n";
    report += "-----------------------------\n";
    report += `Skills: ${profile.skills.join(', ') || 'None detected'}\n`;
    report += `Interests: ${profile.interests.join(', ') || 'None detected'}\n`;
    report += "\nTOP CAREER RECOMMENDATIONS\n";
    report += "---------------------------\n";
    recommendations.slice(0, 5).forEach((rec, i) => {
      report += `\n${i + 1}. ${rec.career.title} (${Math.round(rec.matchScore * 100)}% match)\n`;
      report += `   ${rec.career.description}\n`;
      rec.explanations.forEach(exp => {
        report += `   • ${exp}\n`;
      });
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-recommendations-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your career recommendations report has been saved.",
    });
  };

  const handleSatisfactionRating = (rating: number) => {
    setSatisfaction(rating);
    toast({
      title: "Thank you for your feedback!",
      description: `You rated your satisfaction as ${rating}/5 stars.`,
    });
  };

  return (
    <div className="min-h-screen gradient-hero py-8 px-4" ref={dashboardRef}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="gradient-card rounded-2xl shadow-elegant border border-border/50 p-6 mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Your Career Profile
              </h1>
              <p className="text-muted-foreground">
                Based on your personality assessment and stated goals
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onRestart}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              <Button variant="hero" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Personality Profile */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Personality Profile</h2>
            </div>

            <div className="space-y-4">
              {traitData.map((trait) => {
                const score = personalityScores[trait.key];
                const description = score > 0.6 
                  ? traitDescriptions[trait.key].high 
                  : traitDescriptions[trait.key].low;

                return (
                  <div key={trait.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{trait.name}</span>
                      <span className="text-sm text-muted-foreground">{Math.round(score * 100)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", trait.color)}
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extracted Profile */}
          <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Extracted Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Identified Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="capitalize">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific skills detected</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Identified Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.length > 0 ? (
                    profile.interests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="capitalize">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific interests detected</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Overall Sentiment</h3>
                <Badge 
                  variant={profile.sentiment === 'positive' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {profile.sentiment}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Top Career Matches</h2>
              <p className="text-sm text-muted-foreground">Click on a career to see detailed explanations</p>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const isExpanded = expandedCareer === rec.career.id;
              
              return (
                <Card 
                  key={rec.career.id}
                  className={cn(
                    "overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md",
                    isExpanded ? "ring-2 ring-primary/30" : ""
                  )}
                  onClick={() => setExpandedCareer(isExpanded ? null : rec.career.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{rec.career.title}</h3>
                          <p className="text-sm text-muted-foreground">{rec.career.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(rec.matchScore * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">match</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4 animate-fade-in">
                        <p className="text-muted-foreground">{rec.career.description}</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <GraduationCap className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Education</p>
                              <p className="text-sm text-muted-foreground">{rec.career.education}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Salary Range</p>
                              <p className="text-sm text-muted-foreground">{rec.career.salaryRange}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Growth Outlook</p>
                              <p className="text-sm text-muted-foreground">{rec.career.growthOutlook}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Key Skills</p>
                              <p className="text-sm text-muted-foreground">{rec.career.skills.slice(0, 3).join(', ')}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Why This Matches You
                          </h4>
                          <ul className="space-y-2">
                            {rec.explanations.map((exp, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {exp}
                              </li>
                            ))}
                          </ul>
                          {rec.skillMatches.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Matching keywords:</span>{' '}
                                {rec.skillMatches.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Satisfaction Rating */}
        <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 text-center">
            How satisfied are you with these recommendations?
          </h2>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleSatisfactionRating(rating)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 hover:scale-110",
                  satisfaction !== null && rating <= satisfaction
                    ? "text-yellow-500"
                    : "text-muted-foreground hover:text-yellow-400"
                )}
              >
                <Star className={cn("w-8 h-8", satisfaction !== null && rating <= satisfaction ? "fill-current" : "")} />
              </button>
            ))}
          </div>
          {satisfaction && (
            <p className="text-center text-sm text-muted-foreground mt-3 animate-fade-in">
              Thank you for your feedback! Your input helps improve our recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
