/**
 * PROGRAMME — the conference format and (later) the day-by-day schedule.
 */
import type { Status } from './types.ts';

export interface ProgrammeComponent {
  title: string;
  description: string;
  status: Status;
}

export interface ScheduleSession {
  time: string; // e.g. "09:30 – 10:30"
  title: string;
  detail?: string;
}

export interface ScheduleDay {
  label: string; // e.g. "Day 1 · Thursday 15 April 2027"
  sessions: ScheduleSession[];
}

export const programmeIntro = {
  heading: 'Programme',
  lead: 'A three-day programme combining paper presentations, research-method training, dialogue with industry and faculty development.',
  scheduleNote: 'The detailed three-day schedule will be published once the programme is finalised.',
};

export const programmeComponents: ProgrammeComponent[] = [
  {
    title: 'Paper presentations',
    description: 'Parallel presentation sessions across the seven “Beyond Boundaries” tracks.',
    status: 'proposed',
  },
  {
    title: 'Research-method workshop',
    description: 'A method-based workshop designed for doctoral scholars.',
    status: 'proposed',
  },
  {
    title: 'Panel discussion',
    description: 'Industry and faculty perspectives on research that crosses boundaries.',
    status: 'proposed',
  },
  {
    // Source documents differ: "Faculty development workshop" (proposal)
    // vs "Paper Development Workshop" (deck). See CONTENT_REVIEW.md, C-04.
    title: 'Faculty / paper development workshop',
    description: 'A development workshop led by faculty from different institutions. Final format to be confirmed.',
    status: 'proposed',
  },
];

/**
 * Day-by-day schedule. Leave empty ([]) until the programme is approved.
 * Example of one day (remove the // to use):
 *
 * // {
 * //   label: 'Day 1 · Thursday 15 April 2027',
 * //   sessions: [
 * //     { time: '09:30 – 10:30', title: 'Inaugural session' },
 * //     { time: '11:00 – 13:00', title: 'Paper presentations', detail: 'Tracks 1–3' },
 * //   ],
 * // },
 */
export const schedule: ScheduleDay[] = [];
