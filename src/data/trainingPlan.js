// NHS Couch to 5K - 9 Week Training Plan
// Each interval: { type: 'run' | 'walk', duration: seconds, label: string }

export const TRAINING_PLAN = [
  // Week 1 - 3 sessions
  {
    week: 1,
    session: 1,
    title: 'Week 1 - Session 1',
    totalMinutes: 30,
    description: 'Warm up brisk walk, then alternate 60s run / 90s walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(8).fill(null).flatMap(() => [
        { type: 'run', duration: 60, label: 'Run!' },
        { type: 'walk', duration: 90, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 1,
    session: 2,
    title: 'Week 1 - Session 2',
    totalMinutes: 30,
    description: 'Warm up brisk walk, then alternate 60s run / 90s walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(8).fill(null).flatMap(() => [
        { type: 'run', duration: 60, label: 'Run!' },
        { type: 'walk', duration: 90, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 1,
    session: 3,
    title: 'Week 1 - Session 3',
    totalMinutes: 30,
    description: 'Warm up brisk walk, then alternate 60s run / 90s walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(8).fill(null).flatMap(() => [
        { type: 'run', duration: 60, label: 'Run!' },
        { type: 'walk', duration: 90, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 2 - 3 sessions
  {
    week: 2,
    session: 1,
    title: 'Week 2 - Session 1',
    totalMinutes: 30,
    description: 'Warm up walk, then alternate 90s run / 2min walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(6).fill(null).flatMap(() => [
        { type: 'run', duration: 90, label: 'Run!' },
        { type: 'walk', duration: 120, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 2,
    session: 2,
    title: 'Week 2 - Session 2',
    totalMinutes: 30,
    description: 'Warm up walk, then alternate 90s run / 2min walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(6).fill(null).flatMap(() => [
        { type: 'run', duration: 90, label: 'Run!' },
        { type: 'walk', duration: 120, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 2,
    session: 3,
    title: 'Week 2 - Session 3',
    totalMinutes: 30,
    description: 'Warm up walk, then alternate 90s run / 2min walk for 20 minutes.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      ...Array(6).fill(null).flatMap(() => [
        { type: 'run', duration: 90, label: 'Run!' },
        { type: 'walk', duration: 120, label: 'Walk' },
      ]),
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 3 - 3 sessions
  {
    week: 3,
    session: 1,
    title: 'Week 3 - Session 1',
    totalMinutes: 28,
    description: 'Warm up walk, then: 90s run, 90s walk, 3min run, 3min walk x2.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 3,
    session: 2,
    title: 'Week 3 - Session 2',
    totalMinutes: 28,
    description: 'Warm up walk, then: 90s run, 90s walk, 3min run, 3min walk x2.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 3,
    session: 3,
    title: 'Week 3 - Session 3',
    totalMinutes: 28,
    description: 'Warm up walk, then: 90s run, 90s walk, 3min run, 3min walk x2.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 90, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 4 - 3 sessions
  {
    week: 4,
    session: 1,
    title: 'Week 4 - Session 1',
    totalMinutes: 31,
    description: '3min run, 90s walk, 5min run, 2.5min walk, 3min run, 90s walk, 5min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 150, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 4,
    session: 2,
    title: 'Week 4 - Session 2',
    totalMinutes: 31,
    description: '3min run, 90s walk, 5min run, 2.5min walk, 3min run, 90s walk, 5min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 150, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 4,
    session: 3,
    title: 'Week 4 - Session 3',
    totalMinutes: 31,
    description: '3min run, 90s walk, 5min run, 2.5min walk, 3min run, 90s walk, 5min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 150, label: 'Walk' },
      { type: 'run', duration: 180, label: 'Run!' },
      { type: 'walk', duration: 90, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 5 - 3 sessions (different each day)
  {
    week: 5,
    session: 1,
    title: 'Week 5 - Session 1',
    totalMinutes: 31,
    description: '5min run, 3min walk x3.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 5,
    session: 2,
    title: 'Week 5 - Session 2',
    totalMinutes: 31,
    description: '8min run, 5min walk, 8min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 480, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Walk' },
      { type: 'run', duration: 480, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 5,
    session: 3,
    title: 'Week 5 - Session 3',
    totalMinutes: 30,
    description: 'The BIG one — 20 minutes continuous running!',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1200, label: 'Run — You got this!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 6
  {
    week: 6,
    session: 1,
    title: 'Week 6 - Session 1',
    totalMinutes: 31,
    description: '5min run, 3min walk, 8min run, 3min walk, 5min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 480, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 300, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 6,
    session: 2,
    title: 'Week 6 - Session 2',
    totalMinutes: 31,
    description: '10min run, 3min walk, 10min run.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 600, label: 'Run!' },
      { type: 'walk', duration: 180, label: 'Walk' },
      { type: 'run', duration: 600, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 6,
    session: 3,
    title: 'Week 6 - Session 3',
    totalMinutes: 35,
    description: '25 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1500, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 7
  {
    week: 7,
    session: 1,
    title: 'Week 7 - Session 1',
    totalMinutes: 35,
    description: '25 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1500, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 7,
    session: 2,
    title: 'Week 7 - Session 2',
    totalMinutes: 35,
    description: '25 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1500, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 7,
    session: 3,
    title: 'Week 7 - Session 3',
    totalMinutes: 35,
    description: '25 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1500, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 8
  {
    week: 8,
    session: 1,
    title: 'Week 8 - Session 1',
    totalMinutes: 38,
    description: '28 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1680, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 8,
    session: 2,
    title: 'Week 8 - Session 2',
    totalMinutes: 38,
    description: '28 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1680, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 8,
    session: 3,
    title: 'Week 8 - Session 3',
    totalMinutes: 38,
    description: '28 minutes continuous running.',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1680, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },

  // Week 9
  {
    week: 9,
    session: 1,
    title: 'Week 9 - Session 1',
    totalMinutes: 40,
    description: '30 minutes continuous running. Almost there!',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1800, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 9,
    session: 2,
    title: 'Week 9 - Session 2',
    totalMinutes: 40,
    description: '30 minutes continuous running. One more after this!',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1800, label: 'Run!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
  {
    week: 9,
    session: 3,
    title: 'Week 9 - Session 3',
    totalMinutes: 40,
    description: 'YOUR FINAL RUN! 30 minutes — you are a runner!',
    intervals: [
      { type: 'walk', duration: 300, label: 'Warm Up Walk' },
      { type: 'run', duration: 1800, label: 'Final Run — YOU GOT THIS!' },
      { type: 'walk', duration: 300, label: 'Cool Down Walk' },
    ],
  },
];

// Get sessions for a specific week
export const getWeekSessions = (week) =>
  TRAINING_PLAN.filter((s) => s.week === week);

// Get a specific session
export const getSession = (week, session) =>
  TRAINING_PLAN.find((s) => s.week === week && s.session === session);

// Get next session for a user
export const getNextSession = (completedSessions) => {
  for (let i = 0; i < TRAINING_PLAN.length; i++) {
    const s = TRAINING_PLAN[i];
    const key = `${s.week}-${s.session}`;
    if (!completedSessions.includes(key)) return s;
  }
  return null; // Programme complete
};

// Format seconds to MM:SS
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Total running time in a session
export const totalRunTime = (session) =>
  session.intervals
    .filter((i) => i.type === 'run')
    .reduce((acc, i) => acc + i.duration, 0);
