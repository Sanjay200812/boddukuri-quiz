import React, { useState } from 'react';
import type { DailyQuiz } from '../types/quiz';
import { STATE_REPOSITORIES } from '../data/stateRepositories';
import {
  BookOpen,
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  Play,
  Search,
  ShieldCheck
} from 'lucide-react';

interface StudyGuideProps {
  quizzes: DailyQuiz[];
  initialState?: string;
  onStartQuiz: (quizId: string) => void;
  onGoHome: () => void;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({
  quizzes,
  initialState,
  onStartQuiz,
}) => {
  // Only expose the active states learned in current quizzes (the 6 states for Day 01)
  const activeStatesList = Array.from(new Set(quizzes.flatMap(q => q.statesCovered)));
  const allStates = activeStatesList.length > 0 ? activeStatesList : [
    'Madhya Pradesh',
    'Andhra Pradesh',
    'Telangana',
    'Kerala',
    'Assam',
    'Karnataka'
  ];
  const [selectedState, setSelectedState] = useState<string>(
    initialState && allStates.includes(initialState) && STATE_REPOSITORIES[initialState]
      ? initialState
      : allStates[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const stateData = STATE_REPOSITORIES[selectedState] || STATE_REPOSITORIES[allStates[0]];
  const stateInfo = stateData.stateInfo;

  // Find corresponding quiz for this state if available
  const matchingQuiz = quizzes.find(q => q.statesCovered.includes(selectedState)) || quizzes[0];

  // Filter parks inside the state by search query if any
  const filteredParks = stateInfo.parks.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.famousWildlife && p.famousWildlife.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    p.keyFeature.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fadeIn">

      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-900">
              <BookOpen className="w-5 h-5 text-red-900" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              National Parks Study Guide
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master each state’s verified facts, wildlife, rivers, and establishment years before your daily test!
          </p>
        </div>

        {/* Start Day Quiz CTA */}
        <button
          onClick={() => onStartQuiz(matchingQuiz.id)}
          className="px-5 py-2.5 rounded-xl bg-red-900 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Take {matchingQuiz.title} Quiz</span>
        </button>
      </div>

      {/* State Selector Tabs */}
      <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200/90 shadow-soft overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {allStates.map((st, idx) => {
          const isSelected = st === selectedState;

          return (
            <button
              key={st}
              onClick={() => {
                setSelectedState(st);
                setSearchQuery('');
              }}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-red-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-md text-[10px] flex items-center justify-center font-black ${
                isSelected ? 'bg-red-950 text-red-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {idx + 1}
              </span>
              <span>{st}</span>
            </button>
          );
        })}
      </div>

      {/* State Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950 via-red-900 to-forest-950 text-white p-6 sm:p-8 shadow-elevated">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-white/20 text-red-300 backdrop-blur-sm border border-white/20">
              {stateInfo.totalParks} Officially Notified National Parks
            </span>
            <span className="text-xs text-red-300">
              Capital: <strong className="text-white">{stateInfo.capital}</strong>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {stateInfo.stateName}
          </h2>

          <p className="text-sm sm:text-base text-red-100/90 leading-relaxed max-w-3xl">
            {stateInfo.overview}
          </p>

          {/* Tips for Mahi Card */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-red-300">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span><strong>Mahi's Memory Trick:</strong> {stateInfo.tipsForMahi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input inside the state */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${stateInfo.stateName}'s parks, wildlife, or districts...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-800 shadow-xs"
          />
        </div>

        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          Showing {filteredParks.length} of {stateInfo.totalParks} parks
        </span>
      </div>

      {/* National Parks Fact Cards */}
      <div className="space-y-4">
        {filteredParks.map((park, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card hover:border-red-400 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  National Park #{idx + 1}
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {park.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-red-800" />
                  Est. {park.year}
                </span>
                {park.unescoOrSpecialStatus && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Special Status
                  </span>
                )}
              </div>
            </div>

            {/* Geographical Location & River Biome */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <MapPin className="w-4 h-4 text-red-800 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 font-semibold block text-xs">District & Location</span>
                  <strong className="text-slate-800">{park.district}</strong>
                </div>
              </div>

              {park.riverOrBiome && (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Compass className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 font-semibold block text-xs">River / Landscape</span>
                    <strong className="text-slate-800">{park.riverOrBiome}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Key Feature & Description */}
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
              <span className="font-bold text-red-950 block text-xs uppercase tracking-wider">
                🌟 Significant Features
              </span>
              <p className="text-slate-700 font-medium">
                {park.keyFeature}
              </p>
            </div>

            {/* Famous Wildlife Chips */}
            {park.famousWildlife && park.famousWildlife.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  🐾 Flagship & Endemic Wildlife:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {park.famousWildlife.map((animal, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                      {animal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {park.unescoOrSpecialStatus && (
              <div className="text-xs text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{park.unescoOrSpecialStatus}</span>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Bottom Floating Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Ready to test your cumulative knowledge of {stateInfo.stateName}?
          </h4>
          <p className="text-xs text-slate-500">
            Take the daily quiz to earn points, build streaks, and share your score on WhatsApp!
          </p>
        </div>

        <button
          onClick={() => onStartQuiz(matchingQuiz.id)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-900 hover:bg-red-900 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start {matchingQuiz.title} Quiz</span>
        </button>
      </div>

    </div>
  );
};
