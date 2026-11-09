import type { QuizQuestion, StateNationalParkInfo } from '../types/quiz';

export interface StateData {
  stateInfo: StateNationalParkInfo;
  questions: Omit<QuizQuestion, 'section'>[];
}

export const STATE_REPOSITORIES: Record<string, StateData> = {
  // ==========================================
  // 1. MADHYA PRADESH
  // ==========================================
  'Madhya Pradesh': {
    stateInfo: {
      stateName: 'Madhya Pradesh',
      capital: 'Bhopal',
      totalParks: 11,
      overview: 'Madhya Pradesh, the "Tiger State of India", leads the country with 11 officially notified National Parks across the Vindhya and Satpura mountain ranges.',
      tipsForMahi: 'Remember MP has the most National Parks in India! Core parks: Kanha, Bandhavgarh, Kuno, Pench, Panna, Satpura, Madhav, Sanjay, Van Vihar.',
      parks: [
        {
          name: 'Kanha National Park',
          year: 1955,
          district: 'Mandla and Balaghat',
          riverOrBiome: 'Maikal range of Satpuras',
          famousWildlife: ['Hardground Barasingha', 'Royal Bengal Tiger', 'Leopard', 'Dhole'],
          keyFeature: 'Saved the Hardground Barasingha from extinction; official mascot "Bhoorsingh the Barasingha".',
          unescoOrSpecialStatus: 'First tiger reserve with an official mascot'
        },
        {
          name: 'Bandhavgarh National Park',
          year: 1968,
          district: 'Umaria',
          riverOrBiome: 'Vindhyan hills',
          famousWildlife: ['Royal Bengal Tiger', 'White Tiger (historical origin)', 'Spotted Deer'],
          keyFeature: 'Highest tiger density in India; ancient Bandhavgarh Fort and 10th-century reclining Vishnu (Shesh Shaiya).'
        },
        {
          name: 'Kuno National Park',
          year: 2018,
          district: 'Sheopur and Morena',
          riverOrBiome: 'Kuno River basin',
          famousWildlife: ['Cheetah (African)', 'Leopard', 'Striped Hyena'],
          keyFeature: 'Site of Project Cheetah, where cheetahs from Namibia and South Africa were reintroduced in 2022.'
        },
        {
          name: 'Pench National Park',
          year: 1975,
          district: 'Seoni and Chhindwara',
          riverOrBiome: 'Pench River',
          famousWildlife: ['Royal Bengal Tiger', 'Gaur', 'Leopard'],
          keyFeature: 'Original real-life setting for Rudyard Kipling’s "The Jungle Book".'
        },
        {
          name: 'Panna National Park',
          year: 1981,
          district: 'Panna and Chhatarpur',
          riverOrBiome: 'Ken River',
          famousWildlife: ['Tiger', 'Gharial', 'Vultures'],
          keyFeature: 'Pristine Ken River flows through it; famous for remarkable tiger population recovery.'
        },
        {
          name: 'Satpura National Park',
          year: 1981,
          district: 'Narmadapuram (Hoshangabad)',
          riverOrBiome: 'Denwa River & Satpura range',
          famousWildlife: ['Indian Giant Squirrel', 'Tiger', 'Sloth Bear'],
          keyFeature: 'Core of Pachmarhi Biosphere Reserve; famous for walking safaris and canoeing.'
        }
      ]
    },
    questions: [
      {
        id: 'mp-q1',
        state: 'Madhya Pradesh',
        parkName: 'Kanha National Park',
        question: 'Which deer subspecies was rescued from extinction in Kanha National Park and serves as its official mascot "Bhoorsingh"?',
        options: [
          'Hardground Barasingha (Rucervus duvaucelii branderi)',
          'Sangai Deer',
          'Hangul (Kashmir Stag)',
          'Musk Deer'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Kanha is the world\'s only natural refuge where the Hardground Barasingha (Swamp Deer) was saved from near-extinction, commemorated by mascot Bhoorsingh.',
        establishedYear: 1955,
        district: 'Mandla & Balaghat'
      },
      {
        id: 'mp-q2',
        state: 'Madhya Pradesh',
        parkName: 'Kuno National Park',
        question: 'Under "Project Cheetah", cheetahs from Namibia and South Africa were reintroduced in 2022 into which National Park of Madhya Pradesh?',
        options: ['Kuno National Park', 'Bandhavgarh National Park', 'Madhav National Park', 'Satpura National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'In September 2022, Prime Minister Narendra Modi released the first batch of African cheetahs into Kuno National Park in Sheopur district.',
        establishedYear: 2018,
        district: 'Sheopur & Morena'
      },
      {
        id: 'mp-q3',
        state: 'Madhya Pradesh',
        parkName: 'Bandhavgarh National Park',
        question: 'Which National Park in Madhya Pradesh is famous for the highest recorded tiger density in India and the 10th-century Shesh Shaiya Vishnu sculpture?',
        options: ['Bandhavgarh National Park', 'Van Vihar National Park', 'Fossil National Park', 'Sanjay National Park'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Bandhavgarh National Park in Umaria district features ancient Bandhavgarh Fort, the reclining Vishnu statue (Shesh Shaiya), and highest tiger density.',
        establishedYear: 1968,
        district: 'Umaria'
      },
      {
        id: 'mp-q4',
        state: 'Madhya Pradesh',
        parkName: 'Pench National Park',
        question: 'The landscape and wildlife of which National Park in Madhya Pradesh inspired Rudyard Kipling\'s classic "The Jungle Book"?',
        options: ['Pench National Park', 'Madhav National Park', 'Dinosaur National Park', 'Van Vihar National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Rudyard Kipling based Mowgli\'s adventures in the Seeonee (Seoni) hills surrounding the Pench River, now protected as Pench (Priyadarshini) National Park.',
        establishedYear: 1975,
        district: 'Seoni & Chhindwara'
      },
      {
        id: 'mp-q5',
        state: 'Madhya Pradesh',
        parkName: 'Panna National Park',
        question: 'Which pristine river flows directly through Panna National Park and is linked to the Betwa in India\'s first major river-interlinking project?',
        options: ['Ken River', 'Narmada River', 'Chambal River', 'Son River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Ken River cuts deep gorges through Panna National Park, sustaining its tigers, gharials, and seven species of vultures.',
        establishedYear: 1981,
        district: 'Panna & Chhatarpur'
      },
      {
        id: 'mp-q6',
        state: 'Madhya Pradesh',
        parkName: 'Satpura National Park',
        question: 'Satpura National Park forms the core zone of which renowned Biosphere Reserve in Madhya Pradesh?',
        options: ['Pachmarhi Biosphere Reserve', 'Achanakmar Biosphere Reserve', 'Simlipal Biosphere Reserve', 'Nokrek Biosphere Reserve'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Satpura National Park forms the core of Pachmarhi Biosphere Reserve in Narmadapuram (Hoshangabad) district.',
        establishedYear: 1981,
        district: 'Narmadapuram'
      }
    ]
  },

  // ==========================================
  // 2. ANDHRA PRADESH
  // ==========================================
  'Andhra Pradesh': {
    stateInfo: {
      stateName: 'Andhra Pradesh',
      capital: 'Amaravati',
      totalParks: 3,
      overview: 'Andhra Pradesh hosts 3 National Parks spanning the Eastern Ghats, Seshachalam Biosphere Reserve, and Godavari river valley.',
      tipsForMahi: 'Remember "PSR": Papikonda (Godavari gorge), Sri Venkateswara (Golden Gecko & Red Sanders), and Rajiv Gandhi / Rameswaram (Pennar river).',
      parks: [
        {
          name: 'Sri Venkateswara National Park',
          year: 1989,
          district: 'Tirupati and YSR Kadapa',
          riverOrBiome: 'Seshachalam Hills',
          famousWildlife: ['Golden Gecko', 'Slender Loris', 'Indian Giant Squirrel'],
          keyFeature: 'Home to the endemic Golden Gecko and ancient Red Sanders (Pterocarpus santalinus) forests; contains Talakona Waterfall.',
          unescoOrSpecialStatus: 'Part of Seshachalam Biosphere Reserve'
        },
        {
          name: 'Papikonda National Park',
          year: 2008,
          district: 'Alluri Sitharama Raju and Eluru',
          riverOrBiome: 'Godavari River basin / Papi Hills',
          famousWildlife: ['Royal Bengal Tiger', 'Gaur', 'Spotted Deer'],
          keyFeature: 'Godavari River carves the spectacular Papikondalu gorge through the park.'
        },
        {
          name: 'Rajiv Gandhi (Rameswaram) National Park',
          year: 2005,
          district: 'YSR Kadapa',
          riverOrBiome: 'Pennar River northern bank',
          famousWildlife: ['Blackbuck', 'Spotted Deer', 'Peacock'],
          keyFeature: 'Compact protected area (~2.4 sq km) preserving riverine sand dunes on the Pennar bank.'
        }
      ]
    },
    questions: [
      {
        id: 'ap-q1',
        state: 'Andhra Pradesh',
        parkName: 'Sri Venkateswara National Park',
        question: 'Which critically rare and endemic reptile is uniquely found in the rocky crevices of Sri Venkateswara National Park in Andhra Pradesh?',
        options: [
          'Golden Gecko (Calodactylodes aureus)',
          'King Cobra',
          'Gharial',
          'Indian Star Tortoise'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Golden Gecko (Calodactylodes aureus) is an endangered lizard endemic to the rocky Seshachalam hills in Sri Venkateswara National Park.',
        establishedYear: 1989,
        district: 'Tirupati & YSR Kadapa'
      },
      {
        id: 'ap-q2',
        state: 'Andhra Pradesh',
        parkName: 'Papikonda National Park',
        question: 'Which major Indian river flows directly through Papikonda National Park, carving the scenic Papikondalu gorge?',
        options: ['Godavari River', 'Krishna River', 'Pennar River', 'Tungabhadra River'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Godavari River carves the majestic gorge through the Papi hills inside Papikonda National Park.',
        establishedYear: 2008,
        district: 'Alluri Sitharama Raju & Eluru'
      },
      {
        id: 'ap-q3',
        state: 'Andhra Pradesh',
        parkName: 'Sri Venkateswara National Park',
        question: 'Which highly prized, endemic timber species is heavily protected inside Sri Venkateswara National Park?',
        options: [
          'Red Sanders (Pterocarpus santalinus)',
          'Teak (Tectona grandis)',
          'Sal (Shorea robusta)',
          'Rosewood'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Red Sanders (Pterocarpus santalinus) is endemic to the southern Eastern Ghats of Andhra Pradesh, predominantly within Seshachalam hills.',
        district: 'Tirupati & YSR Kadapa'
      },
      {
        id: 'ap-q4',
        state: 'Andhra Pradesh',
        parkName: 'Rajiv Gandhi (Rameswaram) National Park',
        question: 'Rajiv Gandhi (Rameswaram) National Park in Andhra Pradesh is located along the bank of which river in YSR Kadapa district?',
        options: ['Pennar River', 'Godavari River', 'Krishna River', 'Nagavali River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Rajiv Gandhi (Rameswaram) National Park is situated along the northern bank of the Pennar River in Kadapa district.',
        establishedYear: 2005,
        district: 'YSR Kadapa'
      },
      {
        id: 'ap-q5',
        state: 'Andhra Pradesh',
        parkName: 'Sri Venkateswara National Park',
        question: 'Which highest waterfall in Andhra Pradesh (~270 feet) is located within Sri Venkateswara National Park?',
        options: ['Talakona Waterfall', 'Kaigal Falls', 'Katiki Falls', 'Kalyani Falls'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Talakona Waterfall in Sri Venkateswara National Park falls from about 270 feet, making it the highest waterfall in Andhra Pradesh.',
        district: 'Tirupati district'
      },
      {
        id: 'ap-q6',
        state: 'Andhra Pradesh',
        parkName: 'Papikonda National Park',
        question: 'In which year was Papikonda officially declared a full National Park by the Andhra Pradesh government?',
        options: ['2008', '1989', '2001', '2014'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Papikonda was upgraded and officially notified as a National Park in 2008.',
        establishedYear: 2008
      }
    ]
  },

  // ==========================================
  // 3. TELANGANA
  // ==========================================
  'Telangana': {
    stateInfo: {
      stateName: 'Telangana',
      capital: 'Hyderabad',
      totalParks: 3,
      overview: 'Telangana possesses 3 National Parks, all situated within or near the Hyderabad metropolitan zone.',
      tipsForMahi: 'Remember "K-M-M": KBR in Jubilee Hills, Mahavir Harina Vanasthali (Blackbuck), and Mrugavani at Chilkur.',
      parks: [
        {
          name: 'Kasu Brahmananda Reddy (KBR) National Park',
          year: 1998,
          district: 'Hyderabad (Jubilee Hills)',
          riverOrBiome: 'Deccan thorn scrub',
          famousWildlife: ['Peafowl', 'Pangolin', 'Small Indian Civet'],
          keyFeature: 'Urban forest oasis surrounding the historic Chiran Palace of Prince Mukarram Jah.'
        },
        {
          name: 'Mahavir Harina Vanasthali National Park',
          year: 1994,
          district: 'Ranga Reddy / Vanasthalipuram',
          riverOrBiome: 'Dry scrub grassland',
          famousWildlife: ['Blackbuck (Antilope cervicapra)', 'Spotted Deer'],
          keyFeature: 'Dedicated to Lord Mahavira on his 2500th birth anniversary; former Shikargah of the Nizams.'
        },
        {
          name: 'Mrugavani National Park',
          year: 1994,
          district: 'Ranga Reddy (Chilkur)',
          riverOrBiome: 'Deccan rocky ridge',
          famousWildlife: ['Indian Hare', 'Forest Cat', 'Civet'],
          keyFeature: 'Located near Chilkur Balaji Temple, characterized by granitic rocks and dry scrub.'
        }
      ]
    },
    questions: [
      {
        id: 'ts-q1',
        state: 'Telangana',
        parkName: 'Mahavir Harina Vanasthali National Park',
        question: 'Mahavir Harina Vanasthali National Park in Telangana was established primarily to protect which graceful animal?',
        options: [
          'Blackbuck (Antilope cervicapra)',
          'Hardground Barasingha',
          'Hangul',
          'Nilgiri Tahr'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The park is named "Harina" (deer/antelope) in honour of Lord Mahavira and protects a thriving population of Blackbuck.',
        establishedYear: 1994,
        district: 'Vanasthalipuram, Ranga Reddy'
      },
      {
        id: 'ts-q2',
        state: 'Telangana',
        parkName: 'KBR National Park',
        question: 'Kasu Brahmananda Reddy (KBR) National Park is a prominent urban national park located in which area of Hyderabad?',
        options: ['Jubilee Hills', 'Gachibowli', 'Secunderabad', 'Charminar'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'KBR National Park spans ~390 acres in the Jubilee Hills / Banjara Hills locality of Hyderabad.',
        district: 'Hyderabad'
      },
      {
        id: 'ts-q3',
        state: 'Telangana',
        parkName: 'KBR National Park',
        question: 'Which historic palace built for the Prince of Berar (Azam Jah) is situated inside KBR National Park?',
        options: ['Chiran Palace', 'Falaknuma Palace', 'Chowmahalla Palace', 'King Kothi Palace'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Chiran Palace, built in 1940 for the Nizam\'s eldest son Prince Azam Jah, is located inside KBR National Park.',
        district: 'Hyderabad'
      },
      {
        id: 'ts-q4',
        state: 'Telangana',
        parkName: 'Mrugavani National Park',
        question: 'Mrugavani National Park in Telangana is situated at Chilkur, right next to which renowned landmark?',
        options: [
          'Chilkur Balaji Temple (Visa Balaji)',
          'Yadadri Temple',
          'Golconda Fort',
          'Bhadrachalam Temple'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Mrugavani National Park is located at Chilkur in Ranga Reddy district, right beside Chilkur Balaji Temple.',
        district: 'Ranga Reddy'
      },
      {
        id: 'ts-q5',
        state: 'Telangana',
        parkName: 'Mahavir Harina Vanasthali National Park',
        question: 'Mahavir Harina Vanasthali was historically used as a private hunting preserve (Shikargah) by which rulers?',
        options: [
          'The Nizams of Hyderabad',
          'The Kakatiyas of Warangal',
          'The Bahmani Sultans',
          'The Vijayanagara Kings'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The forest was the private Shikargah (hunting reserve) of the Asaf Jahi Nizams of Hyderabad before being declared a protected area.',
        establishedYear: 1994
      },
      {
        id: 'ts-q6',
        state: 'Telangana',
        parkName: 'Overview of Telangana',
        question: 'What remarkable geographical trait do all 3 National Parks of Telangana share?',
        options: [
          'All three are located in and around the Hyderabad metropolitan region',
          'All three border the Krishna River',
          'All three are above 1500m elevation',
          'All three have mangrove swamps'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'All three national parks in Telangana (KBR, Mahavir Harina Vanasthali, Mrugavani) are within or on the immediate periphery of Hyderabad city.',
        district: 'Hyderabad & Ranga Reddy'
      }
    ]
  },

  // ==========================================
  // 4. KERALA
  // ==========================================
  'Kerala': {
    stateInfo: {
      stateName: 'Kerala',
      capital: 'Thiruvananthapuram',
      totalParks: 6,
      overview: 'Kerala boasts 6 stunning National Parks nestled in the Western Ghats biodiversity hotspot, famous for sholas, the Nilgiri Tahr, and elephant reserves.',
      tipsForMahi: 'Remember Eravikulam (Nilgiri Tahr & Anamudi), Silent Valley (Lion-tailed Macaque), Periyar (Lake & Elephants), and 3 Sholas (Anamudi, Mathikettan, Pambadum).',
      parks: [
        {
          name: 'Eravikulam National Park',
          year: 1978,
          district: 'Idukki',
          riverOrBiome: 'Montane shola-grassland',
          famousWildlife: ['Nilgiri Tahr', 'Atlas Moth'],
          keyFeature: 'Highest peak in South India (Anamudi - 2,695m); largest population of Nilgiri Tahr; Neelakurinji blooms every 12 years.',
          unescoOrSpecialStatus: 'UNESCO World Heritage site'
        },
        {
          name: 'Silent Valley National Park',
          year: 1984,
          district: 'Palakkad',
          riverOrBiome: 'Kunthipuzha River',
          famousWildlife: ['Lion-tailed Macaque', 'Nilgiri Langur'],
          keyFeature: 'Pristine rainforest saved by the historic "Save Silent Valley" movement against a hydroelectric dam.'
        },
        {
          name: 'Periyar National Park',
          year: 1982,
          district: 'Idukki & Pathanamthitta',
          riverOrBiome: 'Periyar Lake',
          famousWildlife: ['Asian Elephant', 'Royal Bengal Tiger', 'Gaur'],
          keyFeature: 'Centred around Periyar Lake formed by Mullaperiyar Dam; famous for boat safaris.'
        },
        {
          name: 'Mathikettan Shola National Park',
          year: 2003,
          district: 'Idukki',
          riverOrBiome: 'Cardamom Hills shola',
          famousWildlife: ['Elephants', 'Gaur'],
          keyFeature: 'Name means "mind confuser" because travelers get disoriented in its dense canopy.'
        },
        {
          name: 'Pambadum Shola National Park',
          year: 2003,
          district: 'Idukki',
          riverOrBiome: 'Southern Western Ghats cloud forest',
          famousWildlife: ['Nilgiri Marten', 'Barking Deer'],
          keyFeature: 'Smallest national park in Kerala (~1.32 sq km); protects the rare Nilgiri Marten.'
        }
      ]
    },
    questions: [
      {
        id: 'kl-q1',
        state: 'Kerala',
        parkName: 'Eravikulam National Park',
        question: 'Eravikulam National Park in Kerala protects the largest surviving wild population of which endangered mountain ungulate?',
        options: [
          'Nilgiri Tahr (Nilgiritragus hylocrius)',
          'Himalayan Ibex',
          'Takin',
          'Blue Sheep'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Eravikulam holds over 750 Nilgiri Tahrs, the largest breeding population of this endangered mountain goat in the world.',
        establishedYear: 1978,
        district: 'Idukki'
      },
      {
        id: 'kl-q2',
        state: 'Kerala',
        parkName: 'Silent Valley National Park',
        question: 'Which river flows through Silent Valley National Park and was saved from a hydroelectric dam by an iconic 1970s environmental movement?',
        options: ['Kunthipuzha River', 'Periyar River', 'Bharathappuzha', 'Pamba River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The crystal-clear Kunthipuzha River flows through Silent Valley. The proposed dam on it sparked the historic "Save Silent Valley" movement.',
        establishedYear: 1984,
        district: 'Palakkad'
      },
      {
        id: 'kl-q3',
        state: 'Kerala',
        parkName: 'Silent Valley National Park',
        question: 'Silent Valley National Park in Palakkad is the foremost stronghold of which endangered primate endemic to the Western Ghats?',
        options: [
          'Lion-tailed Macaque (Macaca silenus)',
          'Hoolock Gibbon',
          'Golden Langur',
          'Bonnet Macaque'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Silent Valley preserves the largest contiguous viable population of the endangered Lion-tailed Macaque.',
        establishedYear: 1984,
        district: 'Palakkad'
      },
      {
        id: 'kl-q4',
        state: 'Kerala',
        parkName: 'Eravikulam National Park',
        question: 'What is the highest mountain peak in South India (2,695 metres), located inside Eravikulam National Park?',
        options: ['Anamudi', 'Doddabetta', 'Agasthyamalai', 'Mukurthi Peak'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Anamudi ("Elephant\'s forehead" in Malayalam) rises to 2,695 m inside Eravikulam, the highest point in peninsular India.',
        establishedYear: 1978,
        district: 'Idukki'
      },
      {
        id: 'kl-q5',
        state: 'Kerala',
        parkName: 'Periyar National Park',
        question: 'Periyar National Park is famous for boat safaris on an artificial lake created in 1895 by which historic dam?',
        options: ['Mullaperiyar Dam', 'Idukki Dam', 'Parambikulam Dam', 'Banasura Sagar Dam'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Periyar Lake was formed by the Mullaperiyar Dam built across the Periyar River by British engineer John Pennycuick.',
        establishedYear: 1982,
        district: 'Idukki & Pathanamthitta'
      },
      {
        id: 'kl-q6',
        state: 'Kerala',
        parkName: 'Pambadum Shola National Park',
        question: 'What distinction does Pambadum Shola National Park hold among all National Parks in Kerala?',
        options: [
          'It is the smallest National Park in Kerala (~1.32 sq km)',
          'It is the oldest National Park in Kerala',
          'It has the highest tiger density',
          'It has no trees'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Pambadum Shola covers only 1.318 sq km in Idukki district, making it the smallest national park in Kerala.',
        establishedYear: 2003,
        district: 'Idukki'
      }
    ]
  },

  // ==========================================
  // 5. ASSAM
  // ==========================================
  'Assam': {
    stateInfo: {
      stateName: 'Assam',
      capital: 'Dispur',
      totalParks: 7,
      overview: 'Assam is world-renowned for its floodplains along the Brahmaputra River, housing two-thirds of the world’s Great One-Horned Rhinoceros and 7 notified National Parks.',
      tipsForMahi: 'Remember Kaziranga (Rhino UNESCO), Manas (Pygmy Hog UNESCO), Nameri, Orang (Mini Kaziranga), Dibru-Saikhowa (Feral horses), Raimona (Golden Langur), Dihing Patkai (Amazon of East).',
      parks: [
        {
          name: 'Kaziranga National Park',
          year: 1974,
          district: 'Golaghat, Nagaon, and Sonitpur',
          riverOrBiome: 'Brahmaputra River floodplains',
          famousWildlife: ['Great One-Horned Rhinoceros', 'Royal Bengal Tiger', 'Asian Elephant', 'Wild Water Buffalo', 'Swamp Deer'],
          keyFeature: 'UNESCO World Heritage Site; holds ~2,600+ one-horned rhinos (two-thirds of global population) and the "Big Five" of Asia.',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (1985)'
        },
        {
          name: 'Manas National Park',
          year: 1990,
          district: 'Baksa and Chirang',
          riverOrBiome: 'Manas River / Bhutan foothills',
          famousWildlife: ['Pygmy Hog (Porcula salvania)', 'Golden Langur', 'Hispid Hare', 'Wild Water Buffalo'],
          keyFeature: 'UNESCO World Heritage Site; sole natural home of the critically endangered Pygmy Hog (world\'s smallest wild pig).',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (1985)'
        },
        {
          name: 'Nameri National Park',
          year: 1998,
          district: 'Sonitpur',
          riverOrBiome: 'Jia Bhoroli River',
          famousWildlife: ['White-winged Wood Duck (Deo Hah)', 'Tiger', 'Golden Mahseer'],
          keyFeature: 'Key haven for the endangered White-winged Wood Duck (the state bird of Assam) and Golden Mahseer angling.'
        },
        {
          name: 'Orang National Park (Rajiv Gandhi)',
          year: 1999,
          district: 'Darrang and Sonitpur',
          riverOrBiome: 'North bank of Brahmaputra River',
          famousWildlife: ['One-Horned Rhino', 'Royal Bengal Tiger', 'Pygmy Hog'],
          keyFeature: 'Often called "Mini Kaziranga" due to its similar alluvial grassland ecology and dense rhino population.'
        },
        {
          name: 'Dibru-Saikhowa National Park',
          year: 1999,
          district: 'Dibrugarh and Tinsukia',
          riverOrBiome: 'Confluence of Brahmaputra and Lohit rivers',
          famousWildlife: ['Feral Horses', 'White-winged Wood Duck', 'Gangetic Dolphin'],
          keyFeature: 'River island national park noted for free-ranging feral horses and wetland avifauna.'
        },
        {
          name: 'Raimona National Park',
          year: 2021,
          district: 'Kokrajhar (BTR)',
          riverOrBiome: 'Sankosh & Saralbhanga rivers',
          famousWildlife: ['Gee\'s Golden Langur', 'Asian Elephant', 'Bengal Tiger'],
          keyFeature: 'Notified in 2021 in Bodoland, safeguarding the endemic Gee\'s Golden Langur.'
        },
        {
          name: 'Dihing Patkai National Park',
          year: 2021,
          district: 'Dibrugarh and Tinsukia',
          riverOrBiome: 'Dihing River / Lowland rainforest',
          famousWildlife: ['Hoolock Gibbon', 'Clouded Leopard', 'White-winged Wood Duck'],
          keyFeature: 'Celebrated as the "Amazon of the East"; largest stretch of lowland tropical rainforest in India.'
        }
      ]
    },
    questions: [
      {
        id: 'as-q1',
        state: 'Assam',
        parkName: 'Kaziranga National Park',
        question: 'Kaziranga National Park in Assam holds approximately what fraction of the world\'s entire surviving population of Great One-Horned Rhinoceroses?',
        options: [
          'Two-thirds (around 65–70%)',
          'One-fourth',
          'Ninety-nine percent',
          'One-tenth'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Kaziranga hosts around 2,600+ one-horned rhinos, representing roughly two-thirds of the world\'s wild population of this iconic species.',
        establishedYear: 1974,
        district: 'Golaghat, Nagaon & Sonitpur'
      },
      {
        id: 'as-q2',
        state: 'Assam',
        parkName: 'Manas National Park',
        question: 'Which critically endangered animal—the world\'s smallest and rarest wild pig—is found naturally only in Manas National Park in Assam?',
        options: [
          'Pygmy Hog (Porcula salvania)',
          'Babirusa',
          'Warthog',
          'Bearded Pig'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Pygmy Hog (Porcula salvania), standing barely 25 cm tall, was once thought extinct before being rediscovered in Manas, its last wild stronghold.',
        establishedYear: 1990,
        district: 'Baksa & Chirang'
      },
      {
        id: 'as-q3',
        state: 'Assam',
        parkName: 'Nameri National Park',
        question: 'Nameri National Park on the Jia Bhoroli River is famed for safeguarding which endangered bird, the official State Bird of Assam?',
        options: [
          'White-winged Wood Duck (Asarcornis scutulata / Deo Hah)',
          'Great Indian Hornbill',
          'Bengal Florican',
          'Black-necked Stork'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The White-winged Wood Duck (known locally as Deo Hah) is Assam\'s state bird, and Nameri is one of its primary protected habitats.',
        establishedYear: 1998,
        district: 'Sonitpur'
      },
      {
        id: 'as-q4',
        state: 'Assam',
        parkName: 'Orang National Park',
        question: 'Which National Park in Assam is popularly referred to as "Mini Kaziranga" due to its similar landscape and high density of rhinos?',
        options: [
          'Orang (Rajiv Gandhi) National Park',
          'Dihing Patkai National Park',
          'Raimona National Park',
          'Dibru-Saikhowa National Park'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Orang National Park on the north bank of the Brahmaputra is dubbed "Mini Kaziranga" due to its identical marshes and rich rhino population.',
        establishedYear: 1999,
        district: 'Darrang & Sonitpur'
      },
      {
        id: 'as-q5',
        state: 'Assam',
        parkName: 'Dihing Patkai National Park',
        question: 'Which National Park notified in Assam in 2021 is affectionately known as the "Amazon of the East"?',
        options: [
          'Dihing Patkai National Park',
          'Raimona National Park',
          'Nameri National Park',
          'Dibru-Saikhowa National Park'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dihing Patkai National Park in Dibrugarh and Tinsukia is called the "Amazon of the East" because it protects India\'s largest contiguous tropical lowland rainforest.',
        establishedYear: 2021,
        district: 'Dibrugarh & Tinsukia'
      },
      {
        id: 'as-q6',
        state: 'Assam',
        parkName: 'Dibru-Saikhowa National Park',
        question: 'Dibru-Saikhowa National Park is a unique river island biosphere in Assam particularly celebrated for which rare herd animals?',
        options: [
          'Feral Horses',
          'Wild Yaks',
          'Asiatic Cheetahs',
          'Kashmir Stags'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Dibru-Saikhowa is famous for free-roaming feral horses, descendants of army horses left behind during World War II.',
        establishedYear: 1999,
        district: 'Dibrugarh & Tinsukia'
      }
    ]
  },

  // ==========================================
  // 6. KARNATAKA
  // ==========================================
  'Karnataka': {
    stateInfo: {
      stateName: 'Karnataka',
      capital: 'Bengaluru',
      totalParks: 5,
      overview: 'Karnataka features 5 world-class National Parks across the Western Ghats and Deccan, home to the second highest tiger and elephant counts in India.',
      tipsForMahi: 'Remember "B-N-K-B-A": Bandipur (Project Tiger 1973), Nagarhole (Kabini), Kudremukh (Horse face), Bannerghatta (Butterfly park), Anshi/Kali (Black Panther).',
      parks: [
        {
          name: 'Bandipur National Park',
          year: 1974,
          district: 'Chamarajanagar',
          riverOrBiome: 'Kabini and Moyar rivers',
          famousWildlife: ['Asian Elephant', 'Tiger', 'Gaur', 'Dhole'],
          keyFeature: 'One of the first 9 Project Tiger reserves created in 1973; heart of Nilgiri Biosphere.'
        },
        {
          name: 'Nagarhole (Rajiv Gandhi) National Park',
          year: 1988,
          district: 'Kodagu and Mysuru',
          riverOrBiome: 'Kabini River reservoir',
          famousWildlife: ['Tiger', 'Black Panther', 'Elephant'],
          keyFeature: 'Separated from Bandipur by Kabini reservoir; famous for massive summer elephant congregations.'
        },
        {
          name: 'Kudremukh National Park',
          year: 1987,
          district: 'Chikkamagaluru, Udupi & Dakshina Kannada',
          riverOrBiome: 'Origin of Tunga, Bhadra & Netravathi',
          famousWildlife: ['Lion-tailed Macaque', 'Tiger', 'Malabar Civet'],
          keyFeature: 'Peak resembles a horse\'s face ("Kudre-mukha"); origin of three major rivers.'
        },
        {
          name: 'Bannerghatta National Park',
          year: 1974,
          district: 'Bengaluru Urban & Ramanagara',
          riverOrBiome: 'Elephant corridor',
          famousWildlife: ['Elephant', 'Tiger', 'Butterflies'],
          keyFeature: 'Contains India\'s first dedicated Butterfly Park conservatory, just 22 km from Bengaluru.'
        },
        {
          name: 'Anshi National Park (Kali Tiger Reserve)',
          year: 1987,
          district: 'Uttara Kannada',
          riverOrBiome: 'Kali River valley',
          famousWildlife: ['Black Panther (Melanistic Leopard)', 'Tiger', 'King Cobra'],
          keyFeature: 'Deep evergreen valleys along Kali River, world-famous for sightings of the rare Black Panther.'
        }
      ]
    },
    questions: [
      {
        id: 'ka-q1',
        state: 'Karnataka',
        parkName: 'Bandipur National Park',
        question: 'Bandipur National Park in Karnataka was one of the original 9 tiger reserves chosen at the historic launch of which project in 1973?',
        options: ['Project Tiger', 'Project Elephant', 'Project Rhino', 'Project Cheetah'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Bandipur was among the original nine reserves chosen when Project Tiger was launched by Indira Gandhi in 1973.',
        establishedYear: 1974,
        district: 'Chamarajanagar'
      },
      {
        id: 'ka-q2',
        state: 'Karnataka',
        parkName: 'Nagarhole National Park',
        question: 'Nagarhole National Park is separated from Bandipur National Park by the reservoir of which scenic river?',
        options: ['Kabini River', 'Sharavathi River', 'Tungabhadra River', 'Netravathi River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Kabini River reservoir separates Nagarhole and Bandipur, where hundreds of wild Asian elephants gather during peak summer.',
        establishedYear: 1988,
        district: 'Kodagu & Mysuru'
      },
      {
        id: 'ka-q3',
        state: 'Karnataka',
        parkName: 'Kudremukh National Park',
        question: 'What does the Kannada word "Kudremukha" literally mean in English?',
        options: ['Horse Face', 'Elephant Trunk', 'Tiger Claw', 'Lion Head'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'In Kannada, "Kudre" means horse and "Mukha" means face. A prominent mountain peak resembles the side profile of a horse\'s face.',
        establishedYear: 1987,
        district: 'Chikkamagaluru'
      },
      {
        id: 'ka-q4',
        state: 'Karnataka',
        parkName: 'Bannerghatta National Park',
        question: 'Bannerghatta National Park on the outskirts of Bengaluru is celebrated for opening India\'s first dedicated enclosure for which creatures in 2006?',
        options: [
          'Butterfly Conservatory (Park)',
          'Snow Leopard Den',
          'Pangolin Sanctuary',
          'Crocodile Bank'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'India\'s first dedicated Butterfly Park with a tropical dome and museum was inaugurated at Bannerghatta in 2006.',
        establishedYear: 1974,
        district: 'Bengaluru Urban'
      },
      {
        id: 'ka-q5',
        state: 'Karnataka',
        parkName: 'Anshi National Park',
        question: 'Anshi National Park (renamed Kali Tiger Reserve) in the Western Ghats is famous as one of the best locations to spot which rare big cat?',
        options: [
          'Black Panther (Melanistic Leopard)',
          'Clouded Leopard',
          'Snow Leopard',
          'Asiatic Cheetah'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The dense, rain-soaked rainforest of Kali / Anshi Tiger Reserve is famous for harboring a thriving population of melanistic leopards (Black Panthers).',
        establishedYear: 1987,
        district: 'Uttara Kannada'
      },
      {
        id: 'ka-q6',
        state: 'Karnataka',
        parkName: 'Kudremukh National Park',
        question: 'Three vital peninsular rivers—Tunga, Bhadra, and Netravathi—originate from hills inside which National Park in Karnataka?',
        options: ['Kudremukh National Park', 'Bandipur National Park', 'Bannerghatta National Park', 'Anshi National Park'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The sacred Ganga Moola hill inside Kudremukh National Park is the source of the Tunga, Bhadra, and Netravathi rivers.',
        establishedYear: 1987,
        district: 'Chikkamagaluru'
      }
    ]
  },

  // ==========================================
  // 7. TAMIL NADU (Ready for Day 02 addition)
  // ==========================================
  'Tamil Nadu': {
    stateInfo: {
      stateName: 'Tamil Nadu',
      capital: 'Chennai',
      totalParks: 5,
      overview: 'Tamil Nadu features 5 National Parks covering marine coral archipelagos, high-altitude Nilgiri peaks, and tropical evergreen scrub.',
      tipsForMahi: 'Remember Guindy (in Chennai), Gulf of Mannar (Dugong/Sea Cow), Mudumalai (Elephant Whisperers), Mukurthi (Nilgiri Tahr), Anamalai.',
      parks: [
        {
          name: 'Gulf of Mannar Marine National Park',
          year: 1986,
          district: 'Ramanathapuram and Thoothukudi',
          riverOrBiome: 'Coral reef archipelago (21 islands)',
          famousWildlife: ['Dugong (Sea Cow)', 'Olive Ridley Turtle', 'Corals'],
          keyFeature: 'India\'s first marine national park in South Asia; prime sanctuary for the vulnerable Dugong.'
        },
        {
          name: 'Guindy National Park',
          year: 1976,
          district: 'Chennai',
          riverOrBiome: 'Tropical dry evergreen scrub',
          famousWildlife: ['Blackbuck', 'Chital'],
          keyFeature: 'One of the very few national parks located completely within a metropolitan city.'
        },
        {
          name: 'Mudumalai National Park',
          year: 1990,
          district: 'Nilgiris',
          riverOrBiome: 'Moyar River',
          famousWildlife: ['Tiger', 'Asian Elephant', 'Vultures'],
          keyFeature: 'Home to the historic Theppakadu Elephant Camp (featured in the Oscar-winning documentary "The Elephant Whisperers").'
        },
        {
          name: 'Mukurthi National Park',
          year: 1990,
          district: 'Nilgiris',
          riverOrBiome: 'High-altitude shola and montane grasslands',
          famousWildlife: ['Nilgiri Tahr', 'Laughingthrush'],
          keyFeature: 'Created specifically to protect the keystone Nilgiri Tahr.'
        },
        {
          name: 'Indira Gandhi (Anamalai) National Park',
          year: 1989,
          district: 'Coimbatore and Tiruppur',
          riverOrBiome: 'Anamalai Hills',
          famousWildlife: ['Nilgiri Tahr', 'Asian Elephant', 'Tiger'],
          keyFeature: 'Spans scenic Topslip and Valparai plateau in the "Elephant Hills".'
        }
      ]
    },
    questions: [
      {
        id: 'tn-q1',
        state: 'Tamil Nadu',
        parkName: 'Gulf of Mannar Marine National Park',
        question: 'Which vulnerable marine herbivorous mammal (often called the "Sea Cow") is the flagship species of Gulf of Mannar Marine National Park?',
        options: ['Dugong (Dugong dugon)', 'Manatee', 'Blue Whale', 'Ganges River Dolphin'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Dugong (Dugong dugon) feeds on the extensive seagrass meadows of the Gulf of Mannar, India\'s prime dugong sanctuary.',
        establishedYear: 1986,
        district: 'Ramanathapuram & Thoothukudi'
      },
      {
        id: 'tn-q2',
        state: 'Tamil Nadu',
        parkName: 'Guindy National Park',
        question: 'Guindy National Park is uniquely situated completely within the urban boundaries of which metropolis?',
        options: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Guindy National Park is located inside Chennai city, directly adjoining the Tamil Nadu Raj Bhavan.',
        establishedYear: 1976,
        district: 'Chennai'
      },
      {
        id: 'tn-q3',
        state: 'Tamil Nadu',
        parkName: 'Mudumalai National Park',
        question: 'Mudumalai National Park houses India\'s oldest elephant camp (Theppakadu), featured in which Oscar-winning documentary?',
        options: ['The Elephant Whisperers', 'My Octopus Teacher', 'March of the Penguins', 'Born in China'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Theppakadu Elephant Camp in Mudumalai was the setting for Kartiki Gonsalves\' Oscar-winning documentary "The Elephant Whisperers" (2022).',
        establishedYear: 1990,
        district: 'Nilgiris'
      },
      {
        id: 'tn-q4',
        state: 'Tamil Nadu',
        parkName: 'Mukurthi National Park',
        question: 'Mukurthi National Park in the Nilgiris was established specifically with the objective of safeguarding which animal?',
        options: ['Nilgiri Tahr', 'Lion-tailed Macaque', 'Royal Bengal Tiger', 'Gaur'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Mukurthi was carved out to protect the Nilgiri Tahr in its pristine high-altitude montane shola-grassland ecosystem.',
        establishedYear: 1990,
        district: 'Nilgiris'
      },
      {
        id: 'tn-q5',
        state: 'Tamil Nadu',
        parkName: 'Indira Gandhi (Anamalai) National Park',
        question: 'What does the Tamil name "Anamalai" literally mean?',
        options: ['Elephant Hill', 'Tiger Mountain', 'Horse Rock', 'Peacock Peak'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'In Tamil, "Aanai" means elephant and "Malai" means hill or mountain, denoting the historic abundance of elephant herds.',
        establishedYear: 1989,
        district: 'Coimbatore & Tiruppur'
      }
    ]
  },

  // ==========================================
  // 8. RAJASTHAN (Ready for Day 03 addition)
  // ==========================================
  'Rajasthan': {
    stateInfo: {
      stateName: 'Rajasthan',
      capital: 'Jaipur',
      totalParks: 5,
      overview: 'Rajasthan showcases 5 National Parks ranging from the Thar Desert sand dunes to Aravalli tiger hills and Ramsar wetland bird sanctuaries.',
      tipsForMahi: 'Remember Keoladeo Ghana (Bharatpur bird UNESCO), Ranthambore (Tigers & Fort), Desert NP (Great Indian Bustard), Sariska (Tiger airlift), Mukundra Hills.',
      parks: [
        {
          name: 'Keoladeo Ghana National Park',
          year: 1981,
          district: 'Bharatpur',
          riverOrBiome: 'Wetland marsh (Gambhir & Banganga rivers)',
          famousWildlife: ['Siberian Crane (historical)', 'Painted Stork', 'Sarus Crane'],
          keyFeature: 'UNESCO World Heritage wetland hosting over 370 bird species during winter migrations.',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (1985)'
        },
        {
          name: 'Ranthambore National Park',
          year: 1980,
          district: 'Sawai Madhopur',
          riverOrBiome: 'Confluence of Banas and Chambal rivers',
          famousWildlife: ['Royal Bengal Tiger', 'Marsh Crocodile', 'Leopard'],
          keyFeature: 'Famous for diurnal tigers hunting around the 10th-century Ranthambore Fort and legendary tigress Machli.'
        },
        {
          name: 'Desert National Park',
          year: 1992,
          district: 'Jaisalmer and Barmer',
          riverOrBiome: 'Thar Desert sand dunes',
          famousWildlife: ['Great Indian Bustard (Godawan)', 'Desert Fox', 'Chinkara'],
          keyFeature: 'One of India\'s largest national parks (~3,162 sq km); last major refuge for the critically endangered Great Indian Bustard.'
        },
        {
          name: 'Sariska National Park',
          year: 1982,
          district: 'Alwar',
          riverOrBiome: 'Aravalli Range dry thorn forest',
          famousWildlife: ['Tiger', 'Sambhar', 'Leopard'],
          keyFeature: 'World\'s first successful tiger relocation via Indian Air Force helicopters (2008).'
        },
        {
          name: 'Mukundra Hills National Park',
          year: 2004,
          district: 'Kota, Bundi, Jhalawar',
          riverOrBiome: 'Chambal River valley',
          famousWildlife: ['Tiger', 'Leopard', 'Sloth Bear'],
          keyFeature: 'Nestled between parallel mountain ridges along the Chambal river valley.'
        }
      ]
    },
    questions: [
      {
        id: 'rj-q1',
        state: 'Rajasthan',
        parkName: 'Keoladeo Ghana National Park',
        question: 'Keoladeo Ghana National Park in Bharatpur is a UNESCO World Heritage Site historically renowned as the wintering ground for which critically endangered migratory bird?',
        options: ['Siberian Crane (Leucogeranus leucogeranus)', 'Greater Flamingo', 'Bar-headed Goose', 'Great White Pelican'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Keoladeo was globally celebrated as the primary winter home for the central population of the Siberian Crane.',
        establishedYear: 1981,
        district: 'Bharatpur'
      },
      {
        id: 'rj-q2',
        state: 'Rajasthan',
        parkName: 'Desert National Park',
        question: 'Desert National Park in Jaisalmer and Barmer is the prime natural sanctuary for which critically endangered bird (State Bird of Rajasthan)?',
        options: ['Great Indian Bustard (Godawan)', 'Lesser Florican', 'Indian Peafowl', 'Houbara Bustard'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Great Indian Bustard (Godawan), critically endangered with under 150 birds left globally, has its main breeding refuge in Desert National Park.',
        establishedYear: 1992,
        district: 'Jaisalmer & Barmer'
      },
      {
        id: 'rj-q3',
        state: 'Rajasthan',
        parkName: 'Ranthambore National Park',
        question: 'Which legendary tigress of Ranthambore, celebrated as the "Queen of Ranthambore", lived to an exceptional age of nearly 20 years?',
        options: ['Machli (T-16)', 'Collarwali', 'Sundari', 'Avani'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Machli (T-16) was India\'s most famous wild tigress, known for surviving fights with large crocodiles and mothering generations of tigers.',
        establishedYear: 1980,
        district: 'Sawai Madhopur'
      },
      {
        id: 'rj-q4',
        state: 'Rajasthan',
        parkName: 'Sariska National Park',
        question: 'In 2008, Sariska made global wildlife history by executing which unprecedented conservation operation?',
        options: [
          'Airlifting wild tigers from Ranthambore to Sariska using helicopters',
          'Cloning an Asiatic cheetah',
          'Reintroducing Asiatic lions',
          'Building a 200-km fence'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'After all tigers were poached in 2004, Sariska was repopulated in 2008 by airlifting wild tigers from Ranthambore using IAF helicopters—a global first.',
        establishedYear: 1982,
        district: 'Alwar'
      },
      {
        id: 'rj-q5',
        state: 'Rajasthan',
        parkName: 'Desert National Park',
        question: 'Akal Wood Fossil Park, preserving 180-million-year-old petrified tree trunks from the Jurassic period, is part of which National Park?',
        options: ['Desert National Park', 'Mukundra Hills National Park', 'Keoladeo National Park', 'Sariska National Park'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Akal Wood Fossil Park is in Desert National Park near Jaisalmer, preserving Jurassic marine and wood fossils from when Thar was submerged.',
        establishedYear: 1992,
        district: 'Jaisalmer'
      }
    ]
  },

  // ==========================================
  // 9. GUJARAT
  // ==========================================
  'Gujarat': {
    stateInfo: {
      stateName: 'Gujarat',
      capital: 'Gandhinagar',
      totalParks: 4,
      overview: 'Gujarat boasts 4 officially notified National Parks, hosting the sole wild refuge of the Asiatic Lion, India’s first marine national park, and vast blackbuck grasslands.',
      tipsForMahi: 'Remember "G-B-M-V": Gir (Asiatic Lion), Blackbuck (Velavadar), Marine (Gulf of Kutch), and Vansda (Dangs rainforest).',
      parks: [
        {
          name: 'Gir National Park',
          year: 1975,
          district: 'Junagadh, Gir Somnath, and Amreli',
          riverOrBiome: 'Hiran and Shetrunji river basin / Dry deciduous teak forest',
          famousWildlife: ['Asiatic Lion (Panthera leo persica)', 'Indian Leopard', 'Sambar', 'Chital'],
          keyFeature: 'The only place on Earth where the Asiatic Lion survives in the wild.',
          unescoOrSpecialStatus: 'Global Sanctuary for the Asiatic Lion'
        },
        {
          name: 'Blackbuck National Park, Velavadar',
          year: 1976,
          district: 'Bhavnagar',
          riverOrBiome: 'Semi-arid coastal saline grassland (Bhal region)',
          famousWildlife: ['Blackbuck', 'Lesser Florican', 'Indian Wolf', 'Striped Hyena'],
          keyFeature: 'World\'s largest roosting site for harriers and premier breeding sanctuary for the endangered Lesser Florican.'
        },
        {
          name: 'Marine National Park, Gulf of Kutch',
          year: 1982,
          district: 'Jamnagar and Devbhumi Dwarka',
          riverOrBiome: 'Intertidal coral reef ecosystem (42 islands)',
          famousWildlife: ['Dugong', 'Coral Reefs (52 species)', 'Whale Shark', 'Green Sea Turtle'],
          keyFeature: 'India\'s first marine national park; visitors can walk on the reef at low tide without diving!'
        },
        {
          name: 'Vansda National Park',
          year: 1979,
          district: 'Navsari',
          riverOrBiome: 'Ambika River / Dangs moist deciduous forest',
          famousWildlife: ['Indian Leopard', 'Four-horned Antelope (Chousingha)', 'Barking Deer'],
          keyFeature: 'Dense canopy of towering bamboo and teak with zero commercial felling since 1952.'
        }
      ]
    },
    questions: [
      {
        id: 'gj-q1',
        state: 'Gujarat',
        parkName: 'Gir National Park',
        question: 'Gir National Park in Gujarat is globally renowned as the sole surviving natural sanctuary on Earth for which magnificent big cat?',
        options: ['Asiatic Lion (Panthera leo persica)', 'Royal Bengal Tiger', 'Snow Leopard', 'Clouded Leopard'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Gir is the only natural home in the entire world for the wild Asiatic Lion, rescued from fewer than 20 individuals to over 670+ lions today.',
        establishedYear: 1975,
        district: 'Gir Somnath, Junagadh & Amreli'
      },
      {
        id: 'gj-q2',
        state: 'Gujarat',
        parkName: 'Marine National Park, Gulf of Kutch',
        question: 'Declared in 1982 in the Gulf of Kutch, which historical distinction does this protected area hold in India?',
        options: [
          'It is India\'s first Marine National Park',
          'It is India\'s highest altitude park',
          'It has the world\'s deepest freshwater trench',
          'It is India\'s largest desert park'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Marine National Park in the Gulf of Kutch (Jamnagar) was notified in 1982 as India\'s very first marine national park, protecting 42 islands and coral reefs.',
        establishedYear: 1982,
        district: 'Jamnagar & Devbhumi Dwarka'
      },
      {
        id: 'gj-q3',
        state: 'Gujarat',
        parkName: 'Blackbuck National Park, Velavadar',
        question: 'Velavadar National Park in Bhavnagar district is an internationally acclaimed grassland haven for which critically endangered bustard bird?',
        options: [
          'Lesser Florican (Kharmore)',
          'Great Indian Bustard',
          'Bengal Florican',
          'Houbara Bustard'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Velavadar protects the world\'s most important breeding population of the Lesser Florican (Sypheotides indicus), famous for its courtship vertical leaps.',
        establishedYear: 1976,
        district: 'Bhavnagar'
      },
      {
        id: 'gj-q4',
        state: 'Gujarat',
        parkName: 'Vansda National Park',
        question: 'Which river flows through Vansda National Park in the South Gujarat Dangs forest tract?',
        options: ['Ambika River', 'Narmada River', 'Tapi River', 'Sabarmati River'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The perennial Ambika River flows through the lush moist deciduous forests of Vansda National Park in Navsari district.',
        establishedYear: 1979,
        district: 'Navsari'
      },
      {
        id: 'gj-q5',
        state: 'Gujarat',
        parkName: 'Gir National Park',
        question: 'Which indigenous pastoral community has traditionally coexisted alongside Asiatic Lions inside the Gir forest for centuries?',
        options: ['Maldharis', 'Gaddis', 'Bakarwals', 'Todas'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Maldhari community (Gujarati pastoralists) lives in small settlements called "Nesses" inside Gir, famous for their harmonious coexistence with lions.',
        establishedYear: 1975
      }
    ]
  },

  // ==========================================
  // 10. UTTARAKHAND
  // ==========================================
  'Uttarakhand': {
    stateInfo: {
      stateName: 'Uttarakhand',
      capital: 'Dehradun',
      totalParks: 6,
      overview: 'Uttarakhand in the Western Himalayas hosts 6 world-famous National Parks, including India\'s oldest park (Jim Corbett) and two UNESCO World Heritage alpine havens.',
      tipsForMahi: 'Remember Corbett (India\'s 1st NP 1936), Valley of Flowers (UNESCO alpine flora), Nanda Devi (UNESCO peak), Rajaji (Elephants), Gangotri (Gaumukh glacier), Govind.',
      parks: [
        {
          name: 'Jim Corbett National Park',
          year: 1936,
          district: 'Nainital and Pauri Garhwal',
          riverOrBiome: 'Ramganga River valley / Shivalik foothills',
          famousWildlife: ['Royal Bengal Tiger', 'Asian Elephant', 'Gharial'],
          keyFeature: 'India’s first ever National Park (originally Hailey NP in 1936); site where Project Tiger was officially launched in 1973.',
          unescoOrSpecialStatus: 'India\'s First National Park'
        },
        {
          name: 'Valley of Flowers National Park',
          year: 1982,
          district: 'Chamoli',
          riverOrBiome: 'Pushpawati River / Zanskar alpine meadows',
          famousWildlife: ['Snow Leopard', 'Asiatic Black Bear', 'Musk Deer', 'Over 500 floral species'],
          keyFeature: 'UNESCO World Heritage Site; discovered by mountaineer Frank Smythe in 1931, blanketed in endemic alpine blooms.',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (2005)'
        },
        {
          name: 'Nanda Devi National Park',
          year: 1982,
          district: 'Chamoli',
          riverOrBiome: 'Rishi Ganga gorge / Glacial sanctuary',
          famousWildlife: ['Snow Leopard', 'Himalayan Musk Deer', 'Bharal (Blue Sheep)'],
          keyFeature: 'UNESCO World Heritage Site encircling India’s second-highest peak, Mount Nanda Devi (7,816 m).',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (1988)'
        },
        {
          name: 'Rajaji National Park',
          year: 1983,
          district: 'Haridwar, Dehradun, and Pauri Garhwal',
          riverOrBiome: 'Ganges River basin / Shivalik hills',
          famousWildlife: ['Asian Elephant', 'Tiger', 'Leopard', 'King Cobra'],
          keyFeature: 'Named in honour of freedom fighter C. Rajagopalachari ("Rajaji"); vital northern corridor for wild Asian elephants.'
        },
        {
          name: 'Gangotri National Park',
          year: 1989,
          district: 'Uttarkashi',
          riverOrBiome: 'Bhagirathi River origin / Gaumukh Glacier',
          famousWildlife: ['Snow Leopard', 'Blue Sheep', 'Himalayan Monal', 'Ibex'],
          keyFeature: 'Protects the sacred Gaumukh Glacier, the physical source of the holy River Ganga.'
        }
      ]
    },
    questions: [
      {
        id: 'uk-q1',
        state: 'Uttarakhand',
        parkName: 'Jim Corbett National Park',
        question: 'What was the original name of Jim Corbett National Park when it was established in 1936 as mainland Asia\'s first National Park?',
        options: ['Hailey National Park', 'Ramganga National Park', 'Garhwal National Park', 'Kumaon National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Established in 1936 under British administration, it was named Hailey National Park after Governor Sir Malcolm Hailey, before being renamed after naturalist Jim Corbett in 1957.',
        establishedYear: 1936,
        district: 'Nainital & Pauri Garhwal'
      },
      {
        id: 'uk-q2',
        state: 'Uttarakhand',
        parkName: 'Valley of Flowers National Park',
        question: 'Which British mountaineer and botanist accidentally stumbled upon and popularized the "Valley of Flowers" in 1931 while returning from Mount Kamet?',
        options: ['Frank S. Smythe', 'Jim Corbett', 'George Mallory', 'Edward Pritchard Gee'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Frank S. Smythe, along with Eric Shipton and R.L. Holdsworth, lost their way in monsoon fog in 1931 and stumbled into the valley, publishing the famous book "The Valley of Flowers".',
        establishedYear: 1982,
        district: 'Chamoli'
      },
      {
        id: 'uk-q3',
        state: 'Uttarakhand',
        parkName: 'Nanda Devi National Park',
        question: 'What is the name of the deep, impassable river gorge through which explorers first gained entry into the inner Nanda Devi sanctuary in 1934?',
        options: ['Rishi Ganga Gorge', 'Alaknanda Gorge', 'Bhagirathi Gorge', 'Mandakini Gorge'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Mountaineers Eric Shipton and H.W. Tilman forced a route through the precipitous Rishi Ganga Gorge in 1934, unlocking the inner sanctuary of Nanda Devi.',
        establishedYear: 1982,
        district: 'Chamoli'
      },
      {
        id: 'uk-q4',
        state: 'Uttarakhand',
        parkName: 'Rajaji National Park',
        question: 'Rajaji National Park in the Shivalik foothills was named in honour of which prominent leader, the last Governor-General of independent India?',
        options: [
          'C. Rajagopalachari (Rajaji)',
          'Dr. Rajendra Prasad',
          'Sardar Vallabhbhai Patel',
          'Jawaharlal Nehru'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The park honours Bharat Ratna recipient C. Rajagopalachari (popularly known as "Rajaji"), the first Indian Governor-General of free India.',
        establishedYear: 1983,
        district: 'Haridwar, Dehradun & Pauri'
      },
      {
        id: 'uk-q5',
        state: 'Uttarakhand',
        parkName: 'Gangotri National Park',
        question: 'The Gaumukh Glacier, the revered origin point of the holy river Bhagirathi (Ganga), is preserved inside which National Park?',
        options: ['Gangotri National Park', 'Govind National Park', 'Jim Corbett National Park', 'Rajaji National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Gaumukh, the snout of the 30-km long Gangotri Glacier where the Bhagirathi river emerges, is located inside Gangotri National Park in Uttarkashi district.',
        establishedYear: 1989,
        district: 'Uttarkashi'
      }
    ]
  },

  // ==========================================
  // 11. WEST BENGAL
  // ==========================================
  'West Bengal': {
    stateInfo: {
      stateName: 'West Bengal',
      capital: 'Kolkata',
      totalParks: 6,
      overview: 'West Bengal spans from the alpine Himalayas in Darjeeling down to the world’s largest mangrove delta in the Sundarbans, protecting 6 National Parks.',
      tipsForMahi: 'Remember Sundarbans (Tidal mangrove & swimming tigers - UNESCO), Jaldapara & Gorumara (Rhinos), Singalila (Red Panda & Sandakphu peak), Neora Valley, Buxa.',
      parks: [
        {
          name: 'Sundarbans National Park',
          year: 1984,
          district: 'South 24 Parganas',
          riverOrBiome: 'Ganges-Brahmaputra-Meghna delta mangrove forest',
          famousWildlife: ['Royal Bengal Tiger (Swimming Tigers)', 'Saltwater Crocodile', 'Gangetic Dolphin'],
          keyFeature: 'UNESCO World Heritage Site; world’s largest mangrove forest delta, famous for tidal tigers adapted to drinking saline water.',
          unescoOrSpecialStatus: 'UNESCO World Heritage Site (1987) & Ramsar Wetland'
        },
        {
          name: 'Jaldapara National Park',
          year: 2012,
          district: 'Alipurduar',
          riverOrBiome: 'Torsa River floodplains',
          famousWildlife: ['Great One-Horned Rhinoceros', 'Asian Elephant', 'Bengal Florican'],
          keyFeature: 'Holds the second largest population of One-horned Rhinoceroses in India after Kaziranga.'
        },
        {
          name: 'Singalila National Park',
          year: 1992,
          district: 'Darjeeling',
          riverOrBiome: 'Eastern Himalayan alpine ridge (2,400m to 3,636m)',
          famousWildlife: ['Red Panda (Ailurus fulgens)', 'Himalayan Black Bear', 'Clouded Leopard'],
          keyFeature: 'Contains Sandakphu (3,636m), the highest peak in West Bengal, offering panoramic views of Everest and Kanchenjunga.'
        },
        {
          name: 'Gorumara National Park',
          year: 1994,
          district: 'Jalpaiguri',
          riverOrBiome: 'Murti and Raidak rivers (Dooars floodplains)',
          famousWildlife: ['Indian Rhinoceros', 'Gaur', 'Elephant'],
          keyFeature: 'Renowned for open watchtowers (Jatraprasad & Rhino point) overlooking the riverbed.'
        }
      ]
    },
    questions: [
      {
        id: 'wb-q1',
        state: 'West Bengal',
        parkName: 'Sundarbans National Park',
        question: 'Which mangrove tree species, featuring breathing root spikes (pneumatophores), is the Sundarbans named after?',
        options: ['Sundari (Heritiera fomes)', 'Rhizophora', 'Avicennia', 'Sonneratia'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Sundarbans gets its name from the "Sundari" tree (Heritiera fomes), which dominates this vast mangrove forest delta.',
        establishedYear: 1984,
        district: 'South 24 Parganas'
      },
      {
        id: 'wb-q2',
        state: 'West Bengal',
        parkName: 'Jaldapara National Park',
        question: 'Jaldapara National Park in the Dooars along the Torsa River holds which remarkable wildlife record in India?',
        options: [
          'Second largest population of Great One-Horned Rhinos in India',
          'Only wild habitat of the Snow Leopard',
          'Highest lion population',
          'Largest flamingo nesting colony'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Jaldapara holds over 290+ One-Horned Rhinos, second only to Kaziranga National Park in India.',
        establishedYear: 2012,
        district: 'Alipurduar'
      },
      {
        id: 'wb-q3',
        state: 'West Bengal',
        parkName: 'Singalila National Park',
        question: 'Singalila National Park in Darjeeling is globally celebrated for its successful conservation and breeding program for which elusive arboreal mammal?',
        options: [
          'Red Panda (Ailurus fulgens)',
          'Lion-tailed Macaque',
          'Nilgiri Tahr',
          'Golden Langur'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Singalila is India\'s prime wild habitat for the endangered Red Panda, supported by the Padmaja Naidu Himalayan Zoological Park captive breeding program.',
        establishedYear: 1992,
        district: 'Darjeeling'
      },
      {
        id: 'wb-q4',
        state: 'West Bengal',
        parkName: 'Sundarbans National Park',
        question: 'What unique hunting and survival behavior distinguishes the Royal Bengal Tigers of the Sundarbans from tigers in all other Indian forests?',
        options: [
          'They regularly swim across wide tidal sea rivers and drink brackish saline water',
          'They live in mountain caves',
          'They hunt exclusively in trees',
          'They are strictly vegetarian'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Sundarbans tigers have adapted to an amphibious lifestyle, swimming across wide saline sea channels and preying on mudskippers, crabs, and spotted deer.',
        establishedYear: 1984
      },
      {
        id: 'wb-q5',
        state: 'West Bengal',
        parkName: 'Singalila National Park',
        question: 'What is the highest mountain summit in West Bengal (3,636 metres), situated along the ridge of Singalila National Park?',
        options: ['Sandakphu', 'Phalut', 'Tiger Hill', 'Tonglu'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Sandakphu (3,636 m) on the Singalila Ridge is the highest point in West Bengal, famous for offering views of four of the world\'s five highest peaks (Everest, Kanchenjunga, Lhotse, Makalu).',
        establishedYear: 1992,
        district: 'Darjeeling'
      }
    ]
  },

  // ==========================================
  // 12. ODISHA
  // ==========================================
  'Odisha': {
    stateInfo: {
      stateName: 'Odisha',
      capital: 'Bhubaneswar',
      totalParks: 2,
      overview: 'Odisha hosts 2 world-class National Parks: Simlipal (famed for melanistic black tigers and waterfalls) and Bhitarkanika (famed for giant saltwater crocodiles).',
      tipsForMahi: 'Remember "S-B": Simlipal (UNESCO Biosphere & Black Tigers) and Bhitarkanika (Mangroves, Giant Crocodiles & Gahirmatha Olive Ridleys).',
      parks: [
        {
          name: 'Simlipal National Park',
          year: 1980,
          district: 'Mayurbhanj',
          riverOrBiome: 'Sal forest / Eastern Ghats highlands',
          famousWildlife: ['Melanistic (Black) Tigers', 'Asian Elephant', 'Gaur', 'Mugger Crocodile'],
          keyFeature: 'World\'s ONLY known wild habitat with pseudo-melanistic (black) tigers; contains the breathtaking Barehipani (399m) and Joranda waterfalls.',
          unescoOrSpecialStatus: 'UNESCO Biosphere Reserve (2009)'
        },
        {
          name: 'Bhitarkanika National Park',
          year: 1998,
          district: 'Kendrapara',
          riverOrBiome: 'Brahmani, Baitarani, and Dhamra river delta',
          famousWildlife: ['Saltwater Crocodile (Crocodylus porosus)', 'White Crocodile (Sankhua)', 'Olive Ridley Sea Turtle', 'King Cobras'],
          keyFeature: 'India’s second largest mangrove ecosystem after Sundarbans; home to record-breaking 23-foot Saltwater Crocodiles; adjoins Gahirmatha beach.',
          unescoOrSpecialStatus: 'Ramsar Wetland Site (2002)'
        }
      ]
    },
    questions: [
      {
        id: 'od-q1',
        state: 'Odisha',
        parkName: 'Simlipal National Park',
        question: 'Simlipal National Park in Mayurbhanj district is globally unique as the world\'s only wild habitat where which rare color variant of tiger is recorded?',
        options: [
          'Pseudo-melanistic (Black) Tigers',
          'Golden Tabby Tigers',
          'Albino Tigers',
          'Blue Tigers'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Simlipal is the only place on Earth with wild pseudo-melanistic tigers, caused by a genetic mutation (Taqpep gene) causing thick, overlapping dark stripes.',
        establishedYear: 1980,
        district: 'Mayurbhanj'
      },
      {
        id: 'od-q2',
        state: 'Odisha',
        parkName: 'Bhitarkanika National Park',
        question: 'Bhitarkanika National Park in Kendrapara district holds the Guinness World Record for the largest documented wild specimens of which reptile?',
        options: [
          'Saltwater Crocodile (Crocodylus porosus)',
          'Gharial',
          'King Cobra',
          'Komodo Dragon'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Bhitarkanika protects over 1,800 saltwater crocodiles, including giant specimens measuring up to 23 feet, documented by the Guinness World Records.',
        establishedYear: 1998,
        district: 'Kendrapara'
      },
      {
        id: 'od-q3',
        state: 'Odisha',
        parkName: 'Simlipal National Park',
        question: 'Which towering waterfall in Simlipal National Park, falling from a height of ~399 metres in two tiers, is the second highest waterfall in India?',
        options: ['Barehipani Falls', 'Joranda Falls', 'Dudhsagar Falls', 'Nohkalikai Falls'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Barehipani Falls on the Budhabalanga River cascades 399 metres down a cliff in Simlipal, making it the second highest waterfall in India.',
        establishedYear: 1980,
        district: 'Mayurbhanj'
      },
      {
        id: 'od-q4',
        state: 'Odisha',
        parkName: 'Bhitarkanika National Park',
        question: 'Adjacent to Bhitarkanika National Park lies Gahirmatha Beach, world-renowned as the planet\'s largest mass-nesting (Arribada) site for which marine creatures?',
        options: [
          'Olive Ridley Sea Turtles (Lepidochelys olivacea)',
          'Leatherback Sea Turtles',
          'Dugongs',
          'Horseshoe Crabs'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Gahirmatha Marine Sanctuary, abutting Bhitarkanika, hosts the world\'s largest mass nesting aggregation (Arribada) where hundreds of thousands of Olive Ridley turtles lay eggs.',
        establishedYear: 1998,
        district: 'Kendrapara'
      },
      {
        id: 'od-q5',
        state: 'Odisha',
        parkName: 'Simlipal National Park',
        question: 'Simlipal derives its name from which prominent red-flowering forest tree that blooms profusely across its hills in spring?',
        options: ['Simul (Red Silk Cotton tree / Bombax ceiba)', 'Sal tree', 'Palash (Flame of the Forest)', 'Teak tree'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The name Simlipal originates from the "Simul" (Red Silk Cotton tree, Bombax ceiba) which sets the forests ablaze in scarlet flowers during spring.',
        establishedYear: 1980,
        district: 'Mayurbhanj'
      }
    ]
  },

  // ==========================================
  // 13. MAHARASHTRA
  // ==========================================
  'Maharashtra': {
    stateInfo: {
      stateName: 'Maharashtra',
      capital: 'Mumbai',
      totalParks: 6,
      overview: 'Maharashtra boasts 6 National Parks extending from the UNESCO Western Ghats (Sahyadri) to the dense dry deciduous tiger corridors of Vidarbha.',
      tipsForMahi: 'Remember Tadoba is the oldest national park in Maharashtra! Core parks: Tadoba, Sanjay Gandhi (Borivali), Gugamal, Navegaon, Pench Maharashtra, Chandoli.',
      parks: [
        {
          name: 'Tadoba National Park',
          year: 1955,
          district: 'Chandrapur',
          riverOrBiome: 'Andhari River / Tadoba Lake',
          famousWildlife: ['Royal Bengal Tiger', 'Leopard', 'Sloth Bear', 'Dhole'],
          keyFeature: 'Maharashtra\'s oldest and largest national park; famous as the "Jewel of Vidarbha" with high tiger density.'
        },
        {
          name: 'Sanjay Gandhi National Park',
          year: 1983,
          district: 'Mumbai Suburban and Thane',
          riverOrBiome: 'Dahisar River / Tulsi Lake',
          famousWildlife: ['Leopard', 'Spotted Deer', 'Rhesus Macaque'],
          keyFeature: 'One of the world\'s most visited urban parks; houses the 2,400-year-old rock-cut Kanheri Caves.'
        },
        {
          name: 'Gugamal National Park',
          year: 1975,
          district: 'Amravati',
          riverOrBiome: 'Satpura range / Melghat',
          famousWildlife: ['Tiger', 'Gaur', 'Four-horned Antelope (Chausingha)'],
          keyFeature: 'Core area of Melghat Tiger Reserve along the rugged hills of the Satpura mountain range.'
        },
        {
          name: 'Chandoli National Park',
          year: 2004,
          district: 'Sangli, Satara, Kolhapur, Ratnagiri',
          riverOrBiome: 'Warna River / Vasant Sagar Reservoir',
          famousWildlife: ['Bengal Tiger', 'Indian Leopard', 'Barking Deer'],
          keyFeature: 'Sprawls across the crest of the Western Ghats; inscribed as a UNESCO World Heritage natural site in 2012.'
        }
      ]
    },
    questions: [
      {
        id: 'mh-q1',
        state: 'Maharashtra',
        parkName: 'Tadoba National Park',
        question: 'Which national park, established in 1955 in Chandrapur district, is the oldest and largest national park in Maharashtra, famously known as the "Jewel of Vidarbha"?',
        options: ['Tadoba National Park', 'Gugamal National Park', 'Navegaon National Park', 'Chandoli National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Tadoba National Park was created in 1955, making it Maharashtra\'s oldest national park. It forms the Tadoba Andhari Tiger Reserve along with Andhari Sanctuary.',
        establishedYear: 1955,
        district: 'Chandrapur'
      },
      {
        id: 'mh-q2',
        state: 'Maharashtra',
        parkName: 'Sanjay Gandhi National Park',
        question: 'Which world-famous urban national park in Mumbai contains the ancient 2,400-year-old Buddhist rock-cut Kanheri Caves and Dahisar River?',
        options: ['Sanjay Gandhi National Park (Borivali)', 'Chandoli National Park', 'Gugamal National Park', 'Pench National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Sanjay Gandhi National Park (formerly Borivali NP) covers 103 sq km in northern Mumbai and Thane, housing over 100 ancient Buddhist rock-cut Kanheri Caves.',
        establishedYear: 1983,
        district: 'Mumbai Suburban and Thane'
      },
      {
        id: 'mh-q3',
        state: 'Maharashtra',
        parkName: 'Gugamal National Park',
        question: 'Gugamal National Park in Amravati district forms the core protected zone of which historic Tiger Reserve located in the Satpura Range?',
        options: ['Melghat Tiger Reserve', 'Sahyadri Tiger Reserve', 'Navegaon-Nagzira', 'Bor Tiger Reserve'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Gugamal National Park covers 361.28 sq km in the rugged Chikhaldara and Dharni tehsils, forming the core zone of Melghat Tiger Reserve.',
        establishedYear: 1975,
        district: 'Amravati'
      },
      {
        id: 'mh-q4',
        state: 'Maharashtra',
        parkName: 'Chandoli National Park',
        question: 'Chandoli National Park, part of the UNESCO World Heritage Western Ghats, is situated along the catchment basin of which river and reservoir?',
        options: ['Warna River and Vasant Sagar Reservoir', 'Koyna River and Shivsagar Lake', 'Godavari River', 'Tapi River'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Chandoli National Park lies on the crest of the Sahyadri range around the Vasant Sagar reservoir impounded by the Warna Dam.',
        establishedYear: 2004,
        district: 'Sangli, Satara, Kolhapur and Ratnagiri'
      },
      {
        id: 'mh-q5',
        state: 'Maharashtra',
        parkName: 'Navegaon National Park',
        question: 'Which national park in Gondia district features a picturesque 18th-century lake built by Kolu Patel Kohli and serves as a major waterfowl sanctuary?',
        options: ['Navegaon National Park', 'Tadoba National Park', 'Radhanagari', 'Koyna National Park'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Navegaon National Park in eastern Vidarbha surrounds Navegaon Lake and was famously associated with ornithological studies by Dr. Salim Ali.',
        establishedYear: 1975,
        district: 'Gondia'
      }
    ]
  },

  // ==========================================
  // 14. HIMACHAL PRADESH
  // ==========================================
  'Himachal Pradesh': {
    stateInfo: {
      stateName: 'Himachal Pradesh',
      capital: 'Shimla',
      totalParks: 5,
      overview: 'Himachal Pradesh preserves pristine alpine ecosystems, snow leopard ranges, and deodar forests across 5 National Parks.',
      tipsForMahi: 'Remember Great Himalayan NP is a UNESCO Natural Heritage Site! Core parks: Great Himalayan, Pin Valley, Inderkilla, Khirganga, Simbalbara.',
      parks: [
        {
          name: 'Great Himalayan National Park',
          year: 1984,
          district: 'Kullu',
          riverOrBiome: 'Tirthan, Sainj, and Parvati Rivers',
          famousWildlife: ['Western Tragopan', 'Snow Leopard', 'Himalayan Musk Deer', 'Blue Sheep'],
          keyFeature: 'Inscribed as a UNESCO World Heritage Site in 2014; world stronghold of the vulnerable Western Tragopan.'
        },
        {
          name: 'Pin Valley National Park',
          year: 1987,
          district: 'Lahaul and Spiti',
          riverOrBiome: 'Pin River / Cold Desert Biome',
          famousWildlife: ['Snow Leopard', 'Siberian Ibex', 'Tibetan Gazelle', 'Chough'],
          keyFeature: 'Cold desert alpine park located south of Dhankar Gompa in Spiti Valley, steeped in Tibetan Buddhist heritage.'
        },
        {
          name: 'Simbalbara National Park',
          year: 2010,
          district: 'Sirmaur',
          riverOrBiome: 'Paonta Valley / Shivalik foothills',
          famousWildlife: ['Goral', 'Sambar', 'Chital', 'Himalayan Black Bear'],
          keyFeature: 'Lush Sal forest valley in the Shivaliks, now also known as Col. Sher Jung National Park.'
        }
      ]
    },
    questions: [
      {
        id: 'hp-q1',
        state: 'Himachal Pradesh',
        parkName: 'Great Himalayan National Park',
        question: 'Which national park in Kullu district was inscribed as a UNESCO World Heritage Site in 2014 for its extraordinary biodiversity and protection of the Western Tragopan?',
        options: ['Great Himalayan National Park', 'Pin Valley National Park', 'Khirganga National Park', 'Simbalbara National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Great Himalayan National Park covers 1,171 sq km across the Sainj and Tirthan valleys, recognized by UNESCO in 2014 for Outstanding Universal Value.',
        establishedYear: 1984,
        district: 'Kullu'
      },
      {
        id: 'hp-q2',
        state: 'Himachal Pradesh',
        parkName: 'Pin Valley National Park',
        question: 'Located in the trans-Himalayan cold desert of Lahaul and Spiti district, which national park is a premier habitat for the Snow Leopard and Siberian Ibex?',
        options: ['Pin Valley National Park', 'Inderkilla National Park', 'Great Himalayan National Park', 'Dachigam National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Pin Valley National Park lies in the cold desert Spiti Valley, famous for snow leopards, bharal (blue sheep), and ancient Tibetan Buddhist monastic culture.',
        establishedYear: 1987,
        district: 'Lahaul and Spiti'
      },
      {
        id: 'hp-q3',
        state: 'Himachal Pradesh',
        parkName: 'Simbalbara National Park',
        question: 'Simbalbara National Park in the Paonta Valley of Sirmaur district, preserving Sal forests and Goral, was renamed in honour of which freedom fighter and conservationist?',
        options: ['Col. Sher Jung', 'Capt. Ram Singh', 'Major Somnath Sharma', 'Gen. Zorawar Singh'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Simbalbara National Park was officially renamed Col. Sher Jung National Park in memory of the distinguished freedom fighter and wildlife enthusiast.',
        establishedYear: 2010,
        district: 'Sirmaur'
      },
      {
        id: 'hp-q4',
        state: 'Himachal Pradesh',
        parkName: 'Khirganga National Park',
        question: 'Khirganga National Park in Kullu district is located at an altitude of approximately 5,500 metres in the catchment of which sacred river valley?',
        options: ['Parvati River Valley', 'Beas River Valley', 'Chenab River Valley', 'Ravi River Valley'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Khirganga National Park was established in 2010 in the upper Parvati River valley, celebrated for its alpine meadows and thermal springs.',
        establishedYear: 2010,
        district: 'Kullu'
      },
      {
        id: 'hp-q5',
        state: 'Himachal Pradesh',
        parkName: 'Inderkilla National Park',
        question: 'Established in October 2010 in Kullu district, Inderkilla National Park provides a critical high-altitude corridor for which endangered carnivores?',
        options: ['Brown Bear and Black Bear', 'Red Panda', 'Golden Jackal', 'Tiger'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Inderkilla National Park spans 104 sq km in Kullu, protecting high-altitude Himalayan Brown Bears, Asiatic Black Bears, and alpine pheasants.',
        establishedYear: 2010,
        district: 'Kullu'
      }
    ]
  },

  // ==========================================
  // 15. UTTAR PRADESH
  // ==========================================
  'Uttar Pradesh': {
    stateInfo: {
      stateName: 'Uttar Pradesh',
      capital: 'Lucknow',
      totalParks: 1,
      overview: 'Uttar Pradesh is anchored by Dudhwa National Park in the fertile Terai belt along the Indo-Nepal international border.',
      tipsForMahi: 'Remember Dudhwa is the ONLY National Park in Uttar Pradesh! Famed for the Swamp Deer (Barasingha) and reintroduced One-horned Rhinos.',
      parks: [
        {
          name: 'Dudhwa National Park',
          year: 1977,
          district: 'Lakhimpur Kheri',
          riverOrBiome: 'Mohana and Suheli Rivers / Terai alluvial grassland',
          famousWildlife: ['Swamp Deer (Barasingha)', 'Royal Bengal Tiger', 'Indian One-Horned Rhinoceros', 'Hispid Hare'],
          keyFeature: 'Terai marshland ecosystem created through the tireless efforts of conservationist "Billy" Arjan Singh.'
        }
      ]
    },
    questions: [
      {
        id: 'up-q1',
        state: 'Uttar Pradesh',
        parkName: 'Dudhwa National Park',
        question: 'Which is the ONLY officially notified National Park in Uttar Pradesh, located in Lakhimpur Kheri district along the Indo-Nepal border?',
        options: ['Dudhwa National Park', 'Katarniaghat National Park', 'Chandraprabha National Park', 'Hastinapur National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dudhwa National Park, notified in 1977, is the solitary national park in Uttar Pradesh. Katarniaghat and Kishanpur are wildlife sanctuaries.',
        establishedYear: 1977,
        district: 'Lakhimpur Kheri'
      },
      {
        id: 'up-q2',
        state: 'Uttar Pradesh',
        parkName: 'Dudhwa National Park',
        question: 'Dudhwa National Park is celebrated as the premier stronghold of which deer species, the state animal of Uttar Pradesh, locally called Barasingha?',
        options: ['Swamp Deer (Rucervus duvaucelii)', 'Hangul (Kashmiri Stag)', 'Sangai (Dancing Deer)', 'Barking Deer'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dudhwa protects the northern subspecies of Swamp Deer (Barasingha, Rucervus duvaucelii duvaucelii), which depends on the waterlogged Terai grasslands.',
        establishedYear: 1977,
        district: 'Lakhimpur Kheri'
      },
      {
        id: 'up-q3',
        state: 'Uttar Pradesh',
        parkName: 'Dudhwa National Park',
        question: 'Which legendary Indian wildlife author and conservationist was the driving force behind establishing Dudhwa National Park and reintroducing big cats there?',
        options: ['"Billy" Arjan Singh', 'Dr. Salim Ali', 'Jim Corbett', 'Kailash Sankhala'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Kunwar "Billy" Arjan Singh campaigned vigorously to protect Dudhwa\'s Barasingha population and established his Tiger Haven estate on the Suheli river.',
        establishedYear: 1977,
        district: 'Lakhimpur Kheri'
      },
      {
        id: 'up-q4',
        state: 'Uttar Pradesh',
        parkName: 'Dudhwa National Park',
        question: 'In 1984, an ambitious species rehabilitation project successfully reintroduced which megaherbivore to Dudhwa from Assam and Nepal?',
        options: ['Greater One-Horned Rhinoceros', 'Wild Water Buffalo', 'Asiatic Lion', 'Gaur'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'In 1984, five rhinos were translocated from Pobitora (Assam) and Chitwan (Nepal) to Dudhwa in an enclosed electric-fenced reintroduction paddock.',
        establishedYear: 1977,
        district: 'Lakhimpur Kheri'
      },
      {
        id: 'up-q5',
        state: 'Uttar Pradesh',
        parkName: 'Dudhwa National Park',
        question: 'Which two Himalayan tributaries flow along the northern and southern boundaries of Dudhwa National Park?',
        options: ['Mohana and Suheli Rivers', 'Ganga and Yamuna Rivers', 'Ghaghara and Gomti Rivers', 'Ramlila and Betwa Rivers'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The Mohana River flows along Dudhwa\'s northern boundary with Nepal, while the Suheli River borders the southern edge of the park.',
        establishedYear: 1977,
        district: 'Lakhimpur Kheri'
      }
    ]
  },

  // ==========================================
  // 16. BIHAR
  // ==========================================
  'Bihar': {
    stateInfo: {
      stateName: 'Bihar',
      capital: 'Patna',
      totalParks: 1,
      overview: 'Bihar preserves its wildlife heritage at Valmiki National Park in the northwestern corner of West Champaran along the Gandak River.',
      tipsForMahi: 'Remember Valmiki is the ONLY National Park in Bihar! It forms a continuous tiger landscape with Chitwan National Park in Nepal.',
      parks: [
        {
          name: 'Valmiki National Park',
          year: 1990,
          district: 'West Champaran',
          riverOrBiome: 'Gandak (Narayani) River / Bhabar-Terai Sal forest',
          famousWildlife: ['Royal Bengal Tiger', 'Indian Leopard', 'Indian Rhinoceros (occasional from Nepal)', 'Flying Fox', 'Gharial'],
          keyFeature: 'Only national park in Bihar; contiguous with Nepal\'s Royal Chitwan National Park and Parsa Wildlife Reserve.'
        }
      ]
    },
    questions: [
      {
        id: 'br-q1',
        state: 'Bihar',
        parkName: 'Valmiki National Park',
        question: 'Which is the ONLY National Park in the state of Bihar, located in the West Champaran district?',
        options: ['Valmiki National Park', 'Bhimbandh National Park', 'Gautam Buddha National Park', 'Kaimur National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Valmiki National Park, established in 1990 in West Champaran, is Bihar\'s sole national park. Bhimbandh and Kaimur are wildlife sanctuaries.',
        establishedYear: 1990,
        district: 'West Champaran'
      },
      {
        id: 'br-q2',
        state: 'Bihar',
        parkName: 'Valmiki National Park',
        question: 'Valmiki National Park forms a contiguous transboundary tiger landscape with which renowned National Park in Nepal?',
        options: ['Chitwan National Park', 'Bardia National Park', 'Sagarmatha National Park', 'Langtang National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Valmiki National Park is directly contiguous across the international border with Chitwan National Park and Parsa Wildlife Reserve of Nepal.',
        establishedYear: 1990,
        district: 'West Champaran'
      },
      {
        id: 'br-q3',
        state: 'Bihar',
        parkName: 'Valmiki National Park',
        question: 'Which major snow-fed Himalayan river, known as Narayani in Nepal, flows along the western boundary of Valmiki National Park?',
        options: ['Gandak River', 'Kosi River', 'Son River', 'Ghaghara River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Gandak River (Narayani) enters India at Valmikinagar, defining the western boundary of the tiger reserve where Gandak Barrage is built.',
        establishedYear: 1990,
        district: 'West Champaran'
      },
      {
        id: 'br-q4',
        state: 'Bihar',
        parkName: 'Valmiki National Park',
        question: 'Which sacred ancient hermitage, where Maharishi Valmiki is said to have written the epic Ramayana and sheltered Sita, is situated inside this forest?',
        options: ['Valmiki Ashram', 'Agastya Ashram', 'Vashistha Ashram', 'Bharadwaj Ashram'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Valmiki Ashram sits on the banks of the Triveni confluence near the Indo-Nepal border inside the forested foothills of the national park.',
        establishedYear: 1990,
        district: 'West Champaran'
      },
      {
        id: 'br-q5',
        state: 'Bihar',
        parkName: 'Valmiki National Park',
        question: 'What distinctive physiological forest terrain combination characterizes the vegetation of Valmiki National Park?',
        options: ['Bhabar and Terai tract with Sal forests', 'Mangrove delta', 'Thorn scrub desert', 'Shola grassland'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Valmiki spans the Bhabar porous pebble-gravel zone and lower swampy Terai, with dense moist deciduous Sal (Shorea robusta) forests and cane brakes.',
        establishedYear: 1990,
        district: 'West Champaran'
      }
    ]
  },

  // ==========================================
  // 17. JHARKHAND
  // ==========================================
  'Jharkhand': {
    stateInfo: {
      stateName: 'Jharkhand',
      capital: 'Ranchi',
      totalParks: 1,
      overview: 'Jharkhand preserves Chota Nagpur plateau forests at Betla National Park in Palamu and Latehar districts.',
      tipsForMahi: 'Remember Betla is the ONLY National Park in Jharkhand! Historical home to the world\'s first tiger pugmark census in 1932.',
      parks: [
        {
          name: 'Betla National Park',
          year: 1986,
          district: 'Latehar and Palamu',
          riverOrBiome: 'North Koel and Auranga Rivers / Chota Nagpur Plateau',
          famousWildlife: ['Asian Elephant', 'Sloth Bear', 'Indian Gaur', 'Leopard', 'Royal Bengal Tiger'],
          keyFeature: 'Site of the world\'s first tiger census using pugmark tracking in 1932; houses historic 16th-century Chero dynasty Palamu Forts.'
        }
      ]
    },
    questions: [
      {
        id: 'jh-q1',
        state: 'Jharkhand',
        parkName: 'Betla National Park',
        question: 'Which is the ONLY notified National Park in the state of Jharkhand, situated in Latehar and Palamu districts on the Chota Nagpur Plateau?',
        options: ['Betla National Park', 'Dalma National Park', 'Hazaribagh National Park', 'Topchanchi National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Betla National Park, notified in 1986, is Jharkhand\'s single national park. Dalma, Hazaribagh, and Palamu are wildlife sanctuaries.',
        establishedYear: 1986,
        district: 'Latehar and Palamu'
      },
      {
        id: 'jh-q2',
        state: 'Jharkhand',
        parkName: 'Betla National Park',
        question: 'Betla National Park holds a unique place in global wildlife conservation history as the site where which breakthrough census method was conducted in 1932?',
        options: ['World\'s first tiger census using pugmark tracking', 'First camera trap census', 'First DNA fecal census', 'First radio telemetry collaring'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'In 1932, J.W. Nicholson (Conservator of Forests) conducted the world\'s very first tiger census in the Palamu forests using pugmark identification.',
        establishedYear: 1986,
        district: 'Latehar and Palamu'
      },
      {
        id: 'jh-q3',
        state: 'Jharkhand',
        parkName: 'Betla National Park',
        question: 'The popular acronym "BETLA" is commonly explained as representing which group of resident forest animals?',
        options: ['Bison, Elephant, Tiger, Leopard, Axis-axis (Chital)', 'Bear, Eagle, Tiger, Lion, Antelope', 'Barking deer, Elephant, Turtle, Langur, Ape', 'Bison, Emu, Tiger, Leopard, Ass'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Locally and mnemonically, BETLA is remembered as: B-Bison (Gaur), E-Elephant, T-Tiger, L-Leopard, A-Axis-axis (Spotted Deer).',
        establishedYear: 1986,
        district: 'Latehar and Palamu'
      },
      {
        id: 'jh-q4',
        state: 'Jharkhand',
        parkName: 'Betla National Park',
        question: 'Which two historical 16th-century brick and stone forts, constructed by kings of the Chero dynasty, stand deep inside the forests of Betla?',
        options: ['Old and New Palamu Forts (Purana and Naya Qila)', 'Rohtasgarh Fort', 'Gwalior Fort', 'Kalinjar Fort'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Deep inside the forest near the Auranga River stand the dramatic 16th-century Palamu Forts built by the Chero rulers, notably Raja Medini Ray.',
        establishedYear: 1986,
        district: 'Latehar and Palamu'
      },
      {
        id: 'jh-q5',
        state: 'Jharkhand',
        parkName: 'Betla National Park',
        question: 'Which prominent north-flowing tributary of the Son River, along with its tributary the Auranga, flows through the Betla forest?',
        options: ['North Koel River', 'Damodar River', 'Subarnarekha River', 'Barakar River'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The North Koel River traverses the western boundary of the reserve, while the Auranga River meanders past the ancient Palamu fort complex.',
        establishedYear: 1986,
        district: 'Latehar and Palamu'
      }
    ]
  },

  // ==========================================
  // 18. CHHATTISGARH
  // ==========================================
  'Chhattisgarh': {
    stateInfo: {
      stateName: 'Chhattisgarh',
      capital: 'Raipur',
      totalParks: 3,
      overview: 'Chhattisgarh preserves Bastar tribal woodlands and Sal forests across 3 National Parks: Indravati, Kanger Valley, and Guru Ghasidas.',
      tipsForMahi: 'Remember Indravati is famous for the Wild Water Buffalo (state animal)! Kanger Valley has subterranean limestone caves with blind fish.',
      parks: [
        {
          name: 'Indravati National Park',
          year: 1981,
          district: 'Bijapur',
          riverOrBiome: 'Indravati River / Bastar plateau',
          famousWildlife: ['Wild Water Buffalo (Bubalus arnee)', 'Tiger', 'Leopard', 'Hill Myna'],
          keyFeature: 'Principal refuge of the endangered Wild Water Buffalo, the official State Animal of Chhattisgarh.'
        },
        {
          name: 'Kanger Valley National Park',
          year: 1982,
          district: 'Bastar (Jagdalpur)',
          riverOrBiome: 'Kanger River / Kolab tributary',
          famousWildlife: ['Bastar Hill Myna (Gracula religiosa peninsularis)', 'Leopard', 'Flying Squirrel'],
          keyFeature: 'Spectacular subterranean limestone caves (Kotumsar, Kailash, Dandak) with stalactites, stalagmites, and blind cave-fish.'
        },
        {
          name: 'Guru Ghasidas National Park',
          year: 1981,
          district: 'Koriya and Surajpur',
          riverOrBiome: 'Hasdeo and Son River catchments',
          famousWildlife: ['Tiger', 'Leopard', 'Nilgai', 'Chinkara'],
          keyFeature: 'Formerly Sanjay National Park; forms a massive tiger corridor linking central India with eastern forests.'
        }
      ]
    },
    questions: [
      {
        id: 'cg-q1',
        state: 'Chhattisgarh',
        parkName: 'Indravati National Park',
        question: 'Indravati National Park in Bijapur district is renowned as the primary sanctuary for which endangered animal, the official State Animal of Chhattisgarh?',
        options: ['Wild Water Buffalo (Bubalus arnee)', 'Barasingha', 'Blackbuck', 'Chinkara'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Indravati National Park is named after the Indravati River and protects one of the last pure populations of wild water buffalo (Ban Bhainsa).',
        establishedYear: 1981,
        district: 'Bijapur'
      },
      {
        id: 'cg-q2',
        state: 'Chhattisgarh',
        parkName: 'Kanger Valley National Park',
        question: 'Kanger Valley National Park near Jagdalpur is globally celebrated for which subterranean geological wonders and blind cave-adapted fish (Nemacheilus soti)?',
        options: ['Kotumsar Limestone Caves', 'Bhimbetka Caves', 'Elephanta Caves', 'Badami Caves'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Kotumsar Cave in Kanger Ghati plunges 35 metres underground, featuring stunning limestone stalactites, stalagmites, and endemic blind fish.',
        establishedYear: 1982,
        district: 'Bastar'
      },
      {
        id: 'cg-q3',
        state: 'Chhattisgarh',
        parkName: 'Guru Ghasidas National Park',
        question: 'Which national park in northern Chhattisgarh, formerly the undivided Sanjay National Park before state reorganization in 2000, was renamed after a revered saint?',
        options: ['Guru Ghasidas National Park', 'Indravati National Park', 'Kanger Ghati National Park', 'Barnawapara National Park'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'When Chhattisgarh was carved out of Madhya Pradesh in 2000, 60% of the original Sanjay NP became Guru Ghasidas National Park.',
        establishedYear: 1981,
        district: 'Koriya and Surajpur'
      },
      {
        id: 'cg-q4',
        state: 'Chhattisgarh',
        parkName: 'Kanger Valley National Park',
        question: 'Which breathtaking 300-foot multi-tiered waterfall on the Kanger River is a centerpiece attraction inside Kanger Valley National Park?',
        options: ['Tirathgarh Falls', 'Chitrakote Falls', 'Dudhsagar Falls', 'Jog Falls'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Tirathgarh Falls cascades down in white sheets of water like a bridal veil over the steps of the Mugabahar River in Kanger Valley.',
        establishedYear: 1982,
        district: 'Bastar'
      },
      {
        id: 'cg-q5',
        state: 'Chhattisgarh',
        parkName: 'Kanger Valley National Park',
        question: 'Which bird, known for its extraordinary voice mimicking ability and designated the State Bird of Chhattisgarh, thrives in Kanger Valley?',
        options: ['Bastar Hill Myna (Gracula religiosa peninsularis)', 'Great Indian Bustard', 'Emerald Dove', 'Malabar Trogon'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The Bastar Hill Myna is the state bird of Chhattisgarh, strictly conserved within the Sal and teak canopies of Kanger Valley.',
        establishedYear: 1982,
        district: 'Bastar'
      }
    ]
  },

  // ==========================================
  // 19. GOA
  // ==========================================
  'Goa': {
    stateInfo: {
      stateName: 'Goa',
      capital: 'Panaji',
      totalParks: 1,
      overview: 'Goa preserves high-biodiversity Western Ghats forests at Mollem National Park surrounding Dudhsagar Falls.',
      tipsForMahi: 'Remember Mollem is the ONLY National Park in Goa! Houses the famous Dudhsagar Waterfalls and the 12th-century Tambdi Surla Temple.',
      parks: [
        {
          name: 'Mollem National Park',
          year: 1978,
          district: 'South Goa (Dharbandora)',
          riverOrBiome: 'Mandovi River / Western Ghats Sahyadri',
          famousWildlife: ['Black Panther (Melanistic Leopard)', 'Bengal Tiger', 'Malabar Pied Hornbill', 'King Cobra', 'Flying Squirrel'],
          keyFeature: 'Encompasses the iconic 4-tiered Dudhsagar Falls and the 12th-century Kadamba-style Mahadev Temple at Tambdi Surla.'
        }
      ]
    },
    questions: [
      {
        id: 'ga-q1',
        state: 'Goa',
        parkName: 'Mollem National Park',
        question: 'Which is the ONLY officially notified National Park in the state of Goa, situated in the Western Ghats near the eastern border with Karnataka?',
        options: ['Mollem National Park', 'Cotigao National Park', 'Salim Ali National Park', 'Bondla National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Mollem National Park (107 sq km), notified in 1978, is Goa\'s sole national park, forming the core zone of Bhagwan Mahaveer Wildlife Sanctuary.',
        establishedYear: 1978,
        district: 'South Goa'
      },
      {
        id: 'ga-q2',
        state: 'Goa',
        parkName: 'Mollem National Park',
        question: 'Which iconic four-tiered, milky-white waterfall on the Mandovi River, falling from a height of 310 metres, is located inside Mollem National Park?',
        options: ['Dudhsagar Falls ("Sea of Milk")', 'Jog Falls', 'Nohkalikai Falls', 'Hogenakkal Falls'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dudhsagar Falls ("Sea of Milk") on the Mandovi river is one of India\'s tallest waterfalls, famous for the rail bridge that crosses directly before it.',
        establishedYear: 1978,
        district: 'South Goa'
      },
      {
        id: 'ga-q3',
        state: 'Goa',
        parkName: 'Mollem National Park',
        question: 'Which exquisite 12th-century basalt-stone temple, built by the Kadamba dynasty and dedicated to Lord Shiva, survives intact inside the Mollem forest?',
        options: ['Tambdi Surla Mahadev Temple', 'Mangueshi Temple', 'Shanta Durga Temple', 'Saptakoteshwar Temple'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Tambdi Surla Mahadev Temple is Goa\'s oldest surviving temple, crafted out of dark chlorite basalt by Kadamba architect-masons in the 12th century.',
        establishedYear: 1978,
        district: 'South Goa'
      },
      {
        id: 'ga-q4',
        state: 'Goa',
        parkName: 'Mollem National Park',
        question: 'Mollem National Park is notable in the Western Ghats for harboring which elusive melanistic color variant of the Indian Leopard?',
        options: ['Black Panther', 'Golden Cat', 'Clouded Leopard', 'Snow Leopard'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Dense, humid evergreen forests of Mollem are famous for sightings of the melanistic leopard, commonly known as the Black Panther.',
        establishedYear: 1978,
        district: 'South Goa'
      },
      {
        id: 'ga-q5',
        state: 'Goa',
        parkName: 'Mollem National Park',
        question: 'What scenic railway line, constructed during the Portuguese colonial era, traverses directly across Mollem National Park and past Dudhsagar Falls?',
        options: ['Mormugao - Castle Rock - Londa railway line', 'Konkan Railway main line', 'Nilgiri Mountain Railway', 'Kalka-Shimla line'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The historic West of India Portuguese Railway line crosses from Mormugao port through Castle Rock over the Braganza Ghats within Mollem.',
        establishedYear: 1978,
        district: 'South Goa'
      }
    ]
  },

  // ==========================================
  // 20. HARYANA
  // ==========================================
  'Haryana': {
    stateInfo: {
      stateName: 'Haryana',
      capital: 'Chandigarh',
      totalParks: 2,
      overview: 'Haryana preserves migratory wetland havens and Shivalik foothill Sal forests across Sultanpur and Kalesar National Parks.',
      tipsForMahi: 'Remember Sultanpur is near Gurugram (migratory bird paradise and Ramsar site)! Kalesar borders Uttarakhand and Himachal in the Shivalik hills.',
      parks: [
        {
          name: 'Sultanpur National Park',
          year: 1991,
          district: 'Gurugram',
          riverOrBiome: 'Semi-arid freshwater wetland / Indo-Gangetic plain',
          famousWildlife: ['Siberian Crane (historical)', 'Greater Flamingo', 'Black Francolin', 'Bar-headed Goose'],
          keyFeature: 'Ramsar wetland sanctuary popularized by Dr. Salim Ali; vital wintering grounds for Central Asian Flyway birds.'
        },
        {
          name: 'Kalesar National Park',
          year: 2003,
          district: 'Yamunanagar',
          riverOrBiome: 'Yamuna River / Shivalik foothills',
          famousWildlife: ['Leopard', 'Barking Deer', 'Sambar', 'Red Junglefowl', 'Elephant (migratory)'],
          keyFeature: 'Dense contiguous Sal forest in the Shivaliks named after the ancient Kaleshwar Mahadev temple.'
        }
      ]
    },
    questions: [
      {
        id: 'hr-q1',
        state: 'Haryana',
        parkName: 'Sultanpur National Park',
        question: 'Which national park and Ramsar wetland site in Gurugram district, Haryana, was declared a bird sanctuary thanks to the efforts of Peter Jackson and Dr. Salim Ali?',
        options: ['Sultanpur National Park', 'Kalesar National Park', 'Bhindawas National Park', 'Okhla Bird Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Sultanpur National Park, located 15 km from Gurugram, was upgraded to a national park in 1991 and designated a Ramsar wetland in 2021.',
        establishedYear: 1991,
        district: 'Gurugram'
      },
      {
        id: 'hr-q2',
        state: 'Haryana',
        parkName: 'Kalesar National Park',
        question: 'Which national park in Yamunanagar district, established in 2003 along the banks of the Yamuna River, features dense Sal forests contiguous with Rajaji National Park?',
        options: ['Kalesar National Park', 'Sultanpur National Park', 'Bir Shikargah', 'Nahar National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Kalesar National Park covers 11,570 acres in Yamunanagar, forming an elephant and tiger movement corridor between Himachal, UP, and Uttarakhand.',
        establishedYear: 2003,
        district: 'Yamunanagar'
      },
      {
        id: 'hr-q3',
        state: 'Haryana',
        parkName: 'Sultanpur National Park',
        question: 'Which bird, celebrated for its resonant calling whistle and designated the State Bird of Haryana, is found in the grasslands around Sultanpur?',
        options: ['Black Francolin (Kala Teetar)', 'Great Indian Bustard', 'Himalayan Monal', 'Emerald Dove'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Black Francolin (Francolinus francolinus), locally known as Kala Teetar, is the proud state bird of Haryana.',
        establishedYear: 1991,
        district: 'Gurugram'
      },
      {
        id: 'hr-q4',
        state: 'Haryana',
        parkName: 'Kalesar National Park',
        question: 'Kalesar National Park derives its name from which ancient religious shrine situated within the boundary of the park?',
        options: ['Kaleshwar Mahadev (Shiva) Temple', 'Kapal Mochan', 'Sheetla Mata Temple', 'Bhadrakali Temple'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Kalesar takes its name from the ancient Kaleshwar Mahadev temple located in the park, revered by pilgrims since antiquity.',
        establishedYear: 2003,
        district: 'Yamunanagar'
      },
      {
        id: 'hr-q5',
        state: 'Haryana',
        parkName: 'Sultanpur National Park',
        question: 'Sultanpur Lake acts as an essential resting and wintering wetland for migratory waterbirds flying along which international avian flyway?',
        options: ['Central Asian Flyway (CAF)', 'East Atlantic Flyway', 'Mississippi Flyway', 'Pacific Americas Flyway'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Sultanpur lies on the critical Central Asian Flyway, providing essential foraging waters for waterfowl escaping freezing Siberian winters.',
        establishedYear: 1991,
        district: 'Gurugram'
      }
    ]
  },

  // ==========================================
  // 21. PUNJAB
  // ==========================================
  'Punjab': {
    stateInfo: {
      stateName: 'Punjab',
      capital: 'Chandigarh',
      totalParks: 0,
      overview: 'Punjab protects rich wetland and wildlife sanctuaries (such as Harike Wetland and Abohar) while having no officially declared National Park under Section 35 of the Wildlife Protection Act 1972.',
      tipsForMahi: 'Important factual knowledge for Mahi! Punjab has ZERO declared National Parks, but protects celebrated Ramsar wetlands hosting the Indus River Dolphin!',
      parks: [
        {
          name: 'Harike Wetland and Wildlife Sanctuary (Key Protected Area)',
          year: 1982,
          district: 'Tarn Taran and Firozpur',
          riverOrBiome: 'Confluence of Beas and Sutlej Rivers / Ramsar Wetland',
          famousWildlife: ['Indus River Dolphin (Platanista gangetica minor)', 'Smooth-coated Otter', 'Testudines Turtles', 'Cotton Pygmy Goose'],
          keyFeature: 'Largest man-made wetland in northern India; exclusive Indian habitat for the endangered Indus River Dolphin.'
        },
        {
          name: 'Abohar Wildlife Sanctuary',
          year: 1986,
          district: 'Fazilka',
          riverOrBiome: 'Agricultural farmland and open scrub',
          famousWildlife: ['Blackbuck (Antilope cervicapra)', 'Blue Bull (Nilgai)', 'Wild Boar'],
          keyFeature: 'Famed for community-driven protection of Blackbucks by the Bishnoi community across 13 revenue villages.'
        }
      ]
    },
    questions: [
      {
        id: 'pb-q1',
        state: 'Punjab',
        parkName: 'Harike Wetland Sanctuary',
        question: 'Which unique geographical fact is true regarding National Parks in the state of Punjab under the Wildlife Protection Act 1972?',
        options: [
          'Punjab has ZERO officially notified National Parks under Section 35 of WLPA 1972',
          'Punjab has five National Parks',
          'Punjab has only one National Park at Harike',
          'Punjab converted all forests into Tiger Reserves'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Punjab is one of the distinct Indian states with no notified National Park, although it maintains extensive wildlife sanctuaries and Ramsar wetlands.',
        establishedYear: 1982,
        district: 'Tarn Taran and Firozpur'
      },
      {
        id: 'pb-q2',
        state: 'Punjab',
        parkName: 'Harike Wetland Sanctuary',
        question: 'Harike Wetland, northern India\'s largest wetland and a Ramsar site, is situated at the confluence of which two major rivers?',
        options: ['Beas and Sutlej Rivers', 'Ravi and Chenab Rivers', 'Jhelum and Indus Rivers', 'Yamuna and Ghaggar Rivers'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Harike Wetland was created in 1952 by constructing a barrage downstream of the confluence of the Beas and Sutlej rivers.',
        establishedYear: 1982,
        district: 'Tarn Taran and Firozpur'
      },
      {
        id: 'pb-q3',
        state: 'Punjab',
        parkName: 'Harike Wetland Sanctuary',
        question: 'Which rare and endangered freshwater mammal, declared the official State Aquatic Animal of Punjab in 2019, is found in the Beas River stretch of Harike?',
        options: ['Indus River Dolphin (Bhulan)', 'Ganges River Dolphin', 'Irrawaddy Dolphin', 'Dugong'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Indus River Dolphin (Platanista gangetica minor) survives in India only in the Beas River of Punjab, declared its State Aquatic Animal in 2019.',
        establishedYear: 1982,
        district: 'Tarn Taran'
      },
      {
        id: 'pb-q4',
        state: 'Punjab',
        parkName: 'Abohar Wildlife Sanctuary',
        question: 'Abohar Wildlife Sanctuary in Fazilka district is celebrated across India for community conservation of Blackbucks led by which conservationist community?',
        options: ['Bishnoi community', 'Gaddi community', 'Mishing community', 'Bhil community'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Across 13 villages in Abohar, the Bishnoi community venerates and strictly defends the Blackbuck (the state animal of Punjab) on their farmlands.',
        establishedYear: 1986,
        district: 'Fazilka'
      },
      {
        id: 'pb-q5',
        state: 'Punjab',
        parkName: 'Harike Wetland Sanctuary',
        question: 'Along with Harike, which other two wetlands in Punjab are officially designated as Wetlands of International Importance under the Ramsar Convention?',
        options: ['Kanjli and Ropar Wetlands', 'Renuka and Pong Dam Wetlands', 'Sambhar and Keoladeo', 'Wular and Tso Moriri'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Punjab hosts 6 Ramsar sites in total, with Kanjli (Kapurthala) and Ropar being historic wetland reserves alongside Harike.',
        establishedYear: 1982,
        district: 'Kapurthala and Rupnagar'
      }
    ]
  },

  // ==========================================
  // 22. SIKKIM
  // ==========================================
  'Sikkim': {
    stateInfo: {
      stateName: 'Sikkim',
      capital: 'Gangtok',
      totalParks: 1,
      overview: 'Sikkim is crowned by Khangchendzonga National Park, India\'s solitary UNESCO Mixed World Heritage Site.',
      tipsForMahi: 'Remember Khangchendzonga is India\'s ONLY Mixed (Natural + Cultural) World Heritage Site! Home to Mount Khangchendzonga (8,586 m).',
      parks: [
        {
          name: 'Khangchendzonga National Park',
          year: 1977,
          district: 'North and West Sikkim',
          riverOrBiome: 'Teesta River basin / Glaciers / High Alpine',
          famousWildlife: ['Red Panda', 'Snow Leopard', 'Himalayan Tahr', 'Musk Deer', 'Blood Pheasant'],
          keyFeature: 'India\'s sole UNESCO Mixed World Heritage Site; surrounds Mount Khangchendzonga (3rd highest in the world) and the 26-km Zemu Glacier.'
        }
      ]
    },
    questions: [
      {
        id: 'sk-q1',
        state: 'Sikkim',
        parkName: 'Khangchendzonga National Park',
        question: 'Which national park in Sikkim is India\'s ONLY inscribed UNESCO "Mixed" (both Natural and Cultural criteria) World Heritage Site?',
        options: ['Khangchendzonga National Park', 'Great Himalayan National Park', 'Nanda Devi National Park', 'Manas National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Khangchendzonga National Park was inscribed in 2016 as India\'s first and only Mixed World Heritage Site under UNESCO criteria (iii), (vi), (vii), and (x).',
        establishedYear: 1977,
        district: 'North and West Sikkim'
      },
      {
        id: 'sk-q2',
        state: 'Sikkim',
        parkName: 'Khangchendzonga National Park',
        question: 'Which colossal peak, rising to 8,586 metres as the third highest mountain in the world and revered as a guardian deity by the people of Sikkim, anchors this park?',
        options: ['Mount Khangchendzonga', 'Mount Everest', 'Mount K2 (Godwin-Austen)', 'Nanda Devi'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Mount Khangchendzonga ("The Five Treasures of Snow") stands at 8,586 m, worshiped as the sacred protector of Sikkim in Lepcha and Bhutia traditions.',
        establishedYear: 1977,
        district: 'North and West Sikkim'
      },
      {
        id: 'sk-q3',
        state: 'Sikkim',
        parkName: 'Khangchendzonga National Park',
        question: 'Which massive glacier, extending approximately 26 kilometres down the eastern flank of Khangchendzonga, is the source of the Teesta River?',
        options: ['Zemu Glacier', 'Gangotri Glacier', 'Siachen Glacier', 'Pindari Glacier'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Zemu Glacier is the largest glacier in the Eastern Himalayas (~26 km length), feeding the headwaters of the turbulent Teesta River.',
        establishedYear: 1977,
        district: 'North Sikkim'
      },
      {
        id: 'sk-q4',
        state: 'Sikkim',
        parkName: 'Khangchendzonga National Park',
        question: 'Which arboreal mammal with a ringed bushy tail, designated the State Animal of Sikkim, finds a vital bamboo-forest refuge in Khangchendzonga?',
        options: ['Red Panda (Ailurus fulgens)', 'Snow Leopard', 'Clouded Leopard', 'Himalayan Marmot'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Red Panda (Firefox, locally "Habre") is the state animal of Sikkim, feeding on bamboo leaves in the temperate oak-rhododendron belt.',
        establishedYear: 1977,
        district: 'West and North Sikkim'
      },
      {
        id: 'sk-q5',
        state: 'Sikkim',
        parkName: 'Khangchendzonga National Park',
        question: 'Under Tibetan Buddhist cosmology, the sacred landscape of Khangchendzonga is venerated as which mythical hidden paradise of peace and refuge?',
        options: ['Beyul Dremoshang (Sacred Hidden Valley)', 'Shangri-La', 'Shambhala', 'Nirvana Valley'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Guru Padmasambhava (Rinpoche) consecrated Khangchendzonga as "Beyul Dremoshang" — a sacred hidden land of bliss blessed for spiritual seekers.',
        establishedYear: 1977,
        district: 'North and West Sikkim'
      }
    ]
  },

  // ==========================================
  // 23. ARUNACHAL PRADESH
  // ==========================================
  'Arunachal Pradesh': {
    stateInfo: {
      stateName: 'Arunachal Pradesh',
      capital: 'Itanagar',
      totalParks: 2,
      overview: 'Arunachal Pradesh features extraordinary altitudinal gradients and tropical-to-alpine rainforests across Namdapha and Mouling National Parks.',
      tipsForMahi: 'Remember Namdapha is the ONLY park in the world harboring four big cats (Tiger, Leopard, Snow Leopard, Clouded Leopard)!',
      parks: [
        {
          name: 'Namdapha National Park',
          year: 1983,
          district: 'Changlang',
          riverOrBiome: 'Noa-Dihing River / Mishmi Hills Patkai range',
          famousWildlife: ['Tiger', 'Leopard', 'Snow Leopard', 'Clouded Leopard', 'Hoolock Gibbon', 'Namdapha Flying Squirrel'],
          keyFeature: 'India\'s 4th largest national park; famous as the only park hosting all 4 big feline species of the genus Panthera & Neofelis.'
        },
        {
          name: 'Mouling National Park',
          year: 1986,
          district: 'Upper Siang',
          riverOrBiome: 'Siang River (Brahmaputra) / Mouling Peak',
          famousWildlife: ['Takin', 'Red Panda', 'Serow', 'Monal Pheasant'],
          keyFeature: 'Forms part of the Dihang-Dibang Biosphere Reserve along the turbulent gorges of the Siang River.'
        }
      ]
    },
    questions: [
      {
        id: 'ar-q1',
        state: 'Arunachal Pradesh',
        parkName: 'Namdapha National Park',
        question: 'Which national park in Changlang district is famously documented as the only national park on Earth that harbors all four big cat species (Tiger, Leopard, Snow Leopard, and Clouded Leopard)?',
        options: ['Namdapha National Park', 'Mouling National Park', 'Kaziranga National Park', 'Manas National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Because of its immense altitudinal variation (200m to 4,571m at Daphabum), Namdapha hosts Tigers, Common Leopards, Clouded Leopards, and Snow Leopards.',
        establishedYear: 1983,
        district: 'Changlang'
      },
      {
        id: 'ar-q2',
        state: 'Arunachal Pradesh',
        parkName: 'Namdapha National Park',
        question: 'Which critically endangered gliding mammal, endemic exclusively to the Patkai Range in Arunachal Pradesh, is found nowhere else in the world?',
        options: ['Namdapha Flying Squirrel (Biswamoyopterus biswasi)', 'Kashmir Flying Squirrel', 'Giant Indian Squirrel', 'Woolly Flying Squirrel'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Namdapha Flying Squirrel is critically endangered, known to science from a single specimen collected in 1981 in the mesic rainforests of Namdapha.',
        establishedYear: 1983,
        district: 'Changlang'
      },
      {
        id: 'ar-q3',
        state: 'Arunachal Pradesh',
        parkName: 'Namdapha National Park',
        question: 'Which prominent meandering tributary of the Brahmaputra River bisects Namdapha National Park from east to west?',
        options: ['Noa-Dihing River', 'Subansiri River', 'Kameng River', 'Lohit River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Noa-Dihing River courses through the heart of the national park, fed by countless mountain streams emerging from the Mishmi Hills.',
        establishedYear: 1983,
        district: 'Changlang'
      },
      {
        id: 'ar-q4',
        state: 'Arunachal Pradesh',
        parkName: 'Mouling National Park',
        question: 'Mouling National Park in Upper Siang district takes its name from Mouling Peak, which translates in the local Adi language to what ominous meaning?',
        options: ['Red Poison (Red Blood)', 'Sleeping Dragon', 'White Peak', 'God\'s Abode'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'In the Adi tribal language, "Mouling" means "red poison" or red blood, associated with poisonous plants traditionally harvested on the mountain.',
        establishedYear: 1986,
        district: 'Upper Siang'
      },
      {
        id: 'ar-q5',
        state: 'Arunachal Pradesh',
        parkName: 'Mouling National Park',
        question: 'Mouling National Park forms the western portion of which prominent UNESCO Biosphere Reserve in Arunachal Pradesh?',
        options: ['Dihang-Dibang Biosphere Reserve', 'Manas Biosphere Reserve', 'Nokrek Biosphere Reserve', 'Dibru-Saikhowa Biosphere Reserve'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Mouling NP and the adjoining Dibang Wildlife Sanctuary together constitute the high-altitude Dihang-Dibang Biosphere Reserve.',
        establishedYear: 1986,
        district: 'Upper Siang'
      }
    ]
  },

  // ==========================================
  // 24. MEGHALAYA
  // ==========================================
  'Meghalaya': {
    stateInfo: {
      stateName: 'Meghalaya',
      capital: 'Shillong',
      totalParks: 2,
      overview: 'Meghalaya features dramatic limestone karst plateaus and living root bridges across Balpakram and Nokrek National Parks in the Garo Hills.',
      tipsForMahi: 'Remember Nokrek is the genetic home of Citrus indica (wild orange)! Balpakram is called the "Grand Canyon of Meghalaya".',
      parks: [
        {
          name: 'Nokrek National Park',
          year: 1986,
          district: 'East and West Garo Hills',
          riverOrBiome: 'Simsang River headwaters / Garo Hills peak',
          famousWildlife: ['Red Panda', 'Asian Elephant', 'Hoolock Gibbon', 'Pig-tailed Macaque'],
          keyFeature: 'UNESCO Biosphere Reserve; designated as a global gene sanctuary for the rare ancestor of oranges, Citrus indica.'
        },
        {
          name: 'Balpakram National Park',
          year: 1985,
          district: 'South Garo Hills',
          riverOrBiome: 'Mahadeo River deep gorge / Plateau tableland',
          famousWildlife: ['Asian Elephant', 'Tiger', 'Golden Cat', 'Water Buffalo'],
          keyFeature: 'Revered in Garo folklore as the "Land of Perpetual Winds" and the sacred resting place of spirits.'
        }
      ]
    },
    questions: [
      {
        id: 'ml-q1',
        state: 'Meghalaya',
        parkName: 'Nokrek National Park',
        question: 'Nokrek National Park in the Garo Hills is internationally famous as a protected gene sanctuary for which primitive wild citrus ancestor fruit?',
        options: ['Citrus indica (Indian Wild Orange)', 'Citrus medica (Citron)', 'Citrus limon', 'Citrus aurantium'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Nokrek is the global gene sanctuary for Citrus indica (locally "M\'memang Narang" or ghost orange), believed to be the progenitor of all cultivated citrus fruits.',
        establishedYear: 1986,
        district: 'West Garo Hills'
      },
      {
        id: 'ml-q2',
        state: 'Meghalaya',
        parkName: 'Balpakram National Park',
        question: 'Balpakram National Park in South Garo Hills is popularly nicknamed the "Grand Canyon of Meghalaya" and translates in the Garo language to what poetic meaning?',
        options: ['Land of Perpetual Winds', 'Valley of Shadows', 'Mountain of Clouds', 'Home of Thunder'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'In Garo mythology, Balpakram translates as the "Land of Perpetual Winds", revered as the sacred repository where souls travel before the afterlife.',
        establishedYear: 1985,
        district: 'South Garo Hills'
      },
      {
        id: 'ml-q3',
        state: 'Meghalaya',
        parkName: 'Nokrek National Park',
        question: 'Nokrek Peak, rising to 1,412 metres inside Nokrek National Park, is the highest point of which mountain range in Meghalaya?',
        options: ['Garo Hills', 'Khasi Hills', 'Jaintia Hills', 'Patkai Hills'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Nokrek Peak is the highest summit in the Garo Hills, serving as the source of major rivers including the Simsang (Someshwari).',
        establishedYear: 1986,
        district: 'East and West Garo Hills'
      },
      {
        id: 'ml-q4',
        state: 'Meghalaya',
        parkName: 'Balpakram National Park',
        question: 'Which extraordinary carnivorous pitcher plant, endemic to the wet rainforests of Meghalaya, is found in the vicinity of Balpakram and Nokrek?',
        options: ['Nepenthes khasiana', 'Drosera burmannii', 'Utricularia aurea', 'Rafflesia arnoldii'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Nepenthes khasiana is India\'s only native pitcher plant species, an endangered carnivorous botanical treasure of the Meghalaya plateau.',
        establishedYear: 1985,
        district: 'South Garo Hills'
      },
      {
        id: 'ml-q5',
        state: 'Meghalaya',
        parkName: 'Balpakram National Park',
        question: 'Which deep chasm and geological fault line inside Balpakram is believed in local folklore to be caused by supernatural beings?',
        options: ['Chitmang Gorge (Mahadeo River Canyon)', 'Laitlum Canyons', 'Siju Gorge', 'Cherrapunji Rift'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The dramatic canyon carved by the Mahadeo River near Chitmang Peak is steeped in folklore as the mythical trail of spirits.',
        establishedYear: 1985,
        district: 'South Garo Hills'
      }
    ]
  },

  // ==========================================
  // 25. MANIPUR
  // ==========================================
  'Manipur': {
    stateInfo: {
      stateName: 'Manipur',
      capital: 'Imphal',
      totalParks: 1,
      overview: 'Manipur is home to the world\'s ONLY floating national park at Keibul Lamjao on Loktak Lake.',
      tipsForMahi: 'Must-know fact: Keibul Lamjao is the ONLY floating national park on Earth! Preserves the Sangai (Dancing Deer) on floating Phumdis.',
      parks: [
        {
          name: 'Keibul Lamjao National Park',
          year: 1977,
          district: 'Bishnupur',
          riverOrBiome: 'Loktak Lake / Floating Phumdi biomass islands',
          famousWildlife: ['Eld\'s Deer / Sangai (Rucervus eldii eldii)', 'Hog Deer', 'Otters', 'Waterfowl'],
          keyFeature: 'World\'s only floating national park; exclusive global home of the critically endangered Brow-antlered "Dancing" Deer.'
        },
        {
          name: 'Shirui National Park (Proposed/Notified)',
          year: 1982,
          district: 'Ukhrul',
          riverOrBiome: 'Shirui Kashong Peak',
          famousWildlife: ['Tragopan', 'Tiger', 'Leopard'],
          keyFeature: 'Famous for the unique and endemic Shirui Lily (Lilium mackliniae), the state flower of Manipur.'
        }
      ]
    },
    questions: [
      {
        id: 'mn-q1',
        state: 'Manipur',
        parkName: 'Keibul Lamjao National Park',
        question: 'Which national park in Manipur, situated in Bishnupur district on Loktak Lake, is internationally celebrated as the ONLY floating national park in the world?',
        options: ['Keibul Lamjao National Park', 'Shirui National Park', 'Nokrek National Park', 'Murlen National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Keibul Lamjao National Park (40 sq km) floats on Loktak Lake in Manipur, universally acknowledged as the planet\'s only floating wildlife park.',
        establishedYear: 1977,
        district: 'Bishnupur'
      },
      {
        id: 'mn-q2',
        state: 'Manipur',
        parkName: 'Keibul Lamjao National Park',
        question: 'Keibul Lamjao is the last surviving natural refuge for which critically endangered deer, the official State Animal of Manipur, famously called the "Dancing Deer"?',
        options: ['Sangai (Eld\'s Deer / Rucervus eldii eldii)', 'Hangul', 'Barasingha', 'Chital'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Sangai (Brow-antlered deer) has adapted specialized broad hooves to balance on the spongy floating mat of vegetation, earning the nickname "Dancing Deer".',
        establishedYear: 1977,
        district: 'Bishnupur'
      },
      {
        id: 'mn-q3',
        state: 'Manipur',
        parkName: 'Keibul Lamjao National Park',
        question: 'What is the local Meitei term for the thick, heterogeneous floating islands of soil, organic matter, and vegetation upon which Keibul Lamjao rests?',
        options: ['Phumdis', 'Charas', 'Khadins', 'Terai'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Phumdis are buoyant mats of vegetative organic debris and soil. One-fifth of the Phumdi floats above the water surface while four-fifths is submerged.',
        establishedYear: 1977,
        district: 'Bishnupur'
      },
      {
        id: 'mn-q4',
        state: 'Manipur',
        parkName: 'Shirui National Park',
        question: 'Shirui National Park in Ukhrul district of Manipur is world-famous as the exclusive natural habitat of which shade-loving endemic mountain flower?',
        options: ['Shirui Lily (Lilium mackliniae)', 'Blue Poppy', 'Brahma Kamal', 'Rhododendron arboreum'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Shirui Lily (Lilium mackliniae) is the state flower of Manipur, discovered by Frank Kingdon-Ward in 1946, blooming only on the slopes of Shirui Kashong.',
        establishedYear: 1982,
        district: 'Ukhrul'
      },
      {
        id: 'mn-q5',
        state: 'Manipur',
        parkName: 'Keibul Lamjao National Park',
        question: 'Loktak Lake, encompassing Keibul Lamjao National Park, is an internationally designated Ramsar wetland listed on which conservation register due to ecological changes from Ithai Barrage?',
        options: ['Montreux Record', 'Red Data List', 'Heritage Danger List', 'IUCN Green List'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Loktak Lake was placed on the Montreux Record in 1993 because the Ithai hydel barrage created permanently high water levels, preventing Phumdi regeneration.',
        establishedYear: 1977,
        district: 'Bishnupur'
      }
    ]
  },

  // ==========================================
  // 26. MIZORAM
  // ==========================================
  'Mizoram': {
    stateInfo: {
      stateName: 'Mizoram',
      capital: 'Aizawl',
      totalParks: 2,
      overview: 'Mizoram preserves rugged Chin-Lushai mountain ridges across Murlen and Phawngpui Blue Mountain National Parks.',
      tipsForMahi: 'Remember Phawngpui is the Blue Mountain (highest peak in Mizoram at 2,157m)! Murlen has canopies so dense sunlight barely enters.',
      parks: [
        {
          name: 'Phawngpui Blue Mountain National Park',
          year: 1992,
          district: 'Lawngtlai',
          riverOrBiome: 'Chhimtuipui (Kolodyne) River / Lushai Hills',
          famousWildlife: ['Blyth\'s Tragopan', 'Mrs. Hume\'s Pheasant (Vavu)', 'Goral', 'Clouded Leopard', 'Serow'],
          keyFeature: 'Encompasses Phawngpui ("Blue Mountain"), the highest peak in Mizoram (2,157 m), venerated as the abode of benign spirits.'
        },
        {
          name: 'Murlen National Park',
          year: 1991,
          district: 'Champhai',
          riverOrBiome: 'Indo-Burma hotspot / Sub-tropical evergreen',
          famousWildlife: ['Hume\'s Pheasant', 'Serow', 'Malayan Giant Squirrel', 'Tiger'],
          keyFeature: 'Noted for its dense canopy ("losing the sky") where only 1% of sunlight penetrates to the forest floor.'
        }
      ]
    },
    questions: [
      {
        id: 'mz-q1',
        state: 'Mizoram',
        parkName: 'Phawngpui Blue Mountain National Park',
        question: 'Which national park in Lawngtlai district protects the highest mountain peak in Mizoram (2,157 metres), famously venerated as the "Blue Mountain"?',
        options: ['Phawngpui Blue Mountain National Park', 'Murlen National Park', 'Dampa National Park', 'Ntangki National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Phawngpui (Blue Mountain) is the highest peak in Mizoram, standing at 2,157 m above sea level near the Myanmar border.',
        establishedYear: 1992,
        district: 'Lawngtlai'
      },
      {
        id: 'mz-q2',
        state: 'Mizoram',
        parkName: 'Phawngpui Blue Mountain National Park',
        question: 'Which rare and magnificent pheasant, designated the official State Bird of Mizoram (locally called "Vavu"), inhabits Phawngpui?',
        options: ['Mrs. Hume\'s Pheasant (Syrmaticus humiae)', 'Blyth\'s Tragopan', 'Blood Pheasant', 'Himalayan Monal'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Mrs. Hume\'s Pheasant (Syrmaticus humiae, locally "Vavu") is the state bird of Mizoram, nesting among the cliffs and dwarf bamboo of Phawngpui.',
        establishedYear: 1992,
        district: 'Lawngtlai'
      },
      {
        id: 'mz-q3',
        state: 'Mizoram',
        parkName: 'Murlen National Park',
        question: 'Murlen National Park in Champhai district is famous for what extraordinary forest canopy phenomenon observed by botanists?',
        options: [
          'Canopy is so dense that only 1% of sunlight penetrates to the forest floor',
          'Forest glows in the dark due to bioluminescent fungus',
          'Trees shed leaves in monsoon rather than winter',
          'Has no ground vegetation due to sand dunes'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Murlen\'s sub-tropical evergreen canopy is famously compared to the Amazon basin, allowing barely 1% of sunlight to reach the ground in bright daylight.',
        establishedYear: 1991,
        district: 'Champhai'
      },
      {
        id: 'mz-q4',
        state: 'Mizoram',
        parkName: 'Phawngpui Blue Mountain National Park',
        question: 'According to traditional Mizo folklore, the Phawngpui peak is revered as the divine abode of which benign protective mountain deity?',
        options: ['Goddess Sangau and the mythical Black Eagle', 'King Arthur', 'Goddess Kali', 'Spirit of Dremoshang'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Mizo mythology holds Phawngpui as the spiritual palace of the spirit king Sangau and is bounded by steep precipices like the Thlangnam cliff.',
        establishedYear: 1992,
        district: 'Lawngtlai'
      },
      {
        id: 'mz-q5',
        state: 'Mizoram',
        parkName: 'Phawngpui Blue Mountain National Park',
        question: 'Which major international river, flowing south through Mizoram into Myanmar\'s Rakhine State, defines the drainage basin of Phawngpui?',
        options: ['Chhimtuipui (Kaladan / Kolodyne) River', 'Tlawng River', 'Barak River', 'Irrawaddy River'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The Chhimtuipui (Kaladan) River flows near the eastern base of Phawngpui, serving as the arterial river of the Indo-Myanmar Kaladan project.',
        establishedYear: 1992,
        district: 'Lawngtlai'
      }
    ]
  },

  // ==========================================
  // 27. NAGALAND
  // ==========================================
  'Nagaland': {
    stateInfo: {
      stateName: 'Nagaland',
      capital: 'Kohima',
      totalParks: 1,
      overview: 'Nagaland preserves sub-tropical and temperate rainforests at Ntangki National Park in Peren district.',
      tipsForMahi: 'Remember Ntangki (or Intanki) is the ONLY National Park in Nagaland! Important home for the Hoolock Gibbon and Great Indian Hornbill.',
      parks: [
        {
          name: 'Ntangki National Park',
          year: 1993,
          district: 'Peren',
          riverOrBiome: 'Dhansiri River tributary / Barail Range',
          famousWildlife: ['Western Hoolock Gibbon', 'Great Indian Hornbill', 'Asian Palm Civet', 'Tiger', 'Black Stork'],
          keyFeature: 'Only national park in Nagaland; prime habitat for the Western Hoolock Gibbon, the only ape found in India.'
        }
      ]
    },
    questions: [
      {
        id: 'nl-q1',
        state: 'Nagaland',
        parkName: 'Ntangki National Park',
        question: 'Which is the ONLY officially notified National Park in the state of Nagaland, located in Peren district bordering Assam?',
        options: ['Ntangki (Intanki) National Park', 'Fakim National Park', 'Pulie Badze National Park', 'Rangapahar National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Ntangki National Park, established in 1993 in Peren district, is Nagaland\'s sole national park. Fakim and Pulie Badze are wildlife sanctuaries.',
        establishedYear: 1993,
        district: 'Peren'
      },
      {
        id: 'nl-q2',
        state: 'Nagaland',
        parkName: 'Ntangki National Park',
        question: 'Ntangki National Park is an essential stronghold for which primate species, celebrated as the ONLY ape species found in India?',
        options: ['Western Hoolock Gibbon (Hoolock hoolock)', 'Golden Langur', 'Lion-tailed Macaque', 'Slow Loris'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'The Western Hoolock Gibbon is India\'s only ape species, swinging across the upper canopy of Ntangki\'s virgin semi-evergreen forests.',
        establishedYear: 1993,
        district: 'Peren'
      },
      {
        id: 'nl-q3',
        state: 'Nagaland',
        parkName: 'Ntangki National Park',
        question: 'Which river flows along the northwestern boundary of Ntangki National Park, separating Nagaland from the Karbi Anglong district of Assam?',
        options: ['Dhansiri River', 'Doyang River', 'Dikhu River', 'Tizu River'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Dhansiri River, a major south-bank tributary of the Brahmaputra, flows along the boundary of Ntangki National Park.',
        establishedYear: 1993,
        district: 'Peren'
      },
      {
        id: 'nl-q4',
        state: 'Nagaland',
        parkName: 'Ntangki National Park',
        question: 'Which indigenous Naga community historically named and preserved the forest area that became Ntangki National Park?',
        options: ['Zeme Naga', 'Ao Naga', 'Angami Naga', 'Konyak Naga'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The name "Ntangki" is derived from the Zeme Naga dialect, historically protected as a traditional forest tract by the Zeliangrong people.',
        establishedYear: 1993,
        district: 'Peren'
      },
      {
        id: 'nl-q5',
        state: 'Nagaland',
        parkName: 'Ntangki National Park',
        question: 'Which iconic avian species, deeply interwoven with Naga cultural rituals and headgear traditions, nests in the high tree hollows of Ntangki?',
        options: ['Great Indian Hornbill (Buceros bicornis)', 'Blyth\'s Tragopan', 'Green Peafowl', 'Kalij Pheasant'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The Great Indian Hornbill is deeply revered in Naga folklore and gives its name to the famous annual Hornbill Festival celebrated in Kohima.',
        establishedYear: 1993,
        district: 'Peren'
      }
    ]
  },

  // ==========================================
  // 28. TRIPURA
  // ==========================================
  'Tripura': {
    stateInfo: {
      stateName: 'Tripura',
      capital: 'Agartala',
      totalParks: 2,
      overview: 'Tripura protects rolling forested hills and wetlands across Clouded Leopard and Rajbari National Parks.',
      tipsForMahi: 'Remember Tripura has Clouded Leopard NP (at Sipahijala) and Rajbari NP (at Trishna)! Home to Phayre\'s Langur (spectacled monkey).',
      parks: [
        {
          name: 'Clouded Leopard National Park',
          year: 2007,
          district: 'Sipahijala',
          riverOrBiome: 'Tropical semi-evergreen / Sipahijala reserve',
          famousWildlife: ['Clouded Leopard (Neofelis nebulosa)', 'Phayre\'s Leaf Monkey (Spectacled Langur)', 'Slow Loris', 'Barking Deer'],
          keyFeature: 'Dedicated to the conservation and captive breeding of Clouded Leopards and Tripura\'s state animal, Phayre\'s Leaf Monkey.'
        },
        {
          name: 'Rajbari National Park',
          year: 2007,
          district: 'South Tripura (Belonia)',
          riverOrBiome: 'Trishna Wildlife Sanctuary / Alluvial bamboo breaks',
          famousWildlife: ['Indian Gaur (Bison)', 'Golden Jackal', 'Wild Boar', 'Pheasants'],
          keyFeature: 'Situated within Trishna Sanctuary; internationally noted for protecting thriving herds of the massive Indian Gaur.'
        }
      ]
    },
    questions: [
      {
        id: 'tr-q1',
        state: 'Tripura',
        parkName: 'Clouded Leopard National Park',
        question: 'Which national park in Sipahijala district, established in 2007, is dedicated to the conservation of Clouded Leopards and Phayre\'s Leaf Monkey?',
        options: ['Clouded Leopard National Park', 'Rajbari National Park', 'Gumti National Park', 'Rowa National Park'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Clouded Leopard National Park covers 5.08 sq km inside the Sipahijala Wildlife Sanctuary, established specifically to safeguard this arboreal feline.',
        establishedYear: 2007,
        district: 'Sipahijala'
      },
      {
        id: 'tr-q2',
        state: 'Tripura',
        parkName: 'Clouded Leopard National Park',
        question: 'Which primate species with distinctive white spectacles around its eyes, designated the State Animal of Tripura, is strictly protected in Sipahijala?',
        options: ['Phayre\'s Leaf Monkey (Spectacled Langur)', 'Golden Langur', 'Bonnet Macaque', 'Capped Langur'],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Phayre\'s Leaf Monkey (Trachypithecus phayrei), or the Spectacled Langur, is the proud state animal of Tripura, found in the Sipahijala forests.',
        establishedYear: 2007,
        district: 'Sipahijala'
      },
      {
        id: 'tr-q3',
        state: 'Tripura',
        parkName: 'Rajbari National Park',
        question: 'Rajbari National Park in South Tripura, located within the Trishna Wildlife Sanctuary, is celebrated for protecting large breeding herds of which bovine megaherbivore?',
        options: ['Indian Gaur (Bison)', 'Wild Water Buffalo', 'Nilgai', 'Chinkara'],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Rajbari National Park is renowned for its flourishing population of the Indian Gaur (Bos gaurus), one of the heaviest wild bovines on Earth.',
        establishedYear: 2007,
        district: 'South Tripura'
      },
      {
        id: 'tr-q4',
        state: 'Tripura',
        parkName: 'Clouded Leopard National Park',
        question: 'What distinctive morphological adaptation allows the Clouded Leopard to climb down tree trunks headfirst and hang from branches with its hind paws?',
        options: [
          'Rotating ankle joints and exceptionally long tail for balance',
          'Webbed feet',
          'Prehensile tail',
          'Retractable wings'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Clouded leopards have flexible, rotating ankle joints and the longest canine teeth relative to skull size of any living carnivore, aiding arboreal hunting.',
        establishedYear: 2007,
        district: 'Sipahijala'
      },
      {
        id: 'tr-q5',
        state: 'Tripura',
        parkName: 'Rajbari National Park',
        question: 'The name "Rajbari" derives from the historical ruins of which royal dynasty\'s palace located in the vicinity of the park?',
        options: ['Manikya Dynasty of Tripura', 'Ahom Dynasty', 'Koch Dynasty', 'Chero Dynasty'],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'The Manikya kings of Tripura had ancestral royal estates and military outposts ("Rajbari") scattered across South Tripura near Belonia.',
        establishedYear: 2007,
        district: 'South Tripura'
      }
    ]
  }
};

