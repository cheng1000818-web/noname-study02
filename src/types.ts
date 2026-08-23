export interface SiteProfile {
  id?: string;
  name: string;
  school: string;
  grade: string;
  interests: string;
  slogan: string;
  avatarUrl?: string;
  bio: string;
  learningDirection: string;
  currentLearning: string;
  futureGoals: string;
  updatedAt?: number;
}

export interface ProjectImage {
  id?: string;
  projectId: string;
  dataUrl: string;
  caption?: string;
  order: number;
  createdAt?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  challenge: string;
  solution: string;
  reflection: string;
  coverImage?: string;
  images?: string[]; // Array of image URLs or image doc IDs
  videoUrl?: string;
  order: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  category?: string;
  order: number;
  createdAt?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  order: number;
}

export type ActiveTab = 'profile' | 'projects' | 'timeline' | 'skills';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
