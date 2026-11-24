import React, { useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Play,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { getWeakAreaAnalysis } from '../../utils/studentLearning';
import { Card3D } from '../ui/Card3D';

interface WeakAreaAnalysisViewProps {
  studentId: string;
  studentName: string;
  onGoBack: () => void;
  onStartQuiz: (quizId: string) => void;
  onOpenRevision: () => void;
}

export const WeakAreaAnalysisView: React.FC<WeakAreaAnalysisViewProps> = ({
  studentId,
  studentName,
  onGoBack,
  onStartQuiz,
  onOpenRevision
}) => {
  const reports = useMemo(() => getWeakAreaAnalysis(studentId), [studentId]);

  const weakTopics = reports.filter(r => r.isWeak);
  const calibratedTopics = reports.filter(r => r.sampleSizeSufficient && !r.isWeak);
  const pendingSampleTopics = reports.filter(r => !r.sampleSizeSufficient);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-rose-50 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="text-xs text-[#76515b]">
          Calibrated against 10+ questions threshold
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
              <TrendingUp className="w-3.5 h-3.5" />
              Targeted Remediation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Weak Area Analysis for {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 max-w-2xl">
              We mathematically calibrate your accuracy per topic once you attempt 10 or more questions, eliminating noise from small sample sizes.
            </p>
          </div>

          <button
            onClick={onOpenRevision}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-md transition active:scale-95 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            Open Smart Revision
          </button>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card3D className="p-4 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="text-xs font-semibold uppercase text-rose-700 mb-1 flex items-center justify-between">
            <span>Needs Attention (&lt;60%)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-[#2b0c15]">{weakTopics.length} Topics</div>
          <div className="text-xs text-[#76515b] mt-1">Requires focused quiz practice</div>
        </Card3D>

        <Card3D className="p-4 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="text-xs font-semibold uppercase text-emerald-700 mb-1 flex items-center justify-between">
            <span>Strong & Calibrated (&ge;60%)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#2b0c15]">{calibratedTopics.length} Topics</div>
          <div className="text-xs text-[#76515b] mt-1">Sufficient sample & solid accuracy</div>
        </Card3D>

        <Card3D className="p-4 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm">
          <div className="text-xs font-semibold uppercase text-stone-600 mb-1 flex items-center justify-between">
            <span>Pending Calibration (&lt;10 Qs)</span>
            <Info className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl font-black text-[#2b0c15]">{pendingSampleTopics.length} Topics</div>
          <div className="text-xs text-[#76515b] mt-1">Practice more questions to classify</div>
        </Card3D>
      </div>

      {/* Weak Areas List (Priority 1) */}
      {weakTopics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#2b0c15] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Critical Weak Topics (Calibrated Sample)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakTopics.map(item => (
              <div key={item.topicId} className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-[#2b0c15]">{item.topicTitle}</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700">
                      {item.accuracyPercentage}% Accuracy
                    </span>
                  </div>

                  <div className="text-xs text-[#76515b] mb-3">
                    Sample size: <span className="font-bold text-[#2b0c15]">{item.totalAttempted} questions attempted</span> ({item.totalCorrect} correct)
                  </div>

                  {item.frequentlyMissedConcepts.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-rose-800 uppercase tracking-wide mb-1.5">
                        Frequently Missed Concepts:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.frequentlyMissedConcepts.map((concept, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-500">Recommended Practice:</span>
                  {item.recommendedQuizzes.length > 0 && (
                    <button
                      onClick={() => onStartQuiz(item.recommendedQuizzes[0].quizId)}
                      className="px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5c0017] transition flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {item.recommendedQuizzes[0].title}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Calibration (Sample Size < 10) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#2b0c15] flex items-center gap-2">
          <Info className="w-5 h-5 text-stone-500" />
          Topics Pending Calibration (&lt; 10 Questions Attempted)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pendingSampleTopics.map(item => (
            <div key={item.topicId} className="p-4 rounded-xl bg-white border border-[#ebd4d9] shadow-sm flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm text-[#2b0c15] mb-1">{item.topicTitle}</div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mb-2">
                  <Info className="w-3 h-3 text-amber-700" />
                  Sample size insufficient ({item.totalAttempted}/10 Qs)
                </div>
                <p className="text-xs text-[#76515b]">
                  {item.totalAttempted === 0
                    ? 'No questions attempted yet in this topic.'
                    : `Attempted ${item.totalAttempted} questions (${item.totalCorrect} correct). Attempt ${10 - item.totalAttempted} more to classify.`}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100">
                {item.recommendedQuizzes.length > 0 && (
                  <button
                    onClick={() => onStartQuiz(item.recommendedQuizzes[0].quizId)}
                    className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-[#800020] hover:text-white text-stone-800 text-xs font-semibold transition flex items-center justify-center gap-1 min-h-[44px]"
                  >
                    <Play className="w-3 h-3" />
                    Start {item.recommendedQuizzes[0].title}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong Calibrated Topics */}
      {calibratedTopics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#2b0c15] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Strong Mastery Areas (&ge;60% Accuracy)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {calibratedTopics.map(item => (
              <div key={item.topicId} className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[#2b0c15]">{item.topicTitle}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {item.accuracyPercentage}%
                  </span>
                </div>
                <div className="text-xs text-[#76515b]">
                  Attempted {item.totalAttempted} Qs ({item.totalCorrect} Correct)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
