import type { Topic, TopicQuestion } from '../types/quiz';

export const TOPIC_CATEGORIES = [
  {
    id: 'static-gk',
    title: 'Static GK',
    description: 'Core foundational general knowledge, starting with Indian National Parks and key geographical landmarks.',
    icon: 'Trees',
    category: 'static-gk' as const,
    subtopics: [
      { id: 'national-parks', title: 'National Parks of India', description: 'Comprehensive coverage of India\'s 109 National Parks across 30 States & UTs.', questionCount: 10 },
      { id: 'wildlife-reserves', title: 'Biosphere & Tiger Reserves', description: 'Key conservation zones and ecological hotspots across India.', questionCount: 0 },
      { id: 'heritage-culture', title: 'Heritage & Culture', description: 'UNESCO World Heritage Sites, classical dances, and monuments.', questionCount: 0 }
    ],
    totalQuestions: 10,
    isPublished: true,
    publishedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'current-affairs',
    title: 'Current Affairs',
    description: 'Curated, examination-tested current affairs covering major national and international developments with dated sources.',
    icon: 'Globe2',
    category: 'current-affairs' as const,
    subtopics: [
      { id: 'national-events', title: 'Important National Events', description: 'Major policy decisions, infrastructure milestones, and national developments.', questionCount: 2 },
      { id: 'international-events', title: 'Important International Events', description: 'Global summits, bilateral treaties, and multilateral forums.', questionCount: 1 },
      { id: 'government-schemes', title: 'Government Schemes', description: 'Flagship welfare, infrastructure, and financial inclusion programs.', questionCount: 1 },
      { id: 'awards-appointments', title: 'Awards and Appointments', description: 'Civilian honors, literary awards, and constitutional appointments.', questionCount: 1 },
      { id: 'sports-events', title: 'Sports & Important Events', description: 'Olympics, world championships, and major athletic milestones.', questionCount: 1 }
    ],
    totalQuestions: 6,
    isPublished: true,
    publishedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'banking-awareness',
    title: 'Banking Awareness',
    description: 'Fundamental principles of banking, RBI regulatory framework, monetary policy, and modern financial institutions.',
    icon: 'Landmark',
    category: 'banking-awareness' as const,
    subtopics: [
      { id: 'banking-fundamentals', title: 'Banking Fundamentals', description: 'Core banking functions, deposit types, and credit operations.', questionCount: 1 },
      { id: 'rbi-monetary-policy', title: 'RBI and Monetary Policy', description: 'Policy rates, MPC composition, liquidity adjustment facilities (LAF).', questionCount: 1 },
      { id: 'banking-terminology', title: 'Banking Terminology', description: 'NPA norms, CRR, SLR, CASA, and Basel regulatory capital frameworks.', questionCount: 2 },
      { id: 'financial-institutions', title: 'Financial Institutions', description: 'Apex development financial institutions: NABARD, SIDBI, EXIM, NHB.', questionCount: 1 },
      { id: 'banking-developments', title: 'Important Banking Developments', description: 'Digital Rupee (CBDC), UPI, account aggregator framework.', questionCount: 1 }
    ],
    totalQuestions: 6,
    isPublished: true,
    publishedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'central-ministers',
    title: 'Central Cabinet Ministers',
    description: 'Verified portfolios and portfolios of the Union Council of Ministers of India based on official gazette notifications.',
    icon: 'Award',
    category: 'central-ministers' as const,
    subtopics: [
      { id: 'prime-minister', title: 'Prime Minister & Portfolios', description: 'Atomic energy, space, and unallocated policy portfolios.', questionCount: 0 },
      { id: 'union-cabinet', title: 'Union Cabinet Ministers', description: 'Senior cabinet portfolios: Defence, Home, Finance, External Affairs.', questionCount: 4 },
      { id: 'ministries-portfolios', title: 'Ministries and Portfolios', description: 'Infrastructure, education, commerce, and railways leadership.', questionCount: 3 },
      { id: 'appointments-changes', title: 'Important Appointments & Changes', description: 'Key ministerial appointments and portfolio reallocations.', questionCount: 0 }
    ],
    totalQuestions: 7,
    isPublished: true,
    publishedAt: '2026-11-18T00:00:00.000Z'
  },
  {
    id: 'ramsar-sites',
    title: 'Ramsar Sites',
    description: 'Comprehensive study of Wetlands of International Importance designated in India under the 1971 Ramsar Convention.',
    icon: 'Waves',
    category: 'ramsar-sites' as const,
    subtopics: [
      { id: 'ramsar-overview', title: 'Ramsar Sites in India', description: 'Convention origin, criteria, and national wetland conservation profile.', questionCount: 1 },
      { id: 'state-wise-ramsar', title: 'State-wise Ramsar Sites', description: 'Distribution across Indian states and union territories.', questionCount: 1 },
      { id: 'important-wetlands', title: 'Important Wetlands', description: 'Largest, smallest, and highest-altitude designated wetlands.', questionCount: 2 },
      { id: 'designation-facts', title: 'Designation Details & Montreux Record', description: 'Montreux Record status, historical listings, and World Wetlands Day.', questionCount: 2 }
    ],
    totalQuestions: 6,
    isPublished: true,
    publishedAt: '2026-11-18T00:00:00.000Z'
  }
];

export const STARTER_TOPIC_QUESTIONS: TopicQuestion[] = [
  // --------------------------------------------------------------------------
  // TOPIC 1: STATIC GK — SUBTOPIC: NATIONAL PARKS
  // --------------------------------------------------------------------------
  {
    id: 'top-sgk-np-01',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which is the oldest National Park in India, originally established in 1936 as Hailey National Park?',
    options: [
      'Jim Corbett National Park (Uttarakhand)',
      'Kaziranga National Park (Assam)',
      'Kanha National Park (Madhya Pradesh)',
      'Gir National Park (Gujarat)'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Jim Corbett National Park in Nainital/Pauri Garhwal district of Uttarakhand was established in 1936 as Hailey National Park. It was India\'s first national park and the inaugural site of Project Tiger in 1973.',
    source: 'National Tiger Conservation Authority (NTCA) / MoEFCC',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-02',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which UNESCO World Heritage National Park in Assam holds the world\'s largest population of the Great Indian One-Horned Rhinoceros?',
    options: [
      'Manas National Park',
      'Kaziranga National Park',
      'Dibru-Saikhowa National Park',
      'Orang National Park'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Kaziranga National Park in Assam, located on the fertile floodplains of the Brahmaputra River, hosts roughly two-thirds of the world\'s Great Indian One-Horned Rhinoceros population.',
    source: 'Assam Forest Department / UNESCO World Heritage Centre',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-03',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Keibul Lamjao National Park, famous as the world\'s only floating national park and home to the endangered Sangai (dancing deer), is situated on which water body?',
    options: [
      'Wular Lake',
      'Loktak Lake (Manipur)',
      'Chilika Lake',
      'Kolleru Lake'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Keibul Lamjao National Park is situated on Loktak Lake in Bishnupur district, Manipur. It is characterized by floating decomposed plant matter known locally as phumdis.',
    source: 'Manipur Forest Department / Ramsar Sites Information Service',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-04',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which is the largest National Park in India by geographical area, globally renowned as a prime habitat for the elusive Snow Leopard?',
    options: [
      'Desert National Park (Rajasthan)',
      'Hemis National Park (Ladakh)',
      'Gangotri National Park (Uttarakhand)',
      'Namdapha National Park (Arunachal Pradesh)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Hemis National Park in eastern Ladakh spans approximately 4,400 sq km, making it India\'s largest national park. It sits in the high-altitude Trans-Himalayas and is famous for high snow leopard density.',
    source: 'Department of Wildlife Protection, UT of Ladakh',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-05',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Gir National Park in Gujarat is the only natural wild sanctuary in the world for which apex predator?',
    options: [
      'Bengal Tiger',
      'Asiatic Cheetah',
      'Asiatic Lion',
      'Snow Leopard'
    ],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Gir National Park and Wildlife Sanctuary in Saurashtra, Gujarat, is the sole remaining natural wild habitat of the Asiatic Lion (Panthera leo persica).',
    source: 'Gujarat Forest Department Wildlife Wing',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-06',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Sundarbans National Park in West Bengal is formed by the confluence of which major river delta systems?',
    options: [
      'Ganga, Brahmaputra, and Meghna',
      'Mahanadi and Baitarani',
      'Godavari and Krishna',
      'Indus and Sutlej'
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Sundarbans is the world\'s largest mangrove delta formed by the sediment of the Ganga, Brahmaputra, and Meghna rivers, famous for tidal Royal Bengal Tigers and estuarine saltwater crocodiles.',
    source: 'West Bengal Forest Directorate / UNESCO',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-07',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which national park in Madhya Pradesh is famous for saving the hard-ground swamp deer (Barasingha) and introducing "Bhoorsingh the Barasingha" as its official mascot?',
    options: [
      'Bandhavgarh National Park',
      'Kanha National Park',
      'Pench National Park',
      'Panna National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Kanha National Park saved the hard-ground swamp deer (Rucervus duvaucelii branderi) from near extinction and became the first tiger reserve in India to introduce an official mascot, Bhoorsingh.',
    source: 'Madhya Pradesh Tiger Foundation Society',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-08',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Silent Valley National Park in the Nilgiri Hills of Kerala is nourished by which river and famous for which endangered primate?',
    options: [
      'Kunthipuzha River & Lion-Tailed Macaque',
      'Periyar River & Nilgiri Tahr',
      'Pamba River & Indian Pangolin',
      'Chaliyar River & Slender Loris'
    ],
    correctAnswer: 0,
    difficulty: 'hard',
    explanation: 'Silent Valley National Park in Palakkad district, Kerala, is drained by the pristine Kunthipuzha River and protects the largest viable wild population of the endangered Lion-tailed Macaque.',
    source: 'Kerala Department of Forests and Wildlife',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-09',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which national park in Sikkim was inscribed in 2016 as India\'s first and only UNESCO "Mixed" World Heritage Site (for both natural and cultural significance)?',
    options: [
      'Singalila National Park',
      'Khangchendzonga (Kanchenjunga) National Park',
      'Neora Valley National Park',
      'Nanda Devi National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Khangchendzonga National Park covers the third highest peak on Earth (Mt. Kanchenjunga) and sacred Buddhist Beyul cultural sites, making it India\'s unique UNESCO Mixed World Heritage Site.',
    source: 'UNESCO World Heritage Committee / Sikkim Forests',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-sgk-np-10',
    topicId: 'static-gk',
    subtopicId: 'national-parks',
    question: 'Which is the smallest National Park in India by land area, measuring approximately 0.03 square kilometers (3 hectares)?',
    options: [
      'Middle Button Island National Park',
      'South Button Island National Park (Andaman & Nicobar Islands)',
      'North Button Island National Park',
      'Guindy National Park (Tamil Nadu)'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'South Button Island National Park in the Andaman and Nicobar Islands is India\'s smallest national park with an area of about 0.03 sq km, famed for pristine shallow-water coral reefs.',
    source: 'Botanical Survey of India / MoEFCC ENVIS',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },

  // --------------------------------------------------------------------------
  // TOPIC 2: CURRENT AFFAIRS
  // --------------------------------------------------------------------------
  {
    id: 'top-ca-nat-01',
    topicId: 'current-affairs',
    subtopicId: 'national-events',
    question: 'What is the name of the strategic 14.15-kilometer twin-tube all-weather road tunnel designed to provide seamless connectivity between Srinagar and Leh?',
    options: [
      'Atal Tunnel',
      'Zojila Tunnel',
      'Sela Tunnel',
      'Shinku La Tunnel'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The Zojila Tunnel beneath the Zojila Pass (at 11,578 ft elevation) links Baltal and Minamarg on NH-1, cutting travel time across the pass from over 3 hours to approximately 15–20 minutes with year-round military and civilian transit.',
    source: 'Ministry of Road Transport and Highways (MoRTH), NHIDCL',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ca-nat-02',
    topicId: 'current-affairs',
    subtopicId: 'national-events',
    question: 'Which launch vehicle of ISRO successfully delivered Chandrayaan-3 into translunar orbit before its historic soft landing near the lunar south pole?',
    options: [
      'PSLV-C56',
      'LVM3-M4',
      'GSLV-F12',
      'SSLV-D2'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'ISRO\'s heavy-lift LVM3-M4 (Launch Vehicle Mark-3, nicknamed \'Fat Boy\') launched Chandrayaan-3 from SDSC SHAR Sriharikota on July 14, 2023, preceding the Vikram lander\'s touchdown on August 23, 2023.',
    source: 'Indian Space Research Organisation (ISRO) Official Mission Log',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ca-sch-01',
    topicId: 'current-affairs',
    subtopicId: 'government-schemes',
    question: 'Under the PM-Surya Ghar: Muft Bijli Yojana launched in 2024, how many households are targeted to receive rooftop solar systems offering up to 300 units of free power each month?',
    options: [
      '25 Lakh households',
      '50 Lakh households',
      '1 Crore (10 Million) households',
      '3 Crore households'
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'The Union Cabinet approved the PM-Surya Ghar: Muft Bijli Yojana with an outlay of ₹75,021 crore to install rooftop solar panels for 1 crore households, giving up to 300 units of free electricity every month.',
    source: 'Ministry of New and Renewable Energy (MNRE), Govt of India',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ca-awd-01',
    topicId: 'current-affairs',
    subtopicId: 'awards-appointments',
    question: 'Who were jointly conferred the prestigious 58th Jnanpith Award (announced in 2024 for exceptional lifelong literary excellence)?',
    options: [
      'Damodar Mauzo and Nilmani Phookan',
      'Jagadguru Rambhadracharya (Sanskrit) and Gulzar (Urdu)',
      'Amitav Ghosh and Vikram Seth',
      'Akkitham Achuthan Namboothiri and Krishna Sobti'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The 58th Jnanpith Award Selection Board awarded Sanskrit polymath and spiritual guru Jagadguru Rambhadracharya alongside eminent poet and filmmaker Gulzar (Sampooran Singh Kalra).',
    source: 'Bharatiya Jnanpith Selection Board Official Citation',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ca-spr-01',
    topicId: 'current-affairs',
    subtopicId: 'sports-events',
    question: 'Which city hosted the 33rd Summer Olympic Games in July–August 2024, introducing breakdancing as a competitive Olympic medal sport?',
    options: [
      'Tokyo, Japan',
      'Paris, France',
      'Los Angeles, USA',
      'Brisbane, Australia'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Paris, France, hosted the Games of the XXXIII Olympiad from 26 July to 11 August 2024, marking the centenary of the 1924 Paris Games and featuring an open river Seine opening ceremony.',
    source: 'International Olympic Committee (IOC)',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ca-int-01',
    topicId: 'current-affairs',
    subtopicId: 'international-events',
    question: 'Under whose national presidency was the 2024 G20 Leaders\' Summit held in Rio de Janeiro with the central theme "Building a Just World and a Sustainable Planet"?',
    options: [
      'India',
      'Brazil',
      'South Africa',
      'Indonesia'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Brazil assumed the G20 Presidency from India on 1 December 2023, hosting the Leaders\' Summit in Rio de Janeiro in November 2024, prior to handing over to South Africa.',
    source: 'G20 Secretariat / Ministry of External Affairs of Brazil and India',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },

  // --------------------------------------------------------------------------
  // TOPIC 3: BANKING AWARENESS
  // --------------------------------------------------------------------------
  {
    id: 'top-ba-mp-01',
    topicId: 'banking-awareness',
    subtopicId: 'rbi-monetary-policy',
    question: 'Under Section 45ZB of the Reserve Bank of India Act 1934, how many members comprise the Monetary Policy Committee (MPC) of India?',
    options: [
      '5 members (all from RBI)',
      '6 members (3 from RBI and 3 appointed by Central Government)',
      '7 members (4 from RBI and 3 from Finance Ministry)',
      '9 members (chaired by the Union Finance Minister)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The MPC consists of six members: three internal RBI officials (the Governor as ex-officio Chairperson, the Deputy Governor in charge of monetary policy, and one officer) and three external economists appointed by the Central Government.',
    source: 'Reserve Bank of India Act 1934, Section 45ZB',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ba-term-01',
    topicId: 'banking-awareness',
    subtopicId: 'banking-terminology',
    question: 'Under RBI\'s Master Circular on Prudential Norms, a loan or advance is classified as a Non-Performing Asset (NPA) if interest or principal instalment remains overdue for a period of more than:',
    options: [
      '30 days',
      '60 days',
      '90 days',
      '180 days'
    ],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'An asset becomes non-performing when it ceases to generate income. A loan account is classified as an NPA if interest and/or principal instalment remains overdue for a period exceeding 90 days in respect of a term loan.',
    source: 'RBI Master Circular - Prudential Norms on Income Recognition and Asset Classification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ba-inst-01',
    topicId: 'banking-awareness',
    subtopicId: 'financial-institutions',
    question: 'Which apex statutory development financial institution was established in 1982 on the recommendations of the B. Sivaraman Committee to foster agriculture and rural development?',
    options: [
      'Small Industries Development Bank of India (SIDBI)',
      'National Bank for Agriculture and Rural Development (NABARD)',
      'Export-Import Bank of India (EXIM Bank)',
      'National Housing Bank (NHB)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'NABARD was set up on 12 July 1982 under the NABARD Act 1981, following the recommendations of the CRAFICARD Committee headed by B. Sivaraman, transferring the agricultural credit functions of the RBI and ACD.',
    source: 'National Bank for Agriculture and Rural Development Act, 1981',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ba-fun-01',
    topicId: 'banking-awareness',
    subtopicId: 'banking-fundamentals',
    question: 'The Deposit Insurance and Credit Guarantee Corporation (DICGC), a 100% subsidiary of the RBI, currently insures each depositor in an insured commercial bank up to a ceiling of:',
    options: [
      '₹1,00,000',
      '₹2,00,000',
      '₹5,00,000',
      '₹10,00,000'
    ],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Under the DICGC (Amendment) Act, each depositor is insured up to a maximum of ₹5,00,000 (Rupees Five Lakh) for both principal and interest amount held by him in the same right and same capacity in an insured bank.',
    source: 'Deposit Insurance and Credit Guarantee Corporation (DICGC) Regulations',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ba-term-02',
    topicId: 'banking-awareness',
    subtopicId: 'banking-terminology',
    question: 'Which ratio stipulates the minimum proportion of Net Demand and Time Liabilities (NDTL) that commercial banks must maintain in liquid assets such as cash, gold, and unencumbered approved government securities?',
    options: [
      'Cash Reserve Ratio (CRR)',
      'Statutory Liquidity Ratio (SLR)',
      'Capital to Risk-Weighted Assets Ratio (CRAR)',
      'Marginal Standing Facility (MSF)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Statutory Liquidity Ratio (SLR) is mandated under Section 24 of the Banking Regulation Act 1949, requiring banks to maintain liquid assets (cash, gold, government securities) as a percentage of their NDTL.',
    source: 'Banking Regulation Act 1949, Section 24 / RBI Guidelines',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ba-dev-01',
    topicId: 'banking-awareness',
    subtopicId: 'banking-developments',
    question: 'What is the sovereign legal tender digital currency introduced in pilot phases by the Reserve Bank of India, functioning as a direct liability on the central bank\'s balance sheet?',
    options: [
      'BitRupee',
      'Central Bank Digital Currency (CBDC) / Digital Rupee (e₹)',
      'Unified Digital Payment (UDP)',
      'Sovereign Crypto Token (SCT)'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Digital Rupee (e₹) or CBDC is the digital form of currency notes issued by the Reserve Bank of India, launched in both Wholesale (e₹-W) and Retail (e₹-R) pilot segments.',
    source: 'Reserve Bank of India Concept Note on Central Bank Digital Currency (CBDC)',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },

  // --------------------------------------------------------------------------
  // TOPIC 4: CENTRAL CABINET MINISTERS
  // --------------------------------------------------------------------------
  {
    id: 'top-ccm-def-01',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    question: 'Who serves as the Union Minister of Defence in the Union Council of Ministers of India?',
    options: [
      'Amit Shah',
      'Rajnath Singh',
      'Nitin Gadkari',
      'Dr. S. Jaishankar'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Rajnath Singh is the Union Minister of Defence, responsible for the Department of Defence, Department of Military Affairs, and Armed Forces of India.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-hom-01',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    question: 'Who serves as the Union Minister of Home Affairs and Union Minister of Cooperation?',
    options: [
      'Amit Shah',
      'J.P. Nadda',
      'Kiren Rijiju',
      'Piyush Goyal'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Amit Shah holds the dual portfolios of Union Minister of Home Affairs and Union Minister of Cooperation in the Central Cabinet.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-fin-01',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    question: 'Who serves as the Union Minister of Finance and Union Minister of Corporate Affairs?',
    options: [
      'Smriti Irani',
      'Nirmala Sitharaman',
      'Nirmala Joshi',
      'Meenakshi Lekhi'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Nirmala Sitharaman serves as the Union Minister of Finance and Corporate Affairs, presenting successive Union Budgets of India.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-ext-01',
    topicId: 'central-ministers',
    subtopicId: 'union-cabinet',
    question: 'Who serves as the Union Minister of External Affairs, leading India\'s diplomatic relations and foreign policy globally?',
    options: [
      'Hardeep Singh Puri',
      'Dr. Subrahmanyam Jaishankar (S. Jaishankar)',
      'Mansukh Mandaviya',
      'Jyotiraditya Scindia'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Dr. S. Jaishankar, former Foreign Secretary and career diplomat, serves as the Union Minister of External Affairs of India.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-rlw-01',
    topicId: 'central-ministers',
    subtopicId: 'ministries-portfolios',
    question: 'Which Union Minister holds the key portfolios of Ministry of Railways, Ministry of Information & Broadcasting, and Ministry of Electronics & IT (MeitY)?',
    options: [
      'Ashwini Vaishnaw',
      'Piyush Goyal',
      'Anurag Thakur',
      'Dharmendra Pradhan'
    ],
    correctAnswer: 0,
    difficulty: 'medium',
    explanation: 'Ashwini Vaishnaw serves as the Union Minister for Railways, Minister of Information and Broadcasting, and Minister of Electronics and Information Technology.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-rdt-01',
    topicId: 'central-ministers',
    subtopicId: 'ministries-portfolios',
    question: 'Who serves as the Union Minister of Road Transport and Highways, recognized for rapid national expressway and highway corridor expansion?',
    options: [
      'Nitin Gadkari',
      'Giriraj Singh',
      'Gajendra Singh Shekhawat',
      'Sarbananda Sonowal'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Nitin Jairam Gadkari serves as the Union Minister for Road Transport and Highways.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ccm-edu-01',
    topicId: 'central-ministers',
    subtopicId: 'ministries-portfolios',
    question: 'Who serves as the Union Minister of Education in the Government of India, overseeing the implementation of the National Education Policy (NEP 2020)?',
    options: [
      'Ramesh Pokhriyal \'Nishank\'',
      'Dharmendra Pradhan',
      'Rajeev Chandrasekhar',
      'Chirag Paswan'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Dharmendra Pradhan serves as the Union Minister of Education, guiding primary, secondary, and higher education along with skilling initiatives.',
    source: 'Cabinet Secretariat of India, Official Gazette Notification',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },

  // --------------------------------------------------------------------------
  // TOPIC 5: RAMSAR SITES
  // --------------------------------------------------------------------------
  {
    id: 'top-ram-org-01',
    topicId: 'ramsar-sites',
    subtopicId: 'ramsar-overview',
    question: 'The intergovernmental convention on wetlands of international importance was signed on 2 February 1971 in which city, commemorated annually as World Wetlands Day?',
    options: [
      'Geneva, Switzerland',
      'Ramsar, Iran',
      'Bonn, Germany',
      'Stockholm, Sweden'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Convention on Wetlands of International Importance was adopted in the Iranian coastal city of Ramsar on 2 February 1971. February 2 is celebrated globally as World Wetlands Day.',
    source: 'Ramsar Convention Secretariat (www.ramsar.org)',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ram-sta-01',
    topicId: 'ramsar-sites',
    subtopicId: 'state-wise-ramsar',
    question: 'Which Indian State possesses the highest number of Ramsar-designated wetlands in the country (with 16 designated sites)?',
    options: [
      'Uttar Pradesh',
      'Tamil Nadu',
      'Kerala',
      'Gujarat'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Tamil Nadu leads India with 16 designated Ramsar sites (including Point Calimere, Vedanthangal, and Pichavaram), followed by Uttar Pradesh with 10 sites.',
    source: 'Ministry of Environment, Forest and Climate Change (MoEFCC), Govt of India',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ram-fst-01',
    topicId: 'ramsar-sites',
    subtopicId: 'designation-facts',
    question: 'Which two wetlands were designated in October 1981 as the very first Ramsar sites in India?',
    options: [
      'Wular Lake (J&K) and Loktak Lake (Manipur)',
      'Chilika Lake (Odisha) and Keoladeo National Park (Rajasthan)',
      'Sundarbans (West Bengal) and Sambhar Lake (Rajasthan)',
      'Vembanad-Kol (Kerala) and Kolleru Lake (Andhra Pradesh)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Chilika Lake in Odisha and Keoladeo Ghana National Park in Bharatpur, Rajasthan, were designated together as India\'s first two Ramsar Sites on 1 October 1981.',
    source: 'Ramsar Sites Information Service (RSIS) / MoEFCC',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ram-lrg-01',
    topicId: 'ramsar-sites',
    subtopicId: 'important-wetlands',
    question: 'Which is the largest Ramsar site by geographical surface area in India, spanning over 4,200 square kilometers?',
    options: [
      'Vembanad-Kol Wetland (Kerala)',
      'Sundarban Wetland (West Bengal)',
      'Chilika Lake (Odisha)',
      'Kolleru Lake (Andhra Pradesh)'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Sundarban Wetland in West Bengal covers approximately 4,230 square kilometers, making it the largest Ramsar site in India, supporting immense estuarine and mangrove biodiversity.',
    source: 'MoEFCC Wetland Division / Ramsar Information Sheet',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ram-sml-01',
    topicId: 'ramsar-sites',
    subtopicId: 'important-wetlands',
    question: 'Which is the smallest Ramsar wetland site in India by surface area, covering roughly 20 hectares (0.2 sq km) in the Sirmaur district of Himachal Pradesh?',
    options: [
      'Chandertal Wetland',
      'Renuka Wetland',
      'Pong Dam Lake',
      'Hokera Wetland'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Renuka Wetland in Sirmaur district of Himachal Pradesh is India\'s smallest Ramsar site, measuring about 20 hectares (0.2 sq km), recognized as a sacred freshwater wetland with subterranean springs.',
    source: 'Himachal Pradesh State Wetland Authority / MoEFCC',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  },
  {
    id: 'top-ram-mon-01',
    topicId: 'ramsar-sites',
    subtopicId: 'designation-facts',
    question: 'Which two Indian wetland sites are currently recorded on the "Montreux Record" (the register of Ramsar wetland sites where ecological changes have occurred or are likely to occur)?',
    options: [
      'Chilika Lake (Odisha) and Wular Lake (J&K)',
      'Keoladeo National Park (Rajasthan) and Loktak Lake (Manipur)',
      'Sundarbans (West Bengal) and Harike Lake (Punjab)',
      'Deepor Beel (Assam) and Rudrasagar Lake (Tripura)'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Keoladeo National Park (facing water scarcity and invasive growth) and Loktak Lake (facing siltation and deforestation) are the two Indian sites on the Montreux Record. Chilika Lake was placed on it in 1993 but successfully removed in 2002 after rehabilitation.',
    source: 'Ramsar Convention Secretariat - Montreux Record List',
    lastVerifiedDate: '2026-11-01',
    status: 'published'
  }
];

export function getAllTopicQuestions(): TopicQuestion[] {
  let custom: TopicQuestion[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('spideyy_published_topic_questions');
      if (saved) custom = JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return [...STARTER_TOPIC_QUESTIONS, ...custom];
}

export function addPublishedTopicQuestions(newQuestions: TopicQuestion[]): void {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('spideyy_published_topic_questions');
      const current: TopicQuestion[] = saved ? JSON.parse(saved) : [];
      const updated = [...current, ...newQuestions];
      localStorage.setItem('spideyy_published_topic_questions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

export function getTopicsList(): Topic[] {
  const allQs = getAllTopicQuestions();
  return TOPIC_CATEGORIES.map(t => {
    const questionsCount = allQs.filter(q => q.topicId === t.id).length;
    return {
      ...t,
      totalQuestions: questionsCount
    };
  });
}

export function getTopicById(topicId: string): Topic | undefined {
  return getTopicsList().find(t => t.id === topicId);
}

export function getQuestionsForTopic(topicId: string, subtopicId?: string): TopicQuestion[] {
  return getAllTopicQuestions().filter(q => {
    if (q.topicId !== topicId) return false;
    if (subtopicId && q.subtopicId !== subtopicId) return false;
    return true;
  });
}

import type { DailyQuiz, QuizQuestion } from '../types/quiz';

/**
 * Builds a runnable DailyQuiz object for a given topic ID,
 * allowing QuizRunner, ResultDashboard, and AnswerSheet to run topic quizzes seamlessly.
 */
export function getQuizForTopic(topicId: string): DailyQuiz {
  const topic = getTopicById(topicId) || TOPIC_CATEGORIES[0];
  const questions = getQuestionsForTopic(topic.id);
  const quizQuestions: QuizQuestion[] = questions.map((q, idx) => ({
    id: q.id,
    quizId: topic.id,
    order: idx + 1,
    section: 'new',
    state: topic.title,
    parkName: q.subtopicId,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    explanation: q.explanation,
    status: 'published'
  }));

  return {
    id: topic.id,
    dayNumber: 10,
    title: topic.title,
    quizDate: '18-11-2026',
    displayDate: 'Topic Workspace',
    statusLabel: 'Available',
    statesCovered: [topic.title],
    newStatesIntroduced: [topic.title],
    previousStates: [],
    stateInfoList: [],
    questions: quizQuestions,
    totalQuestions: quizQuestions.length
  };
}
