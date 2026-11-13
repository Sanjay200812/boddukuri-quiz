import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase.ts';
import type { QuizAttempt, InboxNotification } from '../types/quiz';
import type { ProgressSnapshot } from './storage.ts';

export type RealtimeQuizEvent =
  | 'quiz_submitted'
  | 'schedule_updated'
  | 'progress_reset'
  | 'retake_updated'
  | 'notification_created';

export interface QuizSubmissionPayload {
  attempt: QuizAttempt;
  snapshot: ProgressSnapshot;
  adminNotification?: InboxNotification;
  timestamp: string;
}

export interface ScheduleUpdatePayload {
  quizId: string;
  unlocked: boolean;
  timestamp: string;
}

export interface ResetProgressPayload {
  by: string;
  timestamp: string;
}

export interface RealtimeEventHandlers {
  onQuizSubmitted?: (payload: QuizSubmissionPayload) => void;
  onScheduleUpdated?: (payload: ScheduleUpdatePayload) => void;
  onProgressReset?: (payload: ResetProgressPayload) => void;
  onNotificationCreated?: (notif: InboxNotification) => void;
  onStatusChange?: (status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR') => void;
}

const REALTIME_CHANNEL_NAME = 'mahi_quiz_realtime_v2';

let globalBroadcastChannel: RealtimeChannel | null = null;

function getOrCreateBroadcastChannel() {
  if (!supabase) return null;
  if (!globalBroadcastChannel) {
    globalBroadcastChannel = supabase.channel(REALTIME_CHANNEL_NAME, {
      config: {
        broadcast: { ack: true }
      }
    });
    globalBroadcastChannel.subscribe();
  }
  return globalBroadcastChannel;
}

/**
 * Broadcasts an application event to all connected clients (Admin & Student)
 */
export async function broadcastQuizEvent(
  event: RealtimeQuizEvent,
  payload: unknown
): Promise<boolean> {
  // 1. Dispatch custom DOM event for intra-window / multi-tab support
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mahi_quiz_realtime_local', {
      detail: { event, payload }
    }));
  }

  // 2. Broadcast via Supabase Realtime across devices & browsers
  if (!supabase) return false;
  try {
    const ch = getOrCreateBroadcastChannel();
    if (ch) {
      const resp = await ch.send({
        type: 'broadcast',
        event,
        payload
      });
      return resp === 'ok';
    }
    return false;
  } catch (err) {
    console.warn('Realtime broadcast note:', err);
    return false;
  }
}

/**
 * Subscribes to real-time events. Returns a cleanup unsubscribe function.
 */
export function subscribeToQuizRealtime(handlers: RealtimeEventHandlers): () => void {
  // Track processed event timestamps to prevent duplicate executions
  const processedEventIds = new Set<string>();

  // Handler for local custom events (same browser / tabs)
  const localListener = (evt: Event) => {
    const custom = evt as CustomEvent<{ event: RealtimeQuizEvent; payload: any }>;
    if (!custom.detail) return;
    const { event, payload } = custom.detail;
    dispatchEventToHandlers(event, payload);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mahi_quiz_realtime_local', localListener);
  }

  // Subscribe to Supabase Realtime channel
  let subChannel: RealtimeChannel | null = null;
  if (supabase) {
    // Subscribers must use the same channel as the broadcaster. Random
    // subscriber channel names silently prevented Admin from seeing events.
    subChannel = supabase.channel(REALTIME_CHANNEL_NAME, {
      config: {
        broadcast: { ack: true }
      }
    });

    // Listen to broadcast events
    subChannel
      .on('broadcast', { event: 'quiz_submitted' }, (resp) => {
        dispatchEventToHandlers('quiz_submitted', resp.payload);
      })
      .on('broadcast', { event: 'schedule_updated' }, (resp) => {
        dispatchEventToHandlers('schedule_updated', resp.payload);
      })
      .on('broadcast', { event: 'progress_reset' }, (resp) => {
        dispatchEventToHandlers('progress_reset', resp.payload);
      })
      .on('broadcast', { event: 'notification_created' }, (resp) => {
        dispatchEventToHandlers('notification_created', resp.payload);
      });

    subChannel.subscribe((status) => {
      if (handlers.onStatusChange) {
        handlers.onStatusChange(status as any);
      }
    });
  }

  function dispatchEventToHandlers(event: RealtimeQuizEvent, payload: any) {
    // Generate event key for deduplication
    const eventKey = `${event}_${payload?.timestamp || payload?.attempt?.id || Date.now()}`;
    if (processedEventIds.has(eventKey)) return;
    processedEventIds.add(eventKey);

    // Limit cache size
    if (processedEventIds.size > 100) {
      const first = Array.from(processedEventIds)[0];
      processedEventIds.delete(first);
    }

    switch (event) {
      case 'quiz_submitted':
        handlers.onQuizSubmitted?.(payload as QuizSubmissionPayload);
        break;
      case 'schedule_updated':
        handlers.onScheduleUpdated?.(payload as ScheduleUpdatePayload);
        break;
      case 'progress_reset':
        handlers.onProgressReset?.(payload as ResetProgressPayload);
        break;
      case 'notification_created':
        handlers.onNotificationCreated?.(payload as InboxNotification);
        break;
    }
  }

  // Unsubscribe cleanup
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mahi_quiz_realtime_local', localListener);
    }
    if (supabase && subChannel) {
      void supabase.removeChannel(subChannel);
    }
  };
}
