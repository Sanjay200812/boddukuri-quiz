import React, { useState } from 'react';
import {
  Layers,
  ExternalLink,
  Play,
  ArrowLeft,
  Building2,
  Search,
  CheckCircle2
} from 'lucide-react';

interface CurrentAffairsCentreProps {
  onGoBack: () => void;
  onStartQuiz: (quizId: string) => void;
}

interface NewsItem {
  id: string;
  month: string;
  category: string;
  ministry: string;
  headline: string;
  summary: string;
  keyFacts: string[];
  officialUrl?: string;
  associatedQuizId: string;
  quizTitle: string;
}

const CURATED_CURRENT_AFFAIRS: NewsItem[] = [
  {
    id: 'ca-nov-01',
    month: 'November 2026',
    category: 'Environment & Wetlands',
    ministry: 'MoEFCC',
    headline: 'India Designates 102nd and 103rd Ramsar Sites',
    summary: 'The Ministry of Environment, Forest and Climate Change announced the designation of Sukhna Wetland (102nd, Chandigarh) and Sauj Jheel (103rd, Mainpuri, Uttar Pradesh) under the Ramsar Convention.',
    keyFacts: ['103 Total Sites in India', '102nd: Sukhna Wetland (Chandigarh)', '103rd: Sauj Jheel (UP)'],
    officialUrl: 'https://pib.gov.in',
    associatedQuizId: 'ramsar-sites-quiz-01',
    quizTitle: 'Ramsar Sites Quiz 1'
  },
  {
    id: 'ca-nov-02',
    month: 'November 2026',
    category: 'Culture & Heritage',
    ministry: 'Ministry of Culture / UNESCO',
    headline: 'Sarnath Inscribed as India\'s 45th UNESCO World Heritage Site',
    summary: 'The World Heritage Committee inscribed the ancient Buddhist pilgrimage site of Sarnath, Uttar Pradesh, taking India\'s tally to 45 inscribed sites (36 Cultural, 8 Natural, 1 Mixed).',
    keyFacts: ['45th Site: Sarnath (UP)', 'Dhamek Stupa & Ashoka Pillar', '36 Cultural, 8 Natural, 1 Mixed'],
    officialUrl: 'https://whc.unesco.org',
    associatedQuizId: 'unesco-heritage-quiz-01',
    quizTitle: 'UNESCO Heritage Quiz 1'
  },
  {
    id: 'ca-oct-01',
    month: 'October 2026',
    category: 'Banking & Monetary Policy',
    ministry: 'Reserve Bank of India',
    headline: 'RBI Monetary Policy Committee Maintains Status Quo on Policy Repo Rate',
    summary: 'The 6-member MPC under Section 45ZB of the RBI Act retained the policy repo rate at 6.50% with withdrawal of accommodation stance.',
    keyFacts: ['Repo Rate: 6.50%', 'SDF: 6.25% | MSF: 6.75%', 'Section 45ZB RBI Act 1934'],
    officialUrl: 'https://www.rbi.org.in',
    associatedQuizId: 'banking-awareness-quiz-01',
    quizTitle: 'Banking Awareness Quiz 1'
  },
  {
    id: 'ca-oct-02',
    month: 'October 2026',
    category: 'Technology & Economy',
    ministry: 'Ministry of Electronics & IT',
    headline: 'India Semiconductor Mission Approves New Fab Facility Under ₹76,000 Cr Outlay',
    summary: 'MeitY greenlit two new semiconductor ATMP and OSAT facilities in Sanand and Dholera to foster self-reliance in silicon fabrication.',
    keyFacts: ['₹76,000 Crore Approved Outlay', '50% Central Fiscal Support', 'Sanand & Dholera hubs'],
    officialUrl: 'https://pib.gov.in',
    associatedQuizId: 'current-affairs-quiz-01',
    quizTitle: 'Current Affairs (PIB) Quiz 1'
  },
  {
    id: 'ca-sep-01',
    month: 'September 2026',
    category: 'Governance & Constitution',
    ministry: 'Ministry of Tribal Affairs',
    headline: 'Autonomous District Council Elections and Review Under Sixth Schedule',
    summary: 'Parliamentary committee review of 10 Autonomous District Councils across Assam, Meghalaya, Tripura, and Mizoram under Articles 244(2) and 275(1).',
    keyFacts: ['10 ADCs in AMTM states', 'Articles 244(2) and 275(1)', 'Codified judicial and legislative powers'],
    officialUrl: 'https://pib.gov.in',
    associatedQuizId: 'sixth-schedule-quiz-01',
    quizTitle: 'Sixth Schedule Quiz 1'
  },
  {
    id: 'ca-sep-02',
    month: 'September 2026',
    category: 'Wildlife & Ecology',
    ministry: 'National Tiger Conservation Authority',
    headline: 'Project Tiger 50-Year Milestones and Corbett Tiger Reserve Eco-Tourism Guidelines',
    summary: 'MoEFCC published upgraded eco-tourism carrying capacity norms for Jim Corbett National Park and core buffer zoning.',
    keyFacts: ['Jim Corbett: India\'s First NP (1936)', 'Project Tiger launched 1973', 'Nainital & Pauri Garhwal'],
    officialUrl: 'https://ntca.gov.in',
    associatedQuizId: 'static-gk-quiz-01',
    quizTitle: 'Static GK Quiz 1'
  }
];

export const CurrentAffairsCentre: React.FC<CurrentAffairsCentreProps> = ({
  onGoBack,
  onStartQuiz
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const months = ['November 2026', 'October 2026', 'September 2026'];
  const categories = [
    'Environment & Wetlands',
    'Culture & Heritage',
    'Banking & Monetary Policy',
    'Technology & Economy',
    'Governance & Constitution',
    'Wildlife & Ecology'
  ];

  const filteredNews = CURATED_CURRENT_AFFAIRS.filter(item => {
    const matchesMonth = selectedMonth === 'all' || item.month === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.headline.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.ministry.toLowerCase().includes(q);
    return matchesMonth && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#800020] hover:bg-rose-50 transition active:scale-95 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="text-xs text-[#76515b]">
          Verified against PIB, RBI & Gazettes
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2b0c15] via-[#5c0017] to-[#800020] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-white/10 text-amber-300">
            <Layers className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Current Affairs Learning Centre
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1">
              Curated government news, official gazette notifications, and connected quiz practice.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search headlines, ministries, keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
        >
          <option value="all">All Months</option>
          {months.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800020]/20 min-h-[44px]"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-[#ebd4d9] shadow-sm flex flex-col justify-between hover:border-[#800020]/50 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {item.category}
                </span>
                <span className="text-xs font-medium text-stone-400">{item.month}</span>
              </div>

              <div className="text-xs font-semibold text-[#800020] mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {item.ministry}
              </div>

              <h3 className="text-base font-bold text-[#2b0c15] mb-2 leading-snug">
                {item.headline}
              </h3>

              <p className="text-xs text-[#76515b] mb-4 leading-relaxed">
                {item.summary}
              </p>

              {/* Key Highlights */}
              <div className="space-y-1 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="text-[11px] font-bold text-[#2b0c15] uppercase tracking-wider mb-1">
                  Key Examination Facts:
                </div>
                {item.keyFacts.map((fact, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              {item.officialUrl && (
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-stone-500 hover:text-[#800020] inline-flex items-center gap-1"
                >
                  Official Source <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={() => onStartQuiz(item.associatedQuizId)}
                className="px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#5c0017] transition flex items-center gap-1.5 shadow-sm min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5" />
                Take {item.quizTitle}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
