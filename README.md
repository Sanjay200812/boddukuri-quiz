# Boddukuri's Quiz #Mahi 🌿
**Learn. Revise. Remember. Achieve.**

An educational quiz and daily learning web application designed for **Mahi** to learn and master the **National Parks of India** using a **Cumulative Daily Learning System**.

---

## 🌟 Current Quiz Status: Day 01 (Fixed Date: 09 November 2026)

Currently, the application is strictly configured with **Day 01 ONLY**:
- **Day Number**: 01
- **Quiz Date**: 09-11-2026
- **Display Date**: 09 November 2026
- **Status**: Available
- **Questions**: Exactly 30 questions (approx. 5 per state)
- **Six Foundational States Covered**:
  1. *Madhya Pradesh* (5 Questions)
  2. *Andhra Pradesh* (5 Questions)
  3. *Telangana* (5 Questions)
  4. *Kerala* (5 Questions)
  5. *Assam* (5 Questions)
  6. *Karnataka* (5 Questions)

No future days or future dates are displayed on the dashboard.

### 🔮 Future Expansion Architecture
The application architecture is 100% prepared for cumulative daily quizzes. When you provide a new state in the future and explicitly request the next day's quiz, simply add Day 02 to `DAILY_CONFIGS` in `src/data/quizzes.ts`:
- It will automatically retain all six previous states (*Madhya Pradesh*, *Andhra Pradesh*, *Telangana*, *Kerala*, *Assam*, *Karnataka*)
- Add the new state to the cumulative pool
- Distribute 30 questions evenly across all 7 states
- Preserve all existing user attempts and score history without any deletion.

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
