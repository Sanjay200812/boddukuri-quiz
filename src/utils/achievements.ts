import type { QuizAttempt, AchievementBadge } from '../types/quiz';

/**
 * Master catalog of Achievement Badges for Boddukuri's Quiz #Mahi
 */
export function evaluateBadges(attempts: QuizAttempt[], streak: number = 0): AchievementBadge[] {
  const totalAttempts = attempts.length;
  const bestPercentage = attempts.reduce((max, a) => Math.max(max, a.percentage), 0);
  const totalMarksEarned = attempts.reduce((sum, a) => sum + a.marksObtained, 0);

  // Check if any quiz has been attempted 2+ times
  const quizCounts: Record<string, number> = {};
  attempts.forEach(a => {
    quizCounts[a.quizId] = (quizCounts[a.quizId] || 0) + 1;
  });
  const hasReattempted = Object.values(quizCounts).some(count => count >= 2);

  // Check state-specific 100% accuracy
  const hasPerfectMP = attempts.some(a => 
    a.stateBreakdown?.some(s => s.stateName === 'Madhya Pradesh' && s.percentage === 100)
  );

  const hasPerfectAssam = attempts.some(a => 
    a.stateBreakdown?.some(s => s.stateName === 'Assam' && s.percentage === 100)
  );

  const hasSpeedScholar = attempts.some(a => 
    a.timeTakenSeconds > 0 && a.timeTakenSeconds <= 300 && a.percentage >= 80
  );

  return [
    {
      id: 'first_quiz',
      title: 'First Quiz',
      description: 'Completed your very first daily quiz session',
      icon: '🎯',
      category: 'milestone',
      unlocked: totalAttempts >= 1,
      currentProgress: Math.min(totalAttempts, 1),
      targetProgress: 1,
      rewardHint: 'Complete 1 daily quiz'
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Scored 100% (30 / 30 marks) on a daily quiz',
      icon: '💯',
      category: 'score',
      unlocked: attempts.some(a => a.percentage === 100),
      currentProgress: bestPercentage,
      targetProgress: 100,
      rewardHint: 'Answer all 30 questions correctly'
    },
    {
      id: 'streak_3',
      title: '3-Day Streak',
      description: 'Maintained a learning streak for 3 consecutive days',
      icon: '⚡',
      category: 'streak',
      unlocked: streak >= 3,
      currentProgress: Math.min(streak, 3),
      targetProgress: 3,
      rewardHint: 'Practice 3 days in a row'
    },
    {
      id: 'streak_7',
      title: '7-Day Streak',
      description: 'Maintained an unbroken 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      unlocked: streak >= 7,
      currentProgress: Math.min(streak, 7),
      targetProgress: 7,
      rewardHint: 'Practice 7 days in a row'
    },
    {
      id: 'high_scorer',
      title: 'High Achiever',
      description: 'Scored 90% or higher on a 30-question quiz',
      icon: '🏆',
      category: 'score',
      unlocked: bestPercentage >= 90,
      currentProgress: bestPercentage,
      targetProgress: 90,
      rewardHint: 'Score 27+ marks on any quiz'
    },
    {
      id: 'perseverance',
      title: 'Master of Revision',
      description: 'Reattempted a quiz to reinforce and master the material',
      icon: '🔁',
      category: 'mastery',
      unlocked: hasReattempted,
      currentProgress: hasReattempted ? 1 : 0,
      targetProgress: 1,
      rewardHint: 'Reattempt any completed quiz'
    },
    {
      id: 'tiger_expert',
      title: 'Tiger State Master',
      description: 'Achieved 100% accuracy on Madhya Pradesh questions',
      icon: '🐅',
      category: 'mastery',
      unlocked: hasPerfectMP,
      currentProgress: hasPerfectMP ? 1 : 0,
      targetProgress: 1,
      rewardHint: 'Get all MP questions correct'
    },
    {
      id: 'rhino_guardian',
      title: 'Rhino Guardian',
      description: 'Achieved 100% accuracy on Assam national park questions',
      icon: '🦏',
      category: 'mastery',
      unlocked: hasPerfectAssam,
      currentProgress: hasPerfectAssam ? 1 : 0,
      targetProgress: 1,
      rewardHint: 'Get all Assam questions correct'
    },
    {
      id: 'speed_scholar',
      title: 'Speed Scholar',
      description: 'Completed a quiz in under 5 minutes with ≥80% score',
      icon: '⏱️',
      category: 'milestone',
      unlocked: hasSpeedScholar,
      currentProgress: hasSpeedScholar ? 1 : 0,
      targetProgress: 1,
      rewardHint: 'Finish quiz in ≤5 mins with 80%+'
    },
    {
      id: 'century_club',
      title: 'Century Club',
      description: 'Accumulated 100+ total marks across all quiz sessions',
      icon: '🌟',
      category: 'milestone',
      unlocked: totalMarksEarned >= 100,
      currentProgress: Math.min(totalMarksEarned, 100),
      targetProgress: 100,
      rewardHint: 'Earn 100 cumulative marks'
    }
  ];
}

/**
 * Checks if the latest attempt unlocked any badges that were NOT unlocked prior to this attempt
 */
export function getFreshlyUnlockedBadges(latestAttempt: QuizAttempt, allAttempts: QuizAttempt[], streak: number): AchievementBadge[] {
  // Badges before this attempt
  const priorAttempts = allAttempts.filter(a => a.id !== latestAttempt.id);
  const priorBadges = evaluateBadges(priorAttempts, Math.max(0, streak - 1));
  const currentBadges = evaluateBadges(allAttempts, streak);

  const priorUnlockedIds = new Set(priorBadges.filter(b => b.unlocked).map(b => b.id));
  return currentBadges.filter(b => b.unlocked && !priorUnlockedIds.has(b.id));
}
