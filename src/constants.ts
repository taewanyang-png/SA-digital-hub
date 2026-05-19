/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  equipment: [
    { id: '1', name: 'MacBook Pro #1', type: 'Laptop', status: 'Available', totalQuantity: 1, inUseCount: 0 },
    { id: '2', name: 'MacBook Pro #2', type: 'Laptop', status: 'In-use', totalQuantity: 1, inUseCount: 1, assignedTo: 'John Doe', checkoutDate: '2024-06-01', expectedReturnDate: '2024-06-20' },
    { id: '3', name: 'Epson LCD Projector', type: 'Projector', status: 'Available', totalQuantity: 2, inUseCount: 0 },
    { id: '4', name: 'Anker PowerCore 20k', type: 'Powerbank', status: 'Available', totalQuantity: 5, inUseCount: 0 },
  ],
  projects: [
    {
      id: "trauma",
      name: "Trauma Healing",
      description: "Restoring hope through foundational biblical trauma healing workshops and community level training across PNG provinces.",
      progress: 65,
      lastStatus: "Workshops completed in Lae; moving to Highlands next month.",
      image: "http://googleusercontent.com/image_collection/image_retrieval/5221847308827951878",
      howToSupport: "Your support enables us to provide training manuals and travel to remote villages. A gift of $50 provides a complete healing kit for one participant."
    },
    {
      id: "cms",
      name: "CMS (Culture Meets Scripture)",
      description: "Deep engagement with the biblical narrative that respects and transforms traditional Melanesian cultural values.",
      progress: 40,
      lastStatus: "Curriculum adaptation for Sepik region in progress.",
      image: "http://googleusercontent.com/image_collection/image_retrieval/7622242832858546891",
      howToSupport: "Support CMS by sponsoring a cultural workshop. $200 covers the logistics for a village-wide engagement session."
    },
    {
      id: "salt",
      name: "SALT",
      description: "Scripture Application & Literacy Training for local-level pastors and church leaders in rural communities.",
      progress: 85,
      lastStatus: "35 leaders certified in the recent Highlands training cycle.",
      image: "http://googleusercontent.com/image_collection/image_retrieval/3721352222650854747",
      howToSupport: "SALT needs digital tools. Donating towards a tablet for a rural pastor allows them access to the full digital scripture library."
    },
    {
      id: "bible-overview",
      name: "Bible Overview",
      description: "Providing a holistic understanding of the whole biblical narrative to establish a firm theological foundation.",
      progress: 30,
      lastStatus: "Resource printing for the 2024 cohort started.",
      image: "http://googleusercontent.com/image_collection/image_retrieval/2063697456482634732",
      howToSupport: "Funding the printing of 'Walk Through the Bible' posters helps visual learners understand the story of redemption. $500 prints 100 sets."
    }
  ],
  funding: {
    raised: 45000,
    goal: 100000
  },
  reports: [
    { 
      id: '1', 
      title: 'Project Reports', 
      count: 2, 
      category: 'Internal', 
      date: '2024-05-10', 
      image: 'http://googleusercontent.com/image_collection/image_retrieval/16812338518979774969',
      files: [
        { id: 'f1', name: 'Q1 Field Report.pdf', type: 'pdf', date: '2024-03-31' },
        { id: 'f2', name: 'Mission_Resources_Template.docx', type: 'docx', date: '2024-05-10' }
      ]
    },
    { 
      id: '2', 
      title: 'Impact Stories', 
      count: 1, 
      category: 'Community', 
      date: '2024-04-15', 
      image: 'http://googleusercontent.com/image_collection/image_retrieval/3721352222650854747',
      files: [{ id: 'f3', name: 'Highlands_Testimony.pdf', type: 'pdf', date: '2024-04-15' }]
    },
    { 
      id: '3', 
      title: 'Annual Reviews', 
      count: 1, 
      category: 'Strategic', 
      date: '2024-01-20', 
      image: 'http://googleusercontent.com/image_collection/image_retrieval/2383520574522617965',
      files: [{ id: 'f4', name: '2023_Financial_Review.pdf', type: 'pdf', date: '2024-01-20' }]
    },
    { 
      id: '4', 
      title: 'Policy Documents', 
      count: 1, 
      category: 'Management', 
      date: '2024-05-01', 
      image: "http://googleusercontent.com/image_collection/image_retrieval/7721195682879074194",
      files: [{ id: 'f5', name: 'IT_Infrastructure_Protocol.pdf', type: 'pdf', date: '2024-05-01' }]
    },
    { 
      id: '5', 
      title: 'Resources', 
      count: 2, 
      category: 'Educational', 
      date: '2024-05-18', 
      image: 'http://googleusercontent.com/image_collection/image_retrieval/14946839958299032832',
      files: [
        { id: 'f10', name: 'Literacy_Manual_v1.docx', type: 'docx', date: '2024-05-18' },
        { id: 'f11', name: 'PNG_Ministry_Framework.pdf', type: 'pdf', date: '2024-05-18' }
      ]
    }
  ],
  schedule: [
    { id: 's1', title: 'Highlands Trauma Workshop', date: '2024-06-15', type: 'workshop', description: 'Intensive 3-day workshop for community leaders.', participants: ['David K.', 'Sarah M.', 'Local Pastors'] },
    { id: 's2', title: 'SALT Resource Deadline', date: '2024-06-25', type: 'deadline', description: 'Finalize Tok Pisin translation for training manuals.', participants: ['Translation Team', 'Thomas L.'] },
    { id: 's3', title: 'Annual Strategic Review', date: '2024-07-05', type: 'milestone', description: 'Half-year progress evaluation with department heads.', participants: ['Management Team', 'Board Members'] }
  ],
  videos: [
    { id: 'v1', title: 'Community Transformation', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'http://googleusercontent.com/image_collection/image_retrieval/16812338518979774969' },
    { id: 'v2', title: 'Highlands Literacy Program', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'http://googleusercontent.com/image_collection/image_retrieval/3721352222650854747' },
    { id: 'v3', title: 'Trauma Healing Stories', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'http://googleusercontent.com/image_collection/image_retrieval/5221847308827951878' }
  ],
  footer: {
    email: 'info@gbt.or.kr',
    phone: '+675 7000 0000',
    location: 'Ukarumpa, Eastern Highlands Province, Papua New Guinea'
  },
  authorizedCoAdmins: [],
  pendingRequests: []
};
