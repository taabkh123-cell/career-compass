import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Star, RefreshCw, ChevronDown, ChevronUp,
  Briefcase, GraduationCap, TrendingUp, DollarSign,
  Brain, Sparkles, Target, Info
} from 'lucide-react';
import { PersonalityScores, CareerRecommendation, ExtractedProfile } from '@/utils/careerUtils';
import { traitDescriptions } from '@/data/personalityQuestions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
  const { toast } = useToast();

  const traitData = [
    { key: 'O' as const, name: 'Openness', color: 'hsl(210, 70%, 50%)' },
    { key: 'C' as const, name: 'Conscientiousness', color: 'hsl(142, 70%, 45%)' },
    { key: 'E' as const, name: 'Extraversion', color: 'hsl(45, 90%, 50%)' },
    { key: 'A' as const, name: 'Agreeableness', color: 'hsl(330, 70%, 50%)' },
    { key: 'N' as const, name: 'Emotional Stability', color: 'hsl(270, 60%, 55%)' },
  ];

  // Radar chart data
  const radarData = {
    labels: traitData.map(t => t.name),
    datasets: [
      {
        label: 'Your Profile',
        data: traitData.map(t => t.key === 'N' ? (1 - personalityScores[t.key]) * 100 : personalityScores[t.key] * 100),
        backgroundColor: 'hsla(210, 70%, 50%, 0.2)',
        borderColor: 'hsl(210, 70%, 50%)',
        borderWidth: 2,
        pointBackgroundColor: 'hsl(210, 70%, 50%)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'hsl(210, 70%, 50%)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'hsl(210, 20%, 88%)' },
        grid: { color: 'hsl(210, 20%, 88%)' },
        pointLabels: { 
          font: { size: 11, family: 'Inter' },
          color: 'hsl(215, 25%, 35%)'
        },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: true,
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(33, 53, 71);
    doc.text('Trait Treks - Career Report', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Personality Profile
    doc.setFontSize(16);
    doc.setTextColor(33, 53, 71);
    doc.text('Personality Profile (Big Five)', 20, y);
    y += 10;

    doc.setFontSize(11);
    traitData.forEach(trait => {
      const score = trait.key === 'N' ? 1 - personalityScores[trait.key] : personalityScores[trait.key];
      doc.setTextColor(60);
      doc.text(`${trait.name}: ${Math.round(score * 100)}%`, 25, y);
      y += 7;
    });
    y += 8;

    // Extracted Profile
    doc.setFontSize(16);
    doc.setTextColor(33, 53, 71);
    doc.text('Extracted Profile', 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Skills: ${profile.skills.length > 0 ? profile.skills.join(', ') : 'None detected'}`, 25, y);
    y += 7;
    doc.text(`Interests: ${profile.interests.length > 0 ? profile.interests.join(', ') : 'None detected'}`, 25, y);
    y += 7;
    doc.text(`Sentiment: ${profile.sentiment}`, 25, y);
    y += 15;

    // Top Recommendations
    doc.setFontSize(16);
    doc.setTextColor(33, 53, 71);
    doc.text('Top Career Recommendations', 20, y);
    y += 10;

    recommendations.slice(0, 5).forEach((rec, i) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(33, 53, 71);
      doc.text(`${i + 1}. ${rec.career.title} (${Math.round(rec.matchScore * 100)}% match)`, 25, y);
      y += 6;
      
      doc.setFontSize(10);
      doc.setTextColor(80);
      const descLines = doc.splitTextToSize(rec.career.description, pageWidth - 50);
      doc.text(descLines, 30, y);
      y += descLines.length * 5 + 3;

      rec.explanations.slice(0, 2).forEach(exp => {
        const expLines = doc.splitTextToSize(`• ${exp}`, pageWidth - 55);
        doc.text(expLines, 32, y);
        y += expLines.length * 5;
      });
      y += 8;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('AI-Powered Career Counselor | Muhammad Abdullah | UWL RAK', pageWidth / 2, 285, { align: 'center' });

    doc.save('trait-treks-career-report.pdf');
    
    toast({
      title: "PDF Downloaded",
      description: "Your career report has been saved successfully.",
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
    <div className="min-h-screen gradient-hero py-8 px-4">
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
              <Button variant="outline" onClick={onRestart} className="hover:scale-[1.02] transition-transform">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              <Button variant="hero" onClick={handleDownloadPDF} className="hover:scale-[1.02] transition-transform">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Personality Profile with Radar Chart */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="gradient-card rounded-xl shadow-elegant border border-border/50 p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Personality Radar</h2>
            </div>
            <div className="aspect-square max-w-[280px] mx-auto">
              <Radar data={radarData} options={radarOptions} />
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
                <Badge variant={profile.sentiment === 'positive' ? 'default' : 'secondary'} className="capitalize">
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
              <p className="text-sm text-muted-foreground">Click to see detailed explanations</p>
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
                        <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-primary text-primary-foreground font-bold shrink-0">
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
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
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

                        {/* Explainability Section */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            Why This Matches You (Explainable AI)
                          </h4>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 rounded bg-primary/10">
                              <div className="text-lg font-bold text-primary">{rec.explainability.personalityContribution}%</div>
                              <div className="text-xs text-muted-foreground">Personality</div>
                            </div>
                            <div className="text-center p-2 rounded bg-secondary/10">
                              <div className="text-lg font-bold text-secondary">{rec.explainability.skillContribution}%</div>
                              <div className="text-xs text-muted-foreground">Skills</div>
                            </div>
                            <div className="text-center p-2 rounded bg-accent/10">
                              <div className="text-lg font-bold text-accent">{rec.explainability.interestContribution}%</div>
                              <div className="text-xs text-muted-foreground">Interests</div>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {rec.explanations.map((exp, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {exp}
                              </li>
                            ))}
                          </ul>
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
              Thank you! Your feedback helps improve our recommendations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
