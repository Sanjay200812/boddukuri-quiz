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
  }
};

