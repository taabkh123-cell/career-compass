import { PersonalityQuestion } from '@/data/personalityQuestions';
import { Career, careers } from '@/data/careers';

export interface PersonalityScores {
  O: number; // Openness
  C: number; // Conscientiousness
  E: number; // Extraversion
  A: number; // Agreeableness
  N: number; // Neuroticism
}

export interface ExtractedProfile {
  skills: string[];
  interests: string[];
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface CareerRecommendation {
  career: Career;
  matchScore: number;
  explanations: string[];
  traitMatches: { trait: string; score: number; description: string }[];
  skillMatches: string[];
}

// Calculate personality scores from questionnaire responses
export function calculatePersonalityScores(
  responses: Record<number, number>,
  questions: PersonalityQuestion[]
): PersonalityScores {
  const traitSums: Record<string, number[]> = {
    O: [],
    C: [],
    E: [],
    A: [],
    N: [],
  };

  questions.forEach((question) => {
    const response = responses[question.id];
    if (response !== undefined) {
      // Responses are 1-5, normalize to 0-1
      let normalizedScore = (response - 1) / 4;
      
      // Reverse score for negatively-keyed items
      if (question.reversed) {
        normalizedScore = 1 - normalizedScore;
      }
      
      traitSums[question.trait].push(normalizedScore);
    }
  });

  // Calculate average for each trait
  const scores: PersonalityScores = {
    O: traitSums.O.length > 0 ? traitSums.O.reduce((a, b) => a + b, 0) / traitSums.O.length : 0.5,
    C: traitSums.C.length > 0 ? traitSums.C.reduce((a, b) => a + b, 0) / traitSums.C.length : 0.5,
    E: traitSums.E.length > 0 ? traitSums.E.reduce((a, b) => a + b, 0) / traitSums.E.length : 0.5,
    A: traitSums.A.length > 0 ? traitSums.A.reduce((a, b) => a + b, 0) / traitSums.A.length : 0.5,
    N: traitSums.N.length > 0 ? traitSums.N.reduce((a, b) => a + b, 0) / traitSums.N.length : 0.5,
  };

  return scores;
}

// Simple NLP placeholder - extract skills, interests, and keywords from text
export function extractProfileFromText(
  goals: string,
  interests: string,
  skills: string
): ExtractedProfile {
  const allText = `${goals} ${interests} ${skills}`.toLowerCase();
  
  // Common skills to look for
  const skillKeywords = [
    'programming', 'coding', 'python', 'java', 'javascript', 'sql', 'excel',
    'communication', 'leadership', 'teamwork', 'problem-solving', 'writing',
    'design', 'creativity', 'analysis', 'research', 'public speaking',
    'project management', 'data analysis', 'marketing', 'sales', 'customer service',
    'teaching', 'mentoring', 'organization', 'planning', 'negotiation',
    'critical thinking', 'attention to detail', 'time management',
    'adobe', 'photoshop', 'figma', 'html', 'css', 'react', 'node',
    'machine learning', 'ai', 'artificial intelligence', 'statistics',
    'accounting', 'finance', 'budgeting', 'forecasting', 'modeling',
    'healthcare', 'patient care', 'medical', 'nursing', 'therapy',
    'engineering', 'cad', 'mechanical', 'electrical', 'software',
  ];

  // Interest keywords
  const interestKeywords = [
    'technology', 'science', 'art', 'music', 'sports', 'reading', 'writing',
    'gaming', 'travel', 'cooking', 'photography', 'nature', 'animals',
    'helping others', 'entrepreneurship', 'innovation', 'environment',
    'psychology', 'philosophy', 'history', 'politics', 'economics',
    'fashion', 'beauty', 'fitness', 'health', 'wellness', 'meditation',
    'social media', 'content creation', 'blogging', 'podcasting',
  ];

  const foundSkills: string[] = [];
  const foundInterests: string[] = [];
  const allKeywords: string[] = [];

  skillKeywords.forEach(skill => {
    if (allText.includes(skill)) {
      foundSkills.push(skill);
      allKeywords.push(skill);
    }
  });

  interestKeywords.forEach(interest => {
    if (allText.includes(interest)) {
      foundInterests.push(interest);
      allKeywords.push(interest);
    }
  });

  // Simple sentiment analysis
  const positiveWords = ['love', 'enjoy', 'passionate', 'excited', 'dream', 'aspire', 'motivated', 'enthusiastic'];
  const negativeWords = ['hate', 'dislike', 'avoid', 'struggle', 'difficult', 'frustrated', 'boring'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (allText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (allText.includes(word)) negativeCount++;
  });

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';

  return {
    skills: foundSkills,
    interests: foundInterests,
    keywords: allKeywords,
    sentiment,
  };
}

// Generate career recommendations based on personality and profile
export function generateRecommendations(
  personalityScores: PersonalityScores,
  profile: ExtractedProfile,
  topN: number = 10
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  careers.forEach(career => {
    let totalScore = 0;
    let totalWeight = 0;
    const traitMatches: CareerRecommendation['traitMatches'] = [];
    const explanations: string[] = [];
    const skillMatches: string[] = [];

    // Calculate trait-based score
    const traits: (keyof PersonalityScores)[] = ['O', 'C', 'E', 'A', 'N'];
    const traitNames: Record<string, string> = {
      O: 'Openness',
      C: 'Conscientiousness',
      E: 'Extraversion',
      A: 'Agreeableness',
      N: 'Emotional Stability',
    };

    traits.forEach(trait => {
      const userScore = trait === 'N' ? 1 - personalityScores[trait] : personalityScores[trait];
      const careerTrait = career.traits[trait];
      const idealMid = (careerTrait.min + careerTrait.max) / 2;
      const range = (careerTrait.max - careerTrait.min) / 2;
      
      // Calculate how well the user's score fits the career's ideal range
      let traitScore = 0;
      if (userScore >= careerTrait.min && userScore <= careerTrait.max) {
        // Perfect fit within range
        traitScore = 1 - Math.abs(userScore - idealMid) / (range || 0.5);
      } else {
        // Outside range, penalize based on distance
        const distance = userScore < careerTrait.min 
          ? careerTrait.min - userScore 
          : userScore - careerTrait.max;
        traitScore = Math.max(0, 1 - distance * 2);
      }

      totalScore += traitScore * careerTrait.weight;
      totalWeight += careerTrait.weight;

      if (traitScore > 0.6) {
        const traitName = trait === 'N' ? 'Emotional Stability (low Neuroticism)' : traitNames[trait];
        traitMatches.push({
          trait: traitName,
          score: traitScore,
          description: `Your ${traitName.toLowerCase()} aligns well with this role.`,
        });
      }
    });

    // Normalize personality score
    const personalityScore = totalWeight > 0 ? totalScore / totalWeight : 0.5;

    // Calculate keyword/skill matching bonus
    let keywordBonus = 0;
    profile.keywords.forEach(keyword => {
      if (career.keywords.some(ck => ck.includes(keyword) || keyword.includes(ck))) {
        keywordBonus += 0.05;
        skillMatches.push(keyword);
      }
    });

    career.skills.forEach(careerSkill => {
      const skillLower = careerSkill.toLowerCase();
      if (profile.skills.some(s => skillLower.includes(s) || s.includes(skillLower))) {
        keywordBonus += 0.03;
        if (!skillMatches.includes(careerSkill.toLowerCase())) {
          skillMatches.push(careerSkill.toLowerCase());
        }
      }
    });

    // Cap keyword bonus at 20%
    keywordBonus = Math.min(keywordBonus, 0.2);

    // Final score (80% personality, 20% max from keywords)
    const matchScore = Math.min(0.99, personalityScore * 0.8 + keywordBonus + 0.05);

    // Generate explanations
    if (traitMatches.length > 0) {
      explanations.push(`Your personality profile, particularly your ${traitMatches[0].trait.toLowerCase()}, aligns well with the demands of this role.`);
    }

    if (skillMatches.length > 0) {
      explanations.push(`Your skills and interests (${skillMatches.slice(0, 3).join(', ')}) match key requirements for this career.`);
    }

    if (career.growthOutlook.includes('faster') || career.growthOutlook.includes('Much faster')) {
      explanations.push(`This field has strong job growth prospects: ${career.growthOutlook}.`);
    }

    recommendations.push({
      career,
      matchScore,
      explanations,
      traitMatches,
      skillMatches: [...new Set(skillMatches)],
    });
  });

  // Sort by match score and return top N
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}
