/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'In-use';
  totalQuantity: number;
  inUseCount: number;
  assignedTo?: string;
  checkoutDate?: string;
  expectedReturnDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  lastStatus: string;
  image: string;
  howToSupport?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // ISO format
  type: 'milestone' | 'deadline' | 'meeting' | 'workshop';
  description?: string;
  participants?: string[];
}

export interface FooterInfo {
  email: string;
  phone: string;
  location: string;
}

export interface Funding {
  raised: number;
  goal: number;
}

export interface AppFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx';
  date: string;
  url?: string;
}

export interface Report {
  id: string;
  title: string;
  count: number;
  category: string;
  date: string;
  image: string;
  files: AppFile[];
}

export interface AdminRequest {
  id: string;
  email: string;
  timestamp: string;
}

export interface VideoBlock {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  videoData?: string;
}

export interface AppData {
  equipment: Equipment[];
  projects: Project[];
  funding: Funding;
  reports: Report[];
  schedule: ScheduleEvent[];
  videos: VideoBlock[];
  footer: FooterInfo;
  authorizedCoAdmins: string[];
  pendingRequests: AdminRequest[];
  heroImage?: string;
  managerMessageImage?: string;
  footerImage?: string;
  logoImage?: string;
  quoteText?: string;
  quoteRef?: string;
}
