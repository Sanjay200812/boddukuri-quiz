import { jsPDF } from 'jspdf';
import type { DailyQuiz, QuizAttempt } from '../types/quiz';

/**
 * Generates a clean, readable, mobile-friendly PDF containing:
 * - Day number & date
 * - State names and overviews
 * - National parks fact sheets (establishment year, district, key features, wildlife)
 * - Complete 30-question quiz bank
 * - Correct answer key with detailed factual explanations
 */
export function generateDayNotesPDF(quiz: DailyQuiz): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      renderRunningHeader();
    }
  };

  const renderRunningHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61); // Forest Green
    doc.text("BODDUKURI'S QUIZ #MAHI — DAILY NATIONAL PARKS STUDY NOTES", margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text(`${quiz.title} • ${quiz.displayDate || quiz.quizDate}`, pageWidth - margin, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // ---------------------------------------------------------------------------
  // COVER / TOP TITLE HEADER
  // ---------------------------------------------------------------------------
  doc.setFillColor(15, 81, 50); // Deep Forest Green Header Box
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("BODDUKURI'S QUIZ #MAHI", margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 215);
  doc.text("Learn. Revise. Remember. Achieve. • National Parks of India Spaced Repetition", margin + 6, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${quiz.title}: ${quiz.displayDate} (${quiz.quizDate}) — ${quiz.statesCovered.length} States Pool`, margin + 6, y + 21);

  y += 32;

  // ---------------------------------------------------------------------------
  // SECTION 1: STATES COVERED & OVERVIEW
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(`1. STATES COVERED IN TODAY'S LEARNING POOL (${quiz.statesCovered.length})`, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const statesListText = `States: ${quiz.statesCovered.join(', ')}.`;
  const splitStates = doc.splitTextToSize(statesListText, contentWidth);
  doc.text(splitStates, margin, y);
  y += splitStates.length * 4.5 + 4;

  // State overviews
  if (quiz.stateInfoList && quiz.stateInfoList.length > 0) {
    quiz.stateInfoList.forEach(st => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(21, 128, 61);
      doc.text(`• ${st.stateName} (Capital: ${st.capital}, Total Notified Parks: ${st.totalParks})`, margin, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const overviewLines = doc.splitTextToSize(st.overview, contentWidth - 4);
      doc.text(overviewLines, margin + 4, y);
      y += overviewLines.length * 4 + 2;

      if (st.tipsForMahi) {
        checkPageBreak(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(180, 83, 9); // Amber 700
        const tipLines = doc.splitTextToSize(`Mahi's Memory Tip: ${st.tipsForMahi}`, contentWidth - 4);
        doc.text(tipLines, margin + 4, y);
        y += tipLines.length * 4 + 3;
      }
    });
  }

  y += 4;

  // ---------------------------------------------------------------------------
  // SECTION 2: NATIONAL PARKS FACT SHEETS
  // ---------------------------------------------------------------------------
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("2. VERIFIED NATIONAL PARKS FACT REPOSITORY", margin, y);
  y += 6;

  if (quiz.stateInfoList && quiz.stateInfoList.length > 0) {
    quiz.stateInfoList.forEach(st => {
      if (st.parks && st.parks.length > 0) {
        st.parks.forEach(park => {
          checkPageBreak(22);
          doc.setFillColor(245, 250, 246);
          doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'F');
          doc.setDrawColor(210, 230, 215);
          doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'D');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`${park.name} (${st.stateName})`, margin + 3, y + 4.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text(`District: ${park.district} | Estd: ${park.year}${park.riverOrBiome ? ` | River/Biome: ${park.riverOrBiome}` : ''}`, margin + 3, y + 9);

          doc.setTextColor(15, 81, 50);
          const keyFactText = `Key Feature: ${park.keyFeature}${park.famousWildlife?.length ? ` | Wildlife: ${park.famousWildlife.join(', ')}` : ''}`;
          const splitKeyFact = doc.splitTextToSize(keyFactText, contentWidth - 6);
          doc.text(splitKeyFact[0] || '', margin + 3, y + 13.5);

          y += 21;
        });
      }
    });
  }

  y += 4;

  // ---------------------------------------------------------------------------
  // SECTION 3: 30-QUESTION QUIZ BANK & ANSWER KEY WITH EXPLANATIONS
  // ---------------------------------------------------------------------------
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`3. DAILY QUIZ QUESTION BANK & ANSWER KEY (${quiz.questions.length} QUESTIONS)`, margin, y);
  y += 7;

  quiz.questions.forEach((q, idx) => {
    checkPageBreak(30);

    // Question number & title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const qHeader = `Q${idx + 1}. [${q.state}${q.parkName ? ` • ${q.parkName}` : ''}]`;
    doc.text(qHeader, margin, y);
    y += 4.5;

    // Question body
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const qTextLines = doc.splitTextToSize(q.question, contentWidth - 4);
    doc.text(qTextLines, margin + 2, y);
    y += qTextLines.length * 4 + 2;

    // Options (A, B, C, D)
    const optionLabels = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, optIdx) => {
      checkPageBreak(6);
      const isCorrect = optIdx === q.correctAnswer;
      doc.setFont('helvetica', isCorrect ? 'bold' : 'normal');
      doc.setFontSize(8);
      if (isCorrect) {
        doc.setTextColor(21, 128, 61); // Green for correct
        doc.text(`  (${optionLabels[optIdx]}) ${opt}  [CORRECT ANSWER]`, margin + 2, y);
      } else {
        doc.setTextColor(100, 116, 139);
        doc.text(`  (${optionLabels[optIdx]}) ${opt}`, margin + 2, y);
      }
      y += 3.8;
    });

    // Explanation Box
    checkPageBreak(12);
    y += 1;
    doc.setFillColor(240, 253, 244); // Light Green
    doc.roundedRect(margin + 2, y, contentWidth - 4, 10, 1, 1, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    const explLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 8);
    doc.text(explLines, margin + 4, y + 4);
    y += Math.max(10, explLines.length * 3.5 + 4) + 4;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Boddukuri's Quiz #Mahi — Learn. Revise. Remember. Achieve. | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Trigger download
  const safeFilename = `Boddukuris_Quiz_${quiz.title.replace(/\s+/g, '_')}_Notes.pdf`;
  doc.save(safeFilename);
}

/**
 * Generates an official Admin Answer Sheet Inspection PDF for a specific quiz attempt.
 * Contains:
 * - Student Name, Quiz Day, Date, Score, Percentage, Time Taken, Performance
 * - Every Question with full options
 * - Mahi's Selected Answer
 * - Correct Answer
 * - Status: CORRECT, INCORRECT, UNANSWERED
 * - Explanation and State details
 */
export function generateAnswerSheetPDF(attempt: QuizAttempt, quiz: DailyQuiz): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      renderRunningHeader();
    }
  };

  const renderRunningHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61); // Forest Green
    doc.text("BODDUKURI'S QUIZ — ADMIN ANSWER SHEET INSPECTOR", margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`${quiz.title} • Student: ${attempt.studentName || 'Mahi'}`, pageWidth - margin, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // COVER HEADER
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("BODDUKURI'S QUIZ — STUDENT ANSWER SHEET", margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Student: ${attempt.studentName || 'Mahi'}  |  Access Code: 2002  |  Quiz: ${quiz.title}`, margin + 6, y + 14);
  doc.text(`Submission Date: ${attempt.formattedDate || quiz.displayDate}  |  Duration: ${Math.floor(attempt.timeTakenSeconds / 60)}m ${attempt.timeTakenSeconds % 60}s`, margin + 6, y + 19);

  // Score Pills in Header
  doc.setFillColor(21, 128, 61); // Green pill
  doc.roundedRect(margin + 6, y + 23, 38, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Score: ${attempt.marksObtained}/${attempt.maxMarks} (${attempt.percentage}%)`, margin + 8, y + 27.5);

  doc.setFillColor(30, 41, 59); // Slate pill
  doc.roundedRect(margin + 48, y + 23, 36, 7, 1.5, 1.5, 'F');
  doc.setTextColor(148, 163, 184);
  doc.text(`Correct: ${attempt.correctCount}  |  Wrong: ${attempt.incorrectCount}`, margin + 50, y + 27.5);

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 88, y + 23, 48, 7, 1.5, 1.5, 'F');
  doc.setTextColor(245, 158, 11);
  doc.text(`Status: ${attempt.performanceMessage || 'Completed'}`, margin + 90, y + 27.5);

  y += 40;

  // Question-by-Question Section
  const optionLabels = ['A', 'B', 'C', 'D'];

  quiz.questions.forEach((q, idx) => {
    checkPageBreak(38);

    const qNumStr = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
    const selectedIdx = attempt.answers ? attempt.answers[q.id] : undefined;
    const isUnanswered = selectedIdx === undefined || selectedIdx === -1;
    const isCorrect = !isUnanswered && selectedIdx === q.correctAnswer;

    // Card background
    if (isCorrect) {
      doc.setFillColor(240, 253, 244); // Soft Green
      doc.setDrawColor(187, 247, 208);
    } else if (isUnanswered) {
      doc.setFillColor(248, 250, 252); // Soft Slate
      doc.setDrawColor(226, 232, 240);
    } else {
      doc.setFillColor(254, 242, 242); // Soft Rose
      doc.setDrawColor(254, 202, 202);
    }

    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

    // Question Number & Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Question ${qNumStr}: ${q.question}`, margin + 4, y + 6);

    // State Tag
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`State: ${q.state}`, pageWidth - margin - 4, y + 6, { align: 'right' });

    // Options layout (two columns)
    doc.setFontSize(7.5);
    q.options.forEach((opt, optIdx) => {
      const col = optIdx % 2;
      const row = Math.floor(optIdx / 2);
      const optX = margin + 4 + col * (contentWidth / 2);
      const optY = y + 11 + row * 4.5;

      const isThisCorrect = optIdx === q.correctAnswer;
      const isThisSelected = optIdx === selectedIdx;

      if (isThisCorrect && isThisSelected) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(21, 128, 61);
        doc.text(`${optionLabels[optIdx]}. ${opt}  [CORRECT & SELECTED]`, optX, optY);
      } else if (isThisCorrect) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(21, 128, 61);
        doc.text(`${optionLabels[optIdx]}. ${opt}  [CORRECT ANSWER]`, optX, optY);
      } else if (isThisSelected) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(`${optionLabels[optIdx]}. ${opt}  [MAHI SELECTED - WRONG]`, optX, optY);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`${optionLabels[optIdx]}. ${opt}`, optX, optY);
      }
    });

    // Result summary bar inside card
    const selText = isUnanswered 
      ? 'Not answered' 
      : `${optionLabels[selectedIdx]}. ${q.options[selectedIdx] || ''}`;
    const corText = `${optionLabels[q.correctAnswer]}. ${q.options[q.correctAnswer] || ''}`;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Mahi selected: ${selText}   |   Correct answer: ${corText}`, margin + 4, y + 23);

    // Status Badge
    doc.setFont('helvetica', 'bold');
    if (isCorrect) {
      doc.setTextColor(21, 128, 61);
      doc.text(`Status: CORRECT`, pageWidth - margin - 4, y + 23, { align: 'right' });
    } else if (isUnanswered) {
      doc.setTextColor(100, 116, 139);
      doc.text(`Status: UNANSWERED`, pageWidth - margin - 4, y + 23, { align: 'right' });
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text(`Status: INCORRECT`, pageWidth - margin - 4, y + 23, { align: 'right' });
    }

    // Explanation
    if (q.explanation) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const explLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 8);
      doc.text(explLines, margin + 4, y + 28);
    }

    y += 38;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Boddukuri's Quiz #Mahi — Official Student Answer Sheet Inspection | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  const safeFilename = `Boddukuris_Quiz_AnswerSheet_${quiz.id}_Mahi.pdf`;
  doc.save(safeFilename);
}

