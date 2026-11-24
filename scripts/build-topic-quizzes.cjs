const fs = require('fs');
const path = require('path');

// 1. Read existing starter questions from topics.ts
const topicsSource = fs.readFileSync('src/data/topics.ts', 'utf8');

// 2. Define the new questions for Static GK Quizzes 2, 3, 4
const STATIC_GK_QUIZ_2_QUESTIONS = [
  {
    id: 'top-sgk-np-q02-01',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 1,
    question: 'Dachigam National Park near Srinagar in Jammu & Kashmir is the last surviving natural stronghold for which critically endangered deer species?',
    options: [
      'Hangul (Kashmir Stag)',
      'Hardground Barasingha',
      'Sangai (Dancing Deer)',
      'Musk Deer'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Dachigam National Park protects the critically endangered Hangul or Kashmir Stag (Cervus hanglu hanglu), the only surviving species of red deer in India, along the Dagwan River.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 14,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-02',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 2,
    question: 'Which high-altitude national park in Jammu and Kashmir is situated in the Chenab River basin, bounded by the Rinnay and Kibar rivers?',
    options: [
      'Kazinag National Park',
      'Kishtwar National Park',
      'Salim Ali National Park',
      'Dachigam National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Kishtwar National Park in Kishtwar district of Jammu & Kashmir lies in the Central Himalayan alpine zone between the Rinnay and Kibar rivers, famous for the Himalayan Snowcock and Brown Bear.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 15,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-03',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 3,
    question: 'Kazinag National Park along the Line of Control in Baramulla district of Jammu & Kashmir was specifically established to conserve which rare wild goat with spiral corkscrew horns?',
    options: [
      'Nilgiri Tahr',
      'Himalayan Ibex',
      'Markhor (Capra falconeri)',
      'Bharal (Blue Sheep)'
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Kazinag National Park on the north bank of the Jhelum River was notified in 2007 to protect the endangered Markhor, the largest wild goat in the world famous for its magnificent flared spiral horns.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 16,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-04',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 4,
    question: 'Which river forms the northern boundary of the high-altitude Hemis National Park in Ladakh, India\'s largest national park?',
    options: [
      'Zanskar River',
      'Shyok River',
      'Indus River',
      'Nubra River'
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Hemis National Park is bounded on the north by the Indus River and spans 4,400 sq km of Trans-Himalayan high plateau, hosting Hemis Gompa and the world\'s highest density of Snow Leopards.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 17,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-05',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 5,
    question: 'Great Himalayan National Park (GHNP), inscribed as a UNESCO World Heritage Site in 2014 for its Outstanding Universal Value in biodiversity, is located in which district of Himachal Pradesh?',
    options: [
      'Kangra',
      'Kullu',
      'Kinnaur',
      'Lahaul and Spiti'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Great Himalayan National Park is located in Kullu district of Himachal Pradesh, protecting the catchments of the Tirthan, Sainj, Jiwa Nal, and Parvati rivers.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 18,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-06',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 6,
    question: 'Pin Valley National Park in Himachal Pradesh preserves the unique high-altitude cold desert flora and fauna of which valley?',
    options: [
      'Kullu Valley',
      'Kangra Valley',
      'Spiti Valley',
      'Chamba Valley'
    ],
    correctAnswer: 2,
    difficulty: 'medium',
    explanation: 'Pin Valley National Park lies entirely within the Spiti subdivision of Lahaul & Spiti district in the Trans-Himalayan Cold Desert Biosphere Reserve, home to the Siberian Ibex and Snow Leopard.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 19,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-07',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 7,
    question: 'Which rapid alpine stream, an upstream tributary of the Bhyundar Ganga, drains the enchanting UNESCO World Heritage meadows of Valley of Flowers National Park in Uttarakhand?',
    options: [
      'Alaknanda River',
      'Pushpawati River',
      'Mandakini River',
      'Bhagirathi River'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Valley of Flowers National Park in Chamoli district is drained by the Pushpawati River, discovered by British mountaineer Frank S. Smythe in 1931 and famed for over 500 species of alpine flora.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 20,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-08',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 8,
    question: 'Nanda Devi National Park surrounds India\'s second highest mountain peak (7,816 m). Through which formidable glacial gorge does its only drainage escape?',
    options: [
      'Dhauli Ganga Gorge',
      'Pindar Gorge',
      'Rishi Ganga Gorge',
      'Goriganga Gorge'
    ],
    correctAnswer: 2,
    difficulty: 'hard',
    explanation: 'The Nanda Devi Sanctuary is enclosed by a ring of 6,000-meter peaks, with its glacial waters draining solely through the impassable Rishi Ganga Gorge into the Dhauli Ganga.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 21,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-09',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 9,
    question: 'Rajaji National Park in the Shivalik foothills of Uttarakhand was created in 1983 by amalgamating Chilla, Motichur, and which other historic sanctuary?',
    options: [
      'Govind Sanctuary',
      'Rajaji Sanctuary',
      'Askot Sanctuary',
      'Binsar Sanctuary'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Rajaji National Park was formed by merging Rajaji Sanctuary, Motichur Sanctuary, and Chilla Sanctuary, named after freedom fighter C. Rajagopalachari (Rajaji). It is a vital Asian Elephant habitat.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 22,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-10',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 10,
    question: 'Which historic 10th-century UNESCO World Heritage hill fort overlooks the lakes and tiger territory of Ranthambore National Park in Rajasthan?',
    options: [
      'Kumbhalgarh Fort',
      'Ranthambore Fort',
      'Chittorgarh Fort',
      'Mehrangarh Fort'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Ranthambore Fort sits atop a 700-foot hill inside Ranthambore National Park in Sawai Madhopur, bounded by the Banas and Chambal rivers and famous for diurnal tiger viewing.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 23,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-11',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 11,
    question: 'Desert National Park in Jaisalmer and Barmer districts of Rajasthan is the most crucial sanctuary for which critically endangered avian species, known locally as Godawan?',
    options: [
      'Lesser Florican',
      'Great Indian Bustard (Ardeotis nigriceps)',
      'Bengal Florican',
      'Sarus Crane'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Desert National Park covers ~3,162 sq km of Thar sand dunes and scrubland, providing the last major breeding habitat for the Great Indian Bustard (Rajasthan\'s state bird).',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 24,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q02-12',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-02',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 12,
    question: 'Which was India\'s first notified Marine National Park, established in 1982 to protect coral reefs, mangroves, and 42 islands in Gujarat?',
    options: [
      'Mahatma Gandhi Marine National Park',
      'Marine National Park, Gulf of Kutch',
      'Gulf of Mannar Marine National Park',
      'Malvan Marine Sanctuary'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Marine National Park in the Gulf of Kutch (Jamnagar district, Gujarat) was declared in 1982 as India\'s first marine national park, protecting 162 sq km of coral reefs and mangrove islands like Pirotan.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 25,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  }
];

const STATIC_GK_QUIZ_3_QUESTIONS = [
  {
    id: 'top-sgk-np-q03-01',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 1,
    question: 'Kanha National Park in Madhya Pradesh achieved international acclaim for saving which subspecies of deer from the brink of extinction, introducing "Bhoorsingh the Barasingha" as its official mascot?',
    options: [
      'Swamp Deer (Hardground Barasingha)',
      'Hog Deer',
      'Mouse Deer',
      'Spotted Deer (Chital)'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: 'Kanha National Park saved the central Indian Hardground Barasingha (Rucervus duvaucelii branderi) from fewer than 66 individuals in 1970 to over 800 today, becoming the first reserve in India to introduce an official mascot.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 26,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-02',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 2,
    question: 'Which national park in Umaria district of Madhya Pradesh is celebrated for the highest recorded density of Bengal Tigers in India and the historic origin of the white tiger Mohan?',
    options: [
      'Pench National Park',
      'Bandhavgarh National Park',
      'Panna National Park',
      'Satpura National Park'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Bandhavgarh National Park has the highest tiger density in India, centered around ancient Bandhavgarh hill and the 2000-year-old fort gifted by Lord Rama to brother Lakshmana.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 27,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-03',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 3,
    question: 'Which pristine river flows through the heart of Panna National Park in Madhya Pradesh, creating spectacular gorges and waterfalls like Pandav Falls?',
    options: [
      'Betwa River',
      'Ken River',
      'Son River',
      'Chambal River'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The Ken River flows northwards through Panna National Park, supporting gharials, muggers, and vulture nesting cliffs, and is the focal point of the Ken-Betwa river linking project.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 28,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-04',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 4,
    question: 'Satpura National Park forms the core wilderness of which UNESCO Biosphere Reserve, featuring Mount Dhoopgarh, the highest point in Madhya Pradesh?',
    options: [
      'Achanakmar-Amarkantak Biosphere',
      'Pachmarhi Biosphere Reserve',
      'Panna Biosphere Reserve',
      'Simlipal Biosphere Reserve'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Satpura National Park in Narmadapuram is part of the Pachmarhi Biosphere Reserve. Dhoopgarh peak (1,350 m) provides dramatic sandstone ravines and Malabar Giant Squirrel habitat.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 29,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-05',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 5,
    question: 'Under Project Cheetah, Southeast African cheetahs were reintroduced to which National Park in the Sheopur district of Madhya Pradesh in September 2022?',
    options: [
      'Madhav National Park',
      'Kuno National Park',
      'Van Vihar National Park',
      'Sanjay National Park'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Kuno National Park along the Kuno River was chosen for the reintroduction of cheetahs 70 years after their extinction in India due to its expansive open grasslands and abundant prey base.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 30,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-06',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 6,
    question: 'Notified in 1955 in Chandrapur district, which is Maharashtra\'s oldest and largest National Park, famously referred to as "The Jewel of Vidarbha"?',
    options: [
      'Navegaon National Park',
      'Tadoba National Park',
      'Gugamal National Park',
      'Chandoli National Park'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Tadoba National Park (combined with Andhari Wildlife Sanctuary to form Tadoba-Andhari Tiger Reserve) is the oldest national park in Maharashtra, taking its name from the local deity Taru.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 31,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-07',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 7,
    question: 'Which national park, situated within Mumbai\'s suburban metropolis, houses the ancient 1st-century BCE rock-cut Kanheri Buddhist Caves?',
    options: [
      'Gugamal National Park',
      'Sanjay Gandhi National Park (Borivali)',
      'Navegaon National Park',
      'Chandoli National Park'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Sanjay Gandhi National Park in Borivali, Mumbai, is one of the few national parks situated within a mega-city metropolis, housing 109 basalt rock-cut Kanheri Caves and Vihar & Tulsi lakes.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 32,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-08',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 8,
    question: 'Indravati (Kutru) National Park in Bijapur district of Chhattisgarh provides the primary state haven for which endangered animal, the state animal of Chhattisgarh?',
    options: [
      'Gaur (Indian Bison)',
      'Wild Water Buffalo (Bubalus arnee)',
      'Chousingha (Four-horned antelope)',
      'Sloth Bear'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Indravati National Park along the Indravati River is renowned for conserving one of the last wild populations of the endangered Wild Water Buffalo, the state animal of Chhattisgarh.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 33,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-09',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 9,
    question: 'Kanger Ghati National Park in Bastar district of Chhattisgarh is famous for Tirathgarh waterfall and which subterranean limestone cave containing blind cavefish and stalagmites?',
    options: [
      'Borra Caves',
      'Kotumsar Caves',
      'Belum Caves',
      'Mawsmai Caves'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Kotumsar Cave in Kanger Valley National Park is a 330-meter-deep limestone cave with subterranean stalactites, stalagmites, and the endemic blind cavefish (Indoreonectes evezardi).',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 34,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-10',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 10,
    question: 'Simlipal National Park in Mayurbhanj district of Odisha is globally unique as the world\'s only natural wild reserve harboring which rare variant of Bengal Tiger?',
    options: [
      'Albino White Tigers',
      'Melanistic (Black-striped) Tigers',
      'Golden Tabby Tigers',
      'Blue Tigers'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Simlipal National Park and Biosphere Reserve in Odisha is the only habitat on Earth where pseudo-melanistic (black-striped) tigers exist in the wild, caused by a genetic mutation in the Taqpep gene.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 35,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-11',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 11,
    question: 'Bhitarkanika National Park in Kendrapara district of Odisha is the second largest mangrove ecosystem in India and holds the Guinness World Record for the largest living specimens of which reptile?',
    options: [
      'Gharial',
      'Saltwater Crocodile (Crocodylus porosus)',
      'Mugger Crocodile',
      'King Cobra'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Bhitarkanika\'s Brahmani-Baitarani delta estuarine network is home to over 1,700 giant Saltwater Crocodiles (some exceeding 20 feet) and borders Gahirmatha, the world\'s largest Olive Ridley sea turtle nesting beach.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 36,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q03-12',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-03',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 12,
    question: 'Sundarbans National Park in West Bengal, a UNESCO World Heritage Site and Biosphere Reserve, is named after which dominant halophytic mangrove tree species?',
    options: [
      'Rhizophora',
      'Sundari tree (Heritiera fomes)',
      'Avicennia',
      'Sonneratia'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Sundarbans mangrove forest in the Ganges delta is named after the prolific Sundari tree (Heritiera fomes), celebrated for pneumatophore roots and swimming Bengal Tigers.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 37,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  }
];

const STATIC_GK_QUIZ_4_QUESTIONS = [
  {
    id: 'top-sgk-np-q04-01',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 1,
    question: 'Manas National Park in Assam, contiguous with the Royal Manas National Park in Bhutan along the Manas River, is a UNESCO World Heritage Site noted for conserving which critically endangered diminutive mammal?',
    options: [
      'Hispid Hare',
      'Pygmy Hog (Porcula salvania)',
      'Golden Langur',
      'All of the above'
    ],
    correctAnswer: 3,
    difficulty: 'medium',
    explanation: 'Manas National Park is a biodiversity hotspot protecting endemic fauna including the world\'s rarest suid (Pygmy Hog), Golden Langur, Hispid Hare, and Wild Water Buffalo.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 38,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-02',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 2,
    question: 'Nameri National Park in Sonitpur district of Assam, drained by the Jia-Bhoroli River, is celebrated as a prime habitat for which state bird of Assam?',
    options: [
      'Hornbill',
      'White-winged Wood Duck (Deo Hanh)',
      'Black-necked Crane',
      'Blyth\'s Tragopan'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Nameri National Park in the Himalayan foothills shares its northern border with Pakhui/Pakke Tiger Reserve of Arunachal Pradesh and is famous for the endangered White-winged Wood Duck and Golden Mahseer angling.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 39,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-03',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 3,
    question: 'Which river island national park in Assam, bounded by the Brahmaputra, Lohit, and Dibru rivers, is world-famous for its free-ranging wild feral horses?',
    options: [
      'Orang National Park',
      'Dibru-Saikhowa National Park',
      'Raimona National Park',
      'Dihing Patkai National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Dibru-Saikhowa National Park in Tinsukia/Dibrugarh is a riverine biome harboring feral horses (descendants of World War II military army horses) and Gangetic river dolphins.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 40,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-04',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 4,
    question: 'Namdapha National Park in Changlang district of Arunachal Pradesh is the only national park in the world that shelters which four apex feline predator species in a single ecosystem?',
    options: [
      'Tiger, Lion, Leopard, Cheetah',
      'Tiger, Leopard, Snow Leopard, Clouded Leopard',
      'Tiger, Jaguar, Leopard, Cheetah',
      'Lion, Leopard, Snow Leopard, Ocelot'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Namdapha\'s dramatic altitudinal span (200 m to 4,571 m at Daphabum) enables it to host four big cat species: Bengal Tiger, Common Indian Leopard, Snow Leopard, and Clouded Leopard.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 41,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-05',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 5,
    question: 'Mouling National Park, forming the western part of the Dihang-Dibang Biosphere Reserve in Arunachal Pradesh, is drained by which major trans-boundary river?',
    options: [
      'Subansiri River',
      'Siang (Brahmaputra) River',
      'Kameng River',
      'Tirap River'
    ],
    correctAnswer: 1,
    difficulty: 'hard',
    explanation: 'Mouling National Park in Upper Siang district is drained by the Siang River, protecting red pandas, takins, and serows across temperate rainforests.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 42,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-06',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 6,
    question: 'In Manipur\'s Keibul Lamjao National Park on Loktak Lake, what is the official conservation status of the endemic Eld\'s Deer (Sangai) that treads upon the floating phumdis?',
    options: [
      'Extinct in the Wild',
      'Endangered (Schedule I of Wildlife Protection Act, 1972)',
      'Least Concern',
      'Near Threatened'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Sangai or Manipur brow-antlered dancing deer is critically endangered, protected under Schedule I of the Wildlife (Protection) Act, 1972, exclusively found at Keibul Lamjao.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 43,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-07',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 7,
    question: 'Eravikulam National Park in Idukki district of Kerala protects the largest surviving wild population of the endangered Nilgiri Tahr and contains which highest mountain peak of Peninsular India (2,695 m)?',
    options: [
      'Doddabetta',
      'Anamudi',
      'Agasthyamalai',
      'Chembra Peak'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Anamudi Peak (2,695 meters), the highest peak in India south of the Himalayas, stands inside Eravikulam National Park among rolling montane grassland-shola ecosystems.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 44,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-08',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 8,
    question: 'Silent Valley National Park in the Nilgiri Hills of Palakkad district, Kerala, is drained by which crystal-clear perennial river that was the center of India\'s historic hydro-electric conservation battle?',
    options: [
      'Periyar River',
      'Kunthipuzha River',
      'Bharathappuzha River',
      'Pamba River'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The Kunthipuzha River traverses the entire 24 km length of Silent Valley, saved from a dam project by the pioneering "Save Silent Valley" environmental movement to protect the Lion-tailed Macaque.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 45,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-09',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 9,
    question: 'Which historic 1895 gravity dam on the Periyar River formed the scenic 26 sq km reservoir around which Periyar National Park in Kerala was developed?',
    options: [
      'Idukki Dam',
      'Mullaperiyar Dam',
      'Parambikulam Dam',
      'Cheruthoni Dam'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The reservoir formed by the Mullaperiyar Dam in 1895 created the artificial lake habitat that became the Nellikkampatty Game Sanctuary in 1934 and Periyar National Park in 1982.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 46,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-10',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 10,
    question: 'Mudumalai National Park in Nilgiris district of Tamil Nadu shares interstate borders with Wayanad Wildlife Sanctuary in Kerala and which tiger reserve in Karnataka?',
    options: [
      'Nagarhole Tiger Reserve',
      'Bandipur Tiger Reserve',
      'Bhadra Wildlife Sanctuary',
      'Anshi National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Mudumalai, Bandipur (Karnataka), and Wayanad (Kerala) meet at the Nilgiri Biosphere tri-junction, creating India\'s single largest contiguous landscape for Asian Elephants and Royal Bengal Tigers.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 47,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-11',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 11,
    question: 'The Gulf of Mannar Marine National Park along the coast of Tamil Nadu spans 21 uninhabited coral islands and is India\'s prime reserve for which herbivorous marine mammal?',
    options: [
      'Irrawaddy Dolphin',
      'Dugong / Sea Cow (Dugong dugon)',
      'Finless Porpoise',
      'Blue Whale'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Gulf of Mannar Marine National Park protects extensive shallow seagrass beds that sustain the vulnerable Dugong (sea cow) and over 117 hard coral species between Dhanushkodi and Tuticorin.',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 48,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-sgk-np-q04-12',
    topicId: 'static-gk',
    quizId: 'static-gk-quiz-04',
    subtopicId: 'state-wise-parks',
    orderInQuiz: 12,
    question: 'Which National Park in North Andaman Island encompasses Saddle Peak (732 m) and is drained by the Kalpong River, the only river flowing through the Andaman & Nicobar archipelago?',
    options: [
      'Mahatma Gandhi Marine National Park',
      'Saddle Peak National Park',
      'Campbell Bay National Park',
      'Galathea Bay National Park'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Saddle Peak National Park surrounds the highest point in the Andaman & Nicobar Islands (Saddle Peak, 732 m) and is nourished by the Kalpong River, the islands\' only freshwater river (site of Kalpong Hydroelectric Project).',
    source: 'State_Repositories_2026.pdf',
    sourcePage: 49,
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  }
];

const SIXTH_SCHEDULE_QUIZ_1_QUESTIONS = [
  {
    id: 'top-6th-sched-01',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'constitutional-provisions',
    orderInQuiz: 1,
    question: 'Which four northeastern states of India are administered under the provisions of the Sixth Schedule of the Constitution of India?',
    options: [
      'Assam, Nagaland, Manipur, and Mizoram',
      'Assam, Meghalaya, Tripura, and Mizoram (AMTM)',
      'Arunachal Pradesh, Sikkim, Tripura, and Meghalaya',
      'Manipur, Nagaland, Mizoram, and Tripura'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Sixth Schedule applies exclusively to tribal areas in Assam, Meghalaya, Tripura, and Mizoram (mnemonic: AMTM) under Articles 244(2) and 275(1) of the Indian Constitution.',
    source: 'Constitution of India, Sixth Schedule & PRS India',
    sourcePage: 'Articles 244(2) & 275(1)',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-02',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'constitutional-provisions',
    orderInQuiz: 2,
    question: 'Which constitutional sub-committee of the Constituent Assembly of India recommended the creation of Autonomous District Councils under the Sixth Schedule?',
    options: [
      'Kaka Kalelkar Committee',
      'Gopinath Bordoloi Sub-Committee',
      'B.R. Ambedkar Committee',
      'Fazal Ali Commission'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'The Gopinath Bordoloi Sub-Committee (constituted under the Advisory Committee on Fundamental Rights and Minorities) recommended Autonomous District Councils to ensure tribal self-governance and preservation of customary laws.',
    source: 'Constituent Assembly Debates & Ministry of Tribal Affairs',
    sourcePage: 'CAD Vol. IX',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-03',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'autonomous-district-councils',
    orderInQuiz: 3,
    question: 'How many Autonomous District Councils (ADCs) currently function under the Sixth Schedule of the Constitution across the four designated states?',
    options: [
      '6 ADCs',
      '10 ADCs',
      '14 ADCs',
      '20 ADCs'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'There are 10 ADCs in total: 3 in Assam (Bodoland, Karbi Anglong, Dima Hasao), 3 in Meghalaya (Khasi Hills, Garo Hills, Jaintia Hills), 1 in Tripura (TTAADC), and 3 in Mizoram (Chakma, Mara, Lai).',
    source: 'National Commission for Scheduled Tribes (NCST) Annual Report',
    sourcePage: 'Table 4.2',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-04',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'autonomous-district-councils',
    orderInQuiz: 4,
    question: 'What is the standard constitutional composition and member count of an Autonomous District Council under Paragraph 2 of the Sixth Schedule (with the exception of Bodoland)?',
    options: [
      'Up to 20 members (all elected)',
      'Up to 30 members (up to 26 elected via adult suffrage and 4 nominated by the Governor)',
      'Up to 40 members (30 elected and 10 nominated by the President)',
      '15 members appointed by the Chief Minister'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Under Paragraph 2 of the Sixth Schedule, each ADC has up to 30 members: up to 26 elected by adult franchise for a 5-year term and 4 nominated by the Governor. (Bodoland Territorial Council is an exception with 46 members).',
    source: 'Constitution of India, Sixth Schedule Paragraph 2',
    sourcePage: 'Para 2(1)',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-05',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'powers-governance',
    orderInQuiz: 5,
    question: 'Whose constitutional assent is mandatorily required before any law enacted by an Autonomous District Council on land, forests, or village administration can take legal effect?',
    options: [
      'President of India',
      'Governor of the respective State',
      'Chief Minister of the State',
      'Chief Justice of the High Court'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Under Paragraph 3(2) of the Sixth Schedule, all laws made by an Autonomous District Council on land allocation, forests, water channels, village headmen, and customs must receive the assent of the Governor before having effect.',
    source: 'Constitution of India, Sixth Schedule Paragraph 3',
    sourcePage: 'Para 3(2)',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-06',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'constitutional-provisions',
    orderInQuiz: 6,
    question: 'Which constitutional Articles of India directly govern the establishment and grant-in-aid provisions of the Sixth Schedule?',
    options: [
      'Article 244(1) and Article 245',
      'Article 244(2) and Article 275(1)',
      'Article 370 and Article 371',
      'Article 338 and Article 338A'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'Article 244(2) applies the Sixth Schedule to tribal areas in Assam, Meghalaya, Tripura, and Mizoram. Article 275(1) mandates special grants-in-aid from the Consolidated Fund of India for tribal development.',
    source: 'Constitution of India, Articles 244(2) & 275(1)',
    sourcePage: 'Part X & Part XII',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-07',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'powers-governance',
    orderInQuiz: 7,
    question: 'What is the key institutional distinction between the Fifth Schedule and the Sixth Schedule of the Constitution of India?',
    options: [
      'Fifth Schedule applies to North-East; Sixth Schedule applies to South India',
      'Fifth Schedule areas have advisory Tribes Advisory Councils (TACs); Sixth Schedule areas have autonomous legislative, executive, and judicial ADCs',
      'Fifth Schedule is for Union Territories only',
      'Fifth Schedule councils have military and foreign affairs powers'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Fifth Schedule areas (in 10 mainland states) are governed through normal state machinery with advisory Tribes Advisory Councils (TACs), whereas Sixth Schedule ADCs exercise statutory legislative, judicial, and taxation autonomy.',
    source: 'Ministry of Tribal Affairs Governance Manual',
    sourcePage: 'Chapter 2, p. 18',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-08',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'autonomous-district-councils',
    orderInQuiz: 8,
    question: 'Which Autonomous District Council in Tripura covers approximately 68% of the state\'s total geographical area and over one-third of its population?',
    options: [
      'Chakma Autonomous Council',
      'Tripura Tribal Areas Autonomous District Council (TTAADC)',
      'Dima Hasao Autonomous Council',
      'Karbi Anglong Council'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Tripura Tribal Areas Autonomous District Council (TTAADC), established under the Sixth Schedule in 1985, covers 7,132.5 sq km (about 68% of Tripura\'s area) with headquarters at Khumulwng.',
    source: 'TTAADC Official Portal & NCST',
    sourcePage: 'Administrative Profile 2026',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-09',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'constitutional-provisions',
    orderInQuiz: 9,
    question: 'In the Union Territory of Ladakh, civil society coalitions (Apex Body Leh and Kargil Democratic Alliance) have staged peaceful movements demanding inclusion under which constitutional framework?',
    options: [
      'Fifth Schedule',
      'Sixth Schedule of the Constitution',
      'Article 371A',
      'Eighth Schedule'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Ladakh civil society leaders have demanded inclusion under the Sixth Schedule to protect indigenous land rights, fragile Himalayan ecology, and employment for its over 97% tribal population.',
    source: 'PRS Legislative Research & MHA Parliamentary Reports',
    sourcePage: 'Ladakh Governance Brief 2026',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  },
  {
    id: 'top-6th-sched-10',
    topicId: 'sixth-schedule',
    quizId: 'sixth-schedule-quiz-01',
    subtopicId: 'powers-governance',
    orderInQuiz: 10,
    question: 'What unique judicial power is conferred upon Autonomous District Councils under Paragraphs 4 and 5 of the Sixth Schedule?',
    options: [
      'Authority to hear capital punishment murder appeals',
      'Power to constitute village councils and customary courts to try civil suits and minor offenses between Scheduled Tribes according to customary tribal law',
      'Supreme jurisdiction over State High Court judges',
      'Total immunity from Indian Penal Code'
    ],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Under Paragraphs 4 and 5 of the Sixth Schedule, District Councils can constitute village councils or courts to try suits and cases where both parties are Scheduled Tribes, applying tribal customary law with appellate oversight by the High Court.',
    source: 'Constitution of India, Sixth Schedule Paragraphs 4 & 5',
    sourcePage: 'Para 4-5',
    lastVerifiedDate: '2026-11-24',
    status: 'published'
  }
];

console.log('Static GK Quiz 2 questions:', STATIC_GK_QUIZ_2_QUESTIONS.length);
console.log('Static GK Quiz 3 questions:', STATIC_GK_QUIZ_3_QUESTIONS.length);
console.log('Static GK Quiz 4 questions:', STATIC_GK_QUIZ_4_QUESTIONS.length);
console.log('Sixth Schedule Quiz 1 questions:', SIXTH_SCHEDULE_QUIZ_1_QUESTIONS.length);

module.exports = {
  STATIC_GK_QUIZ_2_QUESTIONS,
  STATIC_GK_QUIZ_3_QUESTIONS,
  STATIC_GK_QUIZ_4_QUESTIONS,
  SIXTH_SCHEDULE_QUIZ_1_QUESTIONS
};
