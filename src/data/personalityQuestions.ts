// IPIP-NEO Big Five Personality Test Questions (50 items - public domain)
// Each trait has 10 questions (5 positive, 5 negative keyed)

export interface PersonalityQuestion {
  id: number;
  text: string;
  trait: 'O' | 'C' | 'E' | 'A' | 'N';
  reversed: boolean;
}

export const personalityQuestions: PersonalityQuestion[] = [
  // Openness to Experience (O)
  { id: 1, text: "I have a vivid imagination.", trait: 'O', reversed: false },
  { id: 2, text: "I am not interested in abstract ideas.", trait: 'O', reversed: true },
  { id: 3, text: "I have difficulty understanding abstract ideas.", trait: 'O', reversed: true },
  { id: 4, text: "I do not have a good imagination.", trait: 'O', reversed: true },
  { id: 5, text: "I have excellent ideas.", trait: 'O', reversed: false },
  { id: 6, text: "I am quick to understand things.", trait: 'O', reversed: false },
  { id: 7, text: "I use difficult words.", trait: 'O', reversed: false },
  { id: 8, text: "I spend time reflecting on things.", trait: 'O', reversed: false },
  { id: 9, text: "I am full of ideas.", trait: 'O', reversed: false },
  { id: 10, text: "I avoid difficult reading material.", trait: 'O', reversed: true },

  // Conscientiousness (C)
  { id: 11, text: "I am always prepared.", trait: 'C', reversed: false },
  { id: 12, text: "I leave my belongings around.", trait: 'C', reversed: true },
  { id: 13, text: "I pay attention to details.", trait: 'C', reversed: false },
  { id: 14, text: "I make a mess of things.", trait: 'C', reversed: true },
  { id: 15, text: "I get chores done right away.", trait: 'C', reversed: false },
  { id: 16, text: "I often forget to put things back in their proper place.", trait: 'C', reversed: true },
  { id: 17, text: "I like order.", trait: 'C', reversed: false },
  { id: 18, text: "I shirk my duties.", trait: 'C', reversed: true },
  { id: 19, text: "I follow a schedule.", trait: 'C', reversed: false },
  { id: 20, text: "I am exacting in my work.", trait: 'C', reversed: false },

  // Extraversion (E)
  { id: 21, text: "I am the life of the party.", trait: 'E', reversed: false },
  { id: 22, text: "I don't talk a lot.", trait: 'E', reversed: true },
  { id: 23, text: "I feel comfortable around people.", trait: 'E', reversed: false },
  { id: 24, text: "I keep in the background.", trait: 'E', reversed: true },
  { id: 25, text: "I start conversations.", trait: 'E', reversed: false },
  { id: 26, text: "I have little to say.", trait: 'E', reversed: true },
  { id: 27, text: "I talk to a lot of different people at parties.", trait: 'E', reversed: false },
  { id: 28, text: "I don't like to draw attention to myself.", trait: 'E', reversed: true },
  { id: 29, text: "I don't mind being the center of attention.", trait: 'E', reversed: false },
  { id: 30, text: "I am quiet around strangers.", trait: 'E', reversed: true },

  // Agreeableness (A)
  { id: 31, text: "I feel little concern for others.", trait: 'A', reversed: true },
  { id: 32, text: "I am interested in people.", trait: 'A', reversed: false },
  { id: 33, text: "I insult people.", trait: 'A', reversed: true },
  { id: 34, text: "I sympathize with others' feelings.", trait: 'A', reversed: false },
  { id: 35, text: "I am not interested in other people's problems.", trait: 'A', reversed: true },
  { id: 36, text: "I have a soft heart.", trait: 'A', reversed: false },
  { id: 37, text: "I am not really interested in others.", trait: 'A', reversed: true },
  { id: 38, text: "I take time out for others.", trait: 'A', reversed: false },
  { id: 39, text: "I feel others' emotions.", trait: 'A', reversed: false },
  { id: 40, text: "I make people feel at ease.", trait: 'A', reversed: false },

  // Neuroticism (N)
  { id: 41, text: "I get stressed out easily.", trait: 'N', reversed: false },
  { id: 42, text: "I am relaxed most of the time.", trait: 'N', reversed: true },
  { id: 43, text: "I worry about things.", trait: 'N', reversed: false },
  { id: 44, text: "I seldom feel blue.", trait: 'N', reversed: true },
  { id: 45, text: "I am easily disturbed.", trait: 'N', reversed: false },
  { id: 46, text: "I get upset easily.", trait: 'N', reversed: false },
  { id: 47, text: "I change my mood a lot.", trait: 'N', reversed: false },
  { id: 48, text: "I have frequent mood swings.", trait: 'N', reversed: false },
  { id: 49, text: "I get irritated easily.", trait: 'N', reversed: false },
  { id: 50, text: "I often feel blue.", trait: 'N', reversed: false },
];

export const traitDescriptions = {
  O: {
    name: "Openness to Experience",
    high: "You are imaginative, curious, and open to new experiences. You appreciate art, emotion, adventure, and unusual ideas.",
    low: "You tend to be more conventional and prefer familiarity over novelty. You focus on practical matters.",
  },
  C: {
    name: "Conscientiousness",
    high: "You are organized, dependable, and self-disciplined. You plan ahead and are goal-oriented.",
    low: "You are more flexible and spontaneous. You may prefer to go with the flow rather than follow strict plans.",
  },
  E: {
    name: "Extraversion",
    high: "You are outgoing, energetic, and enjoy being around others. You draw energy from social interactions.",
    low: "You are more reserved and introspective. You recharge through solitude and prefer deeper one-on-one connections.",
  },
  A: {
    name: "Agreeableness",
    high: "You are compassionate, cooperative, and value getting along with others. You are trusting and helpful.",
    low: "You are more competitive and skeptical. You prioritize your own interests and question others' motives.",
  },
  N: {
    name: "Neuroticism",
    high: "You experience emotions intensely and may be prone to stress and anxiety. You are sensitive to your environment.",
    low: "You are emotionally stable and resilient. You handle stress well and maintain a calm demeanor.",
  },
};
