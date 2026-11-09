import type { QuizAttempt } from '../types/quiz';

// Configured default WhatsApp number as requested
export const DEFAULT_SANJU_WHATSAPP_NUMBER = "917075920852";

/**
 * Formats a list of state names into a human-readable string with "and" before the last state
 * e.g. "Madhya Pradesh, Andhra Pradesh, Telangana, Kerala, Assam and Karnataka."
 */
function formatStatesList(states: string[]): string {
  if (!states || states.length === 0) return 'All covered states.';
  if (states.length === 1) return `${states[0]}.`;
  if (states.length === 2) return `${states[0]} and ${states[1]}.`;
  const allExceptLast = states.slice(0, -1).join(', ');
  const last = states[states.length - 1];
  return `${allExceptLast} and ${last}.`;
}

/**
 * Formats the quiz result into the exact WhatsApp message template requested for Boddukuri's Quiz
 */
export function formatWhatsAppMessage(attempt: QuizAttempt): string {
  const dayStr = attempt.dayNumber < 10 ? `0${attempt.dayNumber}` : `${attempt.dayNumber}`;
  const statesFormatted = formatStatesList(attempt.statesCovered);
  const minutes = Math.floor(attempt.timeTakenSeconds / 60);
  const seconds = attempt.timeTakenSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds}s`;

  const dateStr = attempt.displayDate || attempt.quizDate || '09 November 2026';

  return [
    `🌿 BODDUKURI'S QUIZ`,
    ``,
    `🎉 #Mahi – Day ${dayStr} Completed!`,
    `📅 Date: ${dateStr}`,
    ``,
    `📚 States Covered:`,
    `${statesFormatted}`,
    ``,
    `📊 Result:`,
    `Marks: ${attempt.marksObtained}/${attempt.maxMarks}`,
    `Correct: ${attempt.correctCount}`,
    `Incorrect: ${attempt.incorrectCount}`,
    `Unanswered: ${attempt.unansweredCount || 0}`,
    `Percentage: ${attempt.percentage}%`,
    `Time Taken: ${timeFormatted}`,
    ``,
    `🏆 Performance: ${attempt.performanceMessage}`,
    ``,
    `"Every day you learn something new, you become a better version of yourself."`,
    ``,
    `Keep learning, Mahi! 💚`
  ].join('\n');
}

/**
 * Generates the WhatsApp web/app URL with recipient number and encoded message text
 */
export function getWhatsAppShareUrl(attemptOrMessage: QuizAttempt | string, phoneNumber: string = DEFAULT_SANJU_WHATSAPP_NUMBER): string {
  // Clean phone number: remove any non-digit characters (+, spaces, dashes)
  const cleanNumber = (phoneNumber || DEFAULT_SANJU_WHATSAPP_NUMBER).replace(/\D/g, '');
  const message = typeof attemptOrMessage === 'string' ? attemptOrMessage : formatWhatsAppMessage(attemptOrMessage);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Native Web Share API helper
 */
export async function shareResultNative(attempt: QuizAttempt): Promise<{ success: boolean; method: 'native' | 'clipboard' | 'failed' }> {
  const message = formatWhatsAppMessage(attempt);
  const dayStr = attempt.dayNumber < 10 ? `0${attempt.dayNumber}` : `${attempt.dayNumber}`;
  const title = `Boddukuri's Quiz #Mahi — Day ${dayStr} Result`;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: message,
      });
      return { success: true, method: 'native' };
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        return copyToClipboard(message);
      }
      return { success: false, method: 'failed' };
    }
  }

  return copyToClipboard(message);
}

/**
 * Copy to clipboard fallback
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; method: 'clipboard' | 'failed' }> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard' };
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: successful, method: successful ? 'clipboard' : 'failed' };
    }
  } catch (e) {
    console.error('Clipboard copy failed:', e);
    return { success: false, method: 'failed' };
  }
}
