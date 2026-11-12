import type { QuizQuestion, StateNationalParkInfo } from '../types/quiz';

export interface StateData {
  stateInfo: StateNationalParkInfo;
  questions: Omit<QuizQuestion, 'section'>[];
}

export const STATE_REPOSITORIES: Record<string, StateData> = {
  // ==========================================
  // MADHYA PRADESH
  // ==========================================
  'Madhya Pradesh': {
    stateInfo: {
      stateName: 'Madhya Pradesh',
      capital: 'Bhopal',
      totalParks: 11,
      overview: 'Madhya Pradesh is the Tiger State of India, home to 11 notified National Parks.',
      tipsForMahi: 'Mastering the National Parks of Madhya Pradesh.',
      parks: [
        {
                'name': 'Kanha National Park',
                'year': 1955,
                'district': 'Mandla & Balaghat',
                'keyFeature': 'Famous for Hardground Barasingha.'
        },
        {
                'name': 'Bandhavgarh National Park',
                'year': 1968,
                'district': 'Umaria',
                'keyFeature': 'Renowned for high tiger density.'
        },
        {
                'name': 'Panna National Park',
                'year': 1981,
                'district': 'Panna & Chhatarpur',
                'keyFeature': 'Ken River flows through the park.'
        },
        {
                'name': 'Pench National Park',
                'year': 1975,
                'district': 'Seoni & Chhindwara',
                'keyFeature': 'Setting for Kipling\'s The Jungle Book.'
        },
        {
                'name': 'Satpura National Park',
                'year': 1981,
                'district': 'Narmadapuram',
                'keyFeature': 'Core area of Pachmarhi Biosphere.'
        },
        {
                'name': 'Kuno National Park',
                'year': 2018,
                'district': 'Sheopur',
                'keyFeature': 'Site of Project Cheetah reintroduction.'
        },
        {
                'name': 'Sanjay National Park',
                'year': 1981,
                'district': 'Sidhi',
                'keyFeature': 'Part of Sanjay-Dubri Tiger Reserve.'
        },
        {
                'name': 'Madhav National Park',
                'year': 1959,
                'district': 'Shivpuri',
                'keyFeature': 'Historic Sakhya Sagar lake.'
        },
        {
                'name': 'Van Vihar National Park',
                'year': 1979,
                'district': 'Bhopal',
                'keyFeature': 'Modern zoological park in Bhopal city.'
        },
        {
                'name': 'Mandla Plant Fossils National Park',
                'year': 1983,
                'district': 'Dindori',
                'keyFeature': 'Prehistoric plant fossils.'
        },
        {
                'name': 'Dinosaur Fossils National Park',
                'year': 2011,
                'district': 'Dhar',
                'keyFeature': 'Preserved dinosaur eggs and fossils.'
        }
]
    },
    questions: [
      {
            id: 'madhya-pradesh-q1',
            state: 'Madhya Pradesh',
            parkName: 'Kanha National Park',
            question: 'In which state is Kanha National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Karnataka',
                  'Kerala',
                  'Assam'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Kanha National Park is located in Madhya Pradesh.',
            establishedYear: 1955,
            district: 'Mandla & Balaghat',
            keyFeature: 'Famous for Hardground Barasingha.'
      },
      {
            id: 'madhya-pradesh-q2',
            state: 'Madhya Pradesh',
            parkName: 'Bandhavgarh National Park',
            question: 'In which state is Bandhavgarh National Park located?',
            options: [
                  'Kerala',
                  'Madhya Pradesh',
                  'Assam',
                  'Andhra Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Bandhavgarh National Park is located in Madhya Pradesh.',
            establishedYear: 1968,
            district: 'Umaria',
            keyFeature: 'Renowned for high tiger density.'
      },
      {
            id: 'madhya-pradesh-q3',
            state: 'Madhya Pradesh',
            parkName: 'Panna National Park',
            question: 'In which state is Panna National Park located?',
            options: [
                  'Assam',
                  'Andhra Pradesh',
                  'Madhya Pradesh',
                  'Telangana'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Panna National Park is located in Madhya Pradesh.',
            establishedYear: 1981,
            district: 'Panna & Chhatarpur',
            keyFeature: 'Ken River flows through the park.'
      },
      {
            id: 'madhya-pradesh-q4',
            state: 'Madhya Pradesh',
            parkName: 'Pench National Park',
            question: 'In which state is Pench National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Telangana',
                  'Rajasthan',
                  'Madhya Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Pench National Park is located in Madhya Pradesh.',
            establishedYear: 1975,
            district: 'Seoni & Chhindwara',
            keyFeature: 'Setting for Kipling\'s The Jungle Book.'
      },
      {
            id: 'madhya-pradesh-q5',
            state: 'Madhya Pradesh',
            parkName: 'Satpura National Park',
            question: 'In which state is Satpura National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Telangana',
                  'Rajasthan',
                  'Gujarat'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Satpura National Park is located in Madhya Pradesh.',
            establishedYear: 1981,
            district: 'Narmadapuram',
            keyFeature: 'Core area of Pachmarhi Biosphere.'
      },
      {
            id: 'madhya-pradesh-q6',
            state: 'Madhya Pradesh',
            parkName: 'Kuno National Park',
            question: 'In which state is Kuno National Park located?',
            options: [
                  'Rajasthan',
                  'Madhya Pradesh',
                  'Gujarat',
                  'Karnataka'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Kuno National Park is located in Madhya Pradesh.',
            establishedYear: 2018,
            district: 'Sheopur',
            keyFeature: 'Site of Project Cheetah reintroduction.'
      },
      {
            id: 'madhya-pradesh-q7',
            state: 'Madhya Pradesh',
            parkName: 'Sanjay National Park',
            question: 'In which state is Sanjay National Park located?',
            options: [
                  'Gujarat',
                  'Karnataka',
                  'Madhya Pradesh',
                  'Kerala'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Sanjay National Park is located in Madhya Pradesh.',
            establishedYear: 1981,
            district: 'Sidhi',
            keyFeature: 'Part of Sanjay-Dubri Tiger Reserve.'
      },
      {
            id: 'madhya-pradesh-q8',
            state: 'Madhya Pradesh',
            parkName: 'Madhav National Park',
            question: 'In which state is Madhav National Park located?',
            options: [
                  'Karnataka',
                  'Kerala',
                  'Assam',
                  'Madhya Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Madhav National Park is located in Madhya Pradesh.',
            establishedYear: 1959,
            district: 'Shivpuri',
            keyFeature: 'Historic Sakhya Sagar lake.'
      },
      {
            id: 'madhya-pradesh-q9',
            state: 'Madhya Pradesh',
            parkName: 'Van Vihar National Park',
            question: 'In which state is Van Vihar National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Kerala',
                  'Assam',
                  'Andhra Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Van Vihar National Park is located in Madhya Pradesh.',
            establishedYear: 1979,
            district: 'Bhopal',
            keyFeature: 'Modern zoological park in Bhopal city.'
      },
      {
            id: 'madhya-pradesh-q10',
            state: 'Madhya Pradesh',
            parkName: 'Mandla Plant Fossils National Park',
            question: 'In which state is Mandla Plant Fossils National Park located?',
            options: [
                  'Assam',
                  'Madhya Pradesh',
                  'Andhra Pradesh',
                  'Telangana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mandla Plant Fossils National Park is located in Madhya Pradesh.',
            establishedYear: 1983,
            district: 'Dindori',
            keyFeature: 'Prehistoric plant fossils.'
      },
      {
            id: 'madhya-pradesh-q11',
            state: 'Madhya Pradesh',
            parkName: 'Dinosaur Fossils National Park',
            question: 'In which state is Dinosaur Fossils National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Telangana',
                  'Madhya Pradesh',
                  'Rajasthan'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Dinosaur Fossils National Park is located in Madhya Pradesh.',
            establishedYear: 2011,
            district: 'Dhar',
            keyFeature: 'Preserved dinosaur eggs and fossils.'
      }
]
  },

  // ==========================================
  // ANDHRA PRADESH
  // ==========================================
  'Andhra Pradesh': {
    stateInfo: {
      stateName: 'Andhra Pradesh',
      capital: 'Amaravati',
      totalParks: 3,
      overview: 'Andhra Pradesh has 3 National Parks spanning the Eastern Ghats and Seshachalam hills.',
      tipsForMahi: 'Mastering the National Parks of Andhra Pradesh.',
      parks: [
        {
                'name': 'Papikonda National Park',
                'year': 2008,
                'district': 'East & West Godavari',
                'keyFeature': 'Spans the scenic Papi Hills on Godavari River.'
        },
        {
                'name': 'Sri Venkateswara National Park',
                'year': 1989,
                'district': 'Tirupati & Kadapa',
                'keyFeature': 'Located in Seshachalam Biosphere Reserve.'
        },
        {
                'name': 'Rajiv Gandhi (Rameswaram) National Park',
                'year': 2005,
                'district': 'YSR Kadapa',
                'keyFeature': 'Pristine peninsular biodiversity reserve.'
        }
]
    },
    questions: [
      {
            id: 'andhra-pradesh-q1',
            state: 'Andhra Pradesh',
            parkName: 'Papikonda National Park',
            question: 'In which state is Papikonda National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Telangana',
                  'Karnataka',
                  'Tamil Nadu'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Papikonda National Park is located in Andhra Pradesh.',
            establishedYear: 2008,
            district: 'East & West Godavari',
            keyFeature: 'Spans the scenic Papi Hills on Godavari River.'
      },
      {
            id: 'andhra-pradesh-q2',
            state: 'Andhra Pradesh',
            parkName: 'Sri Venkateswara National Park',
            question: 'In which state is Sri Venkateswara National Park located?',
            options: [
                  'Karnataka',
                  'Andhra Pradesh',
                  'Tamil Nadu',
                  'Kerala'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Sri Venkateswara National Park is located in Andhra Pradesh.',
            establishedYear: 1989,
            district: 'Tirupati & Kadapa',
            keyFeature: 'Located in Seshachalam Biosphere Reserve.'
      },
      {
            id: 'andhra-pradesh-q3',
            state: 'Andhra Pradesh',
            parkName: 'Rajiv Gandhi (Rameswaram) National Park',
            question: 'In which state is Rajiv Gandhi (Rameswaram) National Park located?',
            options: [
                  'Tamil Nadu',
                  'Kerala',
                  'Andhra Pradesh',
                  'Odisha'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Rajiv Gandhi (Rameswaram) National Park is located in Andhra Pradesh.',
            establishedYear: 2005,
            district: 'YSR Kadapa',
            keyFeature: 'Pristine peninsular biodiversity reserve.'
      },
      {
            id: 'andhra-pradesh-q4',
            state: 'Andhra Pradesh',
            parkName: 'Papikonda National Park',
            question: 'In which state is Papikonda National Park located?',
            options: [
                  'Kerala',
                  'Odisha',
                  'Maharashtra',
                  'Andhra Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Papikonda National Park is located in Andhra Pradesh.',
            establishedYear: 2008,
            district: 'East & West Godavari',
            keyFeature: 'Spans the scenic Papi Hills on Godavari River.'
      },
      {
            id: 'andhra-pradesh-q5',
            state: 'Andhra Pradesh',
            parkName: 'Sri Venkateswara National Park',
            question: 'In which state is Sri Venkateswara National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Odisha',
                  'Maharashtra',
                  'Telangana'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Sri Venkateswara National Park is located in Andhra Pradesh.',
            establishedYear: 1989,
            district: 'Tirupati & Kadapa',
            keyFeature: 'Located in Seshachalam Biosphere Reserve.'
      }
]
  },

  // ==========================================
  // TELANGANA
  // ==========================================
  'Telangana': {
    stateInfo: {
      stateName: 'Telangana',
      capital: 'Hyderabad',
      totalParks: 3,
      overview: 'Telangana has 3 National Parks protecting Deccan wildlife and urban nature reserves.',
      tipsForMahi: 'Mastering the National Parks of Telangana.',
      parks: [
        {
                'name': 'Kasu Brahmananda Reddy (KBR) National Park',
                'year': 1998,
                'district': 'Hyderabad',
                'keyFeature': 'Urban forest park in Jubilee Hills, Hyderabad.'
        },
        {
                'name': 'Mahavir Harina Vanasthali National Park',
                'year': 1994,
                'district': 'Ranga Reddy',
                'keyFeature': 'Largest green lung space in Hyderabad, famous for blackbucks.'
        },
        {
                'name': 'Mrugavani National Park',
                'year': 1994,
                'district': 'Ranga Reddy (Chilkur)',
                'keyFeature': 'Diverse Deccan tropical dry deciduous flora.'
        }
]
    },
    questions: [
      {
            id: 'telangana-q1',
            state: 'Telangana',
            parkName: 'Kasu Brahmananda Reddy (KBR) National Park',
            question: 'In which state is Kasu Brahmananda Reddy (KBR) National Park located?',
            options: [
                  'Telangana',
                  'Andhra Pradesh',
                  'Karnataka',
                  'Maharashtra'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Kasu Brahmananda Reddy (KBR) National Park is located in Telangana.',
            establishedYear: 1998,
            district: 'Hyderabad',
            keyFeature: 'Urban forest park in Jubilee Hills, Hyderabad.'
      },
      {
            id: 'telangana-q2',
            state: 'Telangana',
            parkName: 'Mahavir Harina Vanasthali National Park',
            question: 'In which state is Mahavir Harina Vanasthali National Park located?',
            options: [
                  'Karnataka',
                  'Telangana',
                  'Maharashtra',
                  'Madhya Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mahavir Harina Vanasthali National Park is located in Telangana.',
            establishedYear: 1994,
            district: 'Ranga Reddy',
            keyFeature: 'Largest green lung space in Hyderabad, famous for blackbucks.'
      },
      {
            id: 'telangana-q3',
            state: 'Telangana',
            parkName: 'Mrugavani National Park',
            question: 'In which state is Mrugavani National Park located?',
            options: [
                  'Maharashtra',
                  'Madhya Pradesh',
                  'Telangana',
                  'Tamil Nadu'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Mrugavani National Park is located in Telangana.',
            establishedYear: 1994,
            district: 'Ranga Reddy (Chilkur)',
            keyFeature: 'Diverse Deccan tropical dry deciduous flora.'
      },
      {
            id: 'telangana-q4',
            state: 'Telangana',
            parkName: 'Kasu Brahmananda Reddy (KBR) National Park',
            question: 'In which state is Kasu Brahmananda Reddy (KBR) National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Tamil Nadu',
                  'Andhra Pradesh',
                  'Telangana'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Kasu Brahmananda Reddy (KBR) National Park is located in Telangana.',
            establishedYear: 1998,
            district: 'Hyderabad',
            keyFeature: 'Urban forest park in Jubilee Hills, Hyderabad.'
      },
      {
            id: 'telangana-q5',
            state: 'Telangana',
            parkName: 'Mahavir Harina Vanasthali National Park',
            question: 'In which state is Mahavir Harina Vanasthali National Park located?',
            options: [
                  'Telangana',
                  'Tamil Nadu',
                  'Andhra Pradesh',
                  'Karnataka'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mahavir Harina Vanasthali National Park is located in Telangana.',
            establishedYear: 1994,
            district: 'Ranga Reddy',
            keyFeature: 'Largest green lung space in Hyderabad, famous for blackbucks.'
      }
]
  },

  // ==========================================
  // KERALA
  // ==========================================
  'Kerala': {
    stateInfo: {
      stateName: 'Kerala',
      capital: 'Thiruvananthapuram',
      totalParks: 6,
      overview: 'Kerala features 6 National Parks in the Western Ghats global biodiversity hotspot.',
      tipsForMahi: 'Mastering the National Parks of Kerala.',
      parks: [
        {
                'name': 'Eravikulam National Park',
                'year': 1978,
                'district': 'Idukki',
                'keyFeature': 'Home of Nilgiri Tahr and Anamudi peak.'
        },
        {
                'name': 'Silent Valley National Park',
                'year': 1984,
                'district': 'Palakkad',
                'keyFeature': 'Pristine rainforest with Lion-tailed macaques.'
        },
        {
                'name': 'Periyar National Park',
                'year': 1982,
                'district': 'Idukki',
                'keyFeature': 'Famous elephant and tiger sanctuary on Periyar Lake.'
        },
        {
                'name': 'Anamudi Shola National Park',
                'year': 2003,
                'district': 'Idukki',
                'keyFeature': 'High-altitude shola-grassland ecosystem.'
        },
        {
                'name': 'Mathikettan Shola National Park',
                'year': 2003,
                'district': 'Idukki',
                'keyFeature': 'Cardamom Hills shola forest reserve.'
        },
        {
                'name': 'Pambadum Shola National Park',
                'year': 2003,
                'district': 'Idukki',
                'keyFeature': 'Smallest national park in Kerala.'
        }
]
    },
    questions: [
      {
            id: 'kerala-q1',
            state: 'Kerala',
            parkName: 'Eravikulam National Park',
            question: 'In which state is Eravikulam National Park located?',
            options: [
                  'Kerala',
                  'Karnataka',
                  'Tamil Nadu',
                  'Andhra Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Eravikulam National Park is located in Kerala.',
            establishedYear: 1978,
            district: 'Idukki',
            keyFeature: 'Home of Nilgiri Tahr and Anamudi peak.'
      },
      {
            id: 'kerala-q2',
            state: 'Kerala',
            parkName: 'Silent Valley National Park',
            question: 'In which state is Silent Valley National Park located?',
            options: [
                  'Tamil Nadu',
                  'Kerala',
                  'Andhra Pradesh',
                  'Goa'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Silent Valley National Park is located in Kerala.',
            establishedYear: 1984,
            district: 'Palakkad',
            keyFeature: 'Pristine rainforest with Lion-tailed macaques.'
      },
      {
            id: 'kerala-q3',
            state: 'Kerala',
            parkName: 'Periyar National Park',
            question: 'In which state is Periyar National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Goa',
                  'Kerala',
                  'Maharashtra'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Periyar National Park is located in Kerala.',
            establishedYear: 1982,
            district: 'Idukki',
            keyFeature: 'Famous elephant and tiger sanctuary on Periyar Lake.'
      },
      {
            id: 'kerala-q4',
            state: 'Kerala',
            parkName: 'Anamudi Shola National Park',
            question: 'In which state is Anamudi Shola National Park located?',
            options: [
                  'Goa',
                  'Maharashtra',
                  'Karnataka',
                  'Kerala'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Anamudi Shola National Park is located in Kerala.',
            establishedYear: 2003,
            district: 'Idukki',
            keyFeature: 'High-altitude shola-grassland ecosystem.'
      },
      {
            id: 'kerala-q5',
            state: 'Kerala',
            parkName: 'Mathikettan Shola National Park',
            question: 'In which state is Mathikettan Shola National Park located?',
            options: [
                  'Kerala',
                  'Maharashtra',
                  'Karnataka',
                  'Tamil Nadu'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mathikettan Shola National Park is located in Kerala.',
            establishedYear: 2003,
            district: 'Idukki',
            keyFeature: 'Cardamom Hills shola forest reserve.'
      },
      {
            id: 'kerala-q6',
            state: 'Kerala',
            parkName: 'Pambadum Shola National Park',
            question: 'In which state is Pambadum Shola National Park located?',
            options: [
                  'Karnataka',
                  'Kerala',
                  'Tamil Nadu',
                  'Andhra Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Pambadum Shola National Park is located in Kerala.',
            establishedYear: 2003,
            district: 'Idukki',
            keyFeature: 'Smallest national park in Kerala.'
      }
]
  },

  // ==========================================
  // ASSAM
  // ==========================================
  'Assam': {
    stateInfo: {
      stateName: 'Assam',
      capital: 'Dispur',
      totalParks: 7,
      overview: 'Assam features 7 National Parks along the Brahmaputra River valley.',
      tipsForMahi: 'Mastering the National Parks of Assam.',
      parks: [
        {
                'name': 'Kaziranga National Park',
                'year': 1974,
                'district': 'Golaghat & Nagaon',
                'keyFeature': 'World’s greatest stronghold of Great Indian One-Horned Rhinoceros.'
        },
        {
                'name': 'Manas National Park',
                'year': 1990,
                'district': 'Baksa & Chirang',
                'keyFeature': 'UNESCO Natural World Heritage site along Bhutan border.'
        },
        {
                'name': 'Dibru-Saikhowa National Park',
                'year': 1999,
                'district': 'Dibrugarh & Tinsukia',
                'keyFeature': 'Feral horses and riverine wetlands.'
        },
        {
                'name': 'Nameri National Park',
                'year': 1998,
                'district': 'Sonitpur',
                'keyFeature': 'Jia Bhoroli River elephant corridor.'
        },
        {
                'name': 'Rajiv Gandhi Orang National Park',
                'year': 1999,
                'district': 'Darrang & Sonitpur',
                'keyFeature': 'Mini-Kaziranga on northern bank of Brahmaputra.'
        },
        {
                'name': 'Dehing Patkai National Park',
                'year': 2021,
                'district': 'Dibrugarh & Tinsukia',
                'keyFeature': 'The Amazon of the East rainforest.'
        },
        {
                'name': 'Raimona National Park',
                'year': 2021,
                'district': 'Kokrajhar',
                'keyFeature': 'Famous for Golden Langurs in Bodoland.'
        }
]
    },
    questions: [
      {
            id: 'assam-q1',
            state: 'Assam',
            parkName: 'Kaziranga National Park',
            question: 'In which state is Kaziranga National Park located?',
            options: [
                  'Assam',
                  'West Bengal',
                  'Meghalaya',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Kaziranga National Park is located in Assam.',
            establishedYear: 1974,
            district: 'Golaghat & Nagaon',
            keyFeature: 'World’s greatest stronghold of Great Indian One-Horned Rhinoceros.'
      },
      {
            id: 'assam-q2',
            state: 'Assam',
            parkName: 'Manas National Park',
            question: 'In which state is Manas National Park located?',
            options: [
                  'Meghalaya',
                  'Assam',
                  'Arunachal Pradesh',
                  'Nagaland'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Manas National Park is located in Assam.',
            establishedYear: 1990,
            district: 'Baksa & Chirang',
            keyFeature: 'UNESCO Natural World Heritage site along Bhutan border.'
      },
      {
            id: 'assam-q3',
            state: 'Assam',
            parkName: 'Dibru-Saikhowa National Park',
            question: 'In which state is Dibru-Saikhowa National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Nagaland',
                  'Assam',
                  'Tripura'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Dibru-Saikhowa National Park is located in Assam.',
            establishedYear: 1999,
            district: 'Dibrugarh & Tinsukia',
            keyFeature: 'Feral horses and riverine wetlands.'
      },
      {
            id: 'assam-q4',
            state: 'Assam',
            parkName: 'Nameri National Park',
            question: 'In which state is Nameri National Park located?',
            options: [
                  'Nagaland',
                  'Tripura',
                  'West Bengal',
                  'Assam'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Nameri National Park is located in Assam.',
            establishedYear: 1998,
            district: 'Sonitpur',
            keyFeature: 'Jia Bhoroli River elephant corridor.'
      },
      {
            id: 'assam-q5',
            state: 'Assam',
            parkName: 'Rajiv Gandhi Orang National Park',
            question: 'In which state is Rajiv Gandhi Orang National Park located?',
            options: [
                  'Assam',
                  'Tripura',
                  'West Bengal',
                  'Meghalaya'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Rajiv Gandhi Orang National Park is located in Assam.',
            establishedYear: 1999,
            district: 'Darrang & Sonitpur',
            keyFeature: 'Mini-Kaziranga on northern bank of Brahmaputra.'
      },
      {
            id: 'assam-q6',
            state: 'Assam',
            parkName: 'Dehing Patkai National Park',
            question: 'In which state is Dehing Patkai National Park located?',
            options: [
                  'West Bengal',
                  'Assam',
                  'Meghalaya',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Dehing Patkai National Park is located in Assam.',
            establishedYear: 2021,
            district: 'Dibrugarh & Tinsukia',
            keyFeature: 'The Amazon of the East rainforest.'
      },
      {
            id: 'assam-q7',
            state: 'Assam',
            parkName: 'Raimona National Park',
            question: 'In which state is Raimona National Park located?',
            options: [
                  'Meghalaya',
                  'Arunachal Pradesh',
                  'Assam',
                  'Nagaland'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Raimona National Park is located in Assam.',
            establishedYear: 2021,
            district: 'Kokrajhar',
            keyFeature: 'Famous for Golden Langurs in Bodoland.'
      }
]
  },

  // ==========================================
  // KARNATAKA
  // ==========================================
  'Karnataka': {
    stateInfo: {
      stateName: 'Karnataka',
      capital: 'Bengaluru',
      totalParks: 5,
      overview: 'Karnataka has 5 National Parks across Western Ghats and Deccan plateau.',
      tipsForMahi: 'Mastering the National Parks of Karnataka.',
      parks: [
        {
                'name': 'Bandipur National Park',
                'year': 1974,
                'district': 'Chamarajanagar',
                'keyFeature': 'Premier tiger reserve in Nilgiri Biosphere.'
        },
        {
                'name': 'Nagarhole (Rajiv Gandhi) National Park',
                'year': 1988,
                'district': 'Kodagu & Mysuru',
                'keyFeature': 'Kabini River wildlife paradise.'
        },
        {
                'name': 'Bannerghatta National Park',
                'year': 1974,
                'district': 'Bengaluru Urban & Rural',
                'keyFeature': 'Biological park and butterfly sanctuary near Bengaluru.'
        },
        {
                'name': 'Kudremukh National Park',
                'year': 1987,
                'district': 'Chikkamagaluru',
                'keyFeature': 'Horse-face shaped peak in Western Ghats.'
        },
        {
                'name': 'Anshi (Kali) National Park',
                'year': 1987,
                'district': 'Uttara Kannada',
                'keyFeature': 'Dandeli-Anshi Tiger Reserve along Kali River.'
        }
]
    },
    questions: [
      {
            id: 'karnataka-q1',
            state: 'Karnataka',
            parkName: 'Bandipur National Park',
            question: 'In which state is Bandipur National Park located?',
            options: [
                  'Karnataka',
                  'Kerala',
                  'Tamil Nadu',
                  'Maharashtra'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Bandipur National Park is located in Karnataka.',
            establishedYear: 1974,
            district: 'Chamarajanagar',
            keyFeature: 'Premier tiger reserve in Nilgiri Biosphere.'
      },
      {
            id: 'karnataka-q2',
            state: 'Karnataka',
            parkName: 'Nagarhole (Rajiv Gandhi) National Park',
            question: 'In which state is Nagarhole (Rajiv Gandhi) National Park located?',
            options: [
                  'Tamil Nadu',
                  'Karnataka',
                  'Maharashtra',
                  'Telangana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Nagarhole (Rajiv Gandhi) National Park is located in Karnataka.',
            establishedYear: 1988,
            district: 'Kodagu & Mysuru',
            keyFeature: 'Kabini River wildlife paradise.'
      },
      {
            id: 'karnataka-q3',
            state: 'Karnataka',
            parkName: 'Bannerghatta National Park',
            question: 'In which state is Bannerghatta National Park located?',
            options: [
                  'Maharashtra',
                  'Telangana',
                  'Karnataka',
                  'Andhra Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Bannerghatta National Park is located in Karnataka.',
            establishedYear: 1974,
            district: 'Bengaluru Urban & Rural',
            keyFeature: 'Biological park and butterfly sanctuary near Bengaluru.'
      },
      {
            id: 'karnataka-q4',
            state: 'Karnataka',
            parkName: 'Kudremukh National Park',
            question: 'In which state is Kudremukh National Park located?',
            options: [
                  'Telangana',
                  'Andhra Pradesh',
                  'Kerala',
                  'Karnataka'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Kudremukh National Park is located in Karnataka.',
            establishedYear: 1987,
            district: 'Chikkamagaluru',
            keyFeature: 'Horse-face shaped peak in Western Ghats.'
      },
      {
            id: 'karnataka-q5',
            state: 'Karnataka',
            parkName: 'Anshi (Kali) National Park',
            question: 'In which state is Anshi (Kali) National Park located?',
            options: [
                  'Karnataka',
                  'Andhra Pradesh',
                  'Kerala',
                  'Tamil Nadu'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Anshi (Kali) National Park is located in Karnataka.',
            establishedYear: 1987,
            district: 'Uttara Kannada',
            keyFeature: 'Dandeli-Anshi Tiger Reserve along Kali River.'
      }
]
  },

  // ==========================================
  // MAHARASHTRA
  // ==========================================
  'Maharashtra': {
    stateInfo: {
      stateName: 'Maharashtra',
      capital: 'Mumbai',
      totalParks: 6,
      overview: 'Maharashtra has 6 National Parks protecting Sahyadri forests and Vidarbha tiger reserves.',
      tipsForMahi: 'Mastering the National Parks of Maharashtra.',
      parks: [
        {
                'name': 'Tadoba National Park',
                'year': 1955,
                'district': 'Chandrapur',
                'keyFeature': 'Oldest and largest national park in Maharashtra.'
        },
        {
                'name': 'Sanjay Gandhi (Borivali) National Park',
                'year': 1983,
                'district': 'Mumbai Suburban',
                'keyFeature': 'Unique national park situated inside a megacity.'
        },
        {
                'name': 'Chandoli National Park',
                'year': 2004,
                'district': 'Sangli, Satara & Kolhapur',
                'keyFeature': 'Sahyadri Tiger Reserve core.'
        },
        {
                'name': 'Gugamal National Park',
                'year': 1975,
                'district': 'Amravati',
                'keyFeature': 'Melghat Tiger Reserve core in Satpura range.'
        },
        {
                'name': 'Nawegaon National Park',
                'year': 1975,
                'district': 'Gondia',
                'keyFeature': 'Scenic Nawegaon lake bird sanctuary.'
        },
        {
                'name': 'Pench (Maharashtra) National Park',
                'year': 1975,
                'district': 'Nagpur',
                'keyFeature': 'Maharashtra portion of the famous Pench valley.'
        }
]
    },
    questions: [
      {
            id: 'maharashtra-q1',
            state: 'Maharashtra',
            parkName: 'Tadoba National Park',
            question: 'In which state is Tadoba National Park located?',
            options: [
                  'Maharashtra',
                  'Gujarat',
                  'Madhya Pradesh',
                  'Karnataka'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Tadoba National Park is located in Maharashtra.',
            establishedYear: 1955,
            district: 'Chandrapur',
            keyFeature: 'Oldest and largest national park in Maharashtra.'
      },
      {
            id: 'maharashtra-q2',
            state: 'Maharashtra',
            parkName: 'Sanjay Gandhi (Borivali) National Park',
            question: 'In which state is Sanjay Gandhi (Borivali) National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Maharashtra',
                  'Karnataka',
                  'Goa'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Sanjay Gandhi (Borivali) National Park is located in Maharashtra.',
            establishedYear: 1983,
            district: 'Mumbai Suburban',
            keyFeature: 'Unique national park situated inside a megacity.'
      },
      {
            id: 'maharashtra-q3',
            state: 'Maharashtra',
            parkName: 'Chandoli National Park',
            question: 'In which state is Chandoli National Park located?',
            options: [
                  'Karnataka',
                  'Goa',
                  'Maharashtra',
                  'Chhattisgarh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Chandoli National Park is located in Maharashtra.',
            establishedYear: 2004,
            district: 'Sangli, Satara & Kolhapur',
            keyFeature: 'Sahyadri Tiger Reserve core.'
      },
      {
            id: 'maharashtra-q4',
            state: 'Maharashtra',
            parkName: 'Gugamal National Park',
            question: 'In which state is Gugamal National Park located?',
            options: [
                  'Goa',
                  'Chhattisgarh',
                  'Gujarat',
                  'Maharashtra'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Gugamal National Park is located in Maharashtra.',
            establishedYear: 1975,
            district: 'Amravati',
            keyFeature: 'Melghat Tiger Reserve core in Satpura range.'
      },
      {
            id: 'maharashtra-q5',
            state: 'Maharashtra',
            parkName: 'Nawegaon National Park',
            question: 'In which state is Nawegaon National Park located?',
            options: [
                  'Maharashtra',
                  'Chhattisgarh',
                  'Gujarat',
                  'Madhya Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Nawegaon National Park is located in Maharashtra.',
            establishedYear: 1975,
            district: 'Gondia',
            keyFeature: 'Scenic Nawegaon lake bird sanctuary.'
      },
      {
            id: 'maharashtra-q6',
            state: 'Maharashtra',
            parkName: 'Pench (Maharashtra) National Park',
            question: 'In which state is Pench (Maharashtra) National Park located?',
            options: [
                  'Gujarat',
                  'Maharashtra',
                  'Madhya Pradesh',
                  'Karnataka'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Pench (Maharashtra) National Park is located in Maharashtra.',
            establishedYear: 1975,
            district: 'Nagpur',
            keyFeature: 'Maharashtra portion of the famous Pench valley.'
      }
]
  },

  // ==========================================
  // GUJARAT
  // ==========================================
  'Gujarat': {
    stateInfo: {
      stateName: 'Gujarat',
      capital: 'Gandhinagar',
      totalParks: 4,
      overview: 'Gujarat has 4 National Parks covering Asiatic lions, marine coral reefs, and blackbucks.',
      tipsForMahi: 'Mastering the National Parks of Gujarat.',
      parks: [
        {
                'name': 'Gir National Park',
                'year': 1975,
                'district': 'Junagadh & Gir Somnath',
                'keyFeature': 'Only natural habitat of the Asiatic Lion in the world.'
        },
        {
                'name': 'Blackbuck (Velavadar) National Park',
                'year': 1976,
                'district': 'Bhavnagar',
                'keyFeature': 'Largest population of Blackbucks in grassland ecosystem.'
        },
        {
                'name': 'Marine (Gulf of Kutch) National Park',
                'year': 1982,
                'district': 'Jamnagar & Devbhumi Dwarka',
                'keyFeature': 'India’s first marine national park.'
        },
        {
                'name': 'Vansda National Park',
                'year': 1979,
                'district': 'Navsari',
                'keyFeature': 'Dense deciduous Dangs forest canopy.'
        }
]
    },
    questions: [
      {
            id: 'gujarat-q1',
            state: 'Gujarat',
            parkName: 'Gir National Park',
            question: 'In which state is Gir National Park located?',
            options: [
                  'Gujarat',
                  'Rajasthan',
                  'Maharashtra',
                  'Madhya Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Gir National Park is located in Gujarat.',
            establishedYear: 1975,
            district: 'Junagadh & Gir Somnath',
            keyFeature: 'Only natural habitat of the Asiatic Lion in the world.'
      },
      {
            id: 'gujarat-q2',
            state: 'Gujarat',
            parkName: 'Blackbuck (Velavadar) National Park',
            question: 'In which state is Blackbuck (Velavadar) National Park located?',
            options: [
                  'Maharashtra',
                  'Gujarat',
                  'Madhya Pradesh',
                  'Haryana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Blackbuck (Velavadar) National Park is located in Gujarat.',
            establishedYear: 1976,
            district: 'Bhavnagar',
            keyFeature: 'Largest population of Blackbucks in grassland ecosystem.'
      },
      {
            id: 'gujarat-q3',
            state: 'Gujarat',
            parkName: 'Marine (Gulf of Kutch) National Park',
            question: 'In which state is Marine (Gulf of Kutch) National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Haryana',
                  'Gujarat',
                  'Rajasthan'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Marine (Gulf of Kutch) National Park is located in Gujarat.',
            establishedYear: 1982,
            district: 'Jamnagar & Devbhumi Dwarka',
            keyFeature: 'India’s first marine national park.'
      },
      {
            id: 'gujarat-q4',
            state: 'Gujarat',
            parkName: 'Vansda National Park',
            question: 'In which state is Vansda National Park located?',
            options: [
                  'Haryana',
                  'Rajasthan',
                  'Maharashtra',
                  'Gujarat'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Vansda National Park is located in Gujarat.',
            establishedYear: 1979,
            district: 'Navsari',
            keyFeature: 'Dense deciduous Dangs forest canopy.'
      },
      {
            id: 'gujarat-q5',
            state: 'Gujarat',
            parkName: 'Gir National Park',
            question: 'In which state is Gir National Park located?',
            options: [
                  'Gujarat',
                  'Rajasthan',
                  'Maharashtra',
                  'Madhya Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Gir National Park is located in Gujarat.',
            establishedYear: 1975,
            district: 'Junagadh & Gir Somnath',
            keyFeature: 'Only natural habitat of the Asiatic Lion in the world.'
      }
]
  },

  // ==========================================
  // GOA
  // ==========================================
  'Goa': {
    stateInfo: {
      stateName: 'Goa',
      capital: 'Panaji',
      totalParks: 1,
      overview: 'Goa has 1 National Park nestled in the lush Western Ghats.',
      tipsForMahi: 'Mastering the National Parks of Goa.',
      parks: [
        {
                'name': 'Mollem (Bhagwan Mahavir) National Park',
                'year': 1978,
                'district': 'South Goa (Dharbandora)',
                'keyFeature': 'Home of the magnificent Dudhsagar Waterfalls.'
        }
]
    },
    questions: [
      {
            id: 'goa-q1',
            state: 'Goa',
            parkName: 'Mollem (Bhagwan Mahavir) National Park',
            question: 'In which state is Mollem (Bhagwan Mahavir) National Park located?',
            options: [
                  'Goa',
                  'Maharashtra',
                  'Karnataka',
                  'Kerala'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mollem (Bhagwan Mahavir) National Park is located in Goa.',
            establishedYear: 1978,
            district: 'South Goa (Dharbandora)',
            keyFeature: 'Home of the magnificent Dudhsagar Waterfalls.'
      },
      {
            id: 'goa-q2',
            state: 'Goa',
            parkName: 'Mollem (Bhagwan Mahavir) National Park',
            question: 'In which state is Mollem (Bhagwan Mahavir) National Park located?',
            options: [
                  'Karnataka',
                  'Goa',
                  'Kerala',
                  'Gujarat'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mollem (Bhagwan Mahavir) National Park is located in Goa.',
            establishedYear: 1978,
            district: 'South Goa (Dharbandora)',
            keyFeature: 'Home of the magnificent Dudhsagar Waterfalls.'
      },
      {
            id: 'goa-q3',
            state: 'Goa',
            parkName: 'Mollem (Bhagwan Mahavir) National Park',
            question: 'In which state is Mollem (Bhagwan Mahavir) National Park located?',
            options: [
                  'Kerala',
                  'Gujarat',
                  'Goa',
                  'Maharashtra'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Mollem (Bhagwan Mahavir) National Park is located in Goa.',
            establishedYear: 1978,
            district: 'South Goa (Dharbandora)',
            keyFeature: 'Home of the magnificent Dudhsagar Waterfalls.'
      },
      {
            id: 'goa-q4',
            state: 'Goa',
            parkName: 'Mollem (Bhagwan Mahavir) National Park',
            question: 'In which state is Mollem (Bhagwan Mahavir) National Park located?',
            options: [
                  'Gujarat',
                  'Maharashtra',
                  'Karnataka',
                  'Goa'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Mollem (Bhagwan Mahavir) National Park is located in Goa.',
            establishedYear: 1978,
            district: 'South Goa (Dharbandora)',
            keyFeature: 'Home of the magnificent Dudhsagar Waterfalls.'
      },
      {
            id: 'goa-q5',
            state: 'Goa',
            parkName: 'Mollem (Bhagwan Mahavir) National Park',
            question: 'In which state is Mollem (Bhagwan Mahavir) National Park located?',
            options: [
                  'Goa',
                  'Maharashtra',
                  'Karnataka',
                  'Kerala'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mollem (Bhagwan Mahavir) National Park is located in Goa.',
            establishedYear: 1978,
            district: 'South Goa (Dharbandora)',
            keyFeature: 'Home of the magnificent Dudhsagar Waterfalls.'
      }
]
  },

  // ==========================================
  // RAJASTHAN
  // ==========================================
  'Rajasthan': {
    stateInfo: {
      stateName: 'Rajasthan',
      capital: 'Jaipur',
      totalParks: 5,
      overview: 'Rajasthan has 5 National Parks protecting Aravalli, desert and wetland ecosystems.',
      tipsForMahi: 'Mastering the National Parks of Rajasthan.',
      parks: [
        {
                'name': 'Ranthambore National Park',
                'year': 1980,
                'district': 'Sawai Madhopur',
                'keyFeature': 'Historic fort and iconic Royal Bengal Tiger habitat.'
        },
        {
                'name': 'Keoladeo Ghana National Park',
                'year': 1981,
                'district': 'Bharatpur',
                'keyFeature': 'UNESCO World Heritage wetland bird sanctuary.'
        },
        {
                'name': 'Sariska National Park',
                'year': 1990,
                'district': 'Alwar',
                'keyFeature': 'Aravalli tiger reserve with historic ruins.'
        },
        {
                'name': 'Desert National Park',
                'year': 1992,
                'district': 'Jaisalmer & Barmer',
                'keyFeature': 'Great Indian Bustard sanctuary in Thar Desert.'
        },
        {
                'name': 'Mukundra Hills National Park',
                'year': 2012,
                'district': 'Kota',
                'keyFeature': 'Protected riverine valley of Chambal basin.'
        }
]
    },
    questions: [
      {
            id: 'rajasthan-q1',
            state: 'Rajasthan',
            parkName: 'Ranthambore National Park',
            question: 'In which state is Ranthambore National Park located?',
            options: [
                  'Rajasthan',
                  'Gujarat',
                  'Madhya Pradesh',
                  'Haryana'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Ranthambore National Park is located in Rajasthan.',
            establishedYear: 1980,
            district: 'Sawai Madhopur',
            keyFeature: 'Historic fort and iconic Royal Bengal Tiger habitat.'
      },
      {
            id: 'rajasthan-q2',
            state: 'Rajasthan',
            parkName: 'Keoladeo Ghana National Park',
            question: 'In which state is Keoladeo Ghana National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Rajasthan',
                  'Haryana',
                  'Uttar Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Keoladeo Ghana National Park is located in Rajasthan.',
            establishedYear: 1981,
            district: 'Bharatpur',
            keyFeature: 'UNESCO World Heritage wetland bird sanctuary.'
      },
      {
            id: 'rajasthan-q3',
            state: 'Rajasthan',
            parkName: 'Sariska National Park',
            question: 'In which state is Sariska National Park located?',
            options: [
                  'Haryana',
                  'Uttar Pradesh',
                  'Rajasthan',
                  'Gujarat'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Sariska National Park is located in Rajasthan.',
            establishedYear: 1990,
            district: 'Alwar',
            keyFeature: 'Aravalli tiger reserve with historic ruins.'
      },
      {
            id: 'rajasthan-q4',
            state: 'Rajasthan',
            parkName: 'Desert National Park',
            question: 'In which state is Desert National Park located?',
            options: [
                  'Uttar Pradesh',
                  'Gujarat',
                  'Madhya Pradesh',
                  'Rajasthan'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Desert National Park is located in Rajasthan.',
            establishedYear: 1992,
            district: 'Jaisalmer & Barmer',
            keyFeature: 'Great Indian Bustard sanctuary in Thar Desert.'
      },
      {
            id: 'rajasthan-q5',
            state: 'Rajasthan',
            parkName: 'Mukundra Hills National Park',
            question: 'In which state is Mukundra Hills National Park located?',
            options: [
                  'Rajasthan',
                  'Gujarat',
                  'Madhya Pradesh',
                  'Haryana'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mukundra Hills National Park is located in Rajasthan.',
            establishedYear: 2012,
            district: 'Kota',
            keyFeature: 'Protected riverine valley of Chambal basin.'
      }
]
  },

  // ==========================================
  // TAMIL NADU
  // ==========================================
  'Tamil Nadu': {
    stateInfo: {
      stateName: 'Tamil Nadu',
      capital: 'Chennai',
      totalParks: 5,
      overview: 'Tamil Nadu has 5 National Parks in Western Ghats and coastal waters.',
      tipsForMahi: 'Mastering the National Parks of Tamil Nadu.',
      parks: [
        {
                'name': 'Mudumalai National Park',
                'year': 1990,
                'district': 'Nilgiris',
                'keyFeature': 'First national park in South India (part of Nilgiri Biosphere).'
        },
        {
                'name': 'Mukurthi National Park',
                'year': 2001,
                'district': 'Nilgiris',
                'keyFeature': 'Dedicated to preserving the endangered Nilgiri Tahr.'
        },
        {
                'name': 'Indira Gandhi (Anamalai) National Park',
                'year': 1989,
                'district': 'Coimbatore',
                'keyFeature': 'Top Slip elephant and wildlife sanctuary.'
        },
        {
                'name': 'Guindy National Park',
                'year': 1976,
                'district': 'Chennai',
                'keyFeature': 'Unique protected national park situated in Chennai city.'
        },
        {
                'name': 'Gulf of Mannar Marine National Park',
                'year': 1986,
                'district': 'Ramanathapuram & Thoothukudi',
                'keyFeature': 'First marine biosphere reserve in South Asia.'
        }
]
    },
    questions: [
      {
            id: 'tamil-nadu-q1',
            state: 'Tamil Nadu',
            parkName: 'Mudumalai National Park',
            question: 'In which state is Mudumalai National Park located?',
            options: [
                  'Tamil Nadu',
                  'Kerala',
                  'Karnataka',
                  'Andhra Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mudumalai National Park is located in Tamil Nadu.',
            establishedYear: 1990,
            district: 'Nilgiris',
            keyFeature: 'First national park in South India (part of Nilgiri Biosphere).'
      },
      {
            id: 'tamil-nadu-q2',
            state: 'Tamil Nadu',
            parkName: 'Mukurthi National Park',
            question: 'In which state is Mukurthi National Park located?',
            options: [
                  'Karnataka',
                  'Tamil Nadu',
                  'Andhra Pradesh',
                  'Telangana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mukurthi National Park is located in Tamil Nadu.',
            establishedYear: 2001,
            district: 'Nilgiris',
            keyFeature: 'Dedicated to preserving the endangered Nilgiri Tahr.'
      },
      {
            id: 'tamil-nadu-q3',
            state: 'Tamil Nadu',
            parkName: 'Indira Gandhi (Anamalai) National Park',
            question: 'In which state is Indira Gandhi (Anamalai) National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Telangana',
                  'Tamil Nadu',
                  'Kerala'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Indira Gandhi (Anamalai) National Park is located in Tamil Nadu.',
            establishedYear: 1989,
            district: 'Coimbatore',
            keyFeature: 'Top Slip elephant and wildlife sanctuary.'
      },
      {
            id: 'tamil-nadu-q4',
            state: 'Tamil Nadu',
            parkName: 'Guindy National Park',
            question: 'In which state is Guindy National Park located?',
            options: [
                  'Telangana',
                  'Kerala',
                  'Karnataka',
                  'Tamil Nadu'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Guindy National Park is located in Tamil Nadu.',
            establishedYear: 1976,
            district: 'Chennai',
            keyFeature: 'Unique protected national park situated in Chennai city.'
      },
      {
            id: 'tamil-nadu-q5',
            state: 'Tamil Nadu',
            parkName: 'Gulf of Mannar Marine National Park',
            question: 'In which state is Gulf of Mannar Marine National Park located?',
            options: [
                  'Tamil Nadu',
                  'Kerala',
                  'Karnataka',
                  'Andhra Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Gulf of Mannar Marine National Park is located in Tamil Nadu.',
            establishedYear: 1986,
            district: 'Ramanathapuram & Thoothukudi',
            keyFeature: 'First marine biosphere reserve in South Asia.'
      }
]
  },

  // ==========================================
  // UTTARAKHAND
  // ==========================================
  'Uttarakhand': {
    stateInfo: {
      stateName: 'Uttarakhand',
      capital: 'Dehradun',
      totalParks: 6,
      overview: 'Uttarakhand has 6 National Parks in the high Garhwal and Kumaon Himalayas.',
      tipsForMahi: 'Mastering the National Parks of Uttarakhand.',
      parks: [
        {
                'name': 'Jim Corbett National Park',
                'year': 1936,
                'district': 'Nainital & Pauri Garhwal',
                'keyFeature': 'First National Park in India (originally Hailey NP).'
        },
        {
                'name': 'Valley of Flowers National Park',
                'year': 1982,
                'district': 'Chamoli',
                'keyFeature': 'UNESCO World Heritage alpine flower valley.'
        },
        {
                'name': 'Nanda Devi National Park',
                'year': 1982,
                'district': 'Chamoli',
                'keyFeature': 'UNESCO peak sanctuary around Nanda Devi.'
        },
        {
                'name': 'Rajaji National Park',
                'year': 1983,
                'district': 'Haridwar & Dehradun',
                'keyFeature': 'Shivalik elephant and tiger sanctuary.'
        },
        {
                'name': 'Gangotri National Park',
                'year': 1989,
                'district': 'Uttarkashi',
                'keyFeature': 'Origin of sacred Bhagirathi River (Gaumukh).'
        },
        {
                'name': 'Govind Pashu Vihar National Park',
                'year': 1990,
                'district': 'Uttarkashi',
                'keyFeature': 'Famous for Snow Leopard protection in Tons valley.'
        }
]
    },
    questions: [
      {
            id: 'uttarakhand-q1',
            state: 'Uttarakhand',
            parkName: 'Jim Corbett National Park',
            question: 'In which state is Jim Corbett National Park located?',
            options: [
                  'Uttarakhand',
                  'Himachal Pradesh',
                  'Jammu & Kashmir',
                  'Uttar Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Jim Corbett National Park is located in Uttarakhand.',
            establishedYear: 1936,
            district: 'Nainital & Pauri Garhwal',
            keyFeature: 'First National Park in India (originally Hailey NP).'
      },
      {
            id: 'uttarakhand-q2',
            state: 'Uttarakhand',
            parkName: 'Valley of Flowers National Park',
            question: 'In which state is Valley of Flowers National Park located?',
            options: [
                  'Jammu & Kashmir',
                  'Uttarakhand',
                  'Uttar Pradesh',
                  'Sikkim'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Valley of Flowers National Park is located in Uttarakhand.',
            establishedYear: 1982,
            district: 'Chamoli',
            keyFeature: 'UNESCO World Heritage alpine flower valley.'
      },
      {
            id: 'uttarakhand-q3',
            state: 'Uttarakhand',
            parkName: 'Nanda Devi National Park',
            question: 'In which state is Nanda Devi National Park located?',
            options: [
                  'Uttar Pradesh',
                  'Sikkim',
                  'Uttarakhand',
                  'Himachal Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Nanda Devi National Park is located in Uttarakhand.',
            establishedYear: 1982,
            district: 'Chamoli',
            keyFeature: 'UNESCO peak sanctuary around Nanda Devi.'
      },
      {
            id: 'uttarakhand-q4',
            state: 'Uttarakhand',
            parkName: 'Rajaji National Park',
            question: 'In which state is Rajaji National Park located?',
            options: [
                  'Sikkim',
                  'Himachal Pradesh',
                  'Jammu & Kashmir',
                  'Uttarakhand'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Rajaji National Park is located in Uttarakhand.',
            establishedYear: 1983,
            district: 'Haridwar & Dehradun',
            keyFeature: 'Shivalik elephant and tiger sanctuary.'
      },
      {
            id: 'uttarakhand-q5',
            state: 'Uttarakhand',
            parkName: 'Gangotri National Park',
            question: 'In which state is Gangotri National Park located?',
            options: [
                  'Uttarakhand',
                  'Himachal Pradesh',
                  'Jammu & Kashmir',
                  'Uttar Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Gangotri National Park is located in Uttarakhand.',
            establishedYear: 1989,
            district: 'Uttarkashi',
            keyFeature: 'Origin of sacred Bhagirathi River (Gaumukh).'
      },
      {
            id: 'uttarakhand-q6',
            state: 'Uttarakhand',
            parkName: 'Govind Pashu Vihar National Park',
            question: 'In which state is Govind Pashu Vihar National Park located?',
            options: [
                  'Jammu & Kashmir',
                  'Uttarakhand',
                  'Uttar Pradesh',
                  'Sikkim'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Govind Pashu Vihar National Park is located in Uttarakhand.',
            establishedYear: 1990,
            district: 'Uttarkashi',
            keyFeature: 'Famous for Snow Leopard protection in Tons valley.'
      }
]
  },

  // ==========================================
  // HIMACHAL PRADESH
  // ==========================================
  'Himachal Pradesh': {
    stateInfo: {
      stateName: 'Himachal Pradesh',
      capital: 'Shimla',
      totalParks: 5,
      overview: 'Himachal Pradesh has 5 National Parks across Western Himalayas.',
      tipsForMahi: 'Mastering the National Parks of Himachal Pradesh.',
      parks: [
        {
                'name': 'Great Himalayan National Park',
                'year': 1999,
                'district': 'Kullu',
                'keyFeature': 'UNESCO Natural World Heritage site.'
        },
        {
                'name': 'Pin Valley National Park',
                'year': 1987,
                'district': 'Lahaul & Spiti',
                'keyFeature': 'Cold desert park famous for snow leopards and ibex.'
        },
        {
                'name': 'Inderkilla National Park',
                'year': 2010,
                'district': 'Kullu',
                'keyFeature': 'High altitude Himalayan wildlife sanctuary.'
        },
        {
                'name': 'Khirganga National Park',
                'year': 2010,
                'district': 'Kullu',
                'keyFeature': 'Pristine Parvati river valley ecosystem.'
        },
        {
                'name': 'Simbalbara National Park',
                'year': 2010,
                'district': 'Sirmaur',
                'keyFeature': 'Colonel Sher Jung park in Shivalik sal forests.'
        }
]
    },
    questions: [
      {
            id: 'himachal-pradesh-q1',
            state: 'Himachal Pradesh',
            parkName: 'Great Himalayan National Park',
            question: 'In which state is Great Himalayan National Park located?',
            options: [
                  'Himachal Pradesh',
                  'Uttarakhand',
                  'Jammu & Kashmir',
                  'Punjab'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Great Himalayan National Park is located in Himachal Pradesh.',
            establishedYear: 1999,
            district: 'Kullu',
            keyFeature: 'UNESCO Natural World Heritage site.'
      },
      {
            id: 'himachal-pradesh-q2',
            state: 'Himachal Pradesh',
            parkName: 'Pin Valley National Park',
            question: 'In which state is Pin Valley National Park located?',
            options: [
                  'Jammu & Kashmir',
                  'Himachal Pradesh',
                  'Punjab',
                  'Haryana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Pin Valley National Park is located in Himachal Pradesh.',
            establishedYear: 1987,
            district: 'Lahaul & Spiti',
            keyFeature: 'Cold desert park famous for snow leopards and ibex.'
      },
      {
            id: 'himachal-pradesh-q3',
            state: 'Himachal Pradesh',
            parkName: 'Inderkilla National Park',
            question: 'In which state is Inderkilla National Park located?',
            options: [
                  'Punjab',
                  'Haryana',
                  'Himachal Pradesh',
                  'Uttarakhand'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Inderkilla National Park is located in Himachal Pradesh.',
            establishedYear: 2010,
            district: 'Kullu',
            keyFeature: 'High altitude Himalayan wildlife sanctuary.'
      },
      {
            id: 'himachal-pradesh-q4',
            state: 'Himachal Pradesh',
            parkName: 'Khirganga National Park',
            question: 'In which state is Khirganga National Park located?',
            options: [
                  'Haryana',
                  'Uttarakhand',
                  'Jammu & Kashmir',
                  'Himachal Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Khirganga National Park is located in Himachal Pradesh.',
            establishedYear: 2010,
            district: 'Kullu',
            keyFeature: 'Pristine Parvati river valley ecosystem.'
      },
      {
            id: 'himachal-pradesh-q5',
            state: 'Himachal Pradesh',
            parkName: 'Simbalbara National Park',
            question: 'In which state is Simbalbara National Park located?',
            options: [
                  'Himachal Pradesh',
                  'Uttarakhand',
                  'Jammu & Kashmir',
                  'Punjab'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Simbalbara National Park is located in Himachal Pradesh.',
            establishedYear: 2010,
            district: 'Sirmaur',
            keyFeature: 'Colonel Sher Jung park in Shivalik sal forests.'
      }
]
  },

  // ==========================================
  // LADAKH (Day 05)
  // ==========================================
  'Ladakh': {
    stateInfo: {
      stateName: 'Ladakh',
      capital: 'Leh',
      totalParks: 1,
      overview: 'Ladakh is home to Hemis National Park, the largest national park in India.',
      tipsForMahi: 'Mastering the National Parks of Ladakh.',
      parks: [
        {
          'name': 'Hemis National Park',
          'year': 1981,
          'district': 'Leh',
          'keyFeature': 'Largest national park in India; global snow leopard capital.'
        }
      ]
    },
    questions: [
      {
        id: 'ladakh-q1',
        state: 'Ladakh',
        parkName: 'Hemis National Park',
        question: 'In which state is Hemis National Park located?',
        options: [
          'Ladakh',
          'Himachal Pradesh',
          'Uttarakhand',
          'Sikkim'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Hemis National Park is located in Ladakh.',
        establishedYear: 1981,
        district: 'Leh',
        keyFeature: 'Largest national park in India; global snow leopard capital.'
      },
      {
        id: 'ladakh-q2',
        state: 'Ladakh',
        parkName: 'Hemis National Park',
        question: 'Which is the largest national park in India by area, spanning approximately 4,400 sq km?',
        options: [
          'Hemis National Park',
          'Desert National Park',
          'Gangotri National Park',
          'Namdapha National Park'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Hemis National Park in Ladakh is India\'s largest national park, spanning around 4,400 square kilometers.',
        establishedYear: 1981,
        district: 'Leh',
        keyFeature: 'Largest national park in India; global snow leopard capital.'
      },
      {
        id: 'ladakh-q3',
        state: 'Ladakh',
        parkName: 'Hemis National Park',
        question: 'Hemis National Park is internationally famous as the global capital for which endangered predator?',
        options: [
          'Snow Leopard',
          'Royal Bengal Tiger',
          'Asiatic Lion',
          'Clouded Leopard'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Hemis National Park has the highest density of snow leopards in any protected area in the world.',
        establishedYear: 1981,
        district: 'Leh',
        keyFeature: 'Largest national park in India; global snow leopard capital.'
      },
      {
        id: 'ladakh-q4',
        state: 'Ladakh',
        parkName: 'Hemis National Park',
        question: 'Which river flows along the northern boundary of Hemis National Park in Ladakh?',
        options: [
          'Indus River',
          'Zanskar River',
          'Jhelum River',
          'Shyok River'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'The Indus River bounds Hemis National Park to the north, while the Zanskar River passes through parts of it.',
        establishedYear: 1981,
        district: 'Leh',
        keyFeature: 'Largest national park in India; global snow leopard capital.'
      },
      {
        id: 'ladakh-q5',
        state: 'Ladakh',
        parkName: 'Hemis National Park',
        question: 'In which year was Hemis National Park officially established in the Leh district of Ladakh?',
        options: [
          '1981',
          '1975',
          '1986',
          '1992'
        ],
        correctAnswer: 0,
        difficulty: 'hard',
        explanation: 'Hemis National Park was established in 1981 in Ladakh to protect its fragile trans-Himalayan ecosystem.',
        establishedYear: 1981,
        district: 'Leh',
        keyFeature: 'Largest national park in India; global snow leopard capital.'
      }
    ]
  },

  // ==========================================
  // JAMMU AND KASHMIR (Day 07)
  // ==========================================
  'Jammu and Kashmir': {
    stateInfo: {
      stateName: 'Jammu and Kashmir',
      capital: 'Srinagar',
      totalParks: 4,
      overview: 'Jammu and Kashmir has 4 high-altitude Himalayan National Parks.',
      tipsForMahi: 'Mastering the National Parks of Jammu and Kashmir.',
      parks: [
        {
          'name': 'Dachigam National Park',
          'year': 1981,
          'district': 'Srinagar',
          'keyFeature': 'Only natural home of the Hangul (Kashmir Stag).'
        },
        {
          'name': 'Kishtwar National Park',
          'year': 1981,
          'district': 'Kishtwar',
          'keyFeature': 'Rugged Himalayan high peaks sanctuary.'
        },
        {
          'name': 'City Forest (Salim Ali) National Park',
          'year': 1992,
          'district': 'Srinagar',
          'keyFeature': 'Named in honor of India\'s Birdman Dr. Salim Ali.'
        },
        {
          'name': 'Kazinag National Park',
          'year': 2007,
          'district': 'Baramulla',
          'keyFeature': 'Crucial refuge for the Markhor (wild goat).'
        }
      ]
    },
    questions: [
      {
        id: 'jammu-and-kashmir-q1',
        state: 'Jammu and Kashmir',
        parkName: 'Dachigam National Park',
        question: 'In which state is Dachigam National Park located?',
        options: [
          'Jammu and Kashmir',
          'Himachal Pradesh',
          'Uttarakhand',
          'Punjab'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dachigam National Park is located in Jammu and Kashmir.',
        establishedYear: 1981,
        district: 'Srinagar',
        keyFeature: 'Only natural home of the Hangul (Kashmir Stag).'
      },
      {
        id: 'jammu-and-kashmir-q2',
        state: 'Jammu and Kashmir',
        parkName: 'Kishtwar National Park',
        question: 'In which state is Kishtwar National Park located?',
        options: [
          'Himachal Pradesh',
          'Jammu and Kashmir',
          'Uttarakhand',
          'Rajasthan'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        explanation: 'Kishtwar National Park is located in Jammu and Kashmir.',
        establishedYear: 1981,
        district: 'Kishtwar',
        keyFeature: 'Rugged Himalayan high peaks sanctuary.'
      },
      {
        id: 'jammu-and-kashmir-q3',
        state: 'Jammu and Kashmir',
        parkName: 'City Forest (Salim Ali) National Park',
        question: 'In which state is City Forest (Salim Ali) National Park located?',
        options: [
          'Rajasthan',
          'Uttarakhand',
          'Jammu and Kashmir',
          'Himachal Pradesh'
        ],
        correctAnswer: 2,
        difficulty: 'easy',
        explanation: 'City Forest (Salim Ali) National Park is located in Jammu and Kashmir.',
        establishedYear: 1992,
        district: 'Srinagar',
        keyFeature: 'Named in honor of India\'s Birdman Dr. Salim Ali.'
      },
      {
        id: 'jammu-and-kashmir-q4',
        state: 'Jammu and Kashmir',
        parkName: 'Kazinag National Park',
        question: 'In which state is Kazinag National Park located?',
        options: [
          'Punjab',
          'Himachal Pradesh',
          'Uttarakhand',
          'Jammu and Kashmir'
        ],
        correctAnswer: 3,
        difficulty: 'easy',
        explanation: 'Kazinag National Park is located in Jammu and Kashmir.',
        establishedYear: 2007,
        district: 'Baramulla',
        keyFeature: 'Crucial refuge for the Markhor (wild goat).'
      },
      {
        id: 'jammu-and-kashmir-q5',
        state: 'Jammu and Kashmir',
        parkName: 'Dachigam National Park',
        question: 'Dachigam National Park near Srinagar is world-famous as the last viable natural sanctuary for which critically endangered species?',
        options: [
          'Hangul (Kashmir Stag)',
          'Sangai (Brow-antlered Deer)',
          'Barasingha (Swamp Deer)',
          'Himalayan Musk Deer'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Dachigam National Park is renowned as the primary natural habitat and sanctuary of the Hangul, or Kashmir Stag.',
        establishedYear: 1981,
        district: 'Srinagar',
        keyFeature: 'Only natural home of the Hangul (Kashmir Stag).'
      }
    ]
  },

  // Alias for Jammu & Kashmir
  'Jammu & Kashmir': {
    stateInfo: {
      stateName: 'Jammu and Kashmir',
      capital: 'Srinagar',
      totalParks: 4,
      overview: 'Jammu and Kashmir has 4 high-altitude Himalayan National Parks.',
      tipsForMahi: 'Mastering the National Parks of Jammu and Kashmir.',
      parks: [
        {
          'name': 'Dachigam National Park',
          'year': 1981,
          'district': 'Srinagar',
          'keyFeature': 'Only natural home of the Hangul (Kashmir Stag).'
        },
        {
          'name': 'Kishtwar National Park',
          'year': 1981,
          'district': 'Kishtwar',
          'keyFeature': 'Rugged Himalayan high peaks sanctuary.'
        },
        {
          'name': 'City Forest (Salim Ali) National Park',
          'year': 1992,
          'district': 'Srinagar',
          'keyFeature': 'Named in honor of India\'s Birdman Dr. Salim Ali.'
        },
        {
          'name': 'Kazinag National Park',
          'year': 2007,
          'district': 'Baramulla',
          'keyFeature': 'Crucial refuge for the Markhor (wild goat).'
        }
      ]
    },
    questions: [
      {
        id: 'jammu-kashmir-q1',
        state: 'Jammu and Kashmir',
        parkName: 'Dachigam National Park',
        question: 'In which state is Dachigam National Park located?',
        options: [
          'Jammu and Kashmir',
          'Himachal Pradesh',
          'Uttarakhand',
          'Punjab'
        ],
        correctAnswer: 0,
        difficulty: 'easy',
        explanation: 'Dachigam National Park is located in Jammu and Kashmir.',
        establishedYear: 1981,
        district: 'Srinagar',
        keyFeature: 'Only natural home of the Hangul (Kashmir Stag).'
      },
      {
        id: 'jammu-kashmir-q2',
        state: 'Jammu and Kashmir',
        parkName: 'Kishtwar National Park',
        question: 'In which state is Kishtwar National Park located?',
        options: [
          'Himachal Pradesh',
          'Jammu and Kashmir',
          'Uttarakhand',
          'Rajasthan'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        explanation: 'Kishtwar National Park is located in Jammu and Kashmir.',
        establishedYear: 1981,
        district: 'Kishtwar',
        keyFeature: 'Rugged Himalayan high peaks sanctuary.'
      },
      {
        id: 'jammu-kashmir-q3',
        state: 'Jammu and Kashmir',
        parkName: 'City Forest (Salim Ali) National Park',
        question: 'In which state is City Forest (Salim Ali) National Park located?',
        options: [
          'Rajasthan',
          'Uttarakhand',
          'Jammu and Kashmir',
          'Himachal Pradesh'
        ],
        correctAnswer: 2,
        difficulty: 'easy',
        explanation: 'City Forest (Salim Ali) National Park is located in Jammu and Kashmir.',
        establishedYear: 1992,
        district: 'Srinagar',
        keyFeature: 'Named in honor of India\'s Birdman Dr. Salim Ali.'
      },
      {
        id: 'jammu-kashmir-q4',
        state: 'Jammu and Kashmir',
        parkName: 'Kazinag National Park',
        question: 'In which state is Kazinag National Park located?',
        options: [
          'Punjab',
          'Himachal Pradesh',
          'Uttarakhand',
          'Jammu and Kashmir'
        ],
        correctAnswer: 3,
        difficulty: 'easy',
        explanation: 'Kazinag National Park is located in Jammu and Kashmir.',
        establishedYear: 2007,
        district: 'Baramulla',
        keyFeature: 'Crucial refuge for the Markhor (wild goat).'
      },
      {
        id: 'jammu-kashmir-q5',
        state: 'Jammu and Kashmir',
        parkName: 'Dachigam National Park',
        question: 'Dachigam National Park near Srinagar is world-famous as the last viable natural sanctuary for which critically endangered species?',
        options: [
          'Hangul (Kashmir Stag)',
          'Sangai (Brow-antlered Deer)',
          'Barasingha (Swamp Deer)',
          'Himalayan Musk Deer'
        ],
        correctAnswer: 0,
        difficulty: 'medium',
        explanation: 'Dachigam National Park is renowned as the primary natural habitat and sanctuary of the Hangul, or Kashmir Stag.',
        establishedYear: 1981,
        district: 'Srinagar',
        keyFeature: 'Only natural home of the Hangul (Kashmir Stag).'
      }
    ]
  },

  // ==========================================
  // JAMMU & KASHMIR & LADAKH (Combined backward-compatibility)
  // ==========================================
  'Jammu & Kashmir & Ladakh': {
    stateInfo: {
      stateName: 'Jammu & Kashmir & Ladakh',
      capital: 'Srinagar / Leh',
      totalParks: 5,
      overview: 'Jammu & Kashmir and Ladakh have 5 high-altitude National Parks.',
      tipsForMahi: 'Mastering the National Parks of Jammu & Kashmir & Ladakh.',
      parks: [
        {
                'name': 'Dachigam National Park',
                'year': 1981,
                'district': 'Srinagar',
                'keyFeature': 'Only natural home of the Hangul (Kashmir Stag).'
        },
        {
                'name': 'Hemis National Park',
                'year': 1981,
                'district': 'Leh (Ladakh)',
                'keyFeature': 'Largest national park in India; global snow leopard capital.'
        },
        {
                'name': 'Kishtwar National Park',
                'year': 1981,
                'district': 'Kishtwar',
                'keyFeature': 'Rugged Himalayan high peaks sanctuary.'
        },
        {
                'name': 'City Forest (Salim Ali) National Park',
                'year': 1992,
                'district': 'Srinagar',
                'keyFeature': 'Named in honor of India\'s Birdman Dr. Salim Ali.'
        },
        {
                'name': 'Kazinag National Park',
                'year': 2007,
                'district': 'Baramulla',
                'keyFeature': 'Crucial refuge for the Markhor (wild goat).'
        }
]
    },
    questions: [
      {
            id: 'jammu-kashmir-ladakh-q1',
            state: 'Jammu & Kashmir & Ladakh',
            parkName: 'Dachigam National Park',
            question: 'In which state is Dachigam National Park located?',
            options: [
                  'Jammu & Kashmir & Ladakh',
                  'Himachal Pradesh',
                  'Uttarakhand',
                  'Punjab'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Dachigam National Park is located in Jammu & Kashmir & Ladakh.',
            establishedYear: 1981,
            district: 'Srinagar',
            keyFeature: 'Only natural home of the Hangul (Kashmir Stag).'
      },
      {
            id: 'jammu-kashmir-ladakh-q2',
            state: 'Jammu & Kashmir & Ladakh',
            parkName: 'Hemis National Park',
            question: 'In which state is Hemis National Park located?',
            options: [
                  'Uttarakhand',
                  'Jammu & Kashmir & Ladakh',
                  'Punjab',
                  'Rajasthan'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Hemis National Park is located in Jammu & Kashmir & Ladakh.',
            establishedYear: 1981,
            district: 'Leh (Ladakh)',
            keyFeature: 'Largest national park in India; global snow leopard capital.'
      },
      {
            id: 'jammu-kashmir-ladakh-q3',
            state: 'Jammu & Kashmir & Ladakh',
            parkName: 'Kishtwar National Park',
            question: 'In which state is Kishtwar National Park located?',
            options: [
                  'Punjab',
                  'Rajasthan',
                  'Jammu & Kashmir & Ladakh',
                  'Himachal Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Kishtwar National Park is located in Jammu & Kashmir & Ladakh.',
            establishedYear: 1981,
            district: 'Kishtwar',
            keyFeature: 'Rugged Himalayan high peaks sanctuary.'
      },
      {
            id: 'jammu-kashmir-ladakh-q4',
            state: 'Jammu & Kashmir & Ladakh',
            parkName: 'City Forest (Salim Ali) National Park',
            question: 'In which state is City Forest (Salim Ali) National Park located?',
            options: [
                  'Rajasthan',
                  'Himachal Pradesh',
                  'Uttarakhand',
                  'Jammu & Kashmir & Ladakh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'City Forest (Salim Ali) National Park is located in Jammu & Kashmir & Ladakh.',
            establishedYear: 1992,
            district: 'Srinagar',
            keyFeature: 'Named in honor of India\'s Birdman Dr. Salim Ali.'
      },
      {
            id: 'jammu-kashmir-ladakh-q5',
            state: 'Jammu & Kashmir & Ladakh',
            parkName: 'Kazinag National Park',
            question: 'In which state is Kazinag National Park located?',
            options: [
                  'Jammu & Kashmir & Ladakh',
                  'Himachal Pradesh',
                  'Uttarakhand',
                  'Punjab'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Kazinag National Park is located in Jammu & Kashmir & Ladakh.',
            establishedYear: 2007,
            district: 'Baramulla',
            keyFeature: 'Crucial refuge for the Markhor (wild goat).'
      }
]
  },

  // ==========================================
  // HARYANA
  // ==========================================
  'Haryana': {
    stateInfo: {
      stateName: 'Haryana',
      capital: 'Chandigarh',
      totalParks: 2,
      overview: 'Haryana has 2 National Parks serving as wetland and woodland havens.',
      tipsForMahi: 'Mastering the National Parks of Haryana.',
      parks: [
        {
                'name': 'Sultanpur National Park',
                'year': 1991,
                'district': 'Gurugram',
                'keyFeature': 'Renowned wetland bird sanctuary.'
        },
        {
                'name': 'Kalesar National Park',
                'year': 2003,
                'district': 'Yamunanagar',
                'keyFeature': 'Shivalik sal forests along Yamuna River.'
        }
]
    },
    questions: [
      {
            id: 'haryana-q1',
            state: 'Haryana',
            parkName: 'Sultanpur National Park',
            question: 'In which state is Sultanpur National Park located?',
            options: [
                  'Haryana',
                  'Punjab',
                  'Rajasthan',
                  'Uttar Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Sultanpur National Park is located in Haryana.',
            establishedYear: 1991,
            district: 'Gurugram',
            keyFeature: 'Renowned wetland bird sanctuary.'
      },
      {
            id: 'haryana-q2',
            state: 'Haryana',
            parkName: 'Kalesar National Park',
            question: 'In which state is Kalesar National Park located?',
            options: [
                  'Rajasthan',
                  'Haryana',
                  'Uttar Pradesh',
                  'Himachal Pradesh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Kalesar National Park is located in Haryana.',
            establishedYear: 2003,
            district: 'Yamunanagar',
            keyFeature: 'Shivalik sal forests along Yamuna River.'
      },
      {
            id: 'haryana-q3',
            state: 'Haryana',
            parkName: 'Sultanpur National Park',
            question: 'In which state is Sultanpur National Park located?',
            options: [
                  'Uttar Pradesh',
                  'Himachal Pradesh',
                  'Haryana',
                  'Punjab'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Sultanpur National Park is located in Haryana.',
            establishedYear: 1991,
            district: 'Gurugram',
            keyFeature: 'Renowned wetland bird sanctuary.'
      },
      {
            id: 'haryana-q4',
            state: 'Haryana',
            parkName: 'Kalesar National Park',
            question: 'In which state is Kalesar National Park located?',
            options: [
                  'Himachal Pradesh',
                  'Punjab',
                  'Rajasthan',
                  'Haryana'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Kalesar National Park is located in Haryana.',
            establishedYear: 2003,
            district: 'Yamunanagar',
            keyFeature: 'Shivalik sal forests along Yamuna River.'
      },
      {
            id: 'haryana-q5',
            state: 'Haryana',
            parkName: 'Sultanpur National Park',
            question: 'In which state is Sultanpur National Park located?',
            options: [
                  'Haryana',
                  'Punjab',
                  'Rajasthan',
                  'Uttar Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Sultanpur National Park is located in Haryana.',
            establishedYear: 1991,
            district: 'Gurugram',
            keyFeature: 'Renowned wetland bird sanctuary.'
      }
]
  },

  // ==========================================
  // WEST BENGAL
  // ==========================================
  'West Bengal': {
    stateInfo: {
      stateName: 'West Bengal',
      capital: 'Kolkata',
      totalParks: 6,
      overview: 'West Bengal has 6 National Parks spanning from the Himalayas to mangrove deltas.',
      tipsForMahi: 'Mastering the National Parks of West Bengal.',
      parks: [
        {
                'name': 'Sundarbans National Park',
                'year': 1984,
                'district': 'South 24 Parganas',
                'keyFeature': 'World’s largest mangrove forest and Royal Bengal Tiger habitat.'
        },
        {
                'name': 'Jaldapara National Park',
                'year': 2012,
                'district': 'Alipurduar',
                'keyFeature': 'Largest population of One-Horned Rhinos in Bengal.'
        },
        {
                'name': 'Gorumara National Park',
                'year': 1994,
                'district': 'Jalpaiguri',
                'keyFeature': 'Dooars floodplain wildlife sanctuary.'
        },
        {
                'name': 'Buxa National Park',
                'year': 1997,
                'district': 'Alipurduar',
                'keyFeature': 'Buxa Tiger Reserve along Bhutan border.'
        },
        {
                'name': 'Neora Valley National Park',
                'year': 1986,
                'district': 'Kalimpong',
                'keyFeature': 'Pristine mountain home of the Red Panda.'
        },
        {
                'name': 'Singalila National Park',
                'year': 1992,
                'district': 'Darjeeling',
                'keyFeature': 'Highest national park in Bengal on Sandakphu ridge.'
        }
]
    },
    questions: [
      {
            id: 'west-bengal-q1',
            state: 'West Bengal',
            parkName: 'Sundarbans National Park',
            question: 'In which state is Sundarbans National Park located?',
            options: [
                  'West Bengal',
                  'Odisha',
                  'Assam',
                  'Bihar'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Sundarbans National Park is located in West Bengal.',
            establishedYear: 1984,
            district: 'South 24 Parganas',
            keyFeature: 'World’s largest mangrove forest and Royal Bengal Tiger habitat.'
      },
      {
            id: 'west-bengal-q2',
            state: 'West Bengal',
            parkName: 'Jaldapara National Park',
            question: 'In which state is Jaldapara National Park located?',
            options: [
                  'Assam',
                  'West Bengal',
                  'Bihar',
                  'Jharkhand'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Jaldapara National Park is located in West Bengal.',
            establishedYear: 2012,
            district: 'Alipurduar',
            keyFeature: 'Largest population of One-Horned Rhinos in Bengal.'
      },
      {
            id: 'west-bengal-q3',
            state: 'West Bengal',
            parkName: 'Gorumara National Park',
            question: 'In which state is Gorumara National Park located?',
            options: [
                  'Bihar',
                  'Jharkhand',
                  'West Bengal',
                  'Odisha'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Gorumara National Park is located in West Bengal.',
            establishedYear: 1994,
            district: 'Jalpaiguri',
            keyFeature: 'Dooars floodplain wildlife sanctuary.'
      },
      {
            id: 'west-bengal-q4',
            state: 'West Bengal',
            parkName: 'Buxa National Park',
            question: 'In which state is Buxa National Park located?',
            options: [
                  'Jharkhand',
                  'Odisha',
                  'Assam',
                  'West Bengal'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Buxa National Park is located in West Bengal.',
            establishedYear: 1997,
            district: 'Alipurduar',
            keyFeature: 'Buxa Tiger Reserve along Bhutan border.'
      },
      {
            id: 'west-bengal-q5',
            state: 'West Bengal',
            parkName: 'Neora Valley National Park',
            question: 'In which state is Neora Valley National Park located?',
            options: [
                  'West Bengal',
                  'Odisha',
                  'Assam',
                  'Bihar'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Neora Valley National Park is located in West Bengal.',
            establishedYear: 1986,
            district: 'Kalimpong',
            keyFeature: 'Pristine mountain home of the Red Panda.'
      },
      {
            id: 'west-bengal-q6',
            state: 'West Bengal',
            parkName: 'Singalila National Park',
            question: 'In which state is Singalila National Park located?',
            options: [
                  'Assam',
                  'West Bengal',
                  'Bihar',
                  'Jharkhand'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Singalila National Park is located in West Bengal.',
            establishedYear: 1992,
            district: 'Darjeeling',
            keyFeature: 'Highest national park in Bengal on Sandakphu ridge.'
      }
]
  },

  // ==========================================
  // ODISHA
  // ==========================================
  'Odisha': {
    stateInfo: {
      stateName: 'Odisha',
      capital: 'Bhubaneswar',
      totalParks: 2,
      overview: 'Odisha has 2 National Parks protecting wetlands and sal forests.',
      tipsForMahi: 'Mastering the National Parks of Odisha.',
      parks: [
        {
                'name': 'Similipal National Park',
                'year': 1980,
                'district': 'Mayurbhanj',
                'keyFeature': 'UNESCO Biosphere Reserve with melanistic black tigers.'
        },
        {
                'name': 'Bhitarkanika National Park',
                'year': 1998,
                'district': 'Kendrapara',
                'keyFeature': 'Second largest mangrove ecosystem in India; Saltwater crocodiles.'
        }
]
    },
    questions: [
      {
            id: 'odisha-q1',
            state: 'Odisha',
            parkName: 'Similipal National Park',
            question: 'In which state is Similipal National Park located?',
            options: [
                  'Odisha',
                  'West Bengal',
                  'Andhra Pradesh',
                  'Chhattisgarh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Similipal National Park is located in Odisha.',
            establishedYear: 1980,
            district: 'Mayurbhanj',
            keyFeature: 'UNESCO Biosphere Reserve with melanistic black tigers.'
      },
      {
            id: 'odisha-q2',
            state: 'Odisha',
            parkName: 'Bhitarkanika National Park',
            question: 'In which state is Bhitarkanika National Park located?',
            options: [
                  'Andhra Pradesh',
                  'Odisha',
                  'Chhattisgarh',
                  'Jharkhand'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Bhitarkanika National Park is located in Odisha.',
            establishedYear: 1998,
            district: 'Kendrapara',
            keyFeature: 'Second largest mangrove ecosystem in India; Saltwater crocodiles.'
      },
      {
            id: 'odisha-q3',
            state: 'Odisha',
            parkName: 'Similipal National Park',
            question: 'In which state is Similipal National Park located?',
            options: [
                  'Chhattisgarh',
                  'Jharkhand',
                  'Odisha',
                  'West Bengal'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Similipal National Park is located in Odisha.',
            establishedYear: 1980,
            district: 'Mayurbhanj',
            keyFeature: 'UNESCO Biosphere Reserve with melanistic black tigers.'
      },
      {
            id: 'odisha-q4',
            state: 'Odisha',
            parkName: 'Bhitarkanika National Park',
            question: 'In which state is Bhitarkanika National Park located?',
            options: [
                  'Jharkhand',
                  'West Bengal',
                  'Andhra Pradesh',
                  'Odisha'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Bhitarkanika National Park is located in Odisha.',
            establishedYear: 1998,
            district: 'Kendrapara',
            keyFeature: 'Second largest mangrove ecosystem in India; Saltwater crocodiles.'
      },
      {
            id: 'odisha-q5',
            state: 'Odisha',
            parkName: 'Similipal National Park',
            question: 'In which state is Similipal National Park located?',
            options: [
                  'Odisha',
                  'West Bengal',
                  'Andhra Pradesh',
                  'Chhattisgarh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Similipal National Park is located in Odisha.',
            establishedYear: 1980,
            district: 'Mayurbhanj',
            keyFeature: 'UNESCO Biosphere Reserve with melanistic black tigers.'
      }
]
  },

  // ==========================================
  // CHHATTISGARH
  // ==========================================
  'Chhattisgarh': {
    stateInfo: {
      stateName: 'Chhattisgarh',
      capital: 'Raipur',
      totalParks: 3,
      overview: 'Chhattisgarh has 3 National Parks in Bastar and Surguja forests.',
      tipsForMahi: 'Mastering the National Parks of Chhattisgarh.',
      parks: [
        {
                'name': 'Indravati (Kutru) National Park',
                'year': 1981,
                'district': 'Bijapur',
                'keyFeature': 'Prime habitat of the endangered Wild Water Buffalo.'
        },
        {
                'name': 'Kanger Valley National Park',
                'year': 1982,
                'district': 'Bastar (Jagdalpur)',
                'keyFeature': 'Limestone caves (Kotumsar) and Bastar Hill Myna.'
        },
        {
                'name': 'Guru Ghasidas (Sanjay) National Park',
                'year': 1981,
                'district': 'Koriya',
                'keyFeature': 'Connected tiger corridor with MP Sanjay National Park.'
        }
]
    },
    questions: [
      {
            id: 'chhattisgarh-q1',
            state: 'Chhattisgarh',
            parkName: 'Indravati (Kutru) National Park',
            question: 'In which state is Indravati (Kutru) National Park located?',
            options: [
                  'Chhattisgarh',
                  'Madhya Pradesh',
                  'Odisha',
                  'Maharashtra'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Indravati (Kutru) National Park is located in Chhattisgarh.',
            establishedYear: 1981,
            district: 'Bijapur',
            keyFeature: 'Prime habitat of the endangered Wild Water Buffalo.'
      },
      {
            id: 'chhattisgarh-q2',
            state: 'Chhattisgarh',
            parkName: 'Kanger Valley National Park',
            question: 'In which state is Kanger Valley National Park located?',
            options: [
                  'Odisha',
                  'Chhattisgarh',
                  'Maharashtra',
                  'Jharkhand'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Kanger Valley National Park is located in Chhattisgarh.',
            establishedYear: 1982,
            district: 'Bastar (Jagdalpur)',
            keyFeature: 'Limestone caves (Kotumsar) and Bastar Hill Myna.'
      },
      {
            id: 'chhattisgarh-q3',
            state: 'Chhattisgarh',
            parkName: 'Guru Ghasidas (Sanjay) National Park',
            question: 'In which state is Guru Ghasidas (Sanjay) National Park located?',
            options: [
                  'Maharashtra',
                  'Jharkhand',
                  'Chhattisgarh',
                  'Madhya Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Guru Ghasidas (Sanjay) National Park is located in Chhattisgarh.',
            establishedYear: 1981,
            district: 'Koriya',
            keyFeature: 'Connected tiger corridor with MP Sanjay National Park.'
      },
      {
            id: 'chhattisgarh-q4',
            state: 'Chhattisgarh',
            parkName: 'Indravati (Kutru) National Park',
            question: 'In which state is Indravati (Kutru) National Park located?',
            options: [
                  'Jharkhand',
                  'Madhya Pradesh',
                  'Odisha',
                  'Chhattisgarh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Indravati (Kutru) National Park is located in Chhattisgarh.',
            establishedYear: 1981,
            district: 'Bijapur',
            keyFeature: 'Prime habitat of the endangered Wild Water Buffalo.'
      },
      {
            id: 'chhattisgarh-q5',
            state: 'Chhattisgarh',
            parkName: 'Kanger Valley National Park',
            question: 'In which state is Kanger Valley National Park located?',
            options: [
                  'Chhattisgarh',
                  'Madhya Pradesh',
                  'Odisha',
                  'Maharashtra'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Kanger Valley National Park is located in Chhattisgarh.',
            establishedYear: 1982,
            district: 'Bastar (Jagdalpur)',
            keyFeature: 'Limestone caves (Kotumsar) and Bastar Hill Myna.'
      }
]
  },

  // ==========================================
  // UTTAR PRADESH
  // ==========================================
  'Uttar Pradesh': {
    stateInfo: {
      stateName: 'Uttar Pradesh',
      capital: 'Lucknow',
      totalParks: 1,
      overview: 'Uttar Pradesh has 1 National Park in the fertile Terai belt.',
      tipsForMahi: 'Mastering the National Parks of Uttar Pradesh.',
      parks: [
        {
                'name': 'Dudhwa National Park',
                'year': 1977,
                'district': 'Lakhimpur Kheri',
                'keyFeature': 'Terai swamp deer and tiger sanctuary along Nepal border.'
        }
]
    },
    questions: [
      {
            id: 'uttar-pradesh-q1',
            state: 'Uttar Pradesh',
            parkName: 'Dudhwa National Park',
            question: 'In which state is Dudhwa National Park located?',
            options: [
                  'Uttar Pradesh',
                  'Bihar',
                  'Madhya Pradesh',
                  'Uttarakhand'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Dudhwa National Park is located in Uttar Pradesh.',
            establishedYear: 1977,
            district: 'Lakhimpur Kheri',
            keyFeature: 'Terai swamp deer and tiger sanctuary along Nepal border.'
      },
      {
            id: 'uttar-pradesh-q2',
            state: 'Uttar Pradesh',
            parkName: 'Dudhwa National Park',
            question: 'In which state is Dudhwa National Park located?',
            options: [
                  'Madhya Pradesh',
                  'Uttar Pradesh',
                  'Uttarakhand',
                  'Haryana'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Dudhwa National Park is located in Uttar Pradesh.',
            establishedYear: 1977,
            district: 'Lakhimpur Kheri',
            keyFeature: 'Terai swamp deer and tiger sanctuary along Nepal border.'
      },
      {
            id: 'uttar-pradesh-q3',
            state: 'Uttar Pradesh',
            parkName: 'Dudhwa National Park',
            question: 'In which state is Dudhwa National Park located?',
            options: [
                  'Uttarakhand',
                  'Haryana',
                  'Uttar Pradesh',
                  'Bihar'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Dudhwa National Park is located in Uttar Pradesh.',
            establishedYear: 1977,
            district: 'Lakhimpur Kheri',
            keyFeature: 'Terai swamp deer and tiger sanctuary along Nepal border.'
      },
      {
            id: 'uttar-pradesh-q4',
            state: 'Uttar Pradesh',
            parkName: 'Dudhwa National Park',
            question: 'In which state is Dudhwa National Park located?',
            options: [
                  'Haryana',
                  'Bihar',
                  'Madhya Pradesh',
                  'Uttar Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Dudhwa National Park is located in Uttar Pradesh.',
            establishedYear: 1977,
            district: 'Lakhimpur Kheri',
            keyFeature: 'Terai swamp deer and tiger sanctuary along Nepal border.'
      },
      {
            id: 'uttar-pradesh-q5',
            state: 'Uttar Pradesh',
            parkName: 'Dudhwa National Park',
            question: 'In which state is Dudhwa National Park located?',
            options: [
                  'Uttar Pradesh',
                  'Bihar',
                  'Madhya Pradesh',
                  'Uttarakhand'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Dudhwa National Park is located in Uttar Pradesh.',
            establishedYear: 1977,
            district: 'Lakhimpur Kheri',
            keyFeature: 'Terai swamp deer and tiger sanctuary along Nepal border.'
      }
]
  },

  // ==========================================
  // BIHAR
  // ==========================================
  'Bihar': {
    stateInfo: {
      stateName: 'Bihar',
      capital: 'Patna',
      totalParks: 1,
      overview: 'Bihar has 1 National Park on the foothills of the Himalayas.',
      tipsForMahi: 'Mastering the National Parks of Bihar.',
      parks: [
        {
                'name': 'Valmiki National Park',
                'year': 1990,
                'district': 'West Champaran',
                'keyFeature': 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
        }
]
    },
    questions: [
      {
            id: 'bihar-q1',
            state: 'Bihar',
            parkName: 'Valmiki National Park',
            question: 'In which state is Valmiki National Park located?',
            options: [
                  'Bihar',
                  'Uttar Pradesh',
                  'Jharkhand',
                  'West Bengal'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Valmiki National Park is located in Bihar.',
            establishedYear: 1990,
            district: 'West Champaran',
            keyFeature: 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
      },
      {
            id: 'bihar-q2',
            state: 'Bihar',
            parkName: 'Valmiki National Park',
            question: 'In which state is Valmiki National Park located?',
            options: [
                  'Jharkhand',
                  'Bihar',
                  'West Bengal',
                  'Odisha'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Valmiki National Park is located in Bihar.',
            establishedYear: 1990,
            district: 'West Champaran',
            keyFeature: 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
      },
      {
            id: 'bihar-q3',
            state: 'Bihar',
            parkName: 'Valmiki National Park',
            question: 'In which state is Valmiki National Park located?',
            options: [
                  'West Bengal',
                  'Odisha',
                  'Bihar',
                  'Uttar Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Valmiki National Park is located in Bihar.',
            establishedYear: 1990,
            district: 'West Champaran',
            keyFeature: 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
      },
      {
            id: 'bihar-q4',
            state: 'Bihar',
            parkName: 'Valmiki National Park',
            question: 'In which state is Valmiki National Park located?',
            options: [
                  'Odisha',
                  'Uttar Pradesh',
                  'Jharkhand',
                  'Bihar'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Valmiki National Park is located in Bihar.',
            establishedYear: 1990,
            district: 'West Champaran',
            keyFeature: 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
      },
      {
            id: 'bihar-q5',
            state: 'Bihar',
            parkName: 'Valmiki National Park',
            question: 'In which state is Valmiki National Park located?',
            options: [
                  'Bihar',
                  'Uttar Pradesh',
                  'Jharkhand',
                  'West Bengal'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Valmiki National Park is located in Bihar.',
            establishedYear: 1990,
            district: 'West Champaran',
            keyFeature: 'Contiguous with Chitwan National Park of Nepal along Gandak River.'
      }
]
  },

  // ==========================================
  // JHARKHAND
  // ==========================================
  'Jharkhand': {
    stateInfo: {
      stateName: 'Jharkhand',
      capital: 'Ranchi',
      totalParks: 1,
      overview: 'Jharkhand has 1 National Park in the Chota Nagpur plateau.',
      tipsForMahi: 'Mastering the National Parks of Jharkhand.',
      parks: [
        {
                'name': 'Betla National Park',
                'year': 1986,
                'district': 'Latehar & Palamu',
                'keyFeature': 'One of the first tiger reserves under Project Tiger.'
        }
]
    },
    questions: [
      {
            id: 'jharkhand-q1',
            state: 'Jharkhand',
            parkName: 'Betla National Park',
            question: 'In which state is Betla National Park located?',
            options: [
                  'Jharkhand',
                  'Bihar',
                  'Odisha',
                  'West Bengal'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Betla National Park is located in Jharkhand.',
            establishedYear: 1986,
            district: 'Latehar & Palamu',
            keyFeature: 'One of the first tiger reserves under Project Tiger.'
      },
      {
            id: 'jharkhand-q2',
            state: 'Jharkhand',
            parkName: 'Betla National Park',
            question: 'In which state is Betla National Park located?',
            options: [
                  'Odisha',
                  'Jharkhand',
                  'West Bengal',
                  'Chhattisgarh'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Betla National Park is located in Jharkhand.',
            establishedYear: 1986,
            district: 'Latehar & Palamu',
            keyFeature: 'One of the first tiger reserves under Project Tiger.'
      },
      {
            id: 'jharkhand-q3',
            state: 'Jharkhand',
            parkName: 'Betla National Park',
            question: 'In which state is Betla National Park located?',
            options: [
                  'West Bengal',
                  'Chhattisgarh',
                  'Jharkhand',
                  'Bihar'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Betla National Park is located in Jharkhand.',
            establishedYear: 1986,
            district: 'Latehar & Palamu',
            keyFeature: 'One of the first tiger reserves under Project Tiger.'
      },
      {
            id: 'jharkhand-q4',
            state: 'Jharkhand',
            parkName: 'Betla National Park',
            question: 'In which state is Betla National Park located?',
            options: [
                  'Chhattisgarh',
                  'Bihar',
                  'Odisha',
                  'Jharkhand'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Betla National Park is located in Jharkhand.',
            establishedYear: 1986,
            district: 'Latehar & Palamu',
            keyFeature: 'One of the first tiger reserves under Project Tiger.'
      },
      {
            id: 'jharkhand-q5',
            state: 'Jharkhand',
            parkName: 'Betla National Park',
            question: 'In which state is Betla National Park located?',
            options: [
                  'Jharkhand',
                  'Bihar',
                  'Odisha',
                  'West Bengal'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Betla National Park is located in Jharkhand.',
            establishedYear: 1986,
            district: 'Latehar & Palamu',
            keyFeature: 'One of the first tiger reserves under Project Tiger.'
      }
]
  },

  // ==========================================
  // ARUNACHAL PRADESH
  // ==========================================
  'Arunachal Pradesh': {
    stateInfo: {
      stateName: 'Arunachal Pradesh',
      capital: 'Itanagar',
      totalParks: 2,
      overview: 'Arunachal Pradesh has 2 National Parks in the Eastern Himalayas.',
      tipsForMahi: 'Mastering the National Parks of Arunachal Pradesh.',
      parks: [
        {
                'name': 'Namdapha National Park',
                'year': 1983,
                'district': 'Changlang',
                'keyFeature': 'Only park with 4 big cat species (Tiger, Leopard, Snow Leopard, Clouded Leopard).'
        },
        {
                'name': 'Mouling National Park',
                'year': 1986,
                'district': 'Upper Siang',
                'keyFeature': 'Siang River biodiversity canyon.'
        }
]
    },
    questions: [
      {
            id: 'arunachal-pradesh-q1',
            state: 'Arunachal Pradesh',
            parkName: 'Namdapha National Park',
            question: 'In which state is Namdapha National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Assam',
                  'Meghalaya',
                  'Nagaland'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Namdapha National Park is located in Arunachal Pradesh.',
            establishedYear: 1983,
            district: 'Changlang',
            keyFeature: 'Only park with 4 big cat species (Tiger, Leopard, Snow Leopard, Clouded Leopard).'
      },
      {
            id: 'arunachal-pradesh-q2',
            state: 'Arunachal Pradesh',
            parkName: 'Mouling National Park',
            question: 'In which state is Mouling National Park located?',
            options: [
                  'Meghalaya',
                  'Arunachal Pradesh',
                  'Nagaland',
                  'Manipur'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mouling National Park is located in Arunachal Pradesh.',
            establishedYear: 1986,
            district: 'Upper Siang',
            keyFeature: 'Siang River biodiversity canyon.'
      },
      {
            id: 'arunachal-pradesh-q3',
            state: 'Arunachal Pradesh',
            parkName: 'Namdapha National Park',
            question: 'In which state is Namdapha National Park located?',
            options: [
                  'Nagaland',
                  'Manipur',
                  'Arunachal Pradesh',
                  'Assam'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Namdapha National Park is located in Arunachal Pradesh.',
            establishedYear: 1983,
            district: 'Changlang',
            keyFeature: 'Only park with 4 big cat species (Tiger, Leopard, Snow Leopard, Clouded Leopard).'
      },
      {
            id: 'arunachal-pradesh-q4',
            state: 'Arunachal Pradesh',
            parkName: 'Mouling National Park',
            question: 'In which state is Mouling National Park located?',
            options: [
                  'Manipur',
                  'Assam',
                  'Meghalaya',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Mouling National Park is located in Arunachal Pradesh.',
            establishedYear: 1986,
            district: 'Upper Siang',
            keyFeature: 'Siang River biodiversity canyon.'
      },
      {
            id: 'arunachal-pradesh-q5',
            state: 'Arunachal Pradesh',
            parkName: 'Namdapha National Park',
            question: 'In which state is Namdapha National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Assam',
                  'Meghalaya',
                  'Nagaland'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Namdapha National Park is located in Arunachal Pradesh.',
            establishedYear: 1983,
            district: 'Changlang',
            keyFeature: 'Only park with 4 big cat species (Tiger, Leopard, Snow Leopard, Clouded Leopard).'
      }
]
  },

  // ==========================================
  // MEGHALAYA
  // ==========================================
  'Meghalaya': {
    stateInfo: {
      stateName: 'Meghalaya',
      capital: 'Shillong',
      totalParks: 2,
      overview: 'Meghalaya has 2 National Parks in the Garo and South Garo Hills.',
      tipsForMahi: 'Mastering the National Parks of Meghalaya.',
      parks: [
        {
                'name': 'Nokrek Ridge National Park',
                'year': 1988,
                'district': 'East Garo Hills',
                'keyFeature': 'UNESCO Biosphere Reserve; gene sanctuary for wild citrus (Citrus indica).'
        },
        {
                'name': 'Balphakram National Park',
                'year': 1986,
                'district': 'South Garo Hills',
                'keyFeature': 'Land of perpetual winds and deep gorge canyon.'
        }
]
    },
    questions: [
      {
            id: 'meghalaya-q1',
            state: 'Meghalaya',
            parkName: 'Nokrek Ridge National Park',
            question: 'In which state is Nokrek Ridge National Park located?',
            options: [
                  'Meghalaya',
                  'Assam',
                  'Arunachal Pradesh',
                  'Mizoram'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Nokrek Ridge National Park is located in Meghalaya.',
            establishedYear: 1988,
            district: 'East Garo Hills',
            keyFeature: 'UNESCO Biosphere Reserve; gene sanctuary for wild citrus (Citrus indica).'
      },
      {
            id: 'meghalaya-q2',
            state: 'Meghalaya',
            parkName: 'Balphakram National Park',
            question: 'In which state is Balphakram National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Meghalaya',
                  'Mizoram',
                  'Tripura'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Balphakram National Park is located in Meghalaya.',
            establishedYear: 1986,
            district: 'South Garo Hills',
            keyFeature: 'Land of perpetual winds and deep gorge canyon.'
      },
      {
            id: 'meghalaya-q3',
            state: 'Meghalaya',
            parkName: 'Nokrek Ridge National Park',
            question: 'In which state is Nokrek Ridge National Park located?',
            options: [
                  'Mizoram',
                  'Tripura',
                  'Meghalaya',
                  'Assam'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Nokrek Ridge National Park is located in Meghalaya.',
            establishedYear: 1988,
            district: 'East Garo Hills',
            keyFeature: 'UNESCO Biosphere Reserve; gene sanctuary for wild citrus (Citrus indica).'
      },
      {
            id: 'meghalaya-q4',
            state: 'Meghalaya',
            parkName: 'Balphakram National Park',
            question: 'In which state is Balphakram National Park located?',
            options: [
                  'Tripura',
                  'Assam',
                  'Arunachal Pradesh',
                  'Meghalaya'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Balphakram National Park is located in Meghalaya.',
            establishedYear: 1986,
            district: 'South Garo Hills',
            keyFeature: 'Land of perpetual winds and deep gorge canyon.'
      },
      {
            id: 'meghalaya-q5',
            state: 'Meghalaya',
            parkName: 'Nokrek Ridge National Park',
            question: 'In which state is Nokrek Ridge National Park located?',
            options: [
                  'Meghalaya',
                  'Assam',
                  'Arunachal Pradesh',
                  'Mizoram'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Nokrek Ridge National Park is located in Meghalaya.',
            establishedYear: 1988,
            district: 'East Garo Hills',
            keyFeature: 'UNESCO Biosphere Reserve; gene sanctuary for wild citrus (Citrus indica).'
      }
]
  },

  // ==========================================
  // MANIPUR
  // ==========================================
  'Manipur': {
    stateInfo: {
      stateName: 'Manipur',
      capital: 'Imphal',
      totalParks: 2,
      overview: 'Manipur has 2 National Parks including the world\'s only floating park.',
      tipsForMahi: 'Mastering the National Parks of Manipur.',
      parks: [
        {
                'name': 'Keibul Lamjao National Park',
                'year': 1977,
                'district': 'Bishnupur',
                'keyFeature': 'World’s only floating national park on Loktak Lake, home to Sangai deer.'
        },
        {
                'name': 'Shirui National Park',
                'year': 1982,
                'district': 'Ukhrul',
                'keyFeature': 'Home of the rare Shirui Lily (Lilium mackliniae).'
        }
]
    },
    questions: [
      {
            id: 'manipur-q1',
            state: 'Manipur',
            parkName: 'Keibul Lamjao National Park',
            question: 'In which state is Keibul Lamjao National Park located?',
            options: [
                  'Manipur',
                  'Mizoram',
                  'Nagaland',
                  'Assam'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Keibul Lamjao National Park is located in Manipur.',
            establishedYear: 1977,
            district: 'Bishnupur',
            keyFeature: 'World’s only floating national park on Loktak Lake, home to Sangai deer.'
      },
      {
            id: 'manipur-q2',
            state: 'Manipur',
            parkName: 'Shirui National Park',
            question: 'In which state is Shirui National Park located?',
            options: [
                  'Nagaland',
                  'Manipur',
                  'Assam',
                  'Meghalaya'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Shirui National Park is located in Manipur.',
            establishedYear: 1982,
            district: 'Ukhrul',
            keyFeature: 'Home of the rare Shirui Lily (Lilium mackliniae).'
      },
      {
            id: 'manipur-q3',
            state: 'Manipur',
            parkName: 'Keibul Lamjao National Park',
            question: 'In which state is Keibul Lamjao National Park located?',
            options: [
                  'Assam',
                  'Meghalaya',
                  'Manipur',
                  'Mizoram'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Keibul Lamjao National Park is located in Manipur.',
            establishedYear: 1977,
            district: 'Bishnupur',
            keyFeature: 'World’s only floating national park on Loktak Lake, home to Sangai deer.'
      },
      {
            id: 'manipur-q4',
            state: 'Manipur',
            parkName: 'Shirui National Park',
            question: 'In which state is Shirui National Park located?',
            options: [
                  'Meghalaya',
                  'Mizoram',
                  'Nagaland',
                  'Manipur'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Shirui National Park is located in Manipur.',
            establishedYear: 1982,
            district: 'Ukhrul',
            keyFeature: 'Home of the rare Shirui Lily (Lilium mackliniae).'
      },
      {
            id: 'manipur-q5',
            state: 'Manipur',
            parkName: 'Keibul Lamjao National Park',
            question: 'In which state is Keibul Lamjao National Park located?',
            options: [
                  'Manipur',
                  'Mizoram',
                  'Nagaland',
                  'Assam'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Keibul Lamjao National Park is located in Manipur.',
            establishedYear: 1977,
            district: 'Bishnupur',
            keyFeature: 'World’s only floating national park on Loktak Lake, home to Sangai deer.'
      }
]
  },

  // ==========================================
  // MIZORAM
  // ==========================================
  'Mizoram': {
    stateInfo: {
      stateName: 'Mizoram',
      capital: 'Aizawl',
      totalParks: 2,
      overview: 'Mizoram has 2 National Parks in the Lushai hills.',
      tipsForMahi: 'Mastering the National Parks of Mizoram.',
      parks: [
        {
                'name': 'Murlen National Park',
                'year': 1991,
                'district': 'Champhai',
                'keyFeature': 'Dense canopy forest where only 1% sunlight penetrates.'
        },
        {
                'name': 'Phawngpui Blue Mountain National Park',
                'year': 1992,
                'district': 'Lawngtlai',
                'keyFeature': 'Protects Mizoram\'s highest peak (Blue Mountain).'
        }
]
    },
    questions: [
      {
            id: 'mizoram-q1',
            state: 'Mizoram',
            parkName: 'Murlen National Park',
            question: 'In which state is Murlen National Park located?',
            options: [
                  'Mizoram',
                  'Tripura',
                  'Manipur',
                  'Assam'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Murlen National Park is located in Mizoram.',
            establishedYear: 1991,
            district: 'Champhai',
            keyFeature: 'Dense canopy forest where only 1% sunlight penetrates.'
      },
      {
            id: 'mizoram-q2',
            state: 'Mizoram',
            parkName: 'Phawngpui Blue Mountain National Park',
            question: 'In which state is Phawngpui Blue Mountain National Park located?',
            options: [
                  'Manipur',
                  'Mizoram',
                  'Assam',
                  'Nagaland'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Phawngpui Blue Mountain National Park is located in Mizoram.',
            establishedYear: 1992,
            district: 'Lawngtlai',
            keyFeature: 'Protects Mizoram\'s highest peak (Blue Mountain).'
      },
      {
            id: 'mizoram-q3',
            state: 'Mizoram',
            parkName: 'Murlen National Park',
            question: 'In which state is Murlen National Park located?',
            options: [
                  'Assam',
                  'Nagaland',
                  'Mizoram',
                  'Tripura'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Murlen National Park is located in Mizoram.',
            establishedYear: 1991,
            district: 'Champhai',
            keyFeature: 'Dense canopy forest where only 1% sunlight penetrates.'
      },
      {
            id: 'mizoram-q4',
            state: 'Mizoram',
            parkName: 'Phawngpui Blue Mountain National Park',
            question: 'In which state is Phawngpui Blue Mountain National Park located?',
            options: [
                  'Nagaland',
                  'Tripura',
                  'Manipur',
                  'Mizoram'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Phawngpui Blue Mountain National Park is located in Mizoram.',
            establishedYear: 1992,
            district: 'Lawngtlai',
            keyFeature: 'Protects Mizoram\'s highest peak (Blue Mountain).'
      },
      {
            id: 'mizoram-q5',
            state: 'Mizoram',
            parkName: 'Murlen National Park',
            question: 'In which state is Murlen National Park located?',
            options: [
                  'Mizoram',
                  'Tripura',
                  'Manipur',
                  'Assam'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Murlen National Park is located in Mizoram.',
            establishedYear: 1991,
            district: 'Champhai',
            keyFeature: 'Dense canopy forest where only 1% sunlight penetrates.'
      }
]
  },

  // ==========================================
  // NAGALAND
  // ==========================================
  'Nagaland': {
    stateInfo: {
      stateName: 'Nagaland',
      capital: 'Kohima',
      totalParks: 1,
      overview: 'Nagaland has 1 National Park in the Peren district.',
      tipsForMahi: 'Mastering the National Parks of Nagaland.',
      parks: [
        {
                'name': 'Intanki (Ntangki) National Park',
                'year': 1993,
                'district': 'Peren',
                'keyFeature': 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
        }
]
    },
    questions: [
      {
            id: 'nagaland-q1',
            state: 'Nagaland',
            parkName: 'Intanki (Ntangki) National Park',
            question: 'In which state is Intanki (Ntangki) National Park located?',
            options: [
                  'Nagaland',
                  'Manipur',
                  'Assam',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Intanki (Ntangki) National Park is located in Nagaland.',
            establishedYear: 1993,
            district: 'Peren',
            keyFeature: 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
      },
      {
            id: 'nagaland-q2',
            state: 'Nagaland',
            parkName: 'Intanki (Ntangki) National Park',
            question: 'In which state is Intanki (Ntangki) National Park located?',
            options: [
                  'Assam',
                  'Nagaland',
                  'Arunachal Pradesh',
                  'Mizoram'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Intanki (Ntangki) National Park is located in Nagaland.',
            establishedYear: 1993,
            district: 'Peren',
            keyFeature: 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
      },
      {
            id: 'nagaland-q3',
            state: 'Nagaland',
            parkName: 'Intanki (Ntangki) National Park',
            question: 'In which state is Intanki (Ntangki) National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Mizoram',
                  'Nagaland',
                  'Manipur'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Intanki (Ntangki) National Park is located in Nagaland.',
            establishedYear: 1993,
            district: 'Peren',
            keyFeature: 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
      },
      {
            id: 'nagaland-q4',
            state: 'Nagaland',
            parkName: 'Intanki (Ntangki) National Park',
            question: 'In which state is Intanki (Ntangki) National Park located?',
            options: [
                  'Mizoram',
                  'Manipur',
                  'Assam',
                  'Nagaland'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Intanki (Ntangki) National Park is located in Nagaland.',
            establishedYear: 1993,
            district: 'Peren',
            keyFeature: 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
      },
      {
            id: 'nagaland-q5',
            state: 'Nagaland',
            parkName: 'Intanki (Ntangki) National Park',
            question: 'In which state is Intanki (Ntangki) National Park located?',
            options: [
                  'Nagaland',
                  'Manipur',
                  'Assam',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Intanki (Ntangki) National Park is located in Nagaland.',
            establishedYear: 1993,
            district: 'Peren',
            keyFeature: 'Habitat of the Hoolock Gibbon and Great Indian Hornbill.'
      }
]
  },

  // ==========================================
  // TRIPURA
  // ==========================================
  'Tripura': {
    stateInfo: {
      stateName: 'Tripura',
      capital: 'Agartala',
      totalParks: 2,
      overview: 'Tripura has 2 National Parks in the Sipahijala and South Tripura districts.',
      tipsForMahi: 'Mastering the National Parks of Tripura.',
      parks: [
        {
                'name': 'Clouded Leopard National Park',
                'year': 2007,
                'district': 'Sipahijala',
                'keyFeature': 'Dedicated sanctuary for the elusive Clouded Leopard.'
        },
        {
                'name': 'Rajbari (Bison) National Park',
                'year': 2007,
                'district': 'South Tripura (Trishna)',
                'keyFeature': 'Protected habitat for Indian Gaur (Bison).'
        }
]
    },
    questions: [
      {
            id: 'tripura-q1',
            state: 'Tripura',
            parkName: 'Clouded Leopard National Park',
            question: 'In which state is Clouded Leopard National Park located?',
            options: [
                  'Tripura',
                  'Mizoram',
                  'Assam',
                  'Meghalaya'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Clouded Leopard National Park is located in Tripura.',
            establishedYear: 2007,
            district: 'Sipahijala',
            keyFeature: 'Dedicated sanctuary for the elusive Clouded Leopard.'
      },
      {
            id: 'tripura-q2',
            state: 'Tripura',
            parkName: 'Rajbari (Bison) National Park',
            question: 'In which state is Rajbari (Bison) National Park located?',
            options: [
                  'Assam',
                  'Tripura',
                  'Meghalaya',
                  'West Bengal'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Rajbari (Bison) National Park is located in Tripura.',
            establishedYear: 2007,
            district: 'South Tripura (Trishna)',
            keyFeature: 'Protected habitat for Indian Gaur (Bison).'
      },
      {
            id: 'tripura-q3',
            state: 'Tripura',
            parkName: 'Clouded Leopard National Park',
            question: 'In which state is Clouded Leopard National Park located?',
            options: [
                  'Meghalaya',
                  'West Bengal',
                  'Tripura',
                  'Mizoram'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Clouded Leopard National Park is located in Tripura.',
            establishedYear: 2007,
            district: 'Sipahijala',
            keyFeature: 'Dedicated sanctuary for the elusive Clouded Leopard.'
      },
      {
            id: 'tripura-q4',
            state: 'Tripura',
            parkName: 'Rajbari (Bison) National Park',
            question: 'In which state is Rajbari (Bison) National Park located?',
            options: [
                  'West Bengal',
                  'Mizoram',
                  'Assam',
                  'Tripura'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Rajbari (Bison) National Park is located in Tripura.',
            establishedYear: 2007,
            district: 'South Tripura (Trishna)',
            keyFeature: 'Protected habitat for Indian Gaur (Bison).'
      },
      {
            id: 'tripura-q5',
            state: 'Tripura',
            parkName: 'Clouded Leopard National Park',
            question: 'In which state is Clouded Leopard National Park located?',
            options: [
                  'Tripura',
                  'Mizoram',
                  'Assam',
                  'Meghalaya'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Clouded Leopard National Park is located in Tripura.',
            establishedYear: 2007,
            district: 'Sipahijala',
            keyFeature: 'Dedicated sanctuary for the elusive Clouded Leopard.'
      }
]
  },

  // ==========================================
  // SIKKIM
  // ==========================================
  'Sikkim': {
    stateInfo: {
      stateName: 'Sikkim',
      capital: 'Gangtok',
      totalParks: 1,
      overview: 'Sikkim has 1 National Park crowned by the world\'s 3rd highest peak.',
      tipsForMahi: 'Mastering the National Parks of Sikkim.',
      parks: [
        {
                'name': 'Khangchendzonga National Park',
                'year': 1977,
                'district': 'North & West Sikkim',
                'keyFeature': 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
        }
]
    },
    questions: [
      {
            id: 'sikkim-q1',
            state: 'Sikkim',
            parkName: 'Khangchendzonga National Park',
            question: 'In which state is Khangchendzonga National Park located?',
            options: [
                  'Sikkim',
                  'West Bengal',
                  'Assam',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Khangchendzonga National Park is located in Sikkim.',
            establishedYear: 1977,
            district: 'North & West Sikkim',
            keyFeature: 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
      },
      {
            id: 'sikkim-q2',
            state: 'Sikkim',
            parkName: 'Khangchendzonga National Park',
            question: 'In which state is Khangchendzonga National Park located?',
            options: [
                  'Assam',
                  'Sikkim',
                  'Arunachal Pradesh',
                  'Uttarakhand'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Khangchendzonga National Park is located in Sikkim.',
            establishedYear: 1977,
            district: 'North & West Sikkim',
            keyFeature: 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
      },
      {
            id: 'sikkim-q3',
            state: 'Sikkim',
            parkName: 'Khangchendzonga National Park',
            question: 'In which state is Khangchendzonga National Park located?',
            options: [
                  'Arunachal Pradesh',
                  'Uttarakhand',
                  'Sikkim',
                  'West Bengal'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Khangchendzonga National Park is located in Sikkim.',
            establishedYear: 1977,
            district: 'North & West Sikkim',
            keyFeature: 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
      },
      {
            id: 'sikkim-q4',
            state: 'Sikkim',
            parkName: 'Khangchendzonga National Park',
            question: 'In which state is Khangchendzonga National Park located?',
            options: [
                  'Uttarakhand',
                  'West Bengal',
                  'Assam',
                  'Sikkim'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Khangchendzonga National Park is located in Sikkim.',
            establishedYear: 1977,
            district: 'North & West Sikkim',
            keyFeature: 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
      },
      {
            id: 'sikkim-q5',
            state: 'Sikkim',
            parkName: 'Khangchendzonga National Park',
            question: 'In which state is Khangchendzonga National Park located?',
            options: [
                  'Sikkim',
                  'West Bengal',
                  'Assam',
                  'Arunachal Pradesh'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Khangchendzonga National Park is located in Sikkim.',
            establishedYear: 1977,
            district: 'North & West Sikkim',
            keyFeature: 'India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga.'
      }
]
  },

  // ==========================================
  // ANDAMAN & NICOBAR ISLANDS
  // ==========================================
  'Andaman & Nicobar Islands': {
    stateInfo: {
      stateName: 'Andaman & Nicobar Islands',
      capital: 'Port Blair',
      totalParks: 9,
      overview: 'Andaman & Nicobar Islands have 9 National Parks protecting pristine coral reefs and tropical rainforests.',
      tipsForMahi: 'Mastering the National Parks of Andaman & Nicobar Islands.',
      parks: [
        {
                'name': 'Mahatma Gandhi Marine National Park',
                'year': 1983,
                'district': 'South Andaman (Wandoor)',
                'keyFeature': 'Famous coral reef marine park at Wandoor.'
        },
        {
                'name': 'Rani Jhansi Marine National Park',
                'year': 1996,
                'district': 'Ritchie\'s Archipelago',
                'keyFeature': 'Protected coral lagoons and mangrove channels.'
        },
        {
                'name': 'Campbell Bay National Park',
                'year': 1992,
                'district': 'Great Nicobar',
                'keyFeature': 'Part of Great Nicobar Biosphere Reserve.'
        },
        {
                'name': 'Galathea Bay National Park',
                'year': 1992,
                'district': 'Great Nicobar',
                'keyFeature': 'Giant Leatherback Turtle nesting haven.'
        },
        {
                'name': 'Saddle Peak National Park',
                'year': 1979,
                'district': 'North Andaman',
                'keyFeature': 'Highest peak in the Andaman and Nicobar archipelago.'
        },
        {
                'name': 'Mount Harriet (Mount Manipur) National Park',
                'year': 1987,
                'district': 'South Andaman',
                'keyFeature': 'Commemorates Anglo-Manipur war; featured on ₹20 currency note.'
        },
        {
                'name': 'North Button Island National Park',
                'year': 1979,
                'district': 'South Andaman',
                'keyFeature': 'Pristine island coral sanctuary.'
        },
        {
                'name': 'Middle Button Island National Park',
                'year': 1979,
                'district': 'South Andaman',
                'keyFeature': 'Spotted deer and marine life haven.'
        },
        {
                'name': 'South Button Island National Park',
                'year': 1979,
                'district': 'South Andaman',
                'keyFeature': 'Smallest National Park in India (only 0.03 sq km).'
        }
]
    },
    questions: [
      {
            id: 'andaman-nicobar-islands-q1',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Mahatma Gandhi Marine National Park',
            question: 'In which state is Mahatma Gandhi Marine National Park located?',
            options: [
                  'Andaman & Nicobar Islands',
                  'Lakshadweep',
                  'Tamil Nadu',
                  'Kerala'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Mahatma Gandhi Marine National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1983,
            district: 'South Andaman (Wandoor)',
            keyFeature: 'Famous coral reef marine park at Wandoor.'
      },
      {
            id: 'andaman-nicobar-islands-q2',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Rani Jhansi Marine National Park',
            question: 'In which state is Rani Jhansi Marine National Park located?',
            options: [
                  'Tamil Nadu',
                  'Andaman & Nicobar Islands',
                  'Kerala',
                  'Goa'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Rani Jhansi Marine National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1996,
            district: 'Ritchie\'s Archipelago',
            keyFeature: 'Protected coral lagoons and mangrove channels.'
      },
      {
            id: 'andaman-nicobar-islands-q3',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Campbell Bay National Park',
            question: 'In which state is Campbell Bay National Park located?',
            options: [
                  'Kerala',
                  'Goa',
                  'Andaman & Nicobar Islands',
                  'Andhra Pradesh'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'Campbell Bay National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1992,
            district: 'Great Nicobar',
            keyFeature: 'Part of Great Nicobar Biosphere Reserve.'
      },
      {
            id: 'andaman-nicobar-islands-q4',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Galathea Bay National Park',
            question: 'In which state is Galathea Bay National Park located?',
            options: [
                  'Goa',
                  'Andhra Pradesh',
                  'Lakshadweep',
                  'Andaman & Nicobar Islands'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Galathea Bay National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1992,
            district: 'Great Nicobar',
            keyFeature: 'Giant Leatherback Turtle nesting haven.'
      },
      {
            id: 'andaman-nicobar-islands-q5',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Saddle Peak National Park',
            question: 'In which state is Saddle Peak National Park located?',
            options: [
                  'Andaman & Nicobar Islands',
                  'Andhra Pradesh',
                  'Lakshadweep',
                  'Tamil Nadu'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'Saddle Peak National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1979,
            district: 'North Andaman',
            keyFeature: 'Highest peak in the Andaman and Nicobar archipelago.'
      },
      {
            id: 'andaman-nicobar-islands-q6',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Mount Harriet (Mount Manipur) National Park',
            question: 'In which state is Mount Harriet (Mount Manipur) National Park located?',
            options: [
                  'Lakshadweep',
                  'Andaman & Nicobar Islands',
                  'Tamil Nadu',
                  'Kerala'
            ],
            correctAnswer: 1,
            difficulty: 'easy',
            explanation: 'Mount Harriet (Mount Manipur) National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1987,
            district: 'South Andaman',
            keyFeature: 'Commemorates Anglo-Manipur war; featured on ₹20 currency note.'
      },
      {
            id: 'andaman-nicobar-islands-q7',
            state: 'Andaman & Nicobar Islands',
            parkName: 'North Button Island National Park',
            question: 'In which state is North Button Island National Park located?',
            options: [
                  'Tamil Nadu',
                  'Kerala',
                  'Andaman & Nicobar Islands',
                  'Goa'
            ],
            correctAnswer: 2,
            difficulty: 'easy',
            explanation: 'North Button Island National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1979,
            district: 'South Andaman',
            keyFeature: 'Pristine island coral sanctuary.'
      },
      {
            id: 'andaman-nicobar-islands-q8',
            state: 'Andaman & Nicobar Islands',
            parkName: 'Middle Button Island National Park',
            question: 'In which state is Middle Button Island National Park located?',
            options: [
                  'Kerala',
                  'Goa',
                  'Andhra Pradesh',
                  'Andaman & Nicobar Islands'
            ],
            correctAnswer: 3,
            difficulty: 'easy',
            explanation: 'Middle Button Island National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1979,
            district: 'South Andaman',
            keyFeature: 'Spotted deer and marine life haven.'
      },
      {
            id: 'andaman-nicobar-islands-q9',
            state: 'Andaman & Nicobar Islands',
            parkName: 'South Button Island National Park',
            question: 'In which state is South Button Island National Park located?',
            options: [
                  'Andaman & Nicobar Islands',
                  'Goa',
                  'Andhra Pradesh',
                  'Lakshadweep'
            ],
            correctAnswer: 0,
            difficulty: 'easy',
            explanation: 'South Button Island National Park is located in Andaman & Nicobar Islands.',
            establishedYear: 1979,
            district: 'South Andaman',
            keyFeature: 'Smallest National Park in India (only 0.03 sq km).'
      }
]
  },

};

// State Name Aliases for flexible matching
STATE_REPOSITORIES['Andaman and Nicobar Islands'] = STATE_REPOSITORIES['Andaman & Nicobar Islands'];

