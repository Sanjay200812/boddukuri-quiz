import { jsPDF } from 'jspdf';
import type { DailyQuiz } from '../types/quiz';

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
          const keyFactText = `Key Feature: ${park.keyFeature} | Wildlife: ${park.famousWildlife.join(', ')}`;
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

