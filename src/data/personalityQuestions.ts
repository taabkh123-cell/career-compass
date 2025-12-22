// IPIP-NEO Big Five Personality Test Questions (25 items - public domain)
// Each trait has 5 questions (balanced positive/negative keyed)
// Questions marked as mandatory cannot be skipped

export interface PersonalityQuestion {
  id: number;
  text: string;
  trait: 'O' | 'C' | 'E' | 'A' | 'N';
  reversed: boolean;
  mandatory: boolean; // Starred questions that must be answered
}

export const personalityQuestions: PersonalityQuestion[] = [
  // Openness to Experience (O) - 5 questions, 2 mandatory
  { id: 1, text: "I have a vivid imagination.", trait: 'O', reversed: false, mandatory: true },
  { id: 2, text: "I am not interested in abstract ideas.", trait: 'O', reversed: true, mandatory: false },
  { id: 3, text: "I have excellent ideas.", trait: 'O', reversed: false, mandatory: true },
  { id: 4, text: "I am quick to understand things.", trait: 'O', reversed: false, mandatory: false },
  { id: 5, text: "I avoid difficult reading material.", trait: 'O', reversed: true, mandatory: false },

  // Conscientiousness (C) - 5 questions, 2 mandatory
  { id: 6, text: "I am always prepared.", trait: 'C', reversed: false, mandatory: true },
  { id: 7, text: "I leave my belongings around.", trait: 'C', reversed: true, mandatory: false },
  { id: 8, text: "I pay attention to details.", trait: 'C', reversed: false, mandatory: true },
  { id: 9, text: "I get chores done right away.", trait: 'C', reversed: false, mandatory: false },
  { id: 10, text: "I shirk my duties.", trait: 'C', reversed: true, mandatory: false },

  // Extraversion (E) - 5 questions, 2 mandatory
  { id: 11, text: "I am the life of the party.", trait: 'E', reversed: false, mandatory: true },
  { id: 12, text: "I don't talk a lot.", trait: 'E', reversed: true, mandatory: false },
  { id: 13, text: "I feel comfortable around people.", trait: 'E', reversed: false, mandatory: true },
  { id: 14, text: "I start conversations.", trait: 'E', reversed: false, mandatory: false },
  { id: 15, text: "I am quiet around strangers.", trait: 'E', reversed: true, mandatory: false },

  // Agreeableness (A) - 5 questions, 2 mandatory
  { id: 16, text: "I feel little concern for others.", trait: 'A', reversed: true, mandatory: false },
  { id: 17, text: "I am interested in people.", trait: 'A', reversed: false, mandatory: true },
  { id: 18, text: "I sympathize with others' feelings.", trait: 'A', reversed: false, mandatory: true },
  { id: 19, text: "I take time out for others.", trait: 'A', reversed: false, mandatory: false },
  { id: 20, text: "I make people feel at ease.", trait: 'A', reversed: false, mandatory: false },

  // Neuroticism (N) - 5 questions, 2 mandatory
  { id: 21, text: "I get stressed out easily.", trait: 'N', reversed: false, mandatory: true },
  { id: 22, text: "I am relaxed most of the time.", trait: 'N', reversed: true, mandatory: false },
  { id: 23, text: "I worry about things.", trait: 'N', reversed: false, mandatory: true },
  { id: 24, text: "I get upset easily.", trait: 'N', reversed: false, mandatory: false },
  { id: 25, text: "I seldom feel blue.", trait: 'N', reversed: true, mandatory: false },
];

export const traitDescriptions = {
  O: {
    name: "Openness to Experience",
    shortName: "Openness",
    high: "You are imaginative, curious, and open to new experiences. You appreciate art, emotion, adventure, and unusual ideas.",
    low: "You tend to be more conventional and prefer familiarity over novelty. You focus on practical matters.",
  },
  C: {
    name: "Conscientiousness",
    shortName: "Conscientiousness",
    high: "You are organized, dependable, and self-disciplined. You plan ahead and are goal-oriented.",
    low: "You are more flexible and spontaneous. You may prefer to go with the flow rather than follow strict plans.",
  },
  E: {
    name: "Extraversion",
    shortName: "Extraversion",
    high: "You are outgoing, energetic, and enjoy being around others. You draw energy from social interactions.",
    low: "You are more reserved and introspective. You recharge through solitude and prefer deeper one-on-one connections.",
  },
  A: {
    name: "Agreeableness",
    shortName: "Agreeableness",
    high: "You are compassionate, cooperative, and value getting along with others. You are trusting and helpful.",
    low: "You are more competitive and skeptical. You prioritize your own interests and question others' motives.",
  },
  N: {
    name: "Neuroticism",
    shortName: "Emotional Stability",
    high: "You experience emotions intensely and may be prone to stress and anxiety. You are sensitive to your environment.",
    low: "You are emotionally stable and resilient. You handle stress well and maintain a calm demeanor.",
  },
};

// Count mandatory questions
export const mandatoryQuestionCount = personalityQuestions.filter(q => q.mandatory).length;
export const totalQuestionCount = personalityQuestions.length;
