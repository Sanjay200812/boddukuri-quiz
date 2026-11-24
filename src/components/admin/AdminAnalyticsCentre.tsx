import React, { useMemo } from 'react';
import {
  BarChart3,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { getAllAttempts } from '../../utils/storage';
import { getTopicsList } from '../../data/topics';
import { Card3D } from '../ui/Card3D';

interface AdminAnalyticsCentreProps {
  onRefreshData?: () => Promise<void>;
}

export const AdminAnalyticsCentre: React.FC<AdminAnalyticsCentreProps> = ({
  onRefreshData
}) => {
  const attempts = useMemo(() => getAllAttempts(), []);
  const allTopics = useMemo(() => getTopicsList(), []);

  // Performance by Student (Mahi vs Shailu)
  const studentStats = useMemo(() => {
    const stats: Record<string, {
      name: string;
      attemptsCount: number;
      totalCorrect: number;
      totalAnswered: number;
      quizzesPassed: number;
      highestScore: number;
    }> = {
      mahi: { name: 'Mahi', attemptsCount: 0, totalCorrect: 0, totalAnswered: 0, quizzesPassed: 0, highestScore: 0 },
      shailu: { name: 'Shailu', attemptsCount: 0, totalCorrect: 0, totalAnswered: 0, quizzesPassed: 0, highestScore: 0 }
    };

    attempts.forEach(att => {
      const isShailu = att.studentId?.toLowerCase().includes('shailu') || att.studentName?.toLowerCase().includes('shailu');
      const target = isShailu ? stats.shailu : stats.mahi;

      target.attemptsCount += 1;
      target.totalCorrect += (att.correctCount || 0);
      target.totalAnswered += (att.totalQuestions || 0);
      const marks = att.marksObtained ?? att.score ?? 0;
      if (att.passed || marks >= 10 || att.percentage >= 60) {
        target.quizzesPassed += 1;
      }
      if (att.percentage > target.highestScore) {
        target.highestScore = att.percentage;
      }
    });

    return stats;
  }, [attempts]);

  // Topic Accuracy Breakdown
  const topicAccuracy = useMemo(() => {
    return allTopics.map(t => {
      let topicCorrect = 0;
      let topicTotal = 0;
      let topicAttemptsCount = 0;

      attempts.forEach(att => {
        if (att.quizId.startsWith(t.id) || att.quizId === t.id) {
          topicAttemptsCount += 1;
          topicCorrect += (att.correctCount || 0);
          topicTotal += (att.totalQuestions || 0);
        }
      });

      const accuracy = topicTotal > 0 ? Math.round((topicCorrect / topicTotal) * 100) : 0;
      return {
        id: t.id,
        title: t.title,
        attemptsCount: topicAttemptsCount,
        accuracy,
        totalAnswered: topicTotal
      };
    });
  }, [allTopics, attempts]);

  // Most Difficult Questions (Across all attempts with error analysis)
  const difficultQuestions = useMemo(() => {
    const questionMissCount: Record<string, { questionText: string; topicId: string; missCount: number; attemptCount: number; wrongSelections: Record<number, number> }> = {};

    attempts.forEach(att => {
      if (att.answers && att.questionsSnapshot) {
        att.questionsSnapshot.forEach(q => {
          if (!questionMissCount[q.id]) {
            questionMissCount[q.id] = {
              questionText: q.question,
              topicId: q.state || 'General',
              missCount: 0,
              attemptCount: 0,
              wrongSelections: {}
            };
          }

          questionMissCount[q.id].attemptCount += 1;
          const selected = att.answers[q.id];
          if (selected !== undefined && selected !== q.correctAnswer) {
            questionMissCount[q.id].missCount += 1;
            questionMissCount[q.id].wrongSelections[selected] = (questionMissCount[q.id].wrongSelections[selected] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(questionMissCount)
      .map(([id, data]) => ({
        id,
        ...data,
        errorRate: data.attemptCount > 0 ? Math.round((data.missCount / data.attemptCount) * 100) : 0
      }))
      .filter(item => item.missCount > 0)
      .sort((a, b) => b.missCount - a.missCount)
      .slice(0, 5);
  }, [attempts]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Executive Performance Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Comprehensive Analytics Centre
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
            Database-backed reporting on student accuracy, error patterns, and curriculum retention.
          </p>
        </div>

        {onRefreshData && (
          <button
            onClick={() => onRefreshData()}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 active:scale-95 transition min-h-[44px]"
          >
            Refresh Data
          </button>
        )}
      </div>

      {/* Student Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mahi Card */}
        <Card3D className="p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-[#800020] text-white flex items-center justify-center font-bold text-sm">
                M
              </span>
              <div>
                <h3 className="font-bold text-base text-[#2b0c15]">Mahi (Student)</h3>
                <span className="text-xs text-stone-500">Access Code: 2002 • Active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-[#800020]">
              {studentStats.mahi.quizzesPassed} Quizzes Passed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Total Attempts</span>
              <span className="text-lg font-black text-[#2b0c15]">{studentStats.mahi.attemptsCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Accuracy</span>
              <span className="text-lg font-black text-emerald-600">
                {studentStats.mahi.totalAnswered > 0
                  ? Math.round((studentStats.mahi.totalCorrect / studentStats.mahi.totalAnswered) * 100)
                  : 0}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Best Score</span>
              <span className="text-lg font-black text-amber-600">{studentStats.mahi.highestScore}%</span>
            </div>
          </div>
        </Card3D>

        {/* Shailu Card */}
        <Card3D className="p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm">
                S
              </span>
              <div>
                <h3 className="font-bold text-base text-[#2b0c15]">Shailu (Student)</h3>
                <span className="text-xs text-stone-500">Access Code: 2580 • Active</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800">
              {studentStats.shailu.quizzesPassed} Quizzes Passed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Total Attempts</span>
              <span className="text-lg font-black text-[#2b0c15]">{studentStats.shailu.attemptsCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Accuracy</span>
              <span className="text-lg font-black text-emerald-600">
                {studentStats.shailu.totalAnswered > 0
                  ? Math.round((studentStats.shailu.totalCorrect / studentStats.shailu.totalAnswered) * 100)
                  : 0}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50">
              <span className="text-[11px] text-stone-500 block">Best Score</span>
              <span className="text-lg font-black text-amber-600">{studentStats.shailu.highestScore}%</span>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Topic Accuracy Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#2b0c15] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#800020]" />
          Topic-Wise Accuracy & Attempt Volume
        </h3>

        <div className="space-y-3">
          {topicAccuracy.map(t => (
            <div key={t.id} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-bold text-[#2b0c15]">{t.title}</span>
                <span className="font-semibold text-stone-600">
                  {t.attemptsCount} Attempts ({t.totalAnswered} Qs Answered) • <strong className="text-[#800020]">{t.accuracy}% Accuracy</strong>
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    t.accuracy >= 70 ? 'bg-emerald-500' : t.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Difficult Questions */}
      <div className="p-6 rounded-3xl bg-white border border-[#ebd4d9] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#2b0c15] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Top Challenging Questions (High Error Frequency)
          </h3>
          <span className="text-xs text-stone-400">Based on student answer submissions</span>
        </div>

        {difficultQuestions.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-100">
            No repeated incorrect patterns detected yet across submissions.
          </div>
        ) : (
          <div className="space-y-3">
            {difficultQuestions.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#800020]">ID: {item.id}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800">
                    {item.missCount} Mistakes ({item.errorRate}% Error Rate)
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#2b0c15]">
                  {item.questionText}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
