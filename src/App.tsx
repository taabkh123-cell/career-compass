// src/App.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function App() {
  const [showConsent, setShowConsent] = useState(true);
  const [consented, setConsented] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    if (consented) {
      setStarted(true);
      setShowConsent(false);
    }
  };

  if (started) {
    return <div className="p-8 text-center">Personality Questionnaire Coming Next...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-800">
              An AI-Powered Career Counselor Using NLP and Personality Tests
            </CardTitle>
            <CardDescription className="text-lg mt-4">
              Muhammad Abdullah • Student ID: 32147000 • Supervisor: Dr. Imtias Ahmed<br />
              University of West London, Ras Al Khaimah Campus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              This project develops a personalized AI career guidance platform combining Natural Language Processing (NLP) with Big Five personality assessments.
              Get tailored career recommendations based on your traits, interests, and skills.
            </p>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6 text-xl"
              onClick={() => setShowConsent(true)}
            >
              Start Career Guidance
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Participant Information & Consent</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 text-left">
            <p><strong>Researcher:</strong> Muhammad Abdullah (32147000@student.uwl.ac.uk)</p>
            <p><strong>Date:</strong> December 2025</p>
            <p>You are invited to test a student prototype that provides AI-powered career suggestions using personality and text analysis. This is for academic purposes only — not professional advice.</p>
            <p><strong>Participation is voluntary and anonymous.</strong> You can withdraw anytime by closing the app. No personal data is collected.</p>
            <p>Time: 15-30 minutes. Procedure: Consent → Personality quiz → Optional text inputs → Results with explanations.</p>
            <p>Risks are minimal. Benefits: Free personalized career insights.</p>
            <p>Data is used only for this project and deleted afterward. GDPR compliant.</p>
          </DialogDescription>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox id="consent" checked={consented} onCheckedChange={(checked) => setConsented(checked as boolean)} />
            <Label htmlFor="consent" className="text-base font-medium">
              I have read and consent to participate voluntarily
            </Label>
          </div>
          <Button onClick={handleStart} disabled={!consented} className="w-full mt-4">
            Continue to Questionnaire
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
