import type { QuizQuestion, StateNationalParkInfo } from '../types/quiz';

export interface StateData {
  stateInfo: StateNationalParkInfo;
  questions: Omit<QuizQuestion, 'section'>[];
}

export const STATE_REPOSITORIES: Record<string, StateData> = {
  "Madhya Pradesh": {
    "stateInfo": {
      "stateName": "Madhya Pradesh",
      "capital": "Bhopal",
      "totalParks": 11,
      "overview": "Madhya Pradesh is the Tiger State of India, home to 11 notified National Parks.",
      "tipsForMahi": "Mastering the National Parks of Madhya Pradesh.",
      "parks": [
        {
          "name": "Kanha National Park",
          "year": 1955,
          "district": "Mandla & Balaghat",
          "keyFeature": "Famous for Hardground Barasingha."
        },
        {
          "name": "Bandhavgarh National Park",
          "year": 1968,
          "district": "Umaria",
          "keyFeature": "Renowned for high tiger density."
        },
        {
          "name": "Panna National Park",
          "year": 1981,
          "district": "Panna & Chhatarpur",
          "keyFeature": "Ken River flows through the park."
        },
        {
          "name": "Pench National Park",
          "year": 1975,
          "district": "Seoni & Chhindwara",
          "keyFeature": "Setting for Kipling's The Jungle Book."
        },
        {
          "name": "Satpura National Park",
          "year": 1981,
          "district": "Narmadapuram",
          "keyFeature": "Core area of Pachmarhi Biosphere."
        },
        {
          "name": "Kuno National Park",
          "year": 2018,
          "district": "Sheopur",
          "keyFeature": "Site of Project Cheetah reintroduction."
        },
        {
          "name": "Sanjay National Park",
          "year": 1981,
          "district": "Sidhi",
          "keyFeature": "Part of Sanjay-Dubri Tiger Reserve."
        },
        {
          "name": "Madhav National Park",
          "year": 1959,
          "district": "Shivpuri",
          "keyFeature": "Historic Sakhya Sagar lake."
        },
        {
          "name": "Van Vihar National Park",
          "year": 1979,
          "district": "Bhopal",
          "keyFeature": "Modern zoological park in Bhopal city."
        },
        {
          "name": "Mandla Plant Fossils National Park",
          "year": 1983,
          "district": "Dindori",
          "keyFeature": "Prehistoric plant fossils."
        },
        {
          "name": "Dinosaur Fossils National Park",
          "year": 2011,
          "district": "Dhar",
          "keyFeature": "Preserved dinosaur eggs and fossils."
        }
      ]
    },
    "questions": [
      {
        "id": "madhya-pradesh-q1",
        "state": "Madhya Pradesh",
        "parkName": "Kanha National Park",
        "question": "In which state is Kanha National Park located?",
        "options": [
          "Madhya Pradesh",
          "Karnataka",
          "Kerala",
          "Assam"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Kanha National Park is located in Madhya Pradesh.",
        "establishedYear": 1955,
        "district": "Mandla & Balaghat",
        "keyFeature": "Famous for Hardground Barasingha."
      },
      {
        "id": "madhya-pradesh-q2",
        "state": "Madhya Pradesh",
        "parkName": "Bandhavgarh National Park",
        "question": "In which state is Bandhavgarh National Park located?",
        "options": [
          "Kerala",
          "Madhya Pradesh",
          "Assam",
          "Andhra Pradesh"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Bandhavgarh National Park is located in Madhya Pradesh.",
        "establishedYear": 1968,
        "district": "Umaria",
        "keyFeature": "Renowned for high tiger density."
      },
      {
        "id": "madhya-pradesh-q3",
        "state": "Madhya Pradesh",
        "parkName": "Panna National Park",
        "question": "In which state is Panna National Park located?",
        "options": [
          "Assam",
          "Andhra Pradesh",
          "Madhya Pradesh",
          "Telangana"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Panna National Park is located in Madhya Pradesh.",
        "establishedYear": 1981,
        "district": "Panna & Chhatarpur",
        "keyFeature": "Ken River flows through the park."
      },
      {
        "id": "madhya-pradesh-q4",
        "state": "Madhya Pradesh",
        "parkName": "Pench National Park",
        "question": "In which state is Pench National Park located?",
        "options": [
          "Andhra Pradesh",
          "Telangana",
          "Rajasthan",
          "Madhya Pradesh"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Pench National Park is located in Madhya Pradesh.",
        "establishedYear": 1975,
        "district": "Seoni & Chhindwara",
        "keyFeature": "Setting for Kipling's The Jungle Book."
      },
      {
        "id": "madhya-pradesh-q5",
        "state": "Madhya Pradesh",
        "parkName": "Satpura National Park",
        "question": "In which state is Satpura National Park located?",
        "options": [
          "Madhya Pradesh",
          "Telangana",
          "Rajasthan",
          "Gujarat"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Satpura National Park is located in Madhya Pradesh.",
        "establishedYear": 1981,
        "district": "Narmadapuram",
        "keyFeature": "Core area of Pachmarhi Biosphere."
      },
      {
        "id": "madhya-pradesh-q6",
        "state": "Madhya Pradesh",
        "parkName": "Kuno National Park",
        "question": "In which state is Kuno National Park located?",
        "options": [
          "Rajasthan",
          "Madhya Pradesh",
          "Gujarat",
          "Karnataka"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Kuno National Park is located in Madhya Pradesh.",
        "establishedYear": 2018,
        "district": "Sheopur",
        "keyFeature": "Site of Project Cheetah reintroduction."
      },
      {
        "id": "madhya-pradesh-q7",
        "state": "Madhya Pradesh",
        "parkName": "Sanjay National Park",
        "question": "In which state is Sanjay National Park located?",
        "options": [
          "Gujarat",
          "Karnataka",
          "Madhya Pradesh",
          "Kerala"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Sanjay National Park is located in Madhya Pradesh.",
        "establishedYear": 1981,
        "district": "Sidhi",
        "keyFeature": "Part of Sanjay-Dubri Tiger Reserve."
      },
      {
        "id": "madhya-pradesh-q8",
        "state": "Madhya Pradesh",
        "parkName": "Madhav National Park",
        "question": "In which state is Madhav National Park located?",
        "options": [
          "Karnataka",
          "Kerala",
          "Assam",
          "Madhya Pradesh"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Madhav National Park is located in Madhya Pradesh.",
        "establishedYear": 1959,
        "district": "Shivpuri",
        "keyFeature": "Historic Sakhya Sagar lake."
      },
      {
        "id": "madhya-pradesh-q9",
        "state": "Madhya Pradesh",
        "parkName": "Van Vihar National Park",
        "question": "In which state is Van Vihar National Park located?",
        "options": [
          "Madhya Pradesh",
          "Kerala",
          "Assam",
          "Andhra Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Van Vihar National Park is located in Madhya Pradesh.",
        "establishedYear": 1979,
        "district": "Bhopal",
        "keyFeature": "Modern zoological park in Bhopal city."
      },
      {
        "id": "madhya-pradesh-q10",
        "state": "Madhya Pradesh",
        "parkName": "Mandla Plant Fossils National Park",
        "question": "In which state is Mandla Plant Fossils National Park located?",
        "options": [
          "Assam",
          "Madhya Pradesh",
          "Andhra Pradesh",
          "Telangana"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Mandla Plant Fossils National Park is located in Madhya Pradesh.",
        "establishedYear": 1983,
        "district": "Dindori",
        "keyFeature": "Prehistoric plant fossils."
      },
      {
        "id": "madhya-pradesh-q11",
        "state": "Madhya Pradesh",
        "parkName": "Dinosaur Fossils National Park",
        "question": "In which state is Dinosaur Fossils National Park located?",
        "options": [
          "Andhra Pradesh",
          "Telangana",
          "Madhya Pradesh",
          "Rajasthan"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Dinosaur Fossils National Park is located in Madhya Pradesh.",
        "establishedYear": 2011,
        "district": "Dhar",
        "keyFeature": "Preserved dinosaur eggs and fossils."
      }
    ]
  },
  "Andhra Pradesh": {
    "stateInfo": {
      "stateName": "Andhra Pradesh",
      "capital": "Amaravati",
      "totalParks": 3,
      "overview": "Andhra Pradesh has 3 National Parks spanning the Eastern Ghats and Seshachalam hills.",
      "tipsForMahi": "Mastering the National Parks of Andhra Pradesh.",
      "parks": [
        {
          "name": "Papikonda National Park",
          "year": 2008,
          "district": "East & West Godavari",
          "keyFeature": "Spans the scenic Papi Hills on Godavari River."
        },
        {
          "name": "Sri Venkateswara National Park",
          "year": 1989,
          "district": "Tirupati & Kadapa",
          "keyFeature": "Located in Seshachalam Biosphere Reserve."
        },
        {
          "name": "Rajiv Gandhi (Rameswaram) National Park",
          "year": 2005,
          "district": "YSR Kadapa",
          "keyFeature": "Pristine peninsular biodiversity reserve."
        }
      ]
    },
    "questions": [
      {
        "id": "andhra-pradesh-q1",
        "state": "Andhra Pradesh",
        "parkName": "Papikonda National Park",
        "question": "In which Indian State is Papikonda National Park located?",
        "options": [
          "Andhra Pradesh",
          "Telangana",
          "Karnataka",
          "Odisha"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Papikonda National Park is located in Andhra Pradesh (Alluri Sitharama Raju and Eluru districts).",
        "establishedYear": 2008,
        "district": "Alluri Sitharama Raju & Eluru",
        "keyFeature": "Encompasses the scenic gorge where Godavari river cuts through the Eastern Ghats."
      },
      {
        "id": "andhra-pradesh-q2",
        "state": "Andhra Pradesh",
        "parkName": "Sri Venkateswara National Park",
        "question": "Sri Venkateswara National Park, home to the endemic Golden Gecko and Slender Loris, is located in which state?",
        "options": [
          "Andhra Pradesh",
          "Tamil Nadu",
          "Kerala",
          "Karnataka"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Sri Venkateswara National Park is situated in the Seshachalam and Tirumala hills of Andhra Pradesh.",
        "establishedYear": 1989,
        "district": "Tirupati & YSR Kadapa",
        "keyFeature": "Part of Seshachalam Biosphere Reserve, rich in Red Sanders."
      },
      {
        "id": "andhra-pradesh-q3",
        "state": "Andhra Pradesh",
        "parkName": "Rajiv Gandhi (Rameswaram) National Park",
        "question": "Rajiv Gandhi (Rameswaram) National Park is situated along the Penna River in which state?",
        "options": [
          "Andhra Pradesh",
          "Karnataka",
          "Tamil Nadu",
          "Telangana"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Rajiv Gandhi (Rameswaram) National Park is located in YSR Kadapa district of Andhra Pradesh.",
        "establishedYear": 2005,
        "district": "YSR Kadapa",
        "keyFeature": "Located in the dry deciduous forest landscape of the Rayalaseema region."
      },
      {
        "id": "andhra-pradesh-q4",
        "state": "Andhra Pradesh",
        "parkName": "Papikonda National Park",
        "question": "Which prominent river flows through the magnificent gorges of Papikonda National Park in Andhra Pradesh?",
        "options": [
          "Godavari River",
          "Krishna River",
          "Penna River",
          "Cauvery River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The River Godavari flows through the heart of Papikonda National Park.",
        "establishedYear": 2008,
        "district": "Alluri Sitharama Raju",
        "keyFeature": "Godavari river gorge through Eastern Ghats."
      },
      {
        "id": "andhra-pradesh-q5",
        "state": "Andhra Pradesh",
        "parkName": "Sri Venkateswara National Park",
        "question": "Sri Venkateswara National Park forms the core of which Biosphere Reserve in Andhra Pradesh?",
        "options": [
          "Seshachalam Biosphere Reserve",
          "Nilgiri Biosphere Reserve",
          "Agasthyamalai Biosphere Reserve",
          "Similipal Biosphere Reserve"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Sri Venkateswara National Park is the core zone of the Seshachalam Biosphere Reserve, designated in 2010.",
        "establishedYear": 1989,
        "district": "Tirupati",
        "keyFeature": "Seshachalam hill ranges."
      }
    ]
  },
  "Telangana": {
    "stateInfo": {
      "stateName": "Telangana",
      "capital": "Hyderabad",
      "totalParks": 3,
      "overview": "Telangana has 3 National Parks protecting Deccan wildlife and urban nature reserves.",
      "tipsForMahi": "Mastering the National Parks of Telangana.",
      "parks": [
        {
          "name": "Kasu Brahmananda Reddy (KBR) National Park",
          "year": 1998,
          "district": "Hyderabad",
          "keyFeature": "Urban forest park in Jubilee Hills, Hyderabad."
        },
        {
          "name": "Mahavir Harina Vanasthali National Park",
          "year": 1994,
          "district": "Ranga Reddy",
          "keyFeature": "Largest green lung space in Hyderabad, famous for blackbucks."
        },
        {
          "name": "Mrugavani National Park",
          "year": 1994,
          "district": "Ranga Reddy (Chilkur)",
          "keyFeature": "Diverse Deccan tropical dry deciduous flora."
        }
      ]
    },
    "questions": [
      {
        "id": "telangana-q1",
        "state": "Telangana",
        "parkName": "Kasu Brahmananda Reddy (KBR) National Park",
        "question": "In which state is Kasu Brahmananda Reddy (KBR) National Park located?",
        "options": [
          "Telangana",
          "Andhra Pradesh",
          "Maharashtra",
          "Karnataka"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "KBR National Park is located in Jubilee Hills, Hyderabad, Telangana.",
        "establishedYear": 1998,
        "district": "Hyderabad",
        "keyFeature": "Urban forest ecosystem and historical Chiran Palace."
      },
      {
        "id": "telangana-q2",
        "state": "Telangana",
        "parkName": "Mahavir Harina Vanasthali National Park",
        "question": "Mahavir Harina Vanasthali National Park, historically the hunting grounds of the Nizams, is located in which state?",
        "options": [
          "Telangana",
          "Andhra Pradesh",
          "Gujarat",
          "Rajasthan"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mahavir Harina Vanasthali is located at Vanasthalipuram, Hyderabad, Telangana.",
        "establishedYear": 1994,
        "district": "Ranga Reddy",
        "keyFeature": "Prime sanctuary for Blackbuck in southern India."
      },
      {
        "id": "telangana-q3",
        "state": "Telangana",
        "parkName": "Mrugavani National Park",
        "question": "Mrugavani National Park with its distinctive rocky Deccan ridge topography is situated in which state?",
        "options": [
          "Telangana",
          "Karnataka",
          "Andhra Pradesh",
          "Tamil Nadu"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mrugavani National Park is located near Chilkur in Ranga Reddy district, Telangana.",
        "establishedYear": 1994,
        "district": "Ranga Reddy",
        "keyFeature": "Tropical dry deciduous forest with granitic rock formations."
      },
      {
        "id": "telangana-q4",
        "state": "Telangana",
        "parkName": "Mahavir Harina Vanasthali National Park",
        "question": "Which graceful state animal of Punjab, Haryana, and Andhra Pradesh is famously protected in Mahavir Harina Vanasthali, Telangana?",
        "options": [
          "Blackbuck (Antelope)",
          "Spotted Deer (Chital)",
          "Sambar",
          "Barking Deer"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Mahavir Harina Vanasthali National Park is dedicated to preserving the Blackbuck (Antilope cervicapra).",
        "establishedYear": 1994,
        "district": "Ranga Reddy",
        "keyFeature": "Largest green lung in Hyderabad dedicated to Blackbuck conservation."
      },
      {
        "id": "telangana-q5",
        "state": "Telangana",
        "parkName": "Kasu Brahmananda Reddy (KBR) National Park",
        "question": "The historic Chiran Palace and its surrounding pristine woodlands form which National Park in Telangana?",
        "options": [
          "KBR National Park",
          "Mrugavani National Park",
          "Mahavir Harina Vanasthali",
          "Pakhal Wildlife Sanctuary"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Chiran Palace complex in Jubilee Hills forms Kasu Brahmananda Reddy (KBR) National Park.",
        "establishedYear": 1998,
        "district": "Hyderabad",
        "keyFeature": "Chiran Palace heritage site."
      }
    ]
  },
  "Kerala": {
    "stateInfo": {
      "stateName": "Kerala",
      "capital": "Thiruvananthapuram",
      "totalParks": 6,
      "overview": "Kerala features 6 National Parks in the Western Ghats global biodiversity hotspot.",
      "tipsForMahi": "Mastering the National Parks of Kerala.",
      "parks": [
        {
          "name": "Eravikulam National Park",
          "year": 1978,
          "district": "Idukki",
          "keyFeature": "Home of Nilgiri Tahr and Anamudi peak."
        },
        {
          "name": "Silent Valley National Park",
          "year": 1984,
          "district": "Palakkad",
          "keyFeature": "Pristine rainforest with Lion-tailed macaques."
        },
        {
          "name": "Periyar National Park",
          "year": 1982,
          "district": "Idukki",
          "keyFeature": "Famous elephant and tiger sanctuary on Periyar Lake."
        },
        {
          "name": "Anamudi Shola National Park",
          "year": 2003,
          "district": "Idukki",
          "keyFeature": "High-altitude shola-grassland ecosystem."
        },
        {
          "name": "Mathikettan Shola National Park",
          "year": 2003,
          "district": "Idukki",
          "keyFeature": "Cardamom Hills shola forest reserve."
        },
        {
          "name": "Pambadum Shola National Park",
          "year": 2003,
          "district": "Idukki",
          "keyFeature": "Smallest national park in Kerala."
        }
      ]
    },
    "questions": [
      {
        "id": "kerala-q1",
        "state": "Kerala",
        "parkName": "Eravikulam National Park",
        "question": "In which state is Eravikulam National Park located?",
        "options": [
          "Kerala",
          "Karnataka",
          "Tamil Nadu",
          "Andhra Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Eravikulam National Park is located in Kerala.",
        "establishedYear": 1978,
        "district": "Idukki",
        "keyFeature": "Home of Nilgiri Tahr and Anamudi peak."
      },
      {
        "id": "kerala-q2",
        "state": "Kerala",
        "parkName": "Silent Valley National Park",
        "question": "In which state is Silent Valley National Park located?",
        "options": [
          "Tamil Nadu",
          "Kerala",
          "Andhra Pradesh",
          "Goa"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Silent Valley National Park is located in Kerala.",
        "establishedYear": 1984,
        "district": "Palakkad",
        "keyFeature": "Pristine rainforest with Lion-tailed macaques."
      },
      {
        "id": "kerala-q3",
        "state": "Kerala",
        "parkName": "Periyar National Park",
        "question": "In which state is Periyar National Park located?",
        "options": [
          "Andhra Pradesh",
          "Goa",
          "Kerala",
          "Maharashtra"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Periyar National Park is located in Kerala.",
        "establishedYear": 1982,
        "district": "Idukki",
        "keyFeature": "Famous elephant and tiger sanctuary on Periyar Lake."
      },
      {
        "id": "kerala-q4",
        "state": "Kerala",
        "parkName": "Anamudi Shola National Park",
        "question": "In which state is Anamudi Shola National Park located?",
        "options": [
          "Goa",
          "Maharashtra",
          "Karnataka",
          "Kerala"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Anamudi Shola National Park is located in Kerala.",
        "establishedYear": 2003,
        "district": "Idukki",
        "keyFeature": "High-altitude shola-grassland ecosystem."
      },
      {
        "id": "kerala-q5",
        "state": "Kerala",
        "parkName": "Mathikettan Shola National Park",
        "question": "In which state is Mathikettan Shola National Park located?",
        "options": [
          "Kerala",
          "Maharashtra",
          "Karnataka",
          "Tamil Nadu"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mathikettan Shola National Park is located in Kerala.",
        "establishedYear": 2003,
        "district": "Idukki",
        "keyFeature": "Cardamom Hills shola forest reserve."
      },
      {
        "id": "kerala-q6",
        "state": "Kerala",
        "parkName": "Pambadum Shola National Park",
        "question": "In which state is Pambadum Shola National Park located?",
        "options": [
          "Karnataka",
          "Kerala",
          "Tamil Nadu",
          "Andhra Pradesh"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Pambadum Shola National Park is located in Kerala.",
        "establishedYear": 2003,
        "district": "Idukki",
        "keyFeature": "Smallest national park in Kerala."
      }
    ]
  },
  "Assam": {
    "stateInfo": {
      "stateName": "Assam",
      "capital": "Dispur",
      "totalParks": 7,
      "overview": "Assam features 7 National Parks along the Brahmaputra River valley.",
      "tipsForMahi": "Mastering the National Parks of Assam.",
      "parks": [
        {
          "name": "Kaziranga National Park",
          "year": 1974,
          "district": "Golaghat & Nagaon",
          "keyFeature": "World’s greatest stronghold of Great Indian One-Horned Rhinoceros."
        },
        {
          "name": "Manas National Park",
          "year": 1990,
          "district": "Baksa & Chirang",
          "keyFeature": "UNESCO Natural World Heritage site along Bhutan border."
        },
        {
          "name": "Dibru-Saikhowa National Park",
          "year": 1999,
          "district": "Dibrugarh & Tinsukia",
          "keyFeature": "Feral horses and riverine wetlands."
        },
        {
          "name": "Nameri National Park",
          "year": 1998,
          "district": "Sonitpur",
          "keyFeature": "Jia Bhoroli River elephant corridor."
        },
        {
          "name": "Rajiv Gandhi Orang National Park",
          "year": 1999,
          "district": "Darrang & Sonitpur",
          "keyFeature": "Mini-Kaziranga on northern bank of Brahmaputra."
        },
        {
          "name": "Dehing Patkai National Park",
          "year": 2021,
          "district": "Dibrugarh & Tinsukia",
          "keyFeature": "The Amazon of the East rainforest."
        },
        {
          "name": "Raimona National Park",
          "year": 2021,
          "district": "Kokrajhar",
          "keyFeature": "Famous for Golden Langurs in Bodoland."
        }
      ]
    },
    "questions": [
      {
        "id": "assam-q1",
        "state": "Assam",
        "parkName": "Kaziranga National Park",
        "question": "In which state is Kaziranga National Park located?",
        "options": [
          "Assam",
          "West Bengal",
          "Meghalaya",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Kaziranga National Park is located in Assam.",
        "establishedYear": 1974,
        "district": "Golaghat & Nagaon",
        "keyFeature": "World’s greatest stronghold of Great Indian One-Horned Rhinoceros."
      },
      {
        "id": "assam-q2",
        "state": "Assam",
        "parkName": "Manas National Park",
        "question": "In which state is Manas National Park located?",
        "options": [
          "Meghalaya",
          "Assam",
          "Arunachal Pradesh",
          "Nagaland"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Manas National Park is located in Assam.",
        "establishedYear": 1990,
        "district": "Baksa & Chirang",
        "keyFeature": "UNESCO Natural World Heritage site along Bhutan border."
      },
      {
        "id": "assam-q3",
        "state": "Assam",
        "parkName": "Dibru-Saikhowa National Park",
        "question": "In which state is Dibru-Saikhowa National Park located?",
        "options": [
          "Arunachal Pradesh",
          "Nagaland",
          "Assam",
          "Tripura"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Dibru-Saikhowa National Park is located in Assam.",
        "establishedYear": 1999,
        "district": "Dibrugarh & Tinsukia",
        "keyFeature": "Feral horses and riverine wetlands."
      },
      {
        "id": "assam-q4",
        "state": "Assam",
        "parkName": "Nameri National Park",
        "question": "In which state is Nameri National Park located?",
        "options": [
          "Nagaland",
          "Tripura",
          "West Bengal",
          "Assam"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Nameri National Park is located in Assam.",
        "establishedYear": 1998,
        "district": "Sonitpur",
        "keyFeature": "Jia Bhoroli River elephant corridor."
      },
      {
        "id": "assam-q5",
        "state": "Assam",
        "parkName": "Rajiv Gandhi Orang National Park",
        "question": "In which state is Rajiv Gandhi Orang National Park located?",
        "options": [
          "Assam",
          "Tripura",
          "West Bengal",
          "Meghalaya"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Rajiv Gandhi Orang National Park is located in Assam.",
        "establishedYear": 1999,
        "district": "Darrang & Sonitpur",
        "keyFeature": "Mini-Kaziranga on northern bank of Brahmaputra."
      },
      {
        "id": "assam-q6",
        "state": "Assam",
        "parkName": "Dehing Patkai National Park",
        "question": "In which state is Dehing Patkai National Park located?",
        "options": [
          "West Bengal",
          "Assam",
          "Meghalaya",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Dehing Patkai National Park is located in Assam.",
        "establishedYear": 2021,
        "district": "Dibrugarh & Tinsukia",
        "keyFeature": "The Amazon of the East rainforest."
      },
      {
        "id": "assam-q7",
        "state": "Assam",
        "parkName": "Raimona National Park",
        "question": "In which state is Raimona National Park located?",
        "options": [
          "Meghalaya",
          "Arunachal Pradesh",
          "Assam",
          "Nagaland"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Raimona National Park is located in Assam.",
        "establishedYear": 2021,
        "district": "Kokrajhar",
        "keyFeature": "Famous for Golden Langurs in Bodoland."
      }
    ]
  },
  "Karnataka": {
    "stateInfo": {
      "stateName": "Karnataka",
      "capital": "Bengaluru",
      "totalParks": 5,
      "overview": "Karnataka has 5 National Parks across Western Ghats and Deccan plateau.",
      "tipsForMahi": "Mastering the National Parks of Karnataka.",
      "parks": [
        {
          "name": "Bandipur National Park",
          "year": 1974,
          "district": "Chamarajanagar",
          "keyFeature": "Premier tiger reserve in Nilgiri Biosphere."
        },
        {
          "name": "Nagarhole (Rajiv Gandhi) National Park",
          "year": 1988,
          "district": "Kodagu & Mysuru",
          "keyFeature": "Kabini River wildlife paradise."
        },
        {
          "name": "Bannerghatta National Park",
          "year": 1974,
          "district": "Bengaluru Urban & Rural",
          "keyFeature": "Biological park and butterfly sanctuary near Bengaluru."
        },
        {
          "name": "Kudremukh National Park",
          "year": 1987,
          "district": "Chikkamagaluru",
          "keyFeature": "Horse-face shaped peak in Western Ghats."
        },
        {
          "name": "Anshi (Kali) National Park",
          "year": 1987,
          "district": "Uttara Kannada",
          "keyFeature": "Dandeli-Anshi Tiger Reserve along Kali River."
        }
      ]
    },
    "questions": [
      {
        "id": "karnataka-q1",
        "state": "Karnataka",
        "parkName": "Bandipur National Park",
        "question": "In which state is Bandipur National Park located?",
        "options": [
          "Karnataka",
          "Kerala",
          "Tamil Nadu",
          "Maharashtra"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Bandipur National Park is located in Karnataka.",
        "establishedYear": 1974,
        "district": "Chamarajanagar",
        "keyFeature": "Premier tiger reserve in Nilgiri Biosphere."
      },
      {
        "id": "karnataka-q2",
        "state": "Karnataka",
        "parkName": "Nagarhole (Rajiv Gandhi) National Park",
        "question": "In which state is Nagarhole (Rajiv Gandhi) National Park located?",
        "options": [
          "Tamil Nadu",
          "Karnataka",
          "Maharashtra",
          "Telangana"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Nagarhole (Rajiv Gandhi) National Park is located in Karnataka.",
        "establishedYear": 1988,
        "district": "Kodagu & Mysuru",
        "keyFeature": "Kabini River wildlife paradise."
      },
      {
        "id": "karnataka-q3",
        "state": "Karnataka",
        "parkName": "Bannerghatta National Park",
        "question": "In which state is Bannerghatta National Park located?",
        "options": [
          "Maharashtra",
          "Telangana",
          "Karnataka",
          "Andhra Pradesh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Bannerghatta National Park is located in Karnataka.",
        "establishedYear": 1974,
        "district": "Bengaluru Urban & Rural",
        "keyFeature": "Biological park and butterfly sanctuary near Bengaluru."
      },
      {
        "id": "karnataka-q4",
        "state": "Karnataka",
        "parkName": "Kudremukh National Park",
        "question": "In which state is Kudremukh National Park located?",
        "options": [
          "Telangana",
          "Andhra Pradesh",
          "Kerala",
          "Karnataka"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Kudremukh National Park is located in Karnataka.",
        "establishedYear": 1987,
        "district": "Chikkamagaluru",
        "keyFeature": "Horse-face shaped peak in Western Ghats."
      },
      {
        "id": "karnataka-q5",
        "state": "Karnataka",
        "parkName": "Anshi (Kali) National Park",
        "question": "In which state is Anshi (Kali) National Park located?",
        "options": [
          "Karnataka",
          "Andhra Pradesh",
          "Kerala",
          "Tamil Nadu"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Anshi (Kali) National Park is located in Karnataka.",
        "establishedYear": 1987,
        "district": "Uttara Kannada",
        "keyFeature": "Dandeli-Anshi Tiger Reserve along Kali River."
      }
    ]
  },
  "Maharashtra": {
    "stateInfo": {
      "stateName": "Maharashtra",
      "capital": "Mumbai",
      "totalParks": 6,
      "overview": "Maharashtra has 6 National Parks protecting Sahyadri forests and Vidarbha tiger reserves.",
      "tipsForMahi": "Mastering the National Parks of Maharashtra.",
      "parks": [
        {
          "name": "Tadoba National Park",
          "year": 1955,
          "district": "Chandrapur",
          "keyFeature": "Oldest and largest national park in Maharashtra."
        },
        {
          "name": "Sanjay Gandhi (Borivali) National Park",
          "year": 1983,
          "district": "Mumbai Suburban",
          "keyFeature": "Unique national park situated inside a megacity."
        },
        {
          "name": "Chandoli National Park",
          "year": 2004,
          "district": "Sangli, Satara & Kolhapur",
          "keyFeature": "Sahyadri Tiger Reserve core."
        },
        {
          "name": "Gugamal National Park",
          "year": 1975,
          "district": "Amravati",
          "keyFeature": "Melghat Tiger Reserve core in Satpura range."
        },
        {
          "name": "Nawegaon National Park",
          "year": 1975,
          "district": "Gondia",
          "keyFeature": "Scenic Nawegaon lake bird sanctuary."
        },
        {
          "name": "Pench (Maharashtra) National Park",
          "year": 1975,
          "district": "Nagpur",
          "keyFeature": "Maharashtra portion of the famous Pench valley."
        }
      ]
    },
    "questions": [
      {
        "id": "maharashtra-q1",
        "state": "Maharashtra",
        "parkName": "Tadoba National Park",
        "question": "In which state is Tadoba National Park located?",
        "options": [
          "Maharashtra",
          "Gujarat",
          "Madhya Pradesh",
          "Karnataka"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Tadoba National Park is located in Maharashtra.",
        "establishedYear": 1955,
        "district": "Chandrapur",
        "keyFeature": "Oldest and largest national park in Maharashtra."
      },
      {
        "id": "maharashtra-q2",
        "state": "Maharashtra",
        "parkName": "Sanjay Gandhi (Borivali) National Park",
        "question": "In which state is Sanjay Gandhi (Borivali) National Park located?",
        "options": [
          "Madhya Pradesh",
          "Maharashtra",
          "Karnataka",
          "Goa"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Sanjay Gandhi (Borivali) National Park is located in Maharashtra.",
        "establishedYear": 1983,
        "district": "Mumbai Suburban",
        "keyFeature": "Unique national park situated inside a megacity."
      },
      {
        "id": "maharashtra-q3",
        "state": "Maharashtra",
        "parkName": "Chandoli National Park",
        "question": "In which state is Chandoli National Park located?",
        "options": [
          "Karnataka",
          "Goa",
          "Maharashtra",
          "Chhattisgarh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Chandoli National Park is located in Maharashtra.",
        "establishedYear": 2004,
        "district": "Sangli, Satara & Kolhapur",
        "keyFeature": "Sahyadri Tiger Reserve core."
      },
      {
        "id": "maharashtra-q4",
        "state": "Maharashtra",
        "parkName": "Gugamal National Park",
        "question": "In which state is Gugamal National Park located?",
        "options": [
          "Goa",
          "Chhattisgarh",
          "Gujarat",
          "Maharashtra"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Gugamal National Park is located in Maharashtra.",
        "establishedYear": 1975,
        "district": "Amravati",
        "keyFeature": "Melghat Tiger Reserve core in Satpura range."
      },
      {
        "id": "maharashtra-q5",
        "state": "Maharashtra",
        "parkName": "Nawegaon National Park",
        "question": "In which state is Nawegaon National Park located?",
        "options": [
          "Maharashtra",
          "Chhattisgarh",
          "Gujarat",
          "Madhya Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Nawegaon National Park is located in Maharashtra.",
        "establishedYear": 1975,
        "district": "Gondia",
        "keyFeature": "Scenic Nawegaon lake bird sanctuary."
      },
      {
        "id": "maharashtra-q6",
        "state": "Maharashtra",
        "parkName": "Pench (Maharashtra) National Park",
        "question": "In which state is Pench (Maharashtra) National Park located?",
        "options": [
          "Gujarat",
          "Maharashtra",
          "Madhya Pradesh",
          "Karnataka"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Pench (Maharashtra) National Park is located in Maharashtra.",
        "establishedYear": 1975,
        "district": "Nagpur",
        "keyFeature": "Maharashtra portion of the famous Pench valley."
      }
    ]
  },
  "Gujarat": {
    "stateInfo": {
      "stateName": "Gujarat",
      "capital": "Gandhinagar",
      "totalParks": 4,
      "overview": "Gujarat has 4 National Parks covering Asiatic lions, marine coral reefs, and blackbucks.",
      "tipsForMahi": "Mastering the National Parks of Gujarat.",
      "parks": [
        {
          "name": "Gir National Park",
          "year": 1975,
          "district": "Junagadh & Gir Somnath",
          "keyFeature": "Only natural habitat of the Asiatic Lion in the world."
        },
        {
          "name": "Blackbuck (Velavadar) National Park",
          "year": 1976,
          "district": "Bhavnagar",
          "keyFeature": "Largest population of Blackbucks in grassland ecosystem."
        },
        {
          "name": "Marine (Gulf of Kutch) National Park",
          "year": 1982,
          "district": "Jamnagar & Devbhumi Dwarka",
          "keyFeature": "India’s first marine national park."
        },
        {
          "name": "Vansda National Park",
          "year": 1979,
          "district": "Navsari",
          "keyFeature": "Dense deciduous Dangs forest canopy."
        }
      ]
    },
    "questions": [
      {
        "id": "gujarat-q1",
        "state": "Gujarat",
        "parkName": "Gir National Park",
        "question": "In which state is Gir National Park, the sole natural home of the Asiatic Lion in the wild, located?",
        "options": [
          "Gujarat",
          "Rajasthan",
          "Madhya Pradesh",
          "Maharashtra"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Gir National Park is located in the Junagadh/Gir Somnath region of Gujarat.",
        "establishedYear": 1975,
        "district": "Gir Somnath, Junagadh & Amreli",
        "keyFeature": "Only wild habitat of the Asiatic Lion (Panthera leo persica)."
      },
      {
        "id": "gujarat-q2",
        "state": "Gujarat",
        "parkName": "Blackbuck (Velavadar) National Park",
        "question": "Blackbuck (Velavadar) National Park is situated in the Bhal grassland region of which state?",
        "options": [
          "Gujarat",
          "Haryana",
          "Rajasthan",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Velavadar Blackbuck National Park is in Bhavnagar district, Gujarat.",
        "establishedYear": 1976,
        "district": "Bhavnagar",
        "keyFeature": "Open savanna grassland supporting large herds of Blackbuck."
      },
      {
        "id": "gujarat-q3",
        "state": "Gujarat",
        "parkName": "Marine (Gulf of Kutch) National Park",
        "question": "India's very first Marine National Park was established in which coastal region of Gujarat?",
        "options": [
          "Gulf of Kutch (Jamnagar)",
          "Gulf of Khambhat",
          "Diu Coast",
          "Porbandar Marine Reserve"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Marine National Park was established in 1982 in the Gulf of Kutch near Jamnagar, Gujarat.",
        "establishedYear": 1982,
        "district": "Jamnagar & Devbhumi Dwarka",
        "keyFeature": "Intertidal coral reefs, mangroves, and Dugong feeding grounds."
      },
      {
        "id": "gujarat-q4",
        "state": "Gujarat",
        "parkName": "Vansda National Park",
        "question": "Vansda National Park, characterized by moist deciduous forests and bamboo groves, is in which district of Gujarat?",
        "options": [
          "Navsari",
          "Surat",
          "Vadodara",
          "Dang"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Vansda National Park is located in Navsari district, Gujarat.",
        "establishedYear": 1979,
        "district": "Navsari",
        "keyFeature": "Moist deciduous woodlands in the southern Gujarat tribal belt."
      },
      {
        "id": "gujarat-q5",
        "state": "Gujarat",
        "parkName": "Blackbuck (Velavadar) National Park",
        "question": "Which critically endangered bustard species is famous for its monsoon courtship leaps in Velavadar, Gujarat?",
        "options": [
          "Lesser Florican",
          "Great Indian Bustard",
          "Bengal Florican",
          "Houbara Bustard"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Velavadar in Gujarat is the world's most important breeding ground for the Lesser Florican.",
        "establishedYear": 1976,
        "district": "Bhavnagar",
        "keyFeature": "World's highest density of Lesser Floricans during breeding season."
      }
    ]
  },
  "Goa": {
    "stateInfo": {
      "stateName": "Goa",
      "capital": "Panaji",
      "totalParks": 1,
      "overview": "Goa has 1 National Park nestled in the lush Western Ghats.",
      "tipsForMahi": "Mastering the National Parks of Goa.",
      "parks": [
        {
          "name": "Mollem (Bhagwan Mahavir) National Park",
          "year": 1978,
          "district": "South Goa (Dharbandora)",
          "keyFeature": "Home of the magnificent Dudhsagar Waterfalls."
        }
      ]
    },
    "questions": [
      {
        "id": "goa-q1",
        "state": "Goa",
        "parkName": "Mollem (Bhagwan Mahavir) National Park",
        "question": "In which state is Mollem (Bhagwan Mahavir) National Park located?",
        "options": [
          "Goa",
          "Maharashtra",
          "Karnataka",
          "Kerala"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mollem National Park is located in Dharbandora taluka of South Goa.",
        "establishedYear": 1978,
        "district": "South Goa (Dharbandora)",
        "keyFeature": "Core area of Bhagwan Mahavir Wildlife Sanctuary in the Western Ghats."
      },
      {
        "id": "goa-q2",
        "state": "Goa",
        "parkName": "Mollem (Bhagwan Mahavir) National Park",
        "question": "The majestic multi-tiered Dudhsagar Waterfalls is located on which river inside Mollem National Park, Goa?",
        "options": [
          "Mandovi River",
          "Zuari River",
          "Chapora River",
          "Terekhol River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Dudhsagar Falls is on the Mandovi River along the Goa-Karnataka border in Mollem NP.",
        "establishedYear": 1978,
        "district": "South Goa",
        "keyFeature": "Dudhsagar Waterfalls cascading down the Sahyadri range."
      },
      {
        "id": "goa-q3",
        "state": "Goa",
        "parkName": "Mollem (Bhagwan Mahavir) National Park",
        "question": "The historic 12th-century basalt Tambdi Surla Mahadev temple is preserved inside which protected area of Goa?",
        "options": [
          "Mollem National Park",
          "Cotigao Wildlife Sanctuary",
          "Salim Ali Bird Sanctuary",
          "Netravali Sanctuary"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Kadamba-era Tambdi Surla temple is located deep inside Mollem National Park.",
        "establishedYear": 1978,
        "district": "South Goa",
        "keyFeature": "12th-century Kadamba architecture at Tambdi Surla."
      },
      {
        "id": "goa-q4",
        "state": "Goa",
        "parkName": "Mollem (Bhagwan Mahavir) National Park",
        "question": "Mollem National Park in Goa forms a critical ecological corridor in which UNESCO World Heritage mountain chain?",
        "options": [
          "Western Ghats (Sahyadri)",
          "Eastern Ghats",
          "Satpura Range",
          "Nilgiri Hills"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mollem National Park lies in the lush tropical rainforest belt of the Western Ghats.",
        "establishedYear": 1978,
        "district": "South Goa",
        "keyFeature": "Dense evergreen Western Ghats forest."
      },
      {
        "id": "goa-q5",
        "state": "Goa",
        "parkName": "Mollem (Bhagwan Mahavir) National Park",
        "question": "Which rare melanistic big cat is occasionally sighted in the dense canopies of Mollem National Park, Goa?",
        "options": [
          "Black Panther (Melanistic Leopard)",
          "Snow Leopard",
          "Clouded Leopard",
          "Caracal"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Black Panthers (melanistic leopards) are documented inhabitants of Mollem's dense evergreen forests.",
        "establishedYear": 1978,
        "district": "South Goa",
        "keyFeature": "Habitat for Black Panther and King Cobra."
      }
    ]
  },
  "Rajasthan": {
    "stateInfo": {
      "stateName": "Rajasthan",
      "capital": "Jaipur",
      "totalParks": 5,
      "overview": "Rajasthan has 5 National Parks protecting Aravalli, desert and wetland ecosystems.",
      "tipsForMahi": "Mastering the National Parks of Rajasthan.",
      "parks": [
        {
          "name": "Ranthambore National Park",
          "year": 1980,
          "district": "Sawai Madhopur",
          "keyFeature": "Historic fort and iconic Royal Bengal Tiger habitat."
        },
        {
          "name": "Keoladeo Ghana National Park",
          "year": 1981,
          "district": "Bharatpur",
          "keyFeature": "UNESCO World Heritage wetland bird sanctuary."
        },
        {
          "name": "Sariska National Park",
          "year": 1990,
          "district": "Alwar",
          "keyFeature": "Aravalli tiger reserve with historic ruins."
        },
        {
          "name": "Desert National Park",
          "year": 1992,
          "district": "Jaisalmer & Barmer",
          "keyFeature": "Great Indian Bustard sanctuary in Thar Desert."
        },
        {
          "name": "Mukundra Hills National Park",
          "year": 2012,
          "district": "Kota",
          "keyFeature": "Protected riverine valley of Chambal basin."
        }
      ]
    },
    "questions": [
      {
        "id": "rajasthan-q1",
        "state": "Rajasthan",
        "parkName": "Ranthambore National Park",
        "question": "In which state is Ranthambore National Park located?",
        "options": [
          "Rajasthan",
          "Gujarat",
          "Madhya Pradesh",
          "Haryana"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Ranthambore National Park is located in Rajasthan.",
        "establishedYear": 1980,
        "district": "Sawai Madhopur",
        "keyFeature": "Historic fort and iconic Royal Bengal Tiger habitat."
      },
      {
        "id": "rajasthan-q2",
        "state": "Rajasthan",
        "parkName": "Keoladeo Ghana National Park",
        "question": "In which state is Keoladeo Ghana National Park located?",
        "options": [
          "Madhya Pradesh",
          "Rajasthan",
          "Haryana",
          "Uttar Pradesh"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Keoladeo Ghana National Park is located in Rajasthan.",
        "establishedYear": 1981,
        "district": "Bharatpur",
        "keyFeature": "UNESCO World Heritage wetland bird sanctuary."
      },
      {
        "id": "rajasthan-q3",
        "state": "Rajasthan",
        "parkName": "Sariska National Park",
        "question": "In which state is Sariska National Park located?",
        "options": [
          "Haryana",
          "Uttar Pradesh",
          "Rajasthan",
          "Gujarat"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Sariska National Park is located in Rajasthan.",
        "establishedYear": 1990,
        "district": "Alwar",
        "keyFeature": "Aravalli tiger reserve with historic ruins."
      },
      {
        "id": "rajasthan-q4",
        "state": "Rajasthan",
        "parkName": "Desert National Park",
        "question": "In which state is Desert National Park located?",
        "options": [
          "Uttar Pradesh",
          "Gujarat",
          "Madhya Pradesh",
          "Rajasthan"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Desert National Park is located in Rajasthan.",
        "establishedYear": 1992,
        "district": "Jaisalmer & Barmer",
        "keyFeature": "Great Indian Bustard sanctuary in Thar Desert."
      },
      {
        "id": "rajasthan-q5",
        "state": "Rajasthan",
        "parkName": "Mukundra Hills National Park",
        "question": "In which state is Mukundra Hills National Park located?",
        "options": [
          "Rajasthan",
          "Gujarat",
          "Madhya Pradesh",
          "Haryana"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mukundra Hills National Park is located in Rajasthan.",
        "establishedYear": 2012,
        "district": "Kota",
        "keyFeature": "Protected riverine valley of Chambal basin."
      }
    ]
  },
  "Tamil Nadu": {
    "stateInfo": {
      "stateName": "Tamil Nadu",
      "capital": "Chennai",
      "totalParks": 5,
      "overview": "Tamil Nadu has 5 National Parks in Western Ghats and coastal waters.",
      "tipsForMahi": "Mastering the National Parks of Tamil Nadu.",
      "parks": [
        {
          "name": "Mudumalai National Park",
          "year": 1990,
          "district": "Nilgiris",
          "keyFeature": "First national park in South India (part of Nilgiri Biosphere)."
        },
        {
          "name": "Mukurthi National Park",
          "year": 2001,
          "district": "Nilgiris",
          "keyFeature": "Dedicated to preserving the endangered Nilgiri Tahr."
        },
        {
          "name": "Indira Gandhi (Anamalai) National Park",
          "year": 1989,
          "district": "Coimbatore",
          "keyFeature": "Top Slip elephant and wildlife sanctuary."
        },
        {
          "name": "Guindy National Park",
          "year": 1976,
          "district": "Chennai",
          "keyFeature": "Unique protected national park situated in Chennai city."
        },
        {
          "name": "Gulf of Mannar Marine National Park",
          "year": 1986,
          "district": "Ramanathapuram & Thoothukudi",
          "keyFeature": "First marine biosphere reserve in South Asia."
        }
      ]
    },
    "questions": [
      {
        "id": "tamil-nadu-q1",
        "state": "Tamil Nadu",
        "parkName": "Mudumalai National Park",
        "question": "In which state is Mudumalai National Park located?",
        "options": [
          "Tamil Nadu",
          "Kerala",
          "Karnataka",
          "Andhra Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mudumalai National Park is located in Tamil Nadu.",
        "establishedYear": 1990,
        "district": "Nilgiris",
        "keyFeature": "First national park in South India (part of Nilgiri Biosphere)."
      },
      {
        "id": "tamil-nadu-q2",
        "state": "Tamil Nadu",
        "parkName": "Mukurthi National Park",
        "question": "In which state is Mukurthi National Park located?",
        "options": [
          "Karnataka",
          "Tamil Nadu",
          "Andhra Pradesh",
          "Telangana"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Mukurthi National Park is located in Tamil Nadu.",
        "establishedYear": 2001,
        "district": "Nilgiris",
        "keyFeature": "Dedicated to preserving the endangered Nilgiri Tahr."
      },
      {
        "id": "tamil-nadu-q3",
        "state": "Tamil Nadu",
        "parkName": "Indira Gandhi (Anamalai) National Park",
        "question": "In which state is Indira Gandhi (Anamalai) National Park located?",
        "options": [
          "Andhra Pradesh",
          "Telangana",
          "Tamil Nadu",
          "Kerala"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Indira Gandhi (Anamalai) National Park is located in Tamil Nadu.",
        "establishedYear": 1989,
        "district": "Coimbatore",
        "keyFeature": "Top Slip elephant and wildlife sanctuary."
      },
      {
        "id": "tamil-nadu-q4",
        "state": "Tamil Nadu",
        "parkName": "Guindy National Park",
        "question": "In which state is Guindy National Park located?",
        "options": [
          "Telangana",
          "Kerala",
          "Karnataka",
          "Tamil Nadu"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Guindy National Park is located in Tamil Nadu.",
        "establishedYear": 1976,
        "district": "Chennai",
        "keyFeature": "Unique protected national park situated in Chennai city."
      },
      {
        "id": "tamil-nadu-q5",
        "state": "Tamil Nadu",
        "parkName": "Gulf of Mannar Marine National Park",
        "question": "In which state is Gulf of Mannar Marine National Park located?",
        "options": [
          "Tamil Nadu",
          "Kerala",
          "Karnataka",
          "Andhra Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Gulf of Mannar Marine National Park is located in Tamil Nadu.",
        "establishedYear": 1986,
        "district": "Ramanathapuram & Thoothukudi",
        "keyFeature": "First marine biosphere reserve in South Asia."
      }
    ]
  },
  "Uttarakhand": {
    "stateInfo": {
      "stateName": "Uttarakhand",
      "capital": "Dehradun",
      "totalParks": 6,
      "overview": "Uttarakhand has 6 National Parks in the high Garhwal and Kumaon Himalayas.",
      "tipsForMahi": "Mastering the National Parks of Uttarakhand.",
      "parks": [
        {
          "name": "Jim Corbett National Park",
          "year": 1936,
          "district": "Nainital & Pauri Garhwal",
          "keyFeature": "First National Park in India (originally Hailey NP)."
        },
        {
          "name": "Valley of Flowers National Park",
          "year": 1982,
          "district": "Chamoli",
          "keyFeature": "UNESCO World Heritage alpine flower valley."
        },
        {
          "name": "Nanda Devi National Park",
          "year": 1982,
          "district": "Chamoli",
          "keyFeature": "UNESCO peak sanctuary around Nanda Devi."
        },
        {
          "name": "Rajaji National Park",
          "year": 1983,
          "district": "Haridwar & Dehradun",
          "keyFeature": "Shivalik elephant and tiger sanctuary."
        },
        {
          "name": "Gangotri National Park",
          "year": 1989,
          "district": "Uttarkashi",
          "keyFeature": "Origin of sacred Bhagirathi River (Gaumukh)."
        },
        {
          "name": "Govind Pashu Vihar National Park",
          "year": 1990,
          "district": "Uttarkashi",
          "keyFeature": "Famous for Snow Leopard protection in Tons valley."
        }
      ]
    },
    "questions": [
      {
        "id": "uttarakhand-q1",
        "state": "Uttarakhand",
        "parkName": "Jim Corbett National Park",
        "question": "In which state is Jim Corbett National Park located?",
        "options": [
          "Uttarakhand",
          "Himachal Pradesh",
          "Jammu & Kashmir",
          "Uttar Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Jim Corbett National Park is located in Uttarakhand.",
        "establishedYear": 1936,
        "district": "Nainital & Pauri Garhwal",
        "keyFeature": "First National Park in India (originally Hailey NP)."
      },
      {
        "id": "uttarakhand-q2",
        "state": "Uttarakhand",
        "parkName": "Valley of Flowers National Park",
        "question": "In which state is Valley of Flowers National Park located?",
        "options": [
          "Jammu & Kashmir",
          "Uttarakhand",
          "Uttar Pradesh",
          "Sikkim"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Valley of Flowers National Park is located in Uttarakhand.",
        "establishedYear": 1982,
        "district": "Chamoli",
        "keyFeature": "UNESCO World Heritage alpine flower valley."
      },
      {
        "id": "uttarakhand-q3",
        "state": "Uttarakhand",
        "parkName": "Nanda Devi National Park",
        "question": "In which state is Nanda Devi National Park located?",
        "options": [
          "Uttar Pradesh",
          "Sikkim",
          "Uttarakhand",
          "Himachal Pradesh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Nanda Devi National Park is located in Uttarakhand.",
        "establishedYear": 1982,
        "district": "Chamoli",
        "keyFeature": "UNESCO peak sanctuary around Nanda Devi."
      },
      {
        "id": "uttarakhand-q4",
        "state": "Uttarakhand",
        "parkName": "Rajaji National Park",
        "question": "In which state is Rajaji National Park located?",
        "options": [
          "Sikkim",
          "Himachal Pradesh",
          "Jammu & Kashmir",
          "Uttarakhand"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Rajaji National Park is located in Uttarakhand.",
        "establishedYear": 1983,
        "district": "Haridwar & Dehradun",
        "keyFeature": "Shivalik elephant and tiger sanctuary."
      },
      {
        "id": "uttarakhand-q5",
        "state": "Uttarakhand",
        "parkName": "Gangotri National Park",
        "question": "In which state is Gangotri National Park located?",
        "options": [
          "Uttarakhand",
          "Himachal Pradesh",
          "Jammu & Kashmir",
          "Uttar Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Gangotri National Park is located in Uttarakhand.",
        "establishedYear": 1989,
        "district": "Uttarkashi",
        "keyFeature": "Origin of sacred Bhagirathi River (Gaumukh)."
      },
      {
        "id": "uttarakhand-q6",
        "state": "Uttarakhand",
        "parkName": "Govind Pashu Vihar National Park",
        "question": "In which state is Govind Pashu Vihar National Park located?",
        "options": [
          "Jammu & Kashmir",
          "Uttarakhand",
          "Uttar Pradesh",
          "Sikkim"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Govind Pashu Vihar National Park is located in Uttarakhand.",
        "establishedYear": 1990,
        "district": "Uttarkashi",
        "keyFeature": "Famous for Snow Leopard protection in Tons valley."
      }
    ]
  },
  "Himachal Pradesh": {
    "stateInfo": {
      "stateName": "Himachal Pradesh",
      "capital": "Shimla",
      "totalParks": 5,
      "overview": "Himachal Pradesh has 5 National Parks across Western Himalayas.",
      "tipsForMahi": "Mastering the National Parks of Himachal Pradesh.",
      "parks": [
        {
          "name": "Great Himalayan National Park",
          "year": 1999,
          "district": "Kullu",
          "keyFeature": "UNESCO Natural World Heritage site."
        },
        {
          "name": "Pin Valley National Park",
          "year": 1987,
          "district": "Lahaul & Spiti",
          "keyFeature": "Cold desert park famous for snow leopards and ibex."
        },
        {
          "name": "Inderkilla National Park",
          "year": 2010,
          "district": "Kullu",
          "keyFeature": "High altitude Himalayan wildlife sanctuary."
        },
        {
          "name": "Khirganga National Park",
          "year": 2010,
          "district": "Kullu",
          "keyFeature": "Pristine Parvati river valley ecosystem."
        },
        {
          "name": "Simbalbara National Park",
          "year": 2010,
          "district": "Sirmaur",
          "keyFeature": "Colonel Sher Jung park in Shivalik sal forests."
        }
      ]
    },
    "questions": [
      {
        "id": "himachal-pradesh-q1",
        "state": "Himachal Pradesh",
        "parkName": "Great Himalayan National Park",
        "question": "In which state is Great Himalayan National Park located?",
        "options": [
          "Himachal Pradesh",
          "Uttarakhand",
          "Jammu & Kashmir",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Great Himalayan National Park is located in Himachal Pradesh.",
        "establishedYear": 1999,
        "district": "Kullu",
        "keyFeature": "UNESCO Natural World Heritage site."
      },
      {
        "id": "himachal-pradesh-q2",
        "state": "Himachal Pradesh",
        "parkName": "Pin Valley National Park",
        "question": "In which state is Pin Valley National Park located?",
        "options": [
          "Jammu & Kashmir",
          "Himachal Pradesh",
          "Punjab",
          "Haryana"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Pin Valley National Park is located in Himachal Pradesh.",
        "establishedYear": 1987,
        "district": "Lahaul & Spiti",
        "keyFeature": "Cold desert park famous for snow leopards and ibex."
      },
      {
        "id": "himachal-pradesh-q3",
        "state": "Himachal Pradesh",
        "parkName": "Inderkilla National Park",
        "question": "In which state is Inderkilla National Park located?",
        "options": [
          "Punjab",
          "Haryana",
          "Himachal Pradesh",
          "Uttarakhand"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Inderkilla National Park is located in Himachal Pradesh.",
        "establishedYear": 2010,
        "district": "Kullu",
        "keyFeature": "High altitude Himalayan wildlife sanctuary."
      },
      {
        "id": "himachal-pradesh-q4",
        "state": "Himachal Pradesh",
        "parkName": "Khirganga National Park",
        "question": "In which state is Khirganga National Park located?",
        "options": [
          "Haryana",
          "Uttarakhand",
          "Jammu & Kashmir",
          "Himachal Pradesh"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Khirganga National Park is located in Himachal Pradesh.",
        "establishedYear": 2010,
        "district": "Kullu",
        "keyFeature": "Pristine Parvati river valley ecosystem."
      },
      {
        "id": "himachal-pradesh-q5",
        "state": "Himachal Pradesh",
        "parkName": "Simbalbara National Park",
        "question": "In which state is Simbalbara National Park located?",
        "options": [
          "Himachal Pradesh",
          "Uttarakhand",
          "Jammu & Kashmir",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Simbalbara National Park is located in Himachal Pradesh.",
        "establishedYear": 2010,
        "district": "Sirmaur",
        "keyFeature": "Colonel Sher Jung park in Shivalik sal forests."
      }
    ]
  },
  "Ladakh": {
    "stateInfo": {
      "stateName": "Ladakh",
      "capital": "Leh",
      "totalParks": 1,
      "overview": "Ladakh is home to Hemis National Park, the largest national park in India.",
      "tipsForMahi": "Mastering the National Parks of Ladakh.",
      "parks": [
        {
          "name": "Hemis National Park",
          "year": 1981,
          "district": "Leh",
          "keyFeature": "Largest national park in India; global snow leopard capital."
        }
      ]
    },
    "questions": [
      {
        "id": "ladakh-q1",
        "state": "Ladakh",
        "parkName": "Hemis National Park",
        "question": "In which Union Territory is Hemis National Park, India's largest national park by geographic area, located?",
        "options": [
          "Ladakh",
          "Jammu and Kashmir",
          "Himachal Pradesh",
          "Uttarakhand"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Hemis National Park is in the Leh district of Ladakh, covering over 4,400 sq km.",
        "establishedYear": 1981,
        "district": "Leh",
        "keyFeature": "Largest national park in India, world capital of the Snow Leopard."
      },
      {
        "id": "ladakh-q2",
        "state": "Ladakh",
        "parkName": "Hemis National Park",
        "question": "Hemis National Park in Ladakh is globally celebrated as having the highest density of which magnificent high-altitude predator?",
        "options": [
          "Snow Leopard",
          "Tibetan Wolf",
          "Himalayan Brown Bear",
          "Eurasian Lynx"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Hemis National Park is famous worldwide as the premier sanctuary for the Snow Leopard.",
        "establishedYear": 1981,
        "district": "Leh",
        "keyFeature": "World's highest concentration of Snow Leopards."
      },
      {
        "id": "ladakh-q3",
        "state": "Ladakh",
        "parkName": "Hemis National Park",
        "question": "Which legendary trans-Himalayan river bounds Hemis National Park to the north in Ladakh?",
        "options": [
          "Indus River",
          "Zanskar River",
          "Shyok River",
          "Nubra River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Indus River flows along the northern boundary of Hemis National Park.",
        "establishedYear": 1981,
        "district": "Leh",
        "keyFeature": "Bounded by the Indus River in Ladakh."
      },
      {
        "id": "ladakh-q4",
        "state": "Ladakh",
        "parkName": "Hemis National Park",
        "question": "The historic 17th-century Drukpa lineage Tibetan Buddhist monastery situated inside the park is named what?",
        "options": [
          "Hemis Gompa (Monastery)",
          "Thiksey Monastery",
          "Diskit Monastery",
          "Alchi Monastery"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Hemis Monastery, famous for the annual Hemis festival and Cham dance, is inside the park.",
        "establishedYear": 1981,
        "district": "Leh",
        "keyFeature": "Historic Hemis Monastery."
      },
      {
        "id": "ladakh-q5",
        "state": "Ladakh",
        "parkName": "Hemis National Park",
        "question": "Which magnificent wild sheep with giant curved horns and the world's largest wild sheep species is conserved in Hemis, Ladakh?",
        "options": [
          "Great Tibetan Sheep (Argali / Nayan)",
          "Ladakh Urial (Shapu)",
          "Bharal (Blue Sheep)",
          "Asiatic Ibex"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Great Tibetan Sheep (Ovis ammon hodgsoni), or Argali, is protected in the high valleys of Hemis.",
        "establishedYear": 1981,
        "district": "Leh",
        "keyFeature": "Argali and Blue Sheep populations."
      }
    ]
  },
  "Jammu and Kashmir": {
    "stateInfo": {
      "stateName": "Jammu and Kashmir",
      "capital": "Srinagar",
      "totalParks": 4,
      "overview": "Jammu and Kashmir has 4 high-altitude Himalayan National Parks.",
      "tipsForMahi": "Mastering the National Parks of Jammu and Kashmir.",
      "parks": [
        {
          "name": "Dachigam National Park",
          "year": 1981,
          "district": "Srinagar",
          "keyFeature": "Only natural home of the Hangul (Kashmir Stag)."
        },
        {
          "name": "Kishtwar National Park",
          "year": 1981,
          "district": "Kishtwar",
          "keyFeature": "Rugged Himalayan high peaks sanctuary."
        },
        {
          "name": "City Forest (Salim Ali) National Park",
          "year": 1992,
          "district": "Srinagar",
          "keyFeature": "Named in honor of India's Birdman Dr. Salim Ali."
        },
        {
          "name": "Kazinag National Park",
          "year": 2007,
          "district": "Baramulla",
          "keyFeature": "Crucial refuge for the Markhor (wild goat)."
        }
      ]
    },
    "questions": [
      {
        "id": "jammu-and-kashmir-q1",
        "state": "Jammu and Kashmir",
        "parkName": "Dachigam National Park",
        "question": "In which state is Dachigam National Park located?",
        "options": [
          "Jammu and Kashmir",
          "Himachal Pradesh",
          "Uttarakhand",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Dachigam National Park is located in Jammu and Kashmir.",
        "establishedYear": 1981,
        "district": "Srinagar",
        "keyFeature": "Only natural home of the Hangul (Kashmir Stag)."
      },
      {
        "id": "jammu-and-kashmir-q2",
        "state": "Jammu and Kashmir",
        "parkName": "Kishtwar National Park",
        "question": "In which state is Kishtwar National Park located?",
        "options": [
          "Himachal Pradesh",
          "Jammu and Kashmir",
          "Uttarakhand",
          "Rajasthan"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Kishtwar National Park is located in Jammu and Kashmir.",
        "establishedYear": 1981,
        "district": "Kishtwar",
        "keyFeature": "Rugged Himalayan high peaks sanctuary."
      },
      {
        "id": "jammu-and-kashmir-q3",
        "state": "Jammu and Kashmir",
        "parkName": "City Forest (Salim Ali) National Park",
        "question": "In which state is City Forest (Salim Ali) National Park located?",
        "options": [
          "Rajasthan",
          "Uttarakhand",
          "Jammu and Kashmir",
          "Himachal Pradesh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "City Forest (Salim Ali) National Park is located in Jammu and Kashmir.",
        "establishedYear": 1992,
        "district": "Srinagar",
        "keyFeature": "Named in honor of India's Birdman Dr. Salim Ali."
      },
      {
        "id": "jammu-and-kashmir-q4",
        "state": "Jammu and Kashmir",
        "parkName": "Kazinag National Park",
        "question": "In which state is Kazinag National Park located?",
        "options": [
          "Punjab",
          "Himachal Pradesh",
          "Uttarakhand",
          "Jammu and Kashmir"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Kazinag National Park is located in Jammu and Kashmir.",
        "establishedYear": 2007,
        "district": "Baramulla",
        "keyFeature": "Crucial refuge for the Markhor (wild goat)."
      },
      {
        "id": "jammu-and-kashmir-q5",
        "state": "Jammu and Kashmir",
        "parkName": "Dachigam National Park",
        "question": "Dachigam National Park near Srinagar is world-famous as the last viable natural sanctuary for which critically endangered species?",
        "options": [
          "Hangul (Kashmir Stag)",
          "Sangai (Brow-antlered Deer)",
          "Barasingha (Swamp Deer)",
          "Himalayan Musk Deer"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Dachigam National Park is renowned as the primary natural habitat and sanctuary of the Hangul, or Kashmir Stag.",
        "establishedYear": 1981,
        "district": "Srinagar",
        "keyFeature": "Only natural home of the Hangul (Kashmir Stag)."
      }
    ]
  },
  "Jammu & Kashmir & Ladakh": {
    "stateInfo": {
      "stateName": "Jammu & Kashmir & Ladakh",
      "capital": "Srinagar / Leh",
      "totalParks": 5,
      "overview": "Jammu & Kashmir and Ladakh have 5 high-altitude National Parks.",
      "tipsForMahi": "Mastering the National Parks of Jammu & Kashmir & Ladakh.",
      "parks": [
        {
          "name": "Dachigam National Park",
          "year": 1981,
          "district": "Srinagar",
          "keyFeature": "Only natural home of the Hangul (Kashmir Stag)."
        },
        {
          "name": "Hemis National Park",
          "year": 1981,
          "district": "Leh (Ladakh)",
          "keyFeature": "Largest national park in India; global snow leopard capital."
        },
        {
          "name": "Kishtwar National Park",
          "year": 1981,
          "district": "Kishtwar",
          "keyFeature": "Rugged Himalayan high peaks sanctuary."
        },
        {
          "name": "City Forest (Salim Ali) National Park",
          "year": 1992,
          "district": "Srinagar",
          "keyFeature": "Named in honor of India's Birdman Dr. Salim Ali."
        },
        {
          "name": "Kazinag National Park",
          "year": 2007,
          "district": "Baramulla",
          "keyFeature": "Crucial refuge for the Markhor (wild goat)."
        }
      ]
    },
    "questions": [
      {
        "id": "jammu-kashmir-ladakh-q1",
        "state": "Jammu & Kashmir & Ladakh",
        "parkName": "Dachigam National Park",
        "question": "In which state is Dachigam National Park located?",
        "options": [
          "Jammu & Kashmir & Ladakh",
          "Himachal Pradesh",
          "Uttarakhand",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Dachigam National Park is located in Jammu & Kashmir & Ladakh.",
        "establishedYear": 1981,
        "district": "Srinagar",
        "keyFeature": "Only natural home of the Hangul (Kashmir Stag)."
      },
      {
        "id": "jammu-kashmir-ladakh-q2",
        "state": "Jammu & Kashmir & Ladakh",
        "parkName": "Hemis National Park",
        "question": "In which state is Hemis National Park located?",
        "options": [
          "Uttarakhand",
          "Jammu & Kashmir & Ladakh",
          "Punjab",
          "Rajasthan"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Hemis National Park is located in Jammu & Kashmir & Ladakh.",
        "establishedYear": 1981,
        "district": "Leh (Ladakh)",
        "keyFeature": "Largest national park in India; global snow leopard capital."
      },
      {
        "id": "jammu-kashmir-ladakh-q3",
        "state": "Jammu & Kashmir & Ladakh",
        "parkName": "Kishtwar National Park",
        "question": "In which state is Kishtwar National Park located?",
        "options": [
          "Punjab",
          "Rajasthan",
          "Jammu & Kashmir & Ladakh",
          "Himachal Pradesh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Kishtwar National Park is located in Jammu & Kashmir & Ladakh.",
        "establishedYear": 1981,
        "district": "Kishtwar",
        "keyFeature": "Rugged Himalayan high peaks sanctuary."
      },
      {
        "id": "jammu-kashmir-ladakh-q4",
        "state": "Jammu & Kashmir & Ladakh",
        "parkName": "City Forest (Salim Ali) National Park",
        "question": "In which state is City Forest (Salim Ali) National Park located?",
        "options": [
          "Rajasthan",
          "Himachal Pradesh",
          "Uttarakhand",
          "Jammu & Kashmir & Ladakh"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "City Forest (Salim Ali) National Park is located in Jammu & Kashmir & Ladakh.",
        "establishedYear": 1992,
        "district": "Srinagar",
        "keyFeature": "Named in honor of India's Birdman Dr. Salim Ali."
      },
      {
        "id": "jammu-kashmir-ladakh-q5",
        "state": "Jammu & Kashmir & Ladakh",
        "parkName": "Kazinag National Park",
        "question": "In which state is Kazinag National Park located?",
        "options": [
          "Jammu & Kashmir & Ladakh",
          "Himachal Pradesh",
          "Uttarakhand",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Kazinag National Park is located in Jammu & Kashmir & Ladakh.",
        "establishedYear": 2007,
        "district": "Baramulla",
        "keyFeature": "Crucial refuge for the Markhor (wild goat)."
      }
    ]
  },
  "Haryana": {
    "stateInfo": {
      "stateName": "Haryana",
      "capital": "Chandigarh",
      "totalParks": 2,
      "overview": "Haryana has 2 National Parks serving as wetland and woodland havens.",
      "tipsForMahi": "Mastering the National Parks of Haryana.",
      "parks": [
        {
          "name": "Sultanpur National Park",
          "year": 1991,
          "district": "Gurugram",
          "keyFeature": "Renowned wetland bird sanctuary."
        },
        {
          "name": "Kalesar National Park",
          "year": 2003,
          "district": "Yamunanagar",
          "keyFeature": "Shivalik sal forests along Yamuna River."
        }
      ]
    },
    "questions": [
      {
        "id": "haryana-q1",
        "state": "Haryana",
        "parkName": "Sultanpur National Park",
        "question": "In which state is Sultanpur National Park, a premier Ramsar wetland and bird sanctuary, located?",
        "options": [
          "Haryana",
          "Punjab",
          "Rajasthan",
          "Uttar Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Sultanpur National Park is located in Gurugram district, Haryana.",
        "establishedYear": 1991,
        "district": "Gurugram",
        "keyFeature": "Ramsar wetland hosting thousands of migratory waterfowl."
      },
      {
        "id": "haryana-q2",
        "state": "Haryana",
        "parkName": "Kalesar National Park",
        "question": "Kalesar National Park, with its dense sal and dhak forests, is located in which state?",
        "options": [
          "Haryana",
          "Himachal Pradesh",
          "Uttarakhand",
          "Punjab"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Kalesar National Park is in the Yamunanagar district of Haryana.",
        "establishedYear": 2003,
        "district": "Yamunanagar",
        "keyFeature": "Shivalik foothill forest with leopards, barking deer, and sambar."
      },
      {
        "id": "haryana-q3",
        "state": "Haryana",
        "parkName": "Sultanpur National Park",
        "question": "Which famous ornithologist helped establish Sultanpur in Haryana as a notified bird sanctuary in 1972?",
        "options": [
          "Dr. Salim Ali",
          "Dr. Peter Scott",
          "E.P. Gee",
          "Dr. Sálim Moizuddin Abdul Ali"
        ],
        "correctAnswer": 1,
        "difficulty": "hard",
        "explanation": "Peter Scott along with Indira Gandhi helped establish Sultanpur Lake Sanctuary in 1972.",
        "establishedYear": 1991,
        "district": "Gurugram",
        "keyFeature": "Wetland designated as Ramsar site in 2021."
      },
      {
        "id": "haryana-q4",
        "state": "Haryana",
        "parkName": "Kalesar National Park",
        "question": "Which major river forms the eastern boundary of Kalesar National Park in Haryana?",
        "options": [
          "Yamuna River",
          "Ghaggar River",
          "Saraswati River",
          "Markanda River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Yamuna River flows along the eastern boundary of Kalesar National Park.",
        "establishedYear": 2003,
        "district": "Yamunanagar",
        "keyFeature": "Yamuna river corridor connecting Rajaji and Simbalbara."
      },
      {
        "id": "haryana-q5",
        "state": "Haryana",
        "parkName": "Kalesar National Park",
        "question": "Kalesar National Park in Haryana shares a contiguous forest boundary with which National Park in Himachal Pradesh?",
        "options": [
          "Simbalbara National Park",
          "Pin Valley National Park",
          "Great Himalayan National Park",
          "Inderkilla National Park"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Kalesar NP is directly contiguous with Simbalbara National Park of Himachal Pradesh across the border.",
        "establishedYear": 2003,
        "district": "Yamunanagar",
        "keyFeature": "Inter-state Shivalik wildlife corridor."
      }
    ]
  },
  "West Bengal": {
    "stateInfo": {
      "stateName": "West Bengal",
      "capital": "Kolkata",
      "totalParks": 6,
      "overview": "West Bengal has 6 National Parks spanning from the Himalayas to mangrove deltas.",
      "tipsForMahi": "Mastering the National Parks of West Bengal.",
      "parks": [
        {
          "name": "Sundarbans National Park",
          "year": 1984,
          "district": "South 24 Parganas",
          "keyFeature": "World’s largest mangrove forest and Royal Bengal Tiger habitat."
        },
        {
          "name": "Jaldapara National Park",
          "year": 2012,
          "district": "Alipurduar",
          "keyFeature": "Largest population of One-Horned Rhinos in Bengal."
        },
        {
          "name": "Gorumara National Park",
          "year": 1994,
          "district": "Jalpaiguri",
          "keyFeature": "Dooars floodplain wildlife sanctuary."
        },
        {
          "name": "Buxa National Park",
          "year": 1997,
          "district": "Alipurduar",
          "keyFeature": "Buxa Tiger Reserve along Bhutan border."
        },
        {
          "name": "Neora Valley National Park",
          "year": 1986,
          "district": "Kalimpong",
          "keyFeature": "Pristine mountain home of the Red Panda."
        },
        {
          "name": "Singalila National Park",
          "year": 1992,
          "district": "Darjeeling",
          "keyFeature": "Highest national park in Bengal on Sandakphu ridge."
        }
      ]
    },
    "questions": [
      {
        "id": "west-bengal-q1",
        "state": "West Bengal",
        "parkName": "Sundarbans National Park",
        "question": "In which state is Sundarbans National Park located?",
        "options": [
          "West Bengal",
          "Odisha",
          "Assam",
          "Bihar"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Sundarbans National Park is located in West Bengal.",
        "establishedYear": 1984,
        "district": "South 24 Parganas",
        "keyFeature": "World’s largest mangrove forest and Royal Bengal Tiger habitat."
      },
      {
        "id": "west-bengal-q2",
        "state": "West Bengal",
        "parkName": "Jaldapara National Park",
        "question": "In which state is Jaldapara National Park located?",
        "options": [
          "Assam",
          "West Bengal",
          "Bihar",
          "Jharkhand"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Jaldapara National Park is located in West Bengal.",
        "establishedYear": 2012,
        "district": "Alipurduar",
        "keyFeature": "Largest population of One-Horned Rhinos in Bengal."
      },
      {
        "id": "west-bengal-q3",
        "state": "West Bengal",
        "parkName": "Gorumara National Park",
        "question": "In which state is Gorumara National Park located?",
        "options": [
          "Bihar",
          "Jharkhand",
          "West Bengal",
          "Odisha"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Gorumara National Park is located in West Bengal.",
        "establishedYear": 1994,
        "district": "Jalpaiguri",
        "keyFeature": "Dooars floodplain wildlife sanctuary."
      },
      {
        "id": "west-bengal-q4",
        "state": "West Bengal",
        "parkName": "Buxa National Park",
        "question": "In which state is Buxa National Park located?",
        "options": [
          "Jharkhand",
          "Odisha",
          "Assam",
          "West Bengal"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Buxa National Park is located in West Bengal.",
        "establishedYear": 1997,
        "district": "Alipurduar",
        "keyFeature": "Buxa Tiger Reserve along Bhutan border."
      },
      {
        "id": "west-bengal-q5",
        "state": "West Bengal",
        "parkName": "Neora Valley National Park",
        "question": "In which state is Neora Valley National Park located?",
        "options": [
          "West Bengal",
          "Odisha",
          "Assam",
          "Bihar"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Neora Valley National Park is located in West Bengal.",
        "establishedYear": 1986,
        "district": "Kalimpong",
        "keyFeature": "Pristine mountain home of the Red Panda."
      },
      {
        "id": "west-bengal-q6",
        "state": "West Bengal",
        "parkName": "Singalila National Park",
        "question": "In which state is Singalila National Park located?",
        "options": [
          "Assam",
          "West Bengal",
          "Bihar",
          "Jharkhand"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Singalila National Park is located in West Bengal.",
        "establishedYear": 1992,
        "district": "Darjeeling",
        "keyFeature": "Highest national park in Bengal on Sandakphu ridge."
      }
    ]
  },
  "Odisha": {
    "stateInfo": {
      "stateName": "Odisha",
      "capital": "Bhubaneswar",
      "totalParks": 2,
      "overview": "Odisha has 2 National Parks protecting wetlands and sal forests.",
      "tipsForMahi": "Mastering the National Parks of Odisha.",
      "parks": [
        {
          "name": "Similipal National Park",
          "year": 1980,
          "district": "Mayurbhanj",
          "keyFeature": "UNESCO Biosphere Reserve with melanistic black tigers."
        },
        {
          "name": "Bhitarkanika National Park",
          "year": 1998,
          "district": "Kendrapara",
          "keyFeature": "Second largest mangrove ecosystem in India; Saltwater crocodiles."
        }
      ]
    },
    "questions": [
      {
        "id": "odisha-q1",
        "state": "Odisha",
        "parkName": "Similipal National Park",
        "question": "In which state is Similipal National Park, renowned for its red silk cotton trees and melanistic tigers, located?",
        "options": [
          "Odisha",
          "West Bengal",
          "Jharkhand",
          "Chhattisgarh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Similipal National Park is situated in Mayurbhanj district, Odisha.",
        "establishedYear": 1980,
        "district": "Mayurbhanj",
        "keyFeature": "UNESCO Biosphere Reserve home to rare pseudo-melanistic royal Bengal tigers."
      },
      {
        "id": "odisha-q2",
        "state": "Odisha",
        "parkName": "Bhitarkanika National Park",
        "question": "Bhitarkanika National Park, renowned for India's largest population of Saltwater Crocodiles, is located in which state?",
        "options": [
          "Odisha",
          "Andhra Pradesh",
          "West Bengal",
          "Tamil Nadu"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Bhitarkanika is located in Kendrapara district, Odisha.",
        "establishedYear": 1998,
        "district": "Kendrapara",
        "keyFeature": "Second largest mangrove ecosystem in mainland India after Sundarbans."
      },
      {
        "id": "odisha-q3",
        "state": "Odisha",
        "parkName": "Similipal National Park",
        "question": "The spectacular Barehipani Falls (tiered 399m) and Joranda Falls are located within which National Park of Odisha?",
        "options": [
          "Similipal National Park",
          "Bhitarkanika National Park",
          "Kanger Valley National Park",
          "Betla National Park"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Barehipani and Joranda waterfalls are prominent landmarks of Similipal National Park.",
        "establishedYear": 1980,
        "district": "Mayurbhanj",
        "keyFeature": "Spectacular waterfalls in the Mayurbhanj hills."
      },
      {
        "id": "odisha-q4",
        "state": "Odisha",
        "parkName": "Bhitarkanika National Park",
        "question": "Which deltaic river confluence creates the fertile mangrove wetlands of Bhitarkanika National Park in Odisha?",
        "options": [
          "Brahmani, Baitarani, and Dhamra rivers",
          "Mahanadi and Subarnarekha rivers",
          "Godavari and Krishna rivers",
          "Hooghly and Matla rivers"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Bhitarkanika is formed by the delta of Brahmani, Baitarani, and Dhamra rivers in Kendrapara.",
        "establishedYear": 1998,
        "district": "Kendrapara",
        "keyFeature": "Brahmani-Baitarani mangrove delta."
      },
      {
        "id": "odisha-q5",
        "state": "Odisha",
        "parkName": "Bhitarkanika National Park",
        "question": "Gahirmatha beach adjacent to Bhitarkanika in Odisha is celebrated globally as the world's largest nesting ground for which creature?",
        "options": [
          "Olive Ridley Sea Turtle",
          "Leatherback Sea Turtle",
          "Green Sea Turtle",
          "Hawksbill Turtle"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Gahirmatha beach witnesses massive mass nesting (Arribada) of Olive Ridley sea turtles.",
        "establishedYear": 1998,
        "district": "Kendrapara",
        "keyFeature": "World's largest rookery of Olive Ridley sea turtles."
      }
    ]
  },
  "Chhattisgarh": {
    "stateInfo": {
      "stateName": "Chhattisgarh",
      "capital": "Raipur",
      "totalParks": 3,
      "overview": "Chhattisgarh has 3 National Parks in Bastar and Surguja forests.",
      "tipsForMahi": "Mastering the National Parks of Chhattisgarh.",
      "parks": [
        {
          "name": "Indravati (Kutru) National Park",
          "year": 1981,
          "district": "Bijapur",
          "keyFeature": "Prime habitat of the endangered Wild Water Buffalo."
        },
        {
          "name": "Kanger Valley National Park",
          "year": 1982,
          "district": "Bastar (Jagdalpur)",
          "keyFeature": "Limestone caves (Kotumsar) and Bastar Hill Myna."
        },
        {
          "name": "Guru Ghasidas (Sanjay) National Park",
          "year": 1981,
          "district": "Koriya",
          "keyFeature": "Connected tiger corridor with MP Sanjay National Park."
        }
      ]
    },
    "questions": [
      {
        "id": "chhattisgarh-q1",
        "state": "Chhattisgarh",
        "parkName": "Indravati (Kutru) National Park",
        "question": "In which state is Indravati (Kutru) National Park located?",
        "options": [
          "Chhattisgarh",
          "Madhya Pradesh",
          "Odisha",
          "Maharashtra"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Indravati National Park is located in Bijapur district of Bastar region, Chhattisgarh.",
        "establishedYear": 1981,
        "district": "Bijapur",
        "keyFeature": "Home to the endangered Wild Water Buffalo, the state animal of Chhattisgarh."
      },
      {
        "id": "chhattisgarh-q2",
        "state": "Chhattisgarh",
        "parkName": "Kanger Valley National Park",
        "question": "Kanger Valley National Park, famous for its underground Kotumsar limestone cave formations, is situated in which state?",
        "options": [
          "Chhattisgarh",
          "Jharkhand",
          "Odisha",
          "Telangana"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Kanger Valley is located in Bastar district of Chhattisgarh.",
        "establishedYear": 1982,
        "district": "Bastar",
        "keyFeature": "Subterranean limestone caves with stalagmites and stalactites."
      },
      {
        "id": "chhattisgarh-q3",
        "state": "Chhattisgarh",
        "parkName": "Guru Ghasidas (Sanjay) National Park",
        "question": "Guru Ghasidas National Park, formerly part of Sanjay National Park, is situated in which state?",
        "options": [
          "Chhattisgarh",
          "Madhya Pradesh",
          "Uttar Pradesh",
          "Bihar"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Guru Ghasidas National Park lies in Koriya and Surajpur districts of northern Chhattisgarh.",
        "establishedYear": 1981,
        "district": "Koriya & Surajpur",
        "keyFeature": "Critical wildlife corridor connecting Bandhavgarh (MP) and Palamau (Jharkhand)."
      },
      {
        "id": "chhattisgarh-q4",
        "state": "Chhattisgarh",
        "parkName": "Indravati (Kutru) National Park",
        "question": "Which critically endangered bovine species and state animal of Chhattisgarh has its stronghold in Indravati National Park?",
        "options": [
          "Wild Water Buffalo (Bubalus arnee)",
          "Gaur (Indian Bison)",
          "Nilgai",
          "Chinkara"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Indravati NP protects the purest wild gene pool of the endangered Wild Water Buffalo.",
        "establishedYear": 1981,
        "district": "Bijapur",
        "keyFeature": "Habitat for Wild Water Buffalo."
      },
      {
        "id": "chhattisgarh-q5",
        "state": "Chhattisgarh",
        "parkName": "Kanger Valley National Park",
        "question": "The endemic blind cave fish (Indoreonectes evezardi) and Bastar Hill Myna are celebrated in which National Park of Chhattisgarh?",
        "options": [
          "Kanger Valley National Park",
          "Indravati National Park",
          "Guru Ghasidas National Park",
          "Achanakmar Sanctuary"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Kanger Valley's Kotumsar caves host blind cave fish and the state bird Bastar Hill Myna.",
        "establishedYear": 1982,
        "district": "Bastar",
        "keyFeature": "Kotumsar caves and Bastar Hill Myna sanctuary."
      }
    ]
  },
  "Uttar Pradesh": {
    "stateInfo": {
      "stateName": "Uttar Pradesh",
      "capital": "Lucknow",
      "totalParks": 1,
      "overview": "Uttar Pradesh has 1 National Park in the fertile Terai belt.",
      "tipsForMahi": "Mastering the National Parks of Uttar Pradesh.",
      "parks": [
        {
          "name": "Dudhwa National Park",
          "year": 1977,
          "district": "Lakhimpur Kheri",
          "keyFeature": "Terai swamp deer and tiger sanctuary along Nepal border."
        }
      ]
    },
    "questions": [
      {
        "id": "uttar-pradesh-q1",
        "state": "Uttar Pradesh",
        "parkName": "Dudhwa National Park",
        "question": "In which state is Dudhwa National Park located?",
        "options": [
          "Uttar Pradesh",
          "Bihar",
          "Uttarakhand",
          "Madhya Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Dudhwa National Park is situated in Lakhimpur Kheri district, Uttar Pradesh.",
        "establishedYear": 1977,
        "district": "Lakhimpur Kheri",
        "keyFeature": "Prime Terai ecosystem along the Indo-Nepal international border."
      },
      {
        "id": "uttar-pradesh-q2",
        "state": "Uttar Pradesh",
        "parkName": "Dudhwa National Park",
        "question": "In which district of Uttar Pradesh is Dudhwa National Park situated along the Indo-Nepal border?",
        "options": [
          "Lakhimpur Kheri",
          "Bahraich",
          "Pilibhit",
          "Bareilly"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Dudhwa National Park is located in Lakhimpur Kheri district of Uttar Pradesh.",
        "establishedYear": 1977,
        "district": "Lakhimpur Kheri",
        "keyFeature": "Indo-Nepal border Terai belt."
      },
      {
        "id": "uttar-pradesh-q3",
        "state": "Uttar Pradesh",
        "parkName": "Dudhwa National Park",
        "question": "Which swamp-dwelling deer subspecies was saved from near-extinction in the wet grasslands of Dudhwa, Uttar Pradesh?",
        "options": [
          "Swamp Deer (Northern Barasingha)",
          "Sangai Deer",
          "Kashmiri Hangul",
          "Musk Deer"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Dudhwa National Park protects the largest surviving population of the northern swamp deer (Rucervus duvaucelii duvaucelii).",
        "establishedYear": 1977,
        "district": "Lakhimpur Kheri",
        "keyFeature": "Stronghold of the Northern Swamp Deer."
      },
      {
        "id": "uttar-pradesh-q4",
        "state": "Uttar Pradesh",
        "parkName": "Dudhwa National Park",
        "question": "Which legendary conservationist and hunter-turned-naturalist played a pivotal role in establishing Dudhwa as a National Park in Uttar Pradesh?",
        "options": [
          "Billy Arjan Singh",
          "Jim Corbett",
          "Salim Ali",
          "Kailash Sankhala"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "explanation": "Billy Arjan Singh was the driving force behind saving Dudhwa and its swamp deer and tigers.",
        "establishedYear": 1977,
        "district": "Lakhimpur Kheri",
        "keyFeature": "Billy Arjan Singh's conservation sanctuary."
      },
      {
        "id": "uttar-pradesh-q5",
        "state": "Uttar Pradesh",
        "parkName": "Dudhwa National Park",
        "question": "Which massive pachyderm species was successfully reintroduced to Dudhwa National Park in 1984 from Assam and Nepal?",
        "options": [
          "Greater One-horned Rhinoceros",
          "Wild Water Buffalo",
          "Gaur",
          "Pygmy Hog"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "A population of Greater One-horned Rhinos was reintroduced to Dudhwa in 1984, establishing a thriving breeding herd.",
        "establishedYear": 1977,
        "district": "Lakhimpur Kheri",
        "keyFeature": "Successful rhino reintroduction site in Uttar Pradesh."
      }
    ]
  },
  "Bihar": {
    "stateInfo": {
      "stateName": "Bihar",
      "capital": "Patna",
      "totalParks": 1,
      "overview": "Bihar has 1 National Park on the foothills of the Himalayas.",
      "tipsForMahi": "Mastering the National Parks of Bihar.",
      "parks": [
        {
          "name": "Valmiki National Park",
          "year": 1990,
          "district": "West Champaran",
          "keyFeature": "Contiguous with Chitwan National Park of Nepal along Gandak River."
        }
      ]
    },
    "questions": [
      {
        "id": "bihar-q1",
        "state": "Bihar",
        "parkName": "Valmiki National Park",
        "question": "In which state is Valmiki National Park, the state's sole National Park and Tiger Reserve, located?",
        "options": [
          "Bihar",
          "Jharkhand",
          "Uttar Pradesh",
          "West Bengal"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Valmiki National Park is located in West Champaran district, Bihar.",
        "establishedYear": 1990,
        "district": "West Champaran",
        "keyFeature": "Only National Park in Bihar, contiguous with Nepal's Chitwan National Park."
      },
      {
        "id": "bihar-q2",
        "state": "Bihar",
        "parkName": "Valmiki National Park",
        "question": "In which district of northwestern Bihar is Valmiki National Park situated?",
        "options": [
          "West Champaran",
          "East Champaran",
          "Muzaffarpur",
          "Gaya"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Valmiki National Park is in the West Champaran district bordering Nepal.",
        "establishedYear": 1990,
        "district": "West Champaran",
        "keyFeature": "Shivalik foothills in West Champaran."
      },
      {
        "id": "bihar-q3",
        "state": "Bihar",
        "parkName": "Valmiki National Park",
        "question": "Which Himalayan river forms the international boundary along Valmiki National Park in Bihar?",
        "options": [
          "Gandak River (Narayani)",
          "Kosi River",
          "Son River",
          "Ghaghara River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The River Gandak (known as Narayani in Nepal) flows along the border of Valmiki National Park.",
        "establishedYear": 1990,
        "district": "West Champaran",
        "keyFeature": "Gandak river corridor."
      },
      {
        "id": "bihar-q4",
        "state": "Bihar",
        "parkName": "Valmiki National Park",
        "question": "Valmiki National Park in Bihar is directly contiguous across the Nepal border with which world-famous National Park?",
        "options": [
          "Chitwan National Park",
          "Bardia National Park",
          "Sagarmatha National Park",
          "Langtang National Park"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Valmiki National Park (India) and Chitwan National Park (Nepal) form a single trans-boundary ecological unit.",
        "establishedYear": 1990,
        "district": "West Champaran",
        "keyFeature": "Trans-boundary corridor with Chitwan."
      },
      {
        "id": "bihar-q5",
        "state": "Bihar",
        "parkName": "Valmiki National Park",
        "question": "Which prominent tiger conservation status is held by Valmiki in Bihar as the easternmost extent of Terai sal forest?",
        "options": [
          "Tiger Reserve (Project Tiger)",
          "Elephant Reserve only",
          "Biosphere Reserve",
          "Marine Reserve"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Valmiki was designated as India's 18th Tiger Reserve under Project Tiger.",
        "establishedYear": 1990,
        "district": "West Champaran",
        "keyFeature": "Bihar's only Tiger Reserve."
      }
    ]
  },
  "Jharkhand": {
    "stateInfo": {
      "stateName": "Jharkhand",
      "capital": "Ranchi",
      "totalParks": 1,
      "overview": "Jharkhand has 1 National Park in the Chota Nagpur plateau.",
      "tipsForMahi": "Mastering the National Parks of Jharkhand.",
      "parks": [
        {
          "name": "Betla National Park",
          "year": 1986,
          "district": "Latehar & Palamu",
          "keyFeature": "One of the first tiger reserves under Project Tiger."
        }
      ]
    },
    "questions": [
      {
        "id": "jharkhand-q1",
        "state": "Jharkhand",
        "parkName": "Betla National Park",
        "question": "In which state is Betla National Park located?",
        "options": [
          "Jharkhand",
          "Bihar",
          "Odisha",
          "West Bengal"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Betla National Park is located in Latehar and Palamu districts of Jharkhand.",
        "establishedYear": 1986,
        "district": "Latehar & Palamu",
        "keyFeature": "Located in the Chota Nagpur Plateau, home to elephants and the historic Palamu Forts."
      },
      {
        "id": "jharkhand-q2",
        "state": "Jharkhand",
        "parkName": "Betla National Park",
        "question": "On which mineral-rich geological plateau of Jharkhand is Betla National Park situated?",
        "options": [
          "Chota Nagpur Plateau",
          "Malwa Plateau",
          "Deccan Plateau",
          "Shillong Plateau"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Betla National Park is situated in the western part of the Chota Nagpur Plateau.",
        "establishedYear": 1986,
        "district": "Latehar & Palamu",
        "keyFeature": "Chota Nagpur plateau forests."
      },
      {
        "id": "jharkhand-q3",
        "state": "Jharkhand",
        "parkName": "Betla National Park",
        "question": "The forest area surrounding Betla National Park in Jharkhand holds the historical distinction of conducting the world's first what in 1932?",
        "options": [
          "First Tiger Census based on pugmarks",
          "First Wildlife Sanctuary Act",
          "First Elephant Radio-collaring",
          "First Rhino Census"
        ],
        "correctAnswer": 0,
        "difficulty": "hard",
        "explanation": "The world's first systematic tiger census using pugmark tracking was conducted in Palamu/Betla in 1932.",
        "establishedYear": 1986,
        "district": "Latehar & Palamu",
        "keyFeature": "Site of world's first tiger census (1932)."
      },
      {
        "id": "jharkhand-q4",
        "state": "Jharkhand",
        "parkName": "Betla National Park",
        "question": "Which river flows through the northern part of Betla National Park in Jharkhand?",
        "options": [
          "North Koel River",
          "Damodar River",
          "Subarnarekha River",
          "Barakar River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The North Koel River and its tributaries flow through Betla National Park.",
        "establishedYear": 1986,
        "district": "Latehar & Palamu",
        "keyFeature": "North Koel river drainage."
      },
      {
        "id": "jharkhand-q5",
        "state": "Jharkhand",
        "parkName": "Betla National Park",
        "question": "The ruins of two historical 16th-century forts of the Chero kings are located deep inside which protected area of Jharkhand?",
        "options": [
          "Betla National Park (Palamu)",
          "Dalma Wildlife Sanctuary",
          "Hazaribagh Wildlife Sanctuary",
          "Topchanchi Wildlife Sanctuary"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Purana Qila and Naya Qila of the Chero rulers are historic ruins inside Betla National Park.",
        "establishedYear": 1986,
        "district": "Latehar",
        "keyFeature": "Chero dynasty Palamu Forts inside the jungle."
      }
    ]
  },
  "Arunachal Pradesh": {
    "stateInfo": {
      "stateName": "Arunachal Pradesh",
      "capital": "Itanagar",
      "totalParks": 2,
      "overview": "Arunachal Pradesh has 2 National Parks in the Eastern Himalayas.",
      "tipsForMahi": "Mastering the National Parks of Arunachal Pradesh.",
      "parks": [
        {
          "name": "Namdapha National Park",
          "year": 1983,
          "district": "Changlang",
          "keyFeature": "Only park with 4 big cat species (Tiger, Leopard, Snow Leopard, Clouded Leopard)."
        },
        {
          "name": "Mouling National Park",
          "year": 1986,
          "district": "Upper Siang",
          "keyFeature": "Siang River biodiversity canyon."
        }
      ]
    },
    "questions": [
      {
        "id": "arunachal-pradesh-q1",
        "state": "Arunachal Pradesh",
        "parkName": "Namdapha National Park",
        "question": "In which state is Namdapha National Park, renowned as India's easternmost biodiversity hotspot, located?",
        "options": [
          "Arunachal Pradesh",
          "Assam",
          "Nagaland",
          "Manipur"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Namdapha National Park is located in Changlang district of Arunachal Pradesh near the Myanmar border.",
        "establishedYear": 1983,
        "district": "Changlang",
        "keyFeature": "Only park harboring Tiger, Leopard, Snow Leopard, and Clouded Leopard."
      },
      {
        "id": "arunachal-pradesh-q2",
        "state": "Arunachal Pradesh",
        "parkName": "Mouling National Park",
        "question": "Mouling National Park, situated along the Siang river valley, is located in which state?",
        "options": [
          "Arunachal Pradesh",
          "Mizoram",
          "Tripura",
          "Meghalaya"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mouling National Park is in Upper Siang district of Arunachal Pradesh.",
        "establishedYear": 1986,
        "district": "Upper Siang",
        "keyFeature": "Part of Dihang-Dibang Biosphere Reserve with Takin, Red Panda, and Serow."
      },
      {
        "id": "arunachal-pradesh-q3",
        "state": "Arunachal Pradesh",
        "parkName": "Namdapha National Park",
        "question": "Which river meanders through the tropical and subtropical forests of Namdapha in Arunachal Pradesh?",
        "options": [
          "Noa-Dihing River",
          "Subansiri River",
          "Kameng River",
          "Lohit River"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The Noa-Dihing River flows east-to-west through Namdapha National Park.",
        "establishedYear": 1983,
        "district": "Changlang",
        "keyFeature": "Noa-Dihing river basin."
      },
      {
        "id": "arunachal-pradesh-q4",
        "state": "Arunachal Pradesh",
        "parkName": "Namdapha National Park",
        "question": "Namdapha National Park in Arunachal Pradesh is unique on Earth for sheltering which four big cat species within a single reserve?",
        "options": [
          "Tiger, Common Leopard, Clouded Leopard, and Snow Leopard",
          "Lion, Tiger, Leopard, and Cheetah",
          "Jaguar, Puma, Ocelot, and Margay",
          "Snow Leopard, Caracal, Lynx, and Leopard"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Namdapha spans an elevation range from 200m to 4,500m, allowing tropical tigers, clouded leopards, common leopards, and alpine snow leopards to coexist.",
        "establishedYear": 1983,
        "district": "Changlang",
        "keyFeature": "Four feline species in one park."
      },
      {
        "id": "arunachal-pradesh-q5",
        "state": "Arunachal Pradesh",
        "parkName": "Mouling National Park",
        "question": "Mouling National Park forms the western part of which major Biosphere Reserve in Arunachal Pradesh?",
        "options": [
          "Dihang-Dibang Biosphere Reserve",
          "Manas Biosphere Reserve",
          "Khangchendzonga Biosphere Reserve",
          "Nokrek Biosphere Reserve"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Mouling NP and Dibang Wildlife Sanctuary together constitute the Dihang-Dibang Biosphere Reserve.",
        "establishedYear": 1986,
        "district": "Upper Siang",
        "keyFeature": "Core zone of Dihang-Dibang Biosphere Reserve."
      }
    ]
  },
  "Meghalaya": {
    "stateInfo": {
      "stateName": "Meghalaya",
      "capital": "Shillong",
      "totalParks": 2,
      "overview": "Meghalaya has 2 National Parks in the Garo and South Garo Hills.",
      "tipsForMahi": "Mastering the National Parks of Meghalaya.",
      "parks": [
        {
          "name": "Nokrek Ridge National Park",
          "year": 1988,
          "district": "East Garo Hills",
          "keyFeature": "UNESCO Biosphere Reserve; gene sanctuary for wild citrus (Citrus indica)."
        },
        {
          "name": "Balphakram National Park",
          "year": 1986,
          "district": "South Garo Hills",
          "keyFeature": "Land of perpetual winds and deep gorge canyon."
        }
      ]
    },
    "questions": [
      {
        "id": "meghalaya-q1",
        "state": "Meghalaya",
        "parkName": "Nokrek Ridge National Park",
        "question": "In which state is Nokrek Ridge National Park, the core of the Garo Hills Biosphere Reserve, located?",
        "options": [
          "Meghalaya",
          "Assam",
          "Nagaland",
          "Manipur"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Nokrek Ridge National Park is in East Garo Hills, Meghalaya.",
        "establishedYear": 1986,
        "district": "East Garo Hills",
        "keyFeature": "Global gene sanctuary for Citrus indica (Indian Wild Orange)."
      },
      {
        "id": "meghalaya-q2",
        "state": "Meghalaya",
        "parkName": "Balphakram National Park",
        "question": "Balphakram National Park, traditionally revered by the Garo people as the \"Land of Perpetual Winds\", is located in which state?",
        "options": [
          "Meghalaya",
          "Mizoram",
          "Tripura",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Balphakram National Park is in South Garo Hills, Meghalaya.",
        "establishedYear": 1986,
        "district": "South Garo Hills",
        "keyFeature": "Canyon landscape known as the \"abode of departed spirits\" with Asian Elephants."
      },
      {
        "id": "meghalaya-q3",
        "state": "Meghalaya",
        "parkName": "Nokrek Ridge National Park",
        "question": "Nokrek National Park in Meghalaya was established to conserve the wild genetic ancestor of which cultivated fruit?",
        "options": [
          "Citrus indica (Wild Orange)",
          "Musa balbisiana (Wild Banana)",
          "Mangifera indica (Wild Mango)",
          "Artocarpus (Wild Jackfruit)"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Nokrek is a designated Citrus Gene Sanctuary conserving Citrus indica, the progenitor of cultivated citrus.",
        "establishedYear": 1986,
        "district": "East Garo Hills",
        "keyFeature": "Citrus Gene Sanctuary."
      },
      {
        "id": "meghalaya-q4",
        "state": "Meghalaya",
        "parkName": "Balphakram National Park",
        "question": "Which rare insectivorous plant species is endemic to the rocky plateaus around Balphakram in Meghalaya?",
        "options": [
          "Nepenthes khasiana (Pitcher Plant)",
          "Venus Flytrap",
          "Drosera burmannii",
          "Utricularia aurea"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Nepenthes khasiana, India's only native pitcher plant species, grows wild in Balphakram.",
        "establishedYear": 1986,
        "district": "South Garo Hills",
        "keyFeature": "Pitcher plant sanctuary."
      },
      {
        "id": "meghalaya-q5",
        "state": "Meghalaya",
        "parkName": "Nokrek Ridge National Park",
        "question": "Which endangered arboreal mammal with a ringed tail is found in the bamboo groves of Nokrek, Meghalaya?",
        "options": [
          "Red Panda",
          "Binturong",
          "Slow Loris",
          "Spotted Linsang"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Nokrek is one of the rare surviving habitats of the Red Panda in Meghalaya.",
        "establishedYear": 1986,
        "district": "East Garo Hills",
        "keyFeature": "Red Panda habitat in Garo Hills."
      }
    ]
  },
  "Manipur": {
    "stateInfo": {
      "stateName": "Manipur",
      "capital": "Imphal",
      "totalParks": 2,
      "overview": "Manipur has 2 National Parks including the world's only floating park.",
      "tipsForMahi": "Mastering the National Parks of Manipur.",
      "parks": [
        {
          "name": "Keibul Lamjao National Park",
          "year": 1977,
          "district": "Bishnupur",
          "keyFeature": "World’s only floating national park on Loktak Lake, home to Sangai deer."
        },
        {
          "name": "Shirui National Park",
          "year": 1982,
          "district": "Ukhrul",
          "keyFeature": "Home of the rare Shirui Lily (Lilium mackliniae)."
        }
      ]
    },
    "questions": [
      {
        "id": "manipur-q1",
        "state": "Manipur",
        "parkName": "Keibul Lamjao National Park",
        "question": "In which state is Keibul Lamjao National Park, the world's only floating national park, located?",
        "options": [
          "Manipur",
          "Mizoram",
          "Nagaland",
          "Assam"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Keibul Lamjao is located in Bishnupur district, Manipur.",
        "establishedYear": 1977,
        "district": "Bishnupur",
        "keyFeature": "World's only floating national park on Loktak Lake, saving the Sangai deer."
      },
      {
        "id": "manipur-q2",
        "state": "Manipur",
        "parkName": "Shirui National Park",
        "question": "Shirui National Park, home to the rare and endemic Shirui Lily flower, is located in which state?",
        "options": [
          "Manipur",
          "Meghalaya",
          "Arunachal Pradesh",
          "Sikkim"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Shirui National Park is in Ukhrul district, Manipur.",
        "establishedYear": 1982,
        "district": "Ukhrul",
        "keyFeature": "Shirui Kashong peak where the endemic Shirui Lily (Lilium mackliniae) blooms."
      },
      {
        "id": "manipur-q3",
        "state": "Manipur",
        "parkName": "Keibul Lamjao National Park",
        "question": "Keibul Lamjao National Park floats upon which largest freshwater lake of Northeast India?",
        "options": [
          "Loktak Lake",
          "Dal Lake",
          "Umiam Lake",
          "Rudrasagar Lake"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Keibul Lamjao forms the southern part of Loktak Lake in Manipur.",
        "establishedYear": 1977,
        "district": "Bishnupur",
        "keyFeature": "Floating biomass on Loktak Lake."
      },
      {
        "id": "manipur-q4",
        "state": "Manipur",
        "parkName": "Keibul Lamjao National Park",
        "question": "What are the floating heterogeneous masses of vegetation and soil called upon which Keibul Lamjao floats in Manipur?",
        "options": [
          "Phumdis",
          "Char lands",
          "Bheels",
          "Khazans"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The floating mats of soil, organic matter, and vegetation are known locally as Phumdis.",
        "establishedYear": 1977,
        "district": "Bishnupur",
        "keyFeature": "Phumdi floating ecosystem."
      },
      {
        "id": "manipur-q5",
        "state": "Manipur",
        "parkName": "Keibul Lamjao National Park",
        "question": "Which critically endangered deer species, the state animal of Manipur known as the \"dancing deer\", is endemic to Keibul Lamjao?",
        "options": [
          "Sangai (Rucervus eldii eldii)",
          "Hangul (Kashmir Stag)",
          "Barasingha (Swamp Deer)",
          "Musk Deer"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "The Sangai or dancing deer is found exclusively on the phumdis of Keibul Lamjao National Park.",
        "establishedYear": 1977,
        "district": "Bishnupur",
        "keyFeature": "Sole home of the endangered Sangai deer."
      }
    ]
  },
  "Mizoram": {
    "stateInfo": {
      "stateName": "Mizoram",
      "capital": "Aizawl",
      "totalParks": 2,
      "overview": "Mizoram has 2 National Parks in the Lushai hills.",
      "tipsForMahi": "Mastering the National Parks of Mizoram.",
      "parks": [
        {
          "name": "Murlen National Park",
          "year": 1991,
          "district": "Champhai",
          "keyFeature": "Dense canopy forest where only 1% sunlight penetrates."
        },
        {
          "name": "Phawngpui Blue Mountain National Park",
          "year": 1992,
          "district": "Lawngtlai",
          "keyFeature": "Protects Mizoram's highest peak (Blue Mountain)."
        }
      ]
    },
    "questions": [
      {
        "id": "mizoram-q1",
        "state": "Mizoram",
        "parkName": "Murlen National Park",
        "question": "In which state is Murlen National Park, renowned for its impenetrable virgin sub-tropical evergreen forest canopy, located?",
        "options": [
          "Mizoram",
          "Manipur",
          "Nagaland",
          "Tripura"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Murlen National Park is situated in Champhai district, Mizoram near the Myanmar border.",
        "establishedYear": 1991,
        "district": "Champhai",
        "keyFeature": "Dense canopy dubbed \"land of losing one's way\", sheltering Blyth's Tragopan."
      },
      {
        "id": "mizoram-q2",
        "state": "Mizoram",
        "parkName": "Phawngpui Blue Mountain National Park",
        "question": "Phawngpui Blue Mountain National Park, named after the highest mountain peak in the state, is located in which state?",
        "options": [
          "Mizoram",
          "Meghalaya",
          "Assam",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Phawngpui National Park is in Lawngtlai district of southern Mizoram.",
        "establishedYear": 1992,
        "district": "Lawngtlai",
        "keyFeature": "Highest peak of Mizoram (2,157m), revered as the abode of the gods."
      },
      {
        "id": "mizoram-q3",
        "state": "Mizoram",
        "parkName": "Phawngpui Blue Mountain National Park",
        "question": "What is the popular English nickname of Phawngpui peak in Mizoram?",
        "options": [
          "Blue Mountain",
          "Green Mountain",
          "Cloud Peak",
          "Sacred Crest"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Phawngpui is widely known as the Blue Mountain of Mizoram.",
        "establishedYear": 1992,
        "district": "Lawngtlai",
        "keyFeature": "The Blue Mountain of Mizoram."
      },
      {
        "id": "mizoram-q4",
        "state": "Mizoram",
        "parkName": "Murlen National Park",
        "question": "Which state bird of Mizoram, a rare and beautifully plumaged forest pheasant, is protected in Murlen and Phawngpui?",
        "options": [
          "Mrs. Hume's Pheasant (Vavu)",
          "Blyth's Tragopan",
          "Himalayan Monal",
          "Blood Pheasant"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Mrs. Hume's Pheasant (Syrmaticus humiae) is the state bird of Mizoram and thrives in Murlen and Phawngpui.",
        "establishedYear": 1991,
        "district": "Champhai",
        "keyFeature": "Mrs. Hume's Pheasant habitat."
      },
      {
        "id": "mizoram-q5",
        "state": "Mizoram",
        "parkName": "Murlen National Park",
        "question": "Murlen National Park in Mizoram is situated along the international border of India with which country?",
        "options": [
          "Myanmar",
          "Bangladesh",
          "Bhutan",
          "China"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Murlen lies in eastern Mizoram close to the Chin Hills across the border in Myanmar.",
        "establishedYear": 1991,
        "district": "Champhai",
        "keyFeature": "Indo-Myanmar biodiversity border."
      }
    ]
  },
  "Nagaland": {
    "stateInfo": {
      "stateName": "Nagaland",
      "capital": "Kohima",
      "totalParks": 1,
      "overview": "Nagaland has 1 National Park in the Peren district.",
      "tipsForMahi": "Mastering the National Parks of Nagaland.",
      "parks": [
        {
          "name": "Intanki (Ntangki) National Park",
          "year": 1993,
          "district": "Peren",
          "keyFeature": "Habitat of the Hoolock Gibbon and Great Indian Hornbill."
        }
      ]
    },
    "questions": [
      {
        "id": "nagaland-q1",
        "state": "Nagaland",
        "parkName": "Intanki (Ntangki) National Park",
        "question": "In which state is Intanki (Ntangki) National Park located?",
        "options": [
          "Nagaland",
          "Manipur",
          "Assam",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Intanki National Park is located in Peren district, Nagaland.",
        "establishedYear": 1993,
        "district": "Peren",
        "keyFeature": "Only National Park in Nagaland, preserving equatorial-type rainforest."
      },
      {
        "id": "nagaland-q2",
        "state": "Nagaland",
        "parkName": "Intanki (Ntangki) National Park",
        "question": "In which district of southwestern Nagaland is Intanki National Park situated?",
        "options": [
          "Peren",
          "Kohima",
          "Dimapur",
          "Mokokchung"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Intanki National Park is located in Peren district of Nagaland.",
        "establishedYear": 1993,
        "district": "Peren",
        "keyFeature": "Peren district rainforest."
      },
      {
        "id": "nagaland-q3",
        "state": "Nagaland",
        "parkName": "Intanki (Ntangki) National Park",
        "question": "Which tailless primate, the only ape species found anywhere in India, has a prime habitat in Intanki National Park, Nagaland?",
        "options": [
          "Western Hoolock Gibbon",
          "Golden Langur",
          "Lion-tailed Macaque",
          "Slow Loris"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "The Hoolock Gibbon (Hoolock hoolock) is India's only ape species and a flagship animal of Intanki.",
        "establishedYear": 1993,
        "district": "Peren",
        "keyFeature": "Habitat for the Hoolock Gibbon."
      },
      {
        "id": "nagaland-q4",
        "state": "Nagaland",
        "parkName": "Intanki (Ntangki) National Park",
        "question": "Which river drainage basin encompasses the lowland semi-evergreen forests of Intanki National Park in Nagaland?",
        "options": [
          "Dhansiri River basin",
          "Barak River basin",
          "Doyang River basin",
          "Tizu River basin"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Intanki is drained by the Dhansiri river system flowing towards the Brahmaputra.",
        "establishedYear": 1993,
        "district": "Peren",
        "keyFeature": "Dhansiri river valley ecosystem."
      },
      {
        "id": "nagaland-q5",
        "state": "Nagaland",
        "parkName": "Intanki (Ntangki) National Park",
        "question": "Which endangered pheasant species and state bird of Nagaland can be found in the undisturbed canopies of Intanki?",
        "options": [
          "Blyth's Tragopan",
          "Satyr Tragopan",
          "Western Tragopan",
          "Kalij Pheasant"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Blyth's Tragopan (Tragopan blythii) is the state bird of Nagaland and inhabits its montane forests.",
        "establishedYear": 1993,
        "district": "Peren",
        "keyFeature": "Blyth's Tragopan sanctuary."
      }
    ]
  },
  "Tripura": {
    "stateInfo": {
      "stateName": "Tripura",
      "capital": "Agartala",
      "totalParks": 2,
      "overview": "Tripura has 2 National Parks in the Sipahijala and South Tripura districts.",
      "tipsForMahi": "Mastering the National Parks of Tripura.",
      "parks": [
        {
          "name": "Clouded Leopard National Park",
          "year": 2007,
          "district": "Sipahijala",
          "keyFeature": "Dedicated sanctuary for the elusive Clouded Leopard."
        },
        {
          "name": "Rajbari (Bison) National Park",
          "year": 2007,
          "district": "South Tripura (Trishna)",
          "keyFeature": "Protected habitat for Indian Gaur (Bison)."
        }
      ]
    },
    "questions": [
      {
        "id": "tripura-q1",
        "state": "Tripura",
        "parkName": "Clouded Leopard National Park",
        "question": "In which state is Clouded Leopard National Park located?",
        "options": [
          "Tripura",
          "Mizoram",
          "Assam",
          "Meghalaya"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Clouded Leopard National Park is located inside the Sipahijala Wildlife Sanctuary, Tripura.",
        "establishedYear": 2007,
        "district": "Sipahijala",
        "keyFeature": "Dedicated to the conservation of the arboreal Clouded Leopard."
      },
      {
        "id": "tripura-q2",
        "state": "Tripura",
        "parkName": "Rajbari (Bison) National Park",
        "question": "Rajbari (Bison) National Park, famous for its population of Indian Gaur, is located in which state?",
        "options": [
          "Tripura",
          "West Bengal",
          "Odisha",
          "Jharkhand"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Rajbari National Park is located in South Tripura district.",
        "establishedYear": 2007,
        "district": "South Tripura",
        "keyFeature": "Core area of Trishna Wildlife Sanctuary protecting the Indian Gaur (Bison)."
      },
      {
        "id": "tripura-q3",
        "state": "Tripura",
        "parkName": "Clouded Leopard National Park",
        "question": "Clouded Leopard National Park was carved out of which existing protected wildlife sanctuary in Tripura?",
        "options": [
          "Sipahijala Wildlife Sanctuary",
          "Trishna Wildlife Sanctuary",
          "Gumti Wildlife Sanctuary",
          "Rowa Wildlife Sanctuary"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Clouded Leopard National Park covers a portion of Sipahijala Wildlife Sanctuary.",
        "establishedYear": 2007,
        "district": "Sipahijala",
        "keyFeature": "Sipahijala wildlife reserve."
      },
      {
        "id": "tripura-q4",
        "state": "Tripura",
        "parkName": "Rajbari (Bison) National Park",
        "question": "Rajbari National Park in Tripura is celebrated for sheltering herds of which massive wild bovine?",
        "options": [
          "Indian Gaur (Bos gaurus)",
          "Wild Water Buffalo",
          "Banteng",
          "Yak"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Rajbari National Park is renowned for the Indian Gaur (popularly called Indian Bison).",
        "establishedYear": 2007,
        "district": "South Tripura",
        "keyFeature": "Prime habitat for Indian Gaur."
      },
      {
        "id": "tripura-q5",
        "state": "Tripura",
        "parkName": "Clouded Leopard National Park",
        "question": "Which rare primate species with spectacled white eye rings is famously bred in Sipahijala / Clouded Leopard NP in Tripura?",
        "options": [
          "Phayre's Leaf Monkey (Phayre's Langur)",
          "Golden Langur",
          "Gee's Langur",
          "Capped Langur"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "Phayre's Leaf Monkey (Trachypithecus phayrei) is the state animal of Tripura and a prized resident of Sipahijala.",
        "establishedYear": 2007,
        "district": "Sipahijala",
        "keyFeature": "Phayre's Langur conservation breeding program."
      }
    ]
  },
  "Sikkim": {
    "stateInfo": {
      "stateName": "Sikkim",
      "capital": "Gangtok",
      "totalParks": 1,
      "overview": "Sikkim has 1 National Park crowned by the world's 3rd highest peak.",
      "tipsForMahi": "Mastering the National Parks of Sikkim.",
      "parks": [
        {
          "name": "Khangchendzonga National Park",
          "year": 1977,
          "district": "North & West Sikkim",
          "keyFeature": "India’s only Mixed UNESCO World Heritage Site around Mt. Kanchenjunga."
        }
      ]
    },
    "questions": [
      {
        "id": "sikkim-q1",
        "state": "Sikkim",
        "parkName": "Khangchendzonga National Park",
        "question": "In which state is Khangchendzonga National Park, India's only UNESCO Mixed World Heritage Site, located?",
        "options": [
          "Sikkim",
          "Uttarakhand",
          "Himachal Pradesh",
          "Arunachal Pradesh"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Khangchendzonga National Park is located in North and West Sikkim.",
        "establishedYear": 1977,
        "district": "Mangan & Gyalshing",
        "keyFeature": "UNESCO Mixed Heritage Site encompassing Mount Kanchenjunga (8,586m)."
      },
      {
        "id": "sikkim-q2",
        "state": "Sikkim",
        "parkName": "Khangchendzonga National Park",
        "question": "Khangchendzonga National Park surrounds the world's third-highest mountain peak named what?",
        "options": [
          "Mount Kanchenjunga (8,586 m)",
          "Mount Everest",
          "K2 (Godwin Austen)",
          "Nanda Devi"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mount Kanchenjunga (8,586 m) rises directly above the national park.",
        "establishedYear": 1977,
        "district": "North & West Sikkim",
        "keyFeature": "Third highest mountain on Earth."
      },
      {
        "id": "sikkim-q3",
        "state": "Sikkim",
        "parkName": "Khangchendzonga National Park",
        "question": "Which massive glacier, the largest in the Eastern Himalayas, originates inside Khangchendzonga National Park, Sikkim?",
        "options": [
          "Zemu Glacier",
          "Gangotri Glacier",
          "Siachen Glacier",
          "Pindari Glacier"
        ],
        "correctAnswer": 0,
        "difficulty": "medium",
        "explanation": "The 26-kilometer-long Zemu Glacier flows down the eastern flank of Kanchenjunga inside the park.",
        "establishedYear": 1977,
        "district": "Mangan",
        "keyFeature": "Zemu Glacier, source of the Teesta River."
      },
      {
        "id": "sikkim-q4",
        "state": "Sikkim",
        "parkName": "Khangchendzonga National Park",
        "question": "Which elusive high-altitude predator, the \"ghost of the mountains\", is protected in the alpine zones of Khangchendzonga?",
        "options": [
          "Snow Leopard (Panthera uncia)",
          "Clouded Leopard",
          "Tibetan Lynx",
          "Asiatic Cheetah"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Khangchendzonga National Park is a critical high-altitude sanctuary for the Snow Leopard.",
        "establishedYear": 1977,
        "district": "North Sikkim",
        "keyFeature": "Snow Leopard habitat in alpine meadows."
      },
      {
        "id": "sikkim-q5",
        "state": "Sikkim",
        "parkName": "Khangchendzonga National Park",
        "question": "Which bushy-tailed mammal with fiery red fur and the state animal of Sikkim lives in the temperate bamboo forests of Khangchendzonga?",
        "options": [
          "Red Panda (Ailurus fulgens)",
          "Himalayan Black Bear",
          "Musk Deer",
          "Takin"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "The Red Panda is the state animal of Sikkim and thrives in the subalpine bamboo forests of the park.",
        "establishedYear": 1977,
        "district": "Sikkim",
        "keyFeature": "State animal Red Panda sanctuary."
      }
    ]
  },
  "Andaman & Nicobar Islands": {
    "stateInfo": {
      "stateName": "Andaman and Nicobar Islands",
      "capital": "Port Blair",
      "totalParks": 9,
      "overview": "Andaman & Nicobar Islands have 9 National Parks protecting pristine coral reefs and tropical rainforests.",
      "tipsForMahi": "Mastering the National Parks of Andaman & Nicobar Islands.",
      "parks": [
        {
          "name": "Mahatma Gandhi Marine National Park",
          "year": 1983,
          "district": "South Andaman (Wandoor)",
          "keyFeature": "Famous coral reef marine park at Wandoor."
        },
        {
          "name": "Rani Jhansi Marine National Park",
          "year": 1996,
          "district": "Ritchie's Archipelago",
          "keyFeature": "Protected coral lagoons and mangrove channels."
        },
        {
          "name": "Campbell Bay National Park",
          "year": 1992,
          "district": "Great Nicobar",
          "keyFeature": "Part of Great Nicobar Biosphere Reserve."
        },
        {
          "name": "Galathea Bay National Park",
          "year": 1992,
          "district": "Great Nicobar",
          "keyFeature": "Giant Leatherback Turtle nesting haven."
        },
        {
          "name": "Saddle Peak National Park",
          "year": 1979,
          "district": "North Andaman",
          "keyFeature": "Highest peak in the Andaman and Nicobar archipelago."
        },
        {
          "name": "Mount Harriet (Mount Manipur) National Park",
          "year": 1987,
          "district": "South Andaman",
          "keyFeature": "Commemorates Anglo-Manipur war; featured on ₹20 currency note."
        },
        {
          "name": "North Button Island National Park",
          "year": 1979,
          "district": "South Andaman",
          "keyFeature": "Pristine island coral sanctuary."
        },
        {
          "name": "Middle Button Island National Park",
          "year": 1979,
          "district": "South Andaman",
          "keyFeature": "Spotted deer and marine life haven."
        },
        {
          "name": "South Button Island National Park",
          "year": 1979,
          "district": "South Andaman",
          "keyFeature": "Smallest National Park in India (only 0.03 sq km)."
        }
      ]
    },
    "questions": [
      {
        "id": "andaman-nicobar-islands-q1",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Mahatma Gandhi Marine National Park",
        "question": "In which state is Mahatma Gandhi Marine National Park located?",
        "options": [
          "Andaman & Nicobar Islands",
          "Lakshadweep",
          "Tamil Nadu",
          "Kerala"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Mahatma Gandhi Marine National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1983,
        "district": "South Andaman (Wandoor)",
        "keyFeature": "Famous coral reef marine park at Wandoor."
      },
      {
        "id": "andaman-nicobar-islands-q2",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Rani Jhansi Marine National Park",
        "question": "In which state is Rani Jhansi Marine National Park located?",
        "options": [
          "Tamil Nadu",
          "Andaman & Nicobar Islands",
          "Kerala",
          "Goa"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Rani Jhansi Marine National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1996,
        "district": "Ritchie's Archipelago",
        "keyFeature": "Protected coral lagoons and mangrove channels."
      },
      {
        "id": "andaman-nicobar-islands-q3",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Campbell Bay National Park",
        "question": "In which state is Campbell Bay National Park located?",
        "options": [
          "Kerala",
          "Goa",
          "Andaman & Nicobar Islands",
          "Andhra Pradesh"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "Campbell Bay National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1992,
        "district": "Great Nicobar",
        "keyFeature": "Part of Great Nicobar Biosphere Reserve."
      },
      {
        "id": "andaman-nicobar-islands-q4",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Galathea Bay National Park",
        "question": "In which state is Galathea Bay National Park located?",
        "options": [
          "Goa",
          "Andhra Pradesh",
          "Lakshadweep",
          "Andaman & Nicobar Islands"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Galathea Bay National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1992,
        "district": "Great Nicobar",
        "keyFeature": "Giant Leatherback Turtle nesting haven."
      },
      {
        "id": "andaman-nicobar-islands-q5",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Saddle Peak National Park",
        "question": "In which state is Saddle Peak National Park located?",
        "options": [
          "Andaman & Nicobar Islands",
          "Andhra Pradesh",
          "Lakshadweep",
          "Tamil Nadu"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "Saddle Peak National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1979,
        "district": "North Andaman",
        "keyFeature": "Highest peak in the Andaman and Nicobar archipelago."
      },
      {
        "id": "andaman-nicobar-islands-q6",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Mount Harriet (Mount Manipur) National Park",
        "question": "In which state is Mount Harriet (Mount Manipur) National Park located?",
        "options": [
          "Lakshadweep",
          "Andaman & Nicobar Islands",
          "Tamil Nadu",
          "Kerala"
        ],
        "correctAnswer": 1,
        "difficulty": "easy",
        "explanation": "Mount Harriet (Mount Manipur) National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1987,
        "district": "South Andaman",
        "keyFeature": "Commemorates Anglo-Manipur war; featured on ₹20 currency note."
      },
      {
        "id": "andaman-nicobar-islands-q7",
        "state": "Andaman and Nicobar Islands",
        "parkName": "North Button Island National Park",
        "question": "In which state is North Button Island National Park located?",
        "options": [
          "Tamil Nadu",
          "Kerala",
          "Andaman & Nicobar Islands",
          "Goa"
        ],
        "correctAnswer": 2,
        "difficulty": "easy",
        "explanation": "North Button Island National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1979,
        "district": "South Andaman",
        "keyFeature": "Pristine island coral sanctuary."
      },
      {
        "id": "andaman-nicobar-islands-q8",
        "state": "Andaman and Nicobar Islands",
        "parkName": "Middle Button Island National Park",
        "question": "In which state is Middle Button Island National Park located?",
        "options": [
          "Kerala",
          "Goa",
          "Andhra Pradesh",
          "Andaman & Nicobar Islands"
        ],
        "correctAnswer": 3,
        "difficulty": "easy",
        "explanation": "Middle Button Island National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1979,
        "district": "South Andaman",
        "keyFeature": "Spotted deer and marine life haven."
      },
      {
        "id": "andaman-nicobar-islands-q9",
        "state": "Andaman and Nicobar Islands",
        "parkName": "South Button Island National Park",
        "question": "In which state is South Button Island National Park located?",
        "options": [
          "Andaman & Nicobar Islands",
          "Goa",
          "Andhra Pradesh",
          "Lakshadweep"
        ],
        "correctAnswer": 0,
        "difficulty": "easy",
        "explanation": "South Button Island National Park is located in Andaman & Nicobar Islands.",
        "establishedYear": 1979,
        "district": "South Andaman",
        "keyFeature": "Smallest National Park in India (only 0.03 sq km)."
      }
    ]
  }
};

// State Name Aliases for flexible matching
STATE_REPOSITORIES['Andaman and Nicobar Islands'] = STATE_REPOSITORIES['Andaman & Nicobar Islands'];
STATE_REPOSITORIES['Jammu & Kashmir'] = STATE_REPOSITORIES['Jammu and Kashmir'];
