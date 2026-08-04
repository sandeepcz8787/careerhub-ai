export interface DashboardStats {
  applications: { count: number; change: number };
  interviews: { count: number; change: number };
  resumeScore: { score: number; max: number };
  codingStreak: { days: number; best: number };
  communityRep: { points: number; rank: string };
  referrals: { pending: number; accepted: number };
  bookmarks: { count: number };
  unreadNotifications: { count: number };
}

export interface CareerStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface ActivityItem {
  id: string;
  type: 'application' | 'resume' | 'interview' | 'community' | 'referral';
  title: string;
  description: string;
  timestamp: string;
  status?: 'pending' | 'success' | 'warning' | 'info';
}

export interface JobRecommendation {
  id: string;
  companyName: string;
  companyLogo: string;
  role: string;
  location: string;
  salary: string;
  tags: string[];
  saved: boolean;
  matchScore: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'interview' | 'deadline' | 'challenge' | 'meeting';
  date: string; // YYYY-MM-DD
  time: string;
  details?: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Data
let mockNotifications: DashboardNotification[] = [
  {
    id: 'n1',
    title: 'Interview Scheduled',
    message: 'Your mock interview with Google AI Coach is set for tomorrow at 10:00 AM.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'n2',
    title: 'ATS Score Update',
    message: 'Your updated resume scored 85/100 for the Senior React Engineer position.',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: 'n3',
    title: 'Application Deadline',
    message: 'The application for Software Engineer Intern at Meta closes in 24 hours.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
  },
  {
    id: 'n4',
    title: 'Coding Streak Maintained',
    message: 'Congratulations! You maintained your coding streak. 5 days in a row.',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
  },
  {
    id: 'n5',
    title: 'New Referral Request',
    message: 'Sandeep (Microsoft) has requested more details regarding your referral request.',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
  },
];

const mockStats: DashboardStats = {
  applications: { count: 24, change: 12 },
  interviews: { count: 3, change: 50 },
  resumeScore: { score: 85, max: 100 },
  codingStreak: { days: 5, best: 14 },
  communityRep: { points: 342, rank: 'Silver Pro' },
  referrals: { pending: 2, accepted: 1 },
  bookmarks: { count: 12 },
  unreadNotifications: { count: 3 },
};

const mockCareerSteps: CareerStep[] = [
  { id: '1', label: 'Verify Email', description: 'Confirm your account email address', completed: true, order: 1 },
  { id: '2', label: 'Upload Photo', description: 'Add a professional avatar to your profile', completed: true, order: 2 },
  { id: '3', label: 'Complete Education', description: 'Add your university degrees and GPA details', completed: true, order: 3 },
  { id: '4', label: 'Add Skills', description: 'List at least 5 primary technical skills', completed: true, order: 4 },
  { id: '5', label: 'Add Projects', description: 'List at least 2 relevant software projects', completed: false, order: 5 },
  { id: '6', label: 'Upload Resume', description: 'Upload a PDF resume for ATS optimization', completed: false, order: 6 },
];

const mockActivities: ActivityItem[] = [
  {
    id: 'a1',
    type: 'application',
    title: 'Applied to Stripe',
    description: 'Submitted application for Frontend Developer Role.',
    timestamp: '2 hours ago',
    status: 'pending',
  },
  {
    id: 'a2',
    type: 'resume',
    title: 'Resume ATS Check',
    description: 'Scored 85% matching on Senior React Developer JD.',
    timestamp: '4 hours ago',
    status: 'success',
  },
  {
    id: 'a3',
    type: 'interview',
    title: 'Interview Invitation',
    description: 'Google Mock Interview scheduled with AI System.',
    timestamp: 'Yesterday',
    status: 'info',
  },
  {
    id: 'a4',
    type: 'community',
    title: 'Community Post',
    description: 'Shared a post: "How to crack the system design round".',
    timestamp: '2 days ago',
  },
  {
    id: 'a5',
    type: 'referral',
    title: 'Referral Request Sent',
    description: 'Requested referral from Sandeep at Microsoft.',
    timestamp: '3 days ago',
    status: 'warning',
  },
];

let mockRecommendations: JobRecommendation[] = [
  {
    id: 'j1',
    companyName: 'Vercel',
    companyLogo: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=64&q=80',
    role: 'Senior React Developer',
    location: 'Remote, US',
    salary: '$140k - $170k',
    tags: ['React', 'Next.js', 'TailwindCSS'],
    saved: false,
    matchScore: 94,
  },
  {
    id: 'j2',
    companyName: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=64&q=80',
    role: 'Full Stack Engineer',
    location: 'San Francisco, CA',
    salary: '$160k - $200k',
    tags: ['Node.js', 'React', 'PostgreSQL'],
    saved: true,
    matchScore: 88,
  },
  {
    id: 'j3',
    companyName: 'Figma',
    companyLogo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=64&q=80',
    role: 'Frontend UI Engineer',
    location: 'New York, NY',
    salary: '$130k - $160k',
    tags: ['React', 'TypeScript', 'WebGl'],
    saved: false,
    matchScore: 85,
  },
];

const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Google Mock Interview',
    type: 'interview',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0] || '', // tomorrow
    time: '10:00 AM',
    details: 'System Design and coding logic focus.',
  },
  {
    id: 'e2',
    title: 'Meta App Deadline',
    type: 'deadline',
    date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0] || '', // in 2 days
    time: '11:59 PM',
    details: 'Apply via internal referral path.',
  },
  {
    id: 'e3',
    title: 'LeetCode Weekly Contest',
    type: 'challenge',
    date: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString().split('T')[0] || '', // in 3 days
    time: '08:00 AM',
    details: '4 algorithms challenges.',
  },
  {
    id: 'e4',
    title: 'HR Sync - Sandeep Microsoft',
    type: 'meeting',
    date: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString().split('T')[0] || '', // in 5 days
    time: '04:00 PM',
    details: 'Discuss project referral details.',
  },
];

const motivationalQuotes = [
  'The only way to do great work is to love what you do. — Steve Jobs',
  'Choose a job you love, and you will never have to work a day in your life. — Confucius',
  'Opportunities don\'t happen. You create them. — Chris Grosser',
  'Believe you can and you\'re halfway there. — Theodore Roosevelt',
  'Success is not the key to happiness. Happiness is the key to success. — Albert Schweitzer',
  'Your talent determines what you can do. Your motivation determines how much you are willing to do. — Lou Holtz',
];

export const dashboardService = {
  async getStats(fail = false): Promise<DashboardStats> {
    await delay(600);
    if (fail) throw new Error('Failed to load dashboard metrics');
    return { ...mockStats };
  },

  async getCareerProgress(): Promise<CareerStep[]> {
    await delay(500);
    return [...mockCareerSteps];
  },

  async getRecentActivities(): Promise<ActivityItem[]> {
    await delay(400);
    return [...mockActivities];
  },

  async getJobRecommendations(): Promise<JobRecommendation[]> {
    await delay(700);
    return [...mockRecommendations];
  },

  async toggleSaveJob(id: string): Promise<JobRecommendation[]> {
    await delay(200);
    mockRecommendations = mockRecommendations.map((job) =>
      job.id === id ? { ...job, saved: !job.saved } : job
    );
    return [...mockRecommendations];
  },

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    await delay(500);
    return [...mockCalendarEvents];
  },

  async getNotifications(): Promise<DashboardNotification[]> {
    await delay(400);
    return [...mockNotifications];
  },

  async markNotificationRead(id: string): Promise<DashboardNotification[]> {
    await delay(100);
    mockNotifications = mockNotifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    return [...mockNotifications];
  },

  async markAllNotificationsRead(): Promise<DashboardNotification[]> {
    await delay(200);
    mockNotifications = mockNotifications.map((notif) => ({ ...notif, read: true }));
    return [...mockNotifications];
  },

  getMotivationalQuote(): string {
    // Generate static but pseudorandom quote based on today's day of month
    const day = new Date().getDate();
    return motivationalQuotes[day % motivationalQuotes.length] || motivationalQuotes[0]!;
  },
};
