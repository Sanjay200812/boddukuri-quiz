export interface MotivationalQuote {
  quote: string;
  author: string;
  personalNote: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    personalNote: "Mahi, each state you conquer brings you one step closer to complete mastery! Keep this consistency alive."
  },
  {
    quote: "Every expert was once a beginner.",
    author: "Helen Hayes",
    personalNote: "Remember when all these national park names were unfamiliar? Look how naturally you recall them now, Mahi!"
  },
  {
    quote: "Knowledge is the one treasure that no one can take away from you.",
    author: "Indian Proverb",
    personalNote: "Every fact you learn about India's wildlife and forests stays with you forever. Be proud of your curiosity, Mahi!"
  },
  {
    quote: "Don't stop when you're tired. Stop when you're done.",
    author: "David Goggins",
    personalNote: "Your dedication is your superpower, Mahi. Every question you review builds unshakeable confidence!"
  },
  {
    quote: "Little by little, day by day, what is meant for you will find its way.",
    author: "Lao Tzu",
    personalNote: "One state a day is the golden strategy. You're building a massive mountain of knowledge, Mahi!"
  },
  {
    quote: "Your only competition is who you were yesterday.",
    author: "Mahi's Personal Creed",
    personalNote: "You are sharper, quicker, and more knowledgeable than yesterday. Super proud of you, Mahi!"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    personalNote: "Your dream is worth every minute of study. Keep your head high and your focus razor-sharp, Mahi!"
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    personalNote: "Memorizing all 106+ National Parks across India sounded daunting, but you are conquering it state by state, Mahi!"
  },
  {
    quote: "Continuous effort—not strength or intelligence—is the key to unlocking our potential.",
    author: "Winston Churchill",
    personalNote: "It's your daily habit that is creating this brilliance, Mahi. Celebrate this effort today!"
  },
  {
    quote: "Study while others are sleeping; work while others are loafing; prepare while others are playing; and dream while others are wishing.",
    author: "William Arthur Ward",
    personalNote: "Mahi, your quiet persistence will yield loud success. Keep shining!"
  }
];

export function getPerformanceTier(percentage: number): {
  tier: 'outstanding' | 'excellent' | 'good' | 'practice' | 'retry';
  title: string;
  badgeColor: string;
  subtext: string;
} {
  if (percentage >= 90) {
    return {
      tier: 'outstanding',
      title: 'Outstanding!',
      badgeColor: 'bg-red-100 text-red-900 border-red-400',
      subtext: 'Flawless recall! You have completely mastered this state\'s national parks!'
    };
  }
  if (percentage >= 75) {
    return {
      tier: 'excellent',
      title: 'Excellent work!',
      badgeColor: 'bg-red-100 text-red-900 border-red-400',
      subtext: 'Impressive retention! Your memory of previous and new parks is crystal clear!'
    };
  }
  if (percentage >= 60) {
    return {
      tier: 'good',
      title: 'Good effort!',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      subtext: 'Solid grasp! Review the few missed questions in the answer key to hit 100% next time.'
    };
  }
  if (percentage >= 40) {
    return {
      tier: 'practice',
      title: 'Keep practising!',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      subtext: 'You\'re getting the hang of it! Look through the explanations and take another shot.'
    };
  }
  return {
    tier: 'retry',
    title: "Don't give up. Learn and try again!",
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    subtext: 'Every mistake is just a discovery of what to learn next. Read the facts below and reattempt!'
  };
}

export function getRandomQuote(): MotivationalQuote {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
}

