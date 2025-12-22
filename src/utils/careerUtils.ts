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
  sentimentScore: number;
  entities: { text: string; label: string }[];
}

export interface CareerRecommendation {
  career: Career;
  matchScore: number;
  explanations: string[];
  traitMatches: { trait: string; score: number; description: string }[];
  skillMatches: string[];
  explainability: {
    personalityContribution: number;
    skillContribution: number;
    interestContribution: number;
    topFactors: string[];
  };
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

  // Calculate average for each trait (use 0.5 if no answers for that trait)
  const scores: PersonalityScores = {
    O: traitSums.O.length > 0 ? traitSums.O.reduce((a, b) => a + b, 0) / traitSums.O.length : 0.5,
    C: traitSums.C.length > 0 ? traitSums.C.reduce((a, b) => a + b, 0) / traitSums.C.length : 0.5,
    E: traitSums.E.length > 0 ? traitSums.E.reduce((a, b) => a + b, 0) / traitSums.E.length : 0.5,
    A: traitSums.A.length > 0 ? traitSums.A.reduce((a, b) => a + b, 0) / traitSums.A.length : 0.5,
    N: traitSums.N.length > 0 ? traitSums.N.reduce((a, b) => a + b, 0) / traitSums.N.length : 0.5,
  };

  return scores;
}

// Enhanced NLP with spaCy-like patterns
const SKILL_PATTERNS = [
  // Programming & Tech
  { pattern: /\b(python|java|javascript|typescript|c\+\+|c#|ruby|php|swift|kotlin|go|rust|scala)\b/gi, label: 'programming' },
  { pattern: /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel)\b/gi, label: 'framework' },
  { pattern: /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch|graphql)\b/gi, label: 'database' },
  { pattern: /\b(aws|azure|gcp|docker|kubernetes|devops|ci\/cd|terraform)\b/gi, label: 'cloud' },
  { pattern: /\b(machine learning|deep learning|ai|artificial intelligence|nlp|computer vision)\b/gi, label: 'ai_ml' },
  { pattern: /\b(data (analysis|science|analytics|engineering|visualization))\b/gi, label: 'data' },
  { pattern: /\b(html|css|sass|less|tailwind|bootstrap)\b/gi, label: 'web' },
  { pattern: /\b(git|github|gitlab|bitbucket|version control)\b/gi, label: 'tools' },
  
  // Soft Skills
  { pattern: /\b(leadership|team lead|management|mentoring|coaching)\b/gi, label: 'leadership' },
  { pattern: /\b(communication|presentation|public speaking|negotiation)\b/gi, label: 'communication' },
  { pattern: /\b(problem[- ]solving|critical thinking|analytical)\b/gi, label: 'analytical' },
  { pattern: /\b(teamwork|collaboration|cross-functional)\b/gi, label: 'teamwork' },
  { pattern: /\b(creativity|innovation|design thinking)\b/gi, label: 'creativity' },
  { pattern: /\b(organization|planning|time management|project management)\b/gi, label: 'organization' },
  
  // Domain Skills
  { pattern: /\b(accounting|finance|budgeting|forecasting|financial modeling)\b/gi, label: 'finance' },
  { pattern: /\b(marketing|seo|social media|content|branding|digital marketing)\b/gi, label: 'marketing' },
  { pattern: /\b(sales|business development|customer (success|service|relations))\b/gi, label: 'sales' },
  { pattern: /\b(healthcare|medical|clinical|patient care|nursing)\b/gi, label: 'healthcare' },
  { pattern: /\b(design|ux|ui|figma|sketch|photoshop|illustrator|adobe)\b/gi, label: 'design' },
  { pattern: /\b(research|statistics|r programming|spss|stata)\b/gi, label: 'research' },
  { pattern: /\b(writing|editing|copywriting|content creation|journalism)\b/gi, label: 'writing' },
  { pattern: /\b(teaching|training|education|curriculum|instruction)\b/gi, label: 'education' },
];

const INTEREST_PATTERNS = [
  { pattern: /\b(technology|tech|gadgets|software|hardware)\b/gi, label: 'technology' },
  { pattern: /\b(science|research|experiments|discovery)\b/gi, label: 'science' },
  { pattern: /\b(art|music|creative|design|photography)\b/gi, label: 'arts' },
  { pattern: /\b(gaming|video games|esports)\b/gi, label: 'gaming' },
  { pattern: /\b(travel|exploring|adventure|cultures)\b/gi, label: 'travel' },
  { pattern: /\b(fitness|health|wellness|sports|exercise)\b/gi, label: 'fitness' },
  { pattern: /\b(reading|books|literature|writing)\b/gi, label: 'reading' },
  { pattern: /\b(cooking|food|culinary|baking)\b/gi, label: 'culinary' },
  { pattern: /\b(nature|environment|sustainability|outdoors)\b/gi, label: 'environment' },
  { pattern: /\b(helping|volunteering|community|social impact)\b/gi, label: 'social_impact' },
  { pattern: /\b(entrepreneurship|startups|business|innovation)\b/gi, label: 'entrepreneurship' },
  { pattern: /\b(psychology|human behavior|mental health)\b/gi, label: 'psychology' },
];

const SENTIMENT_WORDS = {
  positive: [
    'love', 'enjoy', 'passionate', 'excited', 'dream', 'aspire', 'motivated', 
    'enthusiastic', 'inspired', 'curious', 'eager', 'driven', 'dedicated',
    'fascinated', 'interested', 'thrive', 'excel', 'succeed', 'achieve'
  ],
  negative: [
    'hate', 'dislike', 'avoid', 'struggle', 'difficult', 'frustrated', 
    'boring', 'tedious', 'stressful', 'overwhelming', 'challenging', 'hard'
  ]
};

// Extract skills and entities using pattern matching (simulates spaCy PhraseMatcher)
function extractEntities(text: string): { skills: string[]; interests: string[]; entities: { text: string; label: string }[] } {
  const skills: Set<string> = new Set();
  const interests: Set<string> = new Set();
  const entities: { text: string; label: string }[] = [];

  // Extract skills
  SKILL_PATTERNS.forEach(({ pattern, label }) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        skills.add(match.toLowerCase());
        entities.push({ text: match.toLowerCase(), label: `SKILL:${label}` });
      });
    }
  });

  // Extract interests
  INTEREST_PATTERNS.forEach(({ pattern, label }) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        interests.add(match.toLowerCase());
        entities.push({ text: match.toLowerCase(), label: `INTEREST:${label}` });
      });
    }
  });

  return {
    skills: Array.from(skills),
    interests: Array.from(interests),
    entities
  };
}

// Simple sentiment analysis (simulates TextBlob)
function analyzeSentiment(text: string): { sentiment: 'positive' | 'neutral' | 'negative'; score: number } {
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  SENTIMENT_WORDS.positive.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  SENTIMENT_WORDS.negative.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) return { sentiment: 'neutral', score: 0 };

  const score = (positiveCount - negativeCount) / total;
  
  if (score > 0.2) return { sentiment: 'positive', score };
  if (score < -0.2) return { sentiment: 'negative', score };
  return { sentiment: 'neutral', score };
}

// TF-IDF-like keyword extraction
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Simple stopwords filter
  const stopwords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 
    'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'were', 'being',
    'would', 'could', 'should', 'their', 'there', 'where', 'when', 'what',
    'which', 'this', 'that', 'these', 'those', 'with', 'from', 'into', 'also',
    'want', 'like', 'really', 'very', 'just', 'about', 'some', 'more', 'most'
  ]);

  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    if (!stopwords.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

// Enhanced NLP profile extraction
export function extractProfileFromText(
  goals: string,
  interests: string,
  skills: string
): ExtractedProfile {
  const allText = `${goals} ${interests} ${skills}`;
  
  // Extract entities using pattern matching
  const extracted = extractEntities(allText);
  
  // Analyze sentiment
  const sentimentResult = analyzeSentiment(allText);
  
  // Extract keywords
  const keywords = extractKeywords(allText);

  return {
    skills: extracted.skills,
    interests: extracted.interests,
    keywords: [...new Set([...extracted.skills, ...extracted.interests, ...keywords])],
    sentiment: sentimentResult.sentiment,
    sentimentScore: sentimentResult.score,
    entities: extracted.entities
  };
}

// Generate career recommendations with explainability
export function generateRecommendations(
  personalityScores: PersonalityScores,
  profile: ExtractedProfile,
  topN: number = 8
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];
  const traitNames: Record<string, string> = {
    O: 'Openness',
    C: 'Conscientiousness',
    E: 'Extraversion',
    A: 'Agreeableness',
    N: 'Emotional Stability',
  };

  careers.forEach(career => {
    let personalityScore = 0;
    let personalityWeight = 0;
    const traitMatches: CareerRecommendation['traitMatches'] = [];
    const explanations: string[] = [];
    const skillMatches: string[] = [];
    const topFactors: string[] = [];

    // Calculate trait-based score
    const traits: (keyof PersonalityScores)[] = ['O', 'C', 'E', 'A', 'N'];

    traits.forEach(trait => {
      // For N, we use inverse (emotional stability)
      const userScore = trait === 'N' ? 1 - personalityScores[trait] : personalityScores[trait];
      const careerTrait = career.traits[trait];
      const idealMid = (careerTrait.min + careerTrait.max) / 2;
      const range = (careerTrait.max - careerTrait.min) / 2;
      
      // Calculate fit score
      let traitScore = 0;
      if (userScore >= careerTrait.min && userScore <= careerTrait.max) {
        traitScore = 1 - Math.abs(userScore - idealMid) / (range || 0.5);
      } else {
        const distance = userScore < careerTrait.min 
          ? careerTrait.min - userScore 
          : userScore - careerTrait.max;
        traitScore = Math.max(0, 1 - distance * 2);
      }

      personalityScore += traitScore * careerTrait.weight;
      personalityWeight += careerTrait.weight;

      if (traitScore > 0.65) {
        const traitName = trait === 'N' ? 'Emotional Stability' : traitNames[trait];
        traitMatches.push({
          trait: traitName,
          score: traitScore,
          description: `Your ${traitName.toLowerCase()} (${Math.round(personalityScores[trait] * 100)}%) aligns well with this role.`,
        });
        topFactors.push(`High ${traitName}`);
      }
    });

    // Normalize personality contribution
    const personalityContribution = personalityWeight > 0 ? personalityScore / personalityWeight : 0.5;

    // Calculate skill matching score
    let skillScore = 0;
    let skillMatchCount = 0;
    
    career.skills.forEach(careerSkill => {
      const skillLower = careerSkill.toLowerCase();
      if (profile.skills.some(s => skillLower.includes(s) || s.includes(skillLower))) {
        skillScore += 0.15;
        skillMatchCount++;
        skillMatches.push(skillLower);
      }
    });

    profile.keywords.forEach(keyword => {
      if (career.keywords.some(ck => ck.toLowerCase().includes(keyword) || keyword.includes(ck.toLowerCase()))) {
        if (!skillMatches.includes(keyword)) {
          skillScore += 0.08;
          skillMatches.push(keyword);
        }
      }
    });

    const skillContribution = Math.min(skillScore, 0.25);

    // Calculate interest matching score
    let interestScore = 0;
    profile.interests.forEach(interest => {
      if (career.keywords.some(ck => ck.toLowerCase().includes(interest))) {
        interestScore += 0.05;
      }
    });
    const interestContribution = Math.min(interestScore, 0.1);

    // Weighted final score (60% personality, 25% skills, 10% interests, 5% baseline)
    const matchScore = Math.min(
      0.98,
      personalityContribution * 0.60 + 
      skillContribution + 
      interestContribution + 
      0.05
    );

    // Generate SHAP-like explanations
    if (traitMatches.length > 0) {
      const topTrait = traitMatches[0];
      explanations.push(
        `Personality Match: Your ${topTrait.trait.toLowerCase()} profile (+${Math.round(topTrait.score * 100)}%) strongly contributes to this recommendation. [SHAP contribution: +${Math.round(personalityContribution * 60)}%]`
      );
    } else {
      explanations.push(
        `Personality Baseline: Your personality profile has a moderate fit with this role. [SHAP contribution: +${Math.round(personalityContribution * 60)}%]`
      );
    }

    if (skillMatches.length > 0) {
      const displaySkills = skillMatches.slice(0, 3).join(', ');
      topFactors.push(`Skills: ${displaySkills}`);
      explanations.push(
        `Skill Alignment: Your skills in ${displaySkills} match ${skillMatchCount} key requirements. [SHAP contribution: +${Math.round(skillContribution * 100)}%]`
      );
    }

    if (career.growthOutlook.toLowerCase().includes('faster')) {
      explanations.push(`Market Outlook: ${career.growthOutlook} – strong job prospects in this field.`);
    }

    // Add sentiment-based insight
    if (profile.sentiment === 'positive' && profile.sentimentScore > 0.3) {
      explanations.push(`Your enthusiastic career outlook suggests high motivation for growth-oriented roles.`);
    }

    recommendations.push({
      career,
      matchScore,
      explanations,
      traitMatches,
      skillMatches: [...new Set(skillMatches)],
      explainability: {
        personalityContribution: Math.round(personalityContribution * 60),
        skillContribution: Math.round(skillContribution * 100),
        interestContribution: Math.round(interestContribution * 100),
        topFactors: topFactors.slice(0, 3),
      }
    });
  });

  // Sort by match score and return top N
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}
