import { useState, useCallback } from 'react';
// Trait Treks - AI Career Counselor
import LandingPage from '@/components/LandingPage';
import ConsentForm from '@/components/ConsentForm';
import PersonalityTest from '@/components/PersonalityTest';
import FreeTextInput from '@/components/FreeTextInput';
import LoadingScreen from '@/components/LoadingScreen';
import ResultsDashboard from '@/components/ResultsDashboard';
import Footer from '@/components/Footer';
import { personalityQuestions } from '@/data/personalityQuestions';
import { 
  calculatePersonalityScores, 
  extractProfileFromText, 
  generateRecommendations,
  PersonalityScores,
  ExtractedProfile,
  CareerRecommendation
} from '@/utils/careerUtils';

type AppStep = 'landing' | 'consent' | 'personality' | 'freetext' | 'loading' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [personalityResponses, setPersonalityResponses] = useState<Record<number, number>>({});
  const [personalityScores, setPersonalityScores] = useState<PersonalityScores | null>(null);
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);

  const handleStartCounseling = useCallback(() => {
    setCurrentStep('consent');
  }, []);

  const handleConsent = useCallback(() => {
    setCurrentStep('personality');
  }, []);

  const handlePersonalityComplete = useCallback((responses: Record<number, number>) => {
    setPersonalityResponses(responses);
    setCurrentStep('freetext');
  }, []);

  const processAndShowResults = useCallback((textData: { goals: string; interests: string; skills: string }) => {
    // Calculate scores
    const scores = calculatePersonalityScores(personalityResponses, personalityQuestions);
    setPersonalityScores(scores);

    // Extract profile from text
    const extractedProfile = extractProfileFromText(textData.goals, textData.interests, textData.skills);
    setProfile(extractedProfile);

    // Show loading
    setCurrentStep('loading');
  }, [personalityResponses]);

  const handleFreeTextComplete = useCallback((data: { goals: string; interests: string; skills: string }) => {
    processAndShowResults(data);
  }, [processAndShowResults]);

  const handleFreeTextSkip = useCallback(() => {
    processAndShowResults({ goals: '', interests: '', skills: '' });
  }, [processAndShowResults]);

  const handleLoadingComplete = useCallback(() => {
    if (personalityScores && profile) {
      const recs = generateRecommendations(personalityScores, profile);
      setRecommendations(recs);
      setCurrentStep('results');
    }
  }, [personalityScores, profile]);

  const handleRestart = useCallback(() => {
    setCurrentStep('landing');
    setPersonalityResponses({});
    setPersonalityScores(null);
    setProfile(null);
    setRecommendations([]);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentStep('landing');
  }, []);

  const handleBackToConsent = useCallback(() => {
    setCurrentStep('consent');
  }, []);

  const handleBackToPersonality = useCallback(() => {
    setCurrentStep('personality');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {currentStep === 'landing' && (
          <LandingPage onStart={handleStartCounseling} />
        )}
        
        {currentStep === 'consent' && (
          <ConsentForm onConsent={handleConsent} onBack={handleBackToLanding} />
        )}
        
        {currentStep === 'personality' && (
          <PersonalityTest onComplete={handlePersonalityComplete} onBack={handleBackToConsent} />
        )}
        
        {currentStep === 'freetext' && (
          <FreeTextInput 
            onComplete={handleFreeTextComplete} 
            onSkip={handleFreeTextSkip}
            onBack={handleBackToPersonality} 
          />
        )}
        
        {currentStep === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        
        {currentStep === 'results' && personalityScores && profile && (
          <ResultsDashboard 
            personalityScores={personalityScores}
            profile={profile}
            recommendations={recommendations}
            onRestart={handleRestart}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
