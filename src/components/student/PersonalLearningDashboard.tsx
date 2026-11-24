import React, { useMemo } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Target,
  TrendingUp,
  XCircle,
  Zap,
  Bookmark,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { getAllAttempts } from '../../utils/storage';
import { getAllTopicQuestions, getTopicsList, getQuizzesForTopic } from '../../data/topics';
import { getSmartRevisionList, getStudentMistakes, getStudentBookmarks, getStudentStudyPlan } from '../../utils/studentLearning';
import { Card3D } from '../ui/Card3D';

interface PersonalLearningDashboardProps {
  studentId: string;
  studentName: string;
  onNavigate: (view: string) => void;
  onStartQuiz: (quizId: string) => void;
}

export const PersonalLearningDashboard: React.FC<PersonalLearningDashboardProps> = ({
  studentId,
  studentName,
  onNavigate,
  onStartQuiz
}) => {
  const attempts = useMemo(() => {
    const all = getAllAttempts();
    return all.filter(a => a.studentId === studentId || studentId === 'mahi_student');
  }, [studentId]);

  const allQuestions = useMemo(() => getAllTopicQuestions(), []);
  const allTopics = useMemo(() => getTopicsList(), []);
  const publishedQuizzes = useMemo(() => {
    return allTopics.flatMap(t => getQuizzesForTopic(t.id, false));
  }, [allTopics]);

  const mistakes = useMemo(() => getStudentMistakes(studentId), [studentId]);
  const revisions = useMemo(() => getSmartRevisionList(studentId), [studentId]);
  const bookmarks = useMemo(() => getStudentBookmarks(studentId), [studentId]);
  const studyPlan = useMemo(() => getStudentStudyPlan(studentId), [studentId]);

  // Metric calculations
  const totalAvailableQuestions = allQuestions.length;
  
  // Unique questions attempted
  const attemptedQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const att of attempts) {
      if (att.answers) {
        Object.keys(att.answers).forEach(qid => ids.add(qid));
      }
    }
    return ids;
  }, [attempts]);

  const totalAttemptedQuestionsCount = attemptedQuestionIds.size;

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let highestScorePercent = 0;
  const completedQuizIds = new Set<string>();

  attempts.forEach(att => {
    totalCorrect += (att.correctCount || 0);
    totalIncorrect += ((att.totalQuestions || 0) - (att.correctCount || 0));
    if (att.percentage > highestScorePercent) {
      highestScorePercent = att.percentage;
    }
    const marks = att.marksObtained ?? att.score ?? 0;
    if (att.passed || marks >= 10 || att.percentage >= 60) {
      completedQuizIds.add(att.quizId);
    }
  });

  const totalAnswered = totalCorrect + totalIncorrect;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const totalCompletedQuizzes = completedQuizIds.size;
  const totalPublishedQuizzesCount = publishedQuizzes.length;
  const quizCompletionPercent = totalPublishedQuizzesCount > 0 
    ? Math.round((totalCompletedQuizzes / totalPublishedQuizzesCount) * 100) 
    : 0;

  // Topics completed (where at least one quiz is completed)
  const completedTopicsCount = useMemo(() => {
    let count = 0;
    allTopics.forEach(t => {
      const topicQuizzes = getQuizzesForTopic(t.id, false);
      const isAnyDone = topicQuizzes.some(q => completedQuizIds.has(q.id));
      if (isAnyDone) count++;
    });
    return count;
  }, [allTopics, completedQuizIds]);

  // Study time from studyPlan daily logs
  const totalMinutesSpent = useMemo(() => {
    let mins = 0;
    Object.values(studyPlan.dailyLogs || {}).forEach(log => {
      mins += (log.minutesSpent || 0);
    });
    return mins;
  }, [studyPlan]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = studyPlan.dailyLogs?.[todayStr] || { questionsSolved: 0, minutesSpent: 0, goalMet: false };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b0c15] text-white p-6 sm:p-8 shadow-2xl border border-amber-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Student Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-amber-300">{studentName}</span>! 🎯
            </h1>
            <p className="text-sm sm:text-base text-rose-100/90 max-w-xl">
              Track your real-time learning metrics, mistake resolution, spaced repetition schedule, and exam readiness.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('mock-exam')}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition min-h-[44px]"
            >
              <Zap className="w-4 h-4" />
              Mock Exam Mode
            </button>
            <button
              onClick={() => onNavigate('smart-revision')}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 active:scale-95 transition min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              Revision ({revisions.dueToday.length} Due)
            </button>
          </div>
        </div>

        {/* Ambient subtle glow decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Part C: High-Transparency Numerical Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Attempted vs Available */}
        <Card3D className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#76515b] uppercase tracking-wide">Question Bank</span>
            <span className="p-2 rounded-xl bg-rose-50 text-[#800020]">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {totalAttemptedQuestionsCount} <span className="text-sm font-medium text-stone-400">/ {totalAvailableQuestions}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#76515b]">
            <span>Questions Attempted</span>
            <span className="font-bold text-[#800020]">
              {Math.round((totalAttemptedQuestionsCount / (totalAvailableQuestions || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-[#800020] h-full rounded-full transition-all" 
              style={{ width: `${Math.min(100, Math.round((totalAttemptedQuestionsCount / (totalAvailableQuestions || 1)) * 100))}%` }} 
            />
          </div>
        </Card3D>

        {/* Metric 2: Real Accuracy */}
        <Card3D className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#76515b] uppercase tracking-wide">Overall Accuracy</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {overallAccuracy}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#76515b]">
            <span>Correct vs Wrong</span>
            <span className="font-semibold text-emerald-600">{totalCorrect}C <span className="text-rose-500 font-semibold">{totalIncorrect}W</span></span>
          </div>
          <div className="w-full bg-rose-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all" 
              style={{ width: `${overallAccuracy}%` }} 
            />
          </div>
        </Card3D>

        {/* Metric 3: Quizzes Completed */}
        <Card3D className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#76515b] uppercase tracking-wide">Quizzes Completed</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {totalCompletedQuizzes} <span className="text-sm font-medium text-stone-400">/ {totalPublishedQuizzesCount}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#76515b]">
            <span>Topics Studied</span>
            <span className="font-bold text-[#800020]">{completedTopicsCount} / {allTopics.length}</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all" 
              style={{ width: `${quizCompletionPercent}%` }} 
            />
          </div>
        </Card3D>

        {/* Metric 4: Daily Goal & Streak */}
        <Card3D className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#76515b] uppercase tracking-wide">Today's Target</span>
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2b0c15]">
            {todayLog.questionsSolved} <span className="text-sm font-medium text-stone-400">/ {studyPlan.dailyQuestionTarget} Qs</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#76515b]">
            <span>{totalMinutesSpent}m total studied</span>
            <span className={`font-bold ${todayLog.goalMet ? 'text-emerald-600' : 'text-amber-600'}`}>
              {todayLog.goalMet ? 'Goal Achieved! 🌟' : `${Math.max(0, studyPlan.dailyQuestionTarget - todayLog.questionsSolved)} remaining`}
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${todayLog.goalMet ? 'bg-emerald-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(100, Math.round((todayLog.questionsSolved / studyPlan.dailyQuestionTarget) * 100))}%` }} 
            />
          </div>
        </Card3D>
      </div>

      {/* Quick Access Action Grid */}
      <div>
        <h2 className="text-lg font-bold text-[#2b0c15] mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#800020]" />
          Learning Centre Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Mistake Notebook */}
          <button
            onClick={() => onNavigate('mistake-notebook')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-[#800020] group-hover:text-white transition">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Mistake Notebook</h3>
                {mistakes.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                    {mistakes.filter(m => m.status === 'active').length}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#76515b] mt-1">Review, re-attempt, and master your incorrect and skipped questions.</p>
            </div>
          </button>

          {/* Action 2: Smart Revision */}
          <button
            onClick={() => onNavigate('smart-revision')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Smart Revision</h3>
                {revisions.dueToday.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {revisions.dueToday.length} Due
                  </span>
                )}
              </div>
              <p className="text-xs text-[#76515b] mt-1">Spaced repetition schedule (1d → 3d → 7d → 14d → 30d) for long-term retention.</p>
            </div>
          </button>

          {/* Action 3: Weak Area Analysis */}
          <button
            onClick={() => onNavigate('weak-areas')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Weak Area Analysis</h3>
              <p className="text-xs text-[#76515b] mt-1">Identify low-accuracy topics and frequently missed concepts with sample sizes.</p>
            </div>
          </button>

          {/* Action 4: Flashcards */}
          <button
            onClick={() => onNavigate('flashcards')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Rapid Flashcards</h3>
              <p className="text-xs text-[#76515b] mt-1">3D interactive flashcards for Banking, RBI, Ramsar, UNESCO, and Constitution.</p>
            </div>
          </button>

          {/* Action 5: Current Affairs Centre */}
          <button
            onClick={() => onNavigate('current-affairs')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Current Affairs Centre</h3>
              <p className="text-xs text-[#76515b] mt-1">Organized by month, ministry, category with key facts and official PIB links.</p>
            </div>
          </button>

          {/* Action 6: Bookmarks & Notes */}
          <button
            onClick={() => onNavigate('bookmarks')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Bookmarks & Notes</h3>
                {bookmarks.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {bookmarks.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#76515b] mt-1">Your saved questions, important tags, and personal private study notes.</p>
            </div>
          </button>

          {/* Action 7: Study Planner */}
          <button
            onClick={() => onNavigate('study-planner')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Study Planner</h3>
              <p className="text-xs text-[#76515b] mt-1">Configure daily targets, weekly goals, study times, and habit tracker.</p>
            </div>
          </button>

          {/* Action 8: Student Support & Instructions */}
          <button
            onClick={() => onNavigate('support')}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#ebd4d9] hover:border-[#800020] hover:shadow-md transition text-left active:scale-[0.98] group min-h-[44px]"
          >
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2b0c15] group-hover:text-[#800020] transition">Support & Guidance</h3>
              <p className="text-xs text-[#76515b] mt-1">Report typos/broken links, read admin announcements, exam guidelines.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Attempts & Topic Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Topic Mastery Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#ebd4d9] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2b0c15] text-base sm:text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#800020]" />
              Topic Progress & Completion
            </h3>
            <button
              onClick={() => onNavigate('my-quizzes')}
              className="text-xs font-bold text-[#800020] hover:underline inline-flex items-center gap-1 min-h-[44px]"
            >
              All Quizzes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {allTopics.map(topic => {
              const topicQuizzes = getQuizzesForTopic(topic.id, false);
              const doneQuizzes = topicQuizzes.filter(q => completedQuizIds.has(q.id));
              const pct = topicQuizzes.length > 0 ? Math.round((doneQuizzes.length / topicQuizzes.length) * 100) : 0;
              const nextQuiz = topicQuizzes.find(q => !completedQuizIds.has(q.id)) || topicQuizzes[0];

              return (
                <div key={topic.id} className="p-3.5 rounded-xl border border-stone-100 hover:border-[#ebd4d9] bg-stone-50/50 transition">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#2b0c15] truncate">{topic.title}</div>
                      <div className="text-xs text-[#76515b]">
                        {doneQuizzes.length} of {topicQuizzes.length} Quizzes completed
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#800020]">{pct}%</span>
                      {nextQuiz && (
                        <button
                          onClick={() => onStartQuiz(nextQuiz.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition flex items-center gap-1 min-h-[36px]"
                        >
                          <Play className="w-3 h-3" />
                          {doneQuizzes.length === 0 ? 'Start' : 'Continue'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#800020] h-full rounded-full transition-all" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Attempts Feed */}
        <div className="bg-white rounded-3xl border border-[#ebd4d9] p-5 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2b0c15] text-base sm:text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#800020]" />
              Recent Attempts
            </h3>
            <button
              onClick={() => onNavigate('my-attempts')}
              className="text-xs font-bold text-[#800020] hover:underline min-h-[44px]"
            >
              View All
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Target className="w-10 h-10 mb-2 stroke-1 text-stone-300" />
              <p className="text-sm font-medium text-stone-600">No attempts logged yet</p>
              <p className="text-xs text-stone-400 mt-1">Start a topic quiz to begin generating real performance metrics!</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px]">
              {attempts.slice(0, 5).map(att => (
                <div key={att.id} className="p-3 rounded-xl border border-stone-100 bg-stone-50/70 hover:bg-stone-50 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#2b0c15] truncate max-w-[140px]">
                      {att.quizTitle || att.quizId}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${att.percentage >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {att.percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#76515b]">
                    <span>Score: {att.marksObtained ?? att.score ?? 0}/{att.totalQuestions}</span>
                    <span>{new Date(att.completedAt || att.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
