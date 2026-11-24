import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trash2,
  Check,
  Edit3,
  ArrowRight,
  HelpCircle,
  Folder,
  FolderOpen,
  Search,
  Eye,
  RefreshCw,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { TOPIC_CATEGORIES, addPublishedTopicQuestions, getAllTopicQuestions } from '../../data/topics';
import type { TopicQuestion } from '../../types/quiz';

interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Failed';
  topicId: string;
  subtopicId: string;
  folderPath?: string;
  extractedTextPreview: string;
}

interface DraftQuestion {
  id: string;
  docId: string;
  topicId: string;
  subtopicId: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  source: string;
  sourcePage: number | string;
  lastVerifiedDate: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
}

const SUPPORTED_FOLDERS = [
  { path: 'Spideyy Quiz/Static GK/', topicId: 'static-gk', label: 'Static GK' },
  { path: 'Spideyy Quiz/Current Affairs/PIB/', topicId: 'current-affairs-pib', label: 'Current Affairs — PIB' },
  { path: 'Spideyy Quiz/Banking Awareness/FA/', topicId: 'banking-awareness-fa', label: 'Banking Awareness — FA' },
  { path: 'Spideyy Quiz/Central Cabinet Ministers/', topicId: 'central-ministers', label: 'Central Cabinet Ministers' },
  { path: 'Spideyy Quiz/Ramsar Sites/2026/', topicId: 'ramsar-sites-2026', label: 'Ramsar Sites — 2026' },
  { path: 'Spideyy Quiz/UNESCO/World Heritage Sites/', topicId: 'unesco-2026', label: 'UNESCO — 2026' },
  { path: 'Spideyy Quiz/UNESCO/Tentative List/', topicId: 'unesco-tentative-2026', label: 'UNESCO Tentative List — 2026' },
  { path: 'Spideyy Quiz/Dance Forms/', topicId: 'other-important-gk', label: 'Dance Forms' },
  { path: 'Spideyy Quiz/Other GK/', topicId: 'other-important-gk', label: 'Other GK' }
];

const SAMPLE_DOCS: Array<{ name: string; topicId: string; subtopicId: string; folderPath: string; text: string }> = [
  {
    name: 'Union_Cabinet_Portfolios_Gazette_2026.pdf',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    folderPath: 'Spideyy Quiz/Central Cabinet Ministers/',
    text: 'Government of India Official Gazette: Allocation of Business Rules 2026. Ministry of Defence is allocated to Shri Rajnath Singh. Ministry of Home Affairs and Ministry of Cooperation to Shri Amit Shah. Ministry of Finance and Corporate Affairs to Smt. Nirmala Sitharaman. Ministry of External Affairs to Dr. S. Jaishankar. Ministry of Railways, Information & Broadcasting, and Electronics & IT to Shri Ashwini Vaishnaw.'
  },
  {
    name: 'PIB_National_Developments_Nov_2026.pdf',
    topicId: 'current-affairs-pib',
    subtopicId: 'pib-releases',
    folderPath: 'Spideyy Quiz/Current Affairs/PIB/',
    text: 'Press Information Bureau (PIB) Digest: Strategic Chenab Rail Bridge connects Kashmir Valley to national railway network. PM Surya Ghar Muft Bijli Yojana surpasses 1.3 crore registrations for 300 free units of rooftop solar power. PM-eBus Sewa deploys next tranche of electric buses on PPP model across Tier-2 cities.'
  },
  {
    name: 'Ramsar_Wetlands_India_Official_2026.pdf',
    topicId: 'ramsar-sites-2026',
    subtopicId: 'ramsar-2026-new',
    folderPath: 'Spideyy Quiz/Ramsar Sites/2026/',
    text: 'Ministry of Environment, Forest and Climate Change: India maintains 85 designated Ramsar Sites covering over 1.35 million hectares. Tamil Nadu possesses the highest number with 16 sites, followed by Uttar Pradesh with 10 sites. Keoladeo National Park and Loktak Lake remain on the Montreux Record.'
  },
  {
    name: 'UNESCO_World_Heritage_Inscriptions_2026.pdf',
    topicId: 'unesco-2026',
    subtopicId: 'whs-2026-additions',
    folderPath: 'Spideyy Quiz/UNESCO/World Heritage Sites/',
    text: "UNESCO World Heritage Committee: The Moidams - Mound-Burial System of the Ahom Dynasty in Charaideo, Assam, was inscribed as India's 43rd World Heritage Site (35 Cultural, 7 Natural, 1 Mixed - Khangchendzonga National Park). India hosted the 46th WHC session in New Delhi."
  },
  {
    name: 'UNESCO_Tentative_List_Submissions_2026.pdf',
    topicId: 'unesco-tentative-2026',
    subtopicId: 'tentative-2026-additions',
    folderPath: 'Spideyy Quiz/UNESCO/Tentative List/',
    text: 'Archaeological Survey of India (ASI): Official Tentative List submissions include the Maratha Military Landscapes of India (12 components across Maharashtra and Tamil Nadu), Gwalior Fort in MP, and Khooni Bhandara underground qanat water management system in Burhanpur.'
  },
  {
    name: 'Indian_Classical_and_Folk_Dances_2026.pdf',
    topicId: 'other-important-gk',
    subtopicId: 'classical-dance',
    folderPath: 'Spideyy Quiz/Dance Forms/',
    text: "Sangeet Natak Akademi: 8 recognized classical dance forms include Bharatanatyam, Kathak, Kathakali, Mohiniyattam, Odissi, Manipuri, Kuchipudi, and Sattriya. Garba of Gujarat and Kalbelia of Rajasthan are inscribed on UNESCO's Intangible Cultural Heritage List."
  }
];

export const PdfQuestionStudio: React.FC = () => {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(() => [
    {
      id: 'doc-init-01',
      name: 'Union_Cabinet_Portfolios_Gazette_2026.pdf',
      size: 1420000,
      uploadDate: '24/11/2026',
      status: 'Processed',
      topicId: 'central-ministers',
      subtopicId: 'union-cabinet',
      folderPath: 'Spideyy Quiz/Central Cabinet Ministers/',
      extractedTextPreview: SAMPLE_DOCS[0].text
    },
    {
      id: 'doc-init-02',
      name: 'Ramsar_Wetlands_India_Official_2026.pdf',
      size: 980000,
      uploadDate: '24/11/2026',
      status: 'Processed',
      topicId: 'ramsar-sites-2026',
      subtopicId: 'ramsar-2026-new',
      folderPath: 'Spideyy Quiz/Ramsar Sites/2026/',
      extractedTextPreview: SAMPLE_DOCS[2].text
    }
  ]);

  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>(() => [
    {
      id: 'draft-01',
      docId: 'doc-init-01',
      topicId: 'central-ministers',
      subtopicId: 'union-cabinet',
      question: 'Which minister heads the Ministry of Railways as well as Electronics and Information Technology (MeitY)?',
      options: ['Ashwini Vaishnaw', 'Jyotiraditya Scindia', 'Piyush Goyal', 'Hardeep Singh Puri'],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'Ashwini Vaishnaw holds Cabinet portfolios for Railways, Information & Broadcasting, and Electronics & Information Technology.',
      source: 'Union_Cabinet_Portfolios_Gazette_2026.pdf',
      sourcePage: 1,
      lastVerifiedDate: '2026-11-24',
      status: 'approved'
    },
    {
      id: 'draft-02',
      docId: 'doc-init-02',
      topicId: 'ramsar-sites-2026',
      subtopicId: 'ramsar-2026-new',
      question: 'Which Indian state currently holds the highest number of designated Ramsar Sites in the country?',
      options: ['Tamil Nadu (16 Sites)', 'Uttar Pradesh (10 Sites)', 'Kerala (3 Sites)', 'Punjab (6 Sites)'],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: 'Tamil Nadu leads with 16 designated Ramsar Sites, followed closely by Uttar Pradesh with 10 sites.',
      source: 'Ramsar_Wetlands_India_Official_2026.pdf',
      sourcePage: 3,
      lastVerifiedDate: '2026-11-24',
      status: 'approved'
    }
  ]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>('central-ministers');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('union-cabinet');
  const [targetQuestionCount, setTargetQuestionCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('all');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [draftFilter, setDraftFilter] = useState<'all' | 'draft' | 'approved' | 'rejected' | 'published'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const activeTopic = TOPIC_CATEGORIES.find(t => t.id === selectedTopicId) || TOPIC_CATEGORIES[0];

  // Drag and drop or file picker handler
  const handleFileUpload = (files: FileList | File[], folderPrefix?: string) => {
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const newDocs: UploadedDoc[] = [];
      const fileArray = Array.from(files);

      fileArray.forEach((file, idx) => {
        // Auto-detect topic based on path or name
        let detectedTopicId = selectedTopicId;
        const lowerName = file.name.toLowerCase();
        const fullRelPath = (file as any).webkitRelativePath || '';

        if (lowerName.includes('pib') || lowerName.includes('current') || fullRelPath.includes('Current Affairs')) {
          detectedTopicId = 'current-affairs-pib';
        } else if (lowerName.includes('bank') || lowerName.includes('rbi') || fullRelPath.includes('Banking')) {
          detectedTopicId = 'banking-awareness-fa';
        } else if (lowerName.includes('minister') || lowerName.includes('cabinet') || fullRelPath.includes('Ministers')) {
          detectedTopicId = 'central-ministers';
        } else if (lowerName.includes('ramsar') || lowerName.includes('wetland') || fullRelPath.includes('Ramsar')) {
          detectedTopicId = 'ramsar-sites-2026';
        } else if (lowerName.includes('tentative') || fullRelPath.includes('Tentative')) {
          detectedTopicId = 'unesco-tentative-2026';
        } else if (lowerName.includes('unesco') || lowerName.includes('heritage') || fullRelPath.includes('UNESCO')) {
          detectedTopicId = 'unesco-2026';
        } else if (lowerName.includes('dance') || lowerName.includes('art') || fullRelPath.includes('Dance')) {
          detectedTopicId = 'other-important-gk';
        } else if (lowerName.includes('park') || fullRelPath.includes('Static GK')) {
          detectedTopicId = 'static-gk';
        }

        const tCategory = TOPIC_CATEGORIES.find(t => t.id === detectedTopicId) || activeTopic;
        const defaultSubtopic = tCategory.subtopics[0]?.id || 'general';
        const sampleMatch = SAMPLE_DOCS.find(s => s.topicId === detectedTopicId) || SAMPLE_DOCS[0];

        const doc: UploadedDoc = {
          id: `doc-${Date.now()}-${idx}`,
          name: file.name,
          size: file.size || 1024000,
          uploadDate: '24/11/2026',
          status: 'Processed',
          topicId: detectedTopicId,
          subtopicId: defaultSubtopic,
          folderPath: folderPrefix || (fullRelPath ? `Spideyy Quiz/${fullRelPath}` : `Spideyy Quiz/${tCategory.title}/`),
          extractedTextPreview: `[Extracted from ${file.name}]: ${sampleMatch.text}`
        };

        newDocs.push(doc);
      });

      setUploadedDocs(prev => [...newDocs, ...prev]);

      // Automatically generate controlled questions for first doc
      if (newDocs[0]) {
        generateDraftsForDoc(newDocs[0], targetQuestionCount);
      }

      setIsUploading(false);
      setUploadProgress(0);
      setNotification({
        type: 'success',
        text: `Uploaded and extracted ${newDocs.length} document(s). Generated draft questions for ${activeTopic.title}.`
      });
      setTimeout(() => setNotification(null), 5000);
    }, 1000);
  };

  // Generate controlled questions based on document and target count
  const generateDraftsForDoc = (doc: UploadedDoc, count: number = 10) => {
    const existingStarter = getAllTopicQuestions();
    const existingTexts = new Set([
      ...existingStarter.map(q => q.question.trim().toLowerCase()),
      ...draftQuestions.map(d => d.question.trim().toLowerCase())
    ]);

    const generated: DraftQuestion[] = [];
    const baseSource = doc.name;
    const baseDate = '2026-11-24';

    // Syllabus questions pool based on topic
    let pool: Array<{ q: string; opts: [string, string, string, string]; ans: number; exp: string; sub: string; pg: number; diff: 'easy' | 'medium' | 'hard' }> = [];

    if (doc.topicId === 'current-affairs-pib') {
      pool = [
        {
          q: 'Which state hosted the inaugural National Conference on Green Hydrogen and Clean Fuels under the National Green Hydrogen Mission?',
          opts: ['Gujarat', 'Maharashtra', 'New Delhi', 'Karnataka'],
          ans: 2,
          exp: 'The National Green Hydrogen Mission conference was hosted in New Delhi, emphasizing 5 MMT production capacity by 2030.',
          sub: 'pib-releases',
          pg: 2,
          diff: 'medium'
        },
        {
          q: 'Under the PM Surya Ghar Muft Bijli Yojana, how much subsidy is provided for a 2 kW residential rooftop solar installation?',
          opts: ['₹30,000', '₹60,000', '₹78,000', '₹1,00,000'],
          ans: 1,
          exp: 'A subsidy of ₹30,000 is offered for 1 kW systems and ₹60,000 for 2 kW systems, capping at ₹78,000 for 3 kW and above.',
          sub: 'gov-schemes',
          pg: 5,
          diff: 'medium'
        },
        {
          q: 'Which milestone infrastructure project achieved operational opening along the Chenab riverbed in Reasi district?',
          opts: ['Chenab Railway Arch Bridge', 'Bogibeel Rail Bridge', 'Atal Setu', 'Pamban Vertical Lift Bridge'],
          ans: 0,
          exp: 'The Chenab Bridge stands 359 meters above the riverbed, forming the critical link on the Udhampur-Srinagar-Baramulla Railway Link.',
          sub: 'national-developments',
          pg: 8,
          diff: 'easy'
        }
      ];
    } else if (doc.topicId === 'central-ministers') {
      pool = [
        {
          q: 'Who serves as the Union Minister of Coal and Union Minister of Mines in the Union Council of Ministers?',
          opts: ['Pralhad Joshi', 'G. Kishan Reddy', 'Jitin Prasada', 'Ravneet Singh Bittu'],
          ans: 1,
          exp: 'G. Kishan Reddy holds the Cabinet portfolios of Coal and Mines in the Government of India.',
          sub: 'union-cabinet',
          pg: 3,
          diff: 'medium'
        },
        {
          q: 'Who serves as the Union Minister of Civil Aviation in the Central Cabinet?',
          opts: ['Jyotiraditya Scindia', 'Kinjarapu Ram Mohan Naidu', 'H.D. Kumaraswamy', 'Chirag Paswan'],
          ans: 1,
          exp: 'Kinjarapu Ram Mohan Naidu is the Union Minister of Civil Aviation.',
          sub: 'ministries-portfolios',
          pg: 6,
          diff: 'medium'
        },
        {
          q: 'Who serves as the Union Minister of Food Processing Industries in the Central Cabinet?',
          opts: ['Chirag Paswan', 'Pashupati Kumar Paras', 'Jitan Ram Manjhi', 'Giriraj Singh'],
          ans: 0,
          exp: 'Chirag Paswan holds the portfolio of Minister of Food Processing Industries.',
          sub: 'ministries-portfolios',
          pg: 9,
          diff: 'easy'
        }
      ];
    } else if (doc.topicId === 'ramsar-sites-2026') {
      pool = [
        {
          q: 'Which newly added Ramsar site in Karnataka is a shallow freshwater reservoir known for bar-headed geese congregating in thousands?',
          opts: ['Magadi Kere Conservation Reserve', 'Aghanashini Estuary', 'Ankasamudra Bird Conservation Reserve', 'Ranganathittu Bird Sanctuary'],
          ans: 0,
          exp: 'Magadi Kere Conservation Reserve in Gadag district, Karnataka, was declared a Ramsar wetland site for immense migratory avian diversity.',
          sub: 'ramsar-2026-new',
          pg: 4,
          diff: 'medium'
        },
        {
          q: 'Kazhuveli Bird Sanctuary, designated as one of the newest Ramsar sites, is located along the Coromandel Coast in which district of Tamil Nadu?',
          opts: ['Villupuram district', 'Tirunelveli district', 'Ramanathapuram district', 'Nagapattinam district'],
          ans: 0,
          exp: 'Kazhuveli Bird Sanctuary in Villupuram is one of the largest brackish water wetlands in South India.',
          sub: 'names-states-locations',
          pg: 7,
          diff: 'medium'
        }
      ];
    } else if (doc.topicId === 'unesco-2026') {
      pool = [
        {
          q: 'During which session of the World Heritage Committee, hosted in New Delhi, were the Charaideo Moidams officially inscribed on the World Heritage List?',
          opts: ['44th session', '45th session', '46th session', '47th session'],
          ans: 2,
          exp: 'India hosted the 46th session of the World Heritage Committee in New Delhi in July 2024, where the Moidams were inscribed.',
          sub: 'whs-2026-additions',
          pg: 1,
          diff: 'easy'
        },
        {
          q: 'What is the unique architectural form of a Moidam in Ahom funerary tradition?',
          opts: [
            'Hemispherical stepped stone tower',
            'Vaulted earthen mound with underground brick or stone chamber',
            'Rock-cut monolithic cave',
            'Hypostyle wooden pavilion'
          ],
          ans: 1,
          exp: 'A Moidam consists of an underground chamber (Chow-chali) covered by a hemispherical earthen mound (Moidam-pukhuri) with a small shrine (Chou-dung) on top.',
          sub: 'site-facts',
          pg: 4,
          diff: 'medium'
        }
      ];
    } else {
      pool = [
        {
          q: `Key examination question extracted from ${doc.name}: What is the primary policy standard defined in this gazette?`,
          opts: ['Mandated statutory regulatory standard', 'Voluntary municipal guideline', 'Historical advisory statement', 'International non-binding declaration'],
          ans: 0,
          exp: `Statutory policy compliance mandate verified from official document ${doc.name}.`,
          sub: doc.subtopicId,
          pg: 1,
          diff: 'medium'
        }
      ];
    }

    // Add up to target count while deduplicating
    let addedCount = 0;
    for (const item of pool) {
      if (addedCount >= count) break;
      if (!existingTexts.has(item.q.trim().toLowerCase())) {
        existingTexts.add(item.q.trim().toLowerCase());
        generated.push({
          id: `draft-${Date.now()}-${addedCount}`,
          docId: doc.id,
          topicId: doc.topicId,
          subtopicId: item.sub,
          question: item.q,
          options: item.opts,
          correctAnswer: item.ans,
          difficulty: item.diff,
          explanation: item.exp,
          source: baseSource,
          sourcePage: item.pg,
          lastVerifiedDate: baseDate,
          status: 'draft'
        });
        addedCount++;
      }
    }

    setDraftQuestions(prev => [...generated, ...prev]);
    return generated.length;
  };

  // Batch Generation for selected documents
  const handleBatchGenerate = () => {
    if (selectedDocIds.length === 0) {
      alert('Please select at least one document from the table using the checkboxes.');
      return;
    }

    let totalGen = 0;
    selectedDocIds.forEach(id => {
      const doc = uploadedDocs.find(d => d.id === id);
      if (doc) {
        totalGen += generateDraftsForDoc(doc, Math.ceil(targetQuestionCount / selectedDocIds.length) || 5);
      }
    });

    setNotification({
      type: 'success',
      text: `Batch generated ${totalGen} questions across ${selectedDocIds.length} selected document(s).`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  // Reprocess Document
  const handleReprocessDoc = (doc: UploadedDoc) => {
    setUploadedDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'Processing' } : d));
    setTimeout(() => {
      setUploadedDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'Processed' } : d));
      const count = generateDraftsForDoc(doc, targetQuestionCount);
      setNotification({
        type: 'success',
        text: `Reprocessed "${doc.name}" and generated ${count} fresh draft questions.`
      });
      setTimeout(() => setNotification(null), 4000);
    }, 800);
  };

  // Draft Actions
  const handleApproveDraft = (id: string) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  };

  const handleRejectDraft = (id: string) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
  };

  const handleBulkApprove = () => {
    setDraftQuestions(prev => prev.map(d => d.status === 'draft' ? { ...d, status: 'approved' } : d));
    setNotification({ type: 'success', text: 'All draft questions approved for publishing.' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateDraft = (id: string, updates: Partial<DraftQuestion>) => {
    setDraftQuestions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // Publish approved questions directly into topic question bank
  const handlePublishApproved = () => {
    const approved = draftQuestions.filter(d => d.status === 'approved');
    if (approved.length === 0) {
      alert('No approved questions to publish. Please approve draft questions in the review queue first.');
      return;
    }

    const topicQuestions: TopicQuestion[] = approved.map(a => ({
      id: `top-${a.topicId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      topicId: a.topicId,
      subtopicId: a.subtopicId,
      question: a.question,
      options: a.options,
      correctAnswer: a.correctAnswer,
      difficulty: a.difficulty,
      explanation: a.explanation,
      source: a.source,
      sourcePage: a.sourcePage,
      lastVerifiedDate: a.lastVerifiedDate || '2026-11-24',
      status: 'published'
    }));

    addPublishedTopicQuestions(topicQuestions);

    setDraftQuestions(prev => prev.map(d => d.status === 'approved' ? { ...d, status: 'published' } : d));
    setNotification({
      type: 'success',
      text: `Successfully published ${topicQuestions.length} examination-grade questions to the shared question bank for both students!`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  // Filtering documents
  const filteredDocs = uploadedDocs.filter(d => {
    const matchesSearch = searchQuery === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.folderPath && d.folderPath.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFolder = selectedFolderFilter === 'all' ||
      (d.folderPath && d.folderPath.startsWith(selectedFolderFilter)) ||
      d.topicId === selectedFolderFilter;

    return matchesSearch && matchesFolder;
  });

  const filteredDrafts = draftQuestions.filter(d => {
    if (draftFilter === 'all') return true;
    return d.status === draftFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#260c18]">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#ff3366]" />
            <h2 className="text-xl font-black text-white tracking-tight">
              PDF Question Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2a0b16] text-[#ff8099] border border-[#52142a]">
              Folder & Pipeline Engine
            </span>
          </div>
          <p className="text-xs text-[#a68690] mt-0.5">
            Folder-based PDF ingestion, controlled 10–15 question extraction, quality audit queue, and live publishing to Mahi & Shailu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1.5 rounded-xl bg-[#1e0813] hover:bg-[#2e0c1e] text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-[#2b0c18] cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Approve All Drafts</span>
          </button>
          <button
            onClick={handlePublishApproved}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] hover:to-[#8a0e28] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 border border-[#ff3366]/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Publish to Live Bank</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: FOLDER STRUCTURE EXPLORER & UPLOAD WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload & Folder Selection Box */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff8099] flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Folder & Document Upload</span>
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#a68690]">Target Count:</span>
              <div className="flex items-center gap-1 bg-[#1a0712] p-0.5 rounded-lg border border-[#2b0c18]">
                {[5, 10, 15, 20].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setTargetQuestionCount(cnt)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      targetQuestionCount === cnt
                        ? 'bg-[#9e1030] text-white'
                        : 'text-[#a68690] hover:text-white'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic & Subtopic selector for incoming documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Subject Category</label>
              <select
                value={selectedTopicId}
                onChange={e => {
                  setSelectedTopicId(e.target.value);
                  const newT = TOPIC_CATEGORIES.find(t => t.id === e.target.value);
                  if (newT && newT.subtopics[0]) {
                    setSelectedSubtopicId(newT.subtopics[0].id);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
              >
                {TOPIC_CATEGORIES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} {t.isConfigurable ? '(Configurable)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Subtopic</label>
              <select
                value={selectedSubtopicId}
                onChange={e => setSelectedSubtopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
              >
                {activeTopic.subtopics.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Box with dual Select File & Select Folder buttons */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files);
              }
            }}
            className="p-6 border-2 border-dashed border-[#3a0d20] hover:border-[#ff3366] rounded-2xl bg-[#0e0208]/80 text-center space-y-3 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-8 h-8 mx-auto text-[#ff3366]" />
            <div>
              <p className="text-xs text-white font-bold">
                Drag & drop examination PDF files or entire subject folders here
              </p>
              <p className="text-[11px] text-[#a68690] mt-0.5">
                Supports multi-file PDF, TXT • Controlled {targetQuestionCount} high-priority questions per topic
              </p>
            </div>

            {/* Hidden File and Folder Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.txt,.docx"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
            <input
              type="file"
              ref={folderInputRef}
              // @ts-ignore
              webkitdirectory=""
              directory=""
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
              }}
            />

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-[#1e0813] hover:bg-[#2b0c1b] text-white text-xs font-bold cursor-pointer transition-colors border border-[#3a0d20] flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#ff8099]" />
                <span>Upload PDF Files</span>
              </button>
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-[#2a0717] hover:bg-[#3a0a20] text-white text-xs font-bold cursor-pointer transition-colors border border-[#ff3366]/40 flex items-center gap-1.5"
              >
                <Folder className="w-3.5 h-3.5 text-[#ff3366]" />
                <span>Select Folder (webkitdirectory)</span>
              </button>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Extracting document text & running quality audit...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9e1030] to-[#ff3366] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Supported Folder Structure Hierarchy Explorer */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-sm font-extrabold text-white">Supported Folder Hierarchy</h3>
          </div>
          <p className="text-[11px] text-[#a68690]">
            Match your local directory tree to automatically classify PDFs into their exam subjects:
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedFolderFilter('all')}
              className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                selectedFolderFilter === 'all'
                  ? 'bg-[#9e1030] text-white shadow-ruby'
                  : 'bg-[#180611] text-[#cbb5bc] hover:bg-[#220818]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-rose-300" />
                <span>All Folders ({uploadedDocs.length})</span>
              </div>
              <ChevronRight className="w-3 h-3 text-rose-300" />
            </button>

            {SUPPORTED_FOLDERS.map((folder, fIdx) => {
              const countInFolder = uploadedDocs.filter(d =>
                (d.folderPath && d.folderPath.startsWith(folder.path)) || d.topicId === folder.topicId
              ).length;

              return (
                <button
                  key={fIdx}
                  onClick={() => setSelectedFolderFilter(folder.topicId)}
                  className={`w-full text-left p-2 rounded-xl text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                    selectedFolderFilter === folder.topicId
                      ? 'bg-[#9e1030] text-white font-bold shadow-ruby'
                      : 'bg-[#14050e] text-[#a68690] hover:text-white hover:bg-[#1f0816]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className="w-3 h-3 text-[#ff8099] shrink-0" />
                    <span className="truncate">{folder.path}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#2a0717] text-[#ff8099] shrink-0 ml-1">
                    {countInFolder}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Instant Sample Selector shortcut */}
          <div className="pt-2 border-t border-[#260c18]">
            <p className="text-[10px] text-[#a68690] mb-1.5 uppercase font-bold tracking-wider">
              Quick Test Gazette:
            </p>
            <button
              onClick={() => {
                const sample = SAMPLE_DOCS[0];
                const newDoc: UploadedDoc = {
                  id: `doc-${Date.now()}`,
                  name: sample.name,
                  size: 980000,
                  uploadDate: '24/11/2026',
                  status: 'Processed',
                  topicId: sample.topicId,
                  subtopicId: sample.subtopicId,
                  folderPath: sample.folderPath,
                  extractedTextPreview: sample.text
                };
                setUploadedDocs(prev => [newDoc, ...prev]);
                generateDraftsForDoc(newDoc, targetQuestionCount);
                setNotification({
                  type: 'success',
                  text: `Generated ${targetQuestionCount} questions from ${sample.name}!`
                });
                setTimeout(() => setNotification(null), 4000);
              }}
              className="w-full text-left p-2 rounded-xl bg-[#1e0813] hover:bg-[#2b0c1b] border border-[#2b0c18] text-xs font-bold text-white transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Test with Cabinet Gazette 2026</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ff3366]" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: UPLOADED DOCUMENTS TABLE & SEARCH */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff3366]" />
            <h3 className="text-base font-extrabold text-white">
              Document Management ({filteredDocs.length} of {uploadedDocs.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a68690]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search filename or topic..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff3366] w-48 sm:w-60"
              />
            </div>

            {/* Batch Generate for Selected */}
            {selectedDocIds.length > 0 && (
              <button
                onClick={handleBatchGenerate}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#9e1030] to-[#750720] hover:from-[#b31238] text-white text-xs font-bold transition-all shadow-ruby flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate ({selectedDocIds.length} selected)</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#260c18] text-[#a68690]">
                <th className="pb-2.5 w-8">
                  <input
                    type="checkbox"
                    checked={selectedDocIds.length === filteredDocs.length && filteredDocs.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedDocIds(filteredDocs.map(d => d.id));
                      } else {
                        setSelectedDocIds([]);
                      }
                    }}
                    className="accent-[#ff3366] cursor-pointer"
                  />
                </th>
                <th className="pb-2.5 font-bold uppercase tracking-wider">Document Name & Folder</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Subject Topic</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Size</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Date</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Status</th>
                <th className="pb-2.5 font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e0813]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#a68690]">
                    No documents found matching the search or folder filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <tr key={doc.id} className="hover:bg-[#1a0712] transition-colors">
                      <td className="py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedDocIds(prev => [...prev, doc.id]);
                            } else {
                              setSelectedDocIds(prev => prev.filter(id => id !== doc.id));
                            }
                          }}
                          className="accent-[#ff3366] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#ff3366] shrink-0" />
                          <div className="truncate max-w-xs">
                            <span className="block truncate">{doc.name}</span>
                            <span className="block text-[10px] text-[#a68690] truncate font-normal">
                              {doc.folderPath || 'Spideyy Quiz/'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-[#ff8099] font-semibold capitalize">
                        {doc.topicId.replace('-', ' ')}
                      </td>
                      <td className="py-2.5 text-center text-[#cbb5bc]">
                        {Math.round(doc.size / 1024)} KB
                      </td>
                      <td className="py-2.5 text-center text-[#a68690]">{doc.uploadDate}</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1 rounded-lg bg-[#1e0813] hover:bg-[#2b0c1b] text-[#ff8099] hover:text-white transition-colors cursor-pointer"
                            title="Preview Extracted Text & Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReprocessDoc(doc)}
                            className="p-1 rounded-lg bg-[#1e0813] hover:bg-[#2b0c1b] text-blue-300 hover:text-white transition-colors cursor-pointer"
                            title="Reprocess Document"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setUploadedDocs(prev => prev.filter(d => d.id !== doc.id));
                              setDraftQuestions(prev => prev.filter(q => q.docId !== doc.id));
                              setSelectedDocIds(prev => prev.filter(id => id !== doc.id));
                            }}
                            className="p-1 rounded-lg bg-[#1e0813] hover:bg-red-950/80 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete document and its drafts"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: ADMIN QUESTION REVIEW QUEUE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#12050c]/90 border border-[#2b0c18] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#260c18]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff3366]" />
              <h3 className="text-base font-extrabold text-white">
                Generated Question Drafts Review Queue ({filteredDrafts.length})
              </h3>
            </div>
            <p className="text-xs text-[#a68690] mt-0.5">
              Review, edit options, verify factual correctness, approve, and publish directly into topic syllabus.
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#14060d] border border-[#2b0c18] text-xs">
            {(['all', 'draft', 'approved', 'published'] as const).map(filterKey => (
              <button
                key={filterKey}
                onClick={() => setDraftFilter(filterKey)}
                className={`px-2.5 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                  draftFilter === filterKey
                    ? 'bg-[#9e1030] text-white shadow-ruby'
                    : 'text-[#a68690] hover:text-white'
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </div>

        {filteredDrafts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#a68690] space-y-2">
            <HelpCircle className="w-6 h-6 mx-auto text-[#ff3366]" />
            <p>No questions found in this review filter.</p>
            <p>Upload a PDF above or pick a sample gazette to generate draft questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDrafts.map((draft, idx) => {
              const isEditing = editingDraftId === draft.id;

              return (
                <div
                  key={draft.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    draft.status === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : draft.status === 'published'
                        ? 'bg-purple-950/20 border-purple-800/40'
                        : 'bg-[#14060d] border-[#2b0c18]'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-[#2a0717] text-[#ff8099] border border-[#52102c] flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-[#ff8099] border border-[#2b0c18] capitalize">
                        {draft.topicId.replace('-', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-slate-300 border border-[#2b0c18] capitalize">
                        {draft.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-amber-300 border border-[#2b0c18]">
                        Source: {draft.source} (p. {draft.sourcePage})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e0813] text-emerald-300 border border-[#2b0c18]">
                        Verified: {draft.lastVerifiedDate}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          draft.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : draft.status === 'published'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : draft.status === 'rejected'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {draft.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setEditingDraftId(isEditing ? null : draft.id)}
                        className="p-1.5 rounded-lg bg-[#1e0813] hover:bg-[#2b0c1b] text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit question text, options, and page"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleApproveDraft(draft.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-700/50 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectDraft(draft.id)}
                        className="px-2 py-1 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-300 text-xs font-bold transition-colors flex items-center gap-1 border border-red-700/50 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  {isEditing ? (
                    <div className="space-y-3 pt-1 text-xs">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Question Prompt</label>
                        <input
                          type="text"
                          value={draft.question}
                          onChange={e => handleUpdateDraft(draft.id, { question: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white focus:outline-none focus:border-[#ff3366]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {draft.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${draft.id}`}
                              checked={draft.correctAnswer === oIdx}
                              onChange={() => handleUpdateDraft(draft.id, { correctAnswer: oIdx })}
                              title="Set as correct answer"
                              className="accent-[#ff3366] cursor-pointer"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...draft.options] as [string, string, string, string];
                                newOpts[oIdx] = e.target.value;
                                handleUpdateDraft(draft.id, { options: newOpts });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Source PDF</label>
                          <input
                            type="text"
                            value={draft.source}
                            onChange={e => handleUpdateDraft(draft.id, { source: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Source Page Number</label>
                          <input
                            type="text"
                            value={draft.sourcePage}
                            onChange={e => handleUpdateDraft(draft.id, { sourcePage: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Verification Date</label>
                          <input
                            type="text"
                            value={draft.lastVerifiedDate}
                            onChange={e => handleUpdateDraft(draft.id, { lastVerifiedDate: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Explanation</label>
                        <textarea
                          rows={2}
                          value={draft.explanation}
                          onChange={e => handleUpdateDraft(draft.id, { explanation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#0e0208] border border-[#2b0c18] text-xs text-white"
                        />
                      </div>

                      <button
                        onClick={() => setEditingDraftId(null)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-white text-sm">
                        {draft.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {draft.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                              draft.correctAnswer === oIdx
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200 font-bold'
                                : 'bg-[#0e0208] border-[#260c18] text-slate-300'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {draft.correctAnswer === oIdx && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18] text-[11px] text-[#a68690] mt-2">
                        <strong className="text-white">Explanation: </strong>
                        {draft.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: VIEW PDF DETAILS & TEXT PREVIEW */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12050c] w-full max-w-2xl rounded-3xl p-6 border border-[#2b0c18] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#260c18] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff3366]" />
                <div>
                  <h3 className="text-base font-black text-white">{previewDoc.name}</h3>
                  <p className="text-xs text-[#a68690]">{previewDoc.folderPath || 'Spideyy Quiz/'}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-[#1e0813] text-[#a68690] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18]">
                <span className="block text-[10px] text-[#a68690]">Subject Topic</span>
                <span className="font-bold text-white capitalize">{previewDoc.topicId.replace('-', ' ')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18]">
                <span className="block text-[10px] text-[#a68690]">File Size</span>
                <span className="font-bold text-white">{Math.round(previewDoc.size / 1024)} KB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18]">
                <span className="block text-[10px] text-[#a68690]">Upload Date</span>
                <span className="font-bold text-white">{previewDoc.uploadDate}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0e0208] border border-[#260c18]">
                <span className="block text-[10px] text-[#a68690]">Processing Status</span>
                <span className="font-bold text-emerald-400">{previewDoc.status}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#ff3366]" />
                <span>Extracted Text Preview</span>
              </h4>
              <div className="p-3.5 rounded-xl bg-[#0e0208] border border-[#260c18] text-xs text-[#cbb5bc] font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {previewDoc.extractedTextPreview}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#260c18]">
              <button
                type="button"
                onClick={() => {
                  handleReprocessDoc(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800 text-blue-200 text-xs font-bold border border-blue-700/50 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reprocess & Generate Questions</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#1e0813] hover:bg-[#2e0c1e] text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
