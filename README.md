# Boddukuri's Quiz #Mahi 🌿
**Learn. Revise. Remember. Achieve.**

An educational quiz and daily learning web application designed for **Mahi** to learn and master the **National Parks of India** using a **Cumulative Daily Learning System**.

---

## 🌟 The Cumulative Learning System

Unlike static one-state quizzes, **Boddukuri's Quiz** builds permanent memory through spaced cumulative repetition:

- **Day 01**: Features all **6 foundational states** (30 questions, 5 per state):
  1. *Madhya Pradesh*
  2. *Andhra Pradesh*
  3. *Telangana*
  4. *Kerala*
  5. *Assam*
  6. *Karnataka*
- **Day 02**: Introduces *Tamil Nadu* → The quiz pool automatically contains **all 6 previous states + Tamil Nadu** (7 states = 30 questions evenly balanced).
- **Day 03**: Introduces *Rajasthan* → The quiz pool automatically contains **all 7 previous states + Rajasthan** (8 states = 30 questions).
- **Subsequent Days**: When new states are added, previously learned states are **never removed** from the pool. Every quiz balances revision from prior states with questions on the new state!

---

## 📱 WhatsApp Sharing Integration

When Mahi completes a quiz, clicking **"Share My Result on WhatsApp"** formats a message pre-filled to Sanju's WhatsApp (`917075920852`):

```
🌿 BODDUKURI'S QUIZ

🎉 #Mahi – Day 01 Completed!

📚 States Covered:
Madhya Pradesh, Andhra Pradesh, Telangana, Kerala, Assam and Karnataka.

📊 Result:
Marks: 28/30
Correct: 28
Incorrect: 2
Percentage: 93%

🏆 Performance: Outstanding!

"Every day you learn something new, you become a better version of yourself."

Keep learning, Mahi! 💚
```

---

## 🛠 Central Daily Update Architecture

To add a new day, open `src/data/quizzes.ts` and simply append a new entry to `DAILY_CONFIGS`:

```typescript
{
  dayNumber: 4,
  title: 'Day 04',
  newStates: ['Gujarat'],
  totalQuestions: 30
}
```

The system will automatically:
1. Find all previously added states.
2. Add the new state to the cumulative learning pool.
3. Generate a balanced 30-question quiz representing every state in the pool.
4. Maintain previous quiz days and preserve all progress in LocalStorage.

---

## 📊 Dashboard Metrics

The home dashboard displays:
- **Total states learned**: Unique states mastered through completed days
- **Total completed days**: Number of daily quizzes cleared
- **Total quizzes attempted**: Total sessions taken (including reattempts)
- **Overall marks**: Points obtained across best scores
- **Overall accuracy**: Percentage across best scores
- **Current streak**: Consecutive daily learning streak

---

## 🚀 Running the App Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```
