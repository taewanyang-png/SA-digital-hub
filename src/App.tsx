/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  ChevronRight, 
  BarChart3, 
  Package, 
  Calendar, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  FileText,
  Users,
  Search,
  ShieldCheck,
  UserPlus,
  Mail,
  Trash2,
  Download,
  Eye,
  Pencil,
  FilePlus,
  FileUp,
  Image as ImageIcon,
  Play,
  Video
} from 'lucide-react';
import { AppData, Equipment, Project, Report, AdminRequest, AppFile, VideoBlock, ScheduleEvent } from './types';
import { INITIAL_DATA } from './constants';

// --- Components ---

const Navbar = ({ isAdmin, onToggleAdmin, userType }: { isAdmin: boolean; onToggleAdmin: () => void; userType: 'Root' | 'Co-Admin' | 'Guest' }) => (
  <nav className="fixed top-0 w-full z-50 bg-sand/80 backdrop-blur-md border-b border-emerald/10 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald rounded-full flex items-center justify-center text-sand font-serif font-bold text-xl">S</div>
      <div>
        <h1 className="font-serif font-bold tracking-tight text-emerald-dark leading-tight uppercase text-sm md:text-base">Scripture Access</h1>
        <p className="text-[10px] uppercase tracking-widest text-emerald/60 font-semibold">Digital Hub</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {isAdmin && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald/5 rounded-full border border-emerald/10">
          <ShieldCheck size={12} className="text-emerald" />
          <span className="text-[10px] font-bold uppercase text-emerald tracking-wider">{userType} Access</span>
        </div>
      )}
      <button 
        onClick={onToggleAdmin}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
          isAdmin 
            ? 'bg-emerald text-sand shadow-lg shadow-emerald/20' 
            : 'bg-emerald/10 text-emerald hover:bg-emerald/20'
        }`}
      >
        {isAdmin ? <LogOut size={14} /> : <Settings size={14} />}
        {isAdmin ? 'Exit Admin' : 'Admin Mode'}
      </button>
    </div>
  </nav>
);

const SafeImage = ({ src, alt, className, referrerPolicy }: { src: string; alt: string; className?: string; referrerPolicy?: React.HTMLAttributeReferrerPolicy }) => (
  <img 
    src={src || 'http://googleusercontent.com/image_collection/image_retrieval/8271124991101079782'} 
    alt={alt}
    className={`${className} object-cover`}
    style={{ objectPosition: 'center', imageRendering: 'pixelated' }}
    referrerPolicy={referrerPolicy}
    loading="eager"
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = 'http://googleusercontent.com/image_collection/image_retrieval/8271124991101079782';
    }}
  />
);

const Hero = () => (
  <section 
    className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
    /* --- MANUAL IMAGE SWAP --- */
    style={{ 
      backgroundImage: "url('http://googleusercontent.com/image_collection/image_retrieval/8271124991101079782')", 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      imageRendering: 'pixelated'
    }}
  >
    {/* Explicit image preloader for Hero section */}
    <img 
      src="http://googleusercontent.com/image_collection/image_retrieval/8271124991101079782" 
      className="hidden" 
      loading="eager" 
      alt="Preload" 
    />

    {/* Optional Overlay for better text legibility */}
    <div className="absolute inset-0 bg-[#042f2e]/40 backdrop-blur-[1px] z-0"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sand/20 z-0"></div>

    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-6xl md:text-[9.5rem] font-bold text-sand mb-2 leading-[0.8] tracking-tighter uppercase drop-shadow-[0_15px_40px_rgba(4,47,46,0.6)]">
          SCRIPTURE<br />ACCESS
        </h2>
        <div className="mt-10 pt-10 border-t border-sand/30 inline-block">
          <p className="text-sand font-bold tracking-[0.6em] uppercase text-xs md:text-sm font-sans drop-shadow-md">
            PAPUA NEW GUINEA DEPARTMENT | DIGITAL HUB
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProgressRing = ({ progress, size = 60 }: { progress: number; size?: number }) => {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-emerald/10"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
        <circle
          className="text-emerald transition-all duration-1000 ease-out"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size/2}
          cy={size/2}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-emerald-dark">{progress}%</span>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [showManagerMessage, setShowManagerMessage] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', category: '', count: 0 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportFilesModal, setShowReportFilesModal] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [showVideoAdmin, setShowVideoAdmin] = useState(false);
  const [showFooterAdmin, setShowFooterAdmin] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<ScheduleEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'workshop',
    description: '',
    participants: []
  });
  const [participantInput, setParticipantInput] = useState('');
  const [footerForm, setFooterForm] = useState<AppData['footer']>(data.footer);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    name: '',
    description: '',
    progress: 0,
    lastStatus: '',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654ca',
    howToSupport: ''
  });

  // Force image caching and pre-rendering
  useEffect(() => {
    const criticalImages = [
      'http://googleusercontent.com/image_collection/image_retrieval/8271124991101079782', // Hero
      'http://googleusercontent.com/image_collection/image_retrieval/3721352222650854747', // SALT
      'http://googleusercontent.com/image_collection/image_retrieval/5221847308827951878', // Trauma
      'http://googleusercontent.com/image_collection/image_retrieval/7622242832858546891', // CMS
      'http://googleusercontent.com/image_collection/image_retrieval/16812338518979774969', // Archive
      'http://googleusercontent.com/image_collection/image_retrieval/2063697456482634732', // Travel
      'http://googleusercontent.com/image_collection/image_retrieval/2383520574522617965', // Ukarumpa
      'http://googleusercontent.com/image_collection/image_retrieval/14946839958299032832', // Resource
      'http://googleusercontent.com/image_collection/image_retrieval/7721195682879074194'  // Accent
    ];
    
    criticalImages.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const ROOT_ADMIN = 'taewan_yang@gbt.or.kr';

  const getUserType = () => {
    if (currentUserEmail === ROOT_ADMIN) return 'Root';
    if (currentUserEmail && data.authorizedCoAdmins.includes(currentUserEmail)) return 'Co-Admin';
    return 'Guest';
  };

  const userType = getUserType();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scripture_hub_data');
    const savedUser = localStorage.getItem('scripture_hub_user');
    const savedPending = localStorage.getItem('pendingAdminRequests');
    const savedCoAdmins = localStorage.getItem('coAdmins');

    if (saved) {
      const parsedData = JSON.parse(saved);
      // Merge with specific localStorage keys if they exist
      if (savedCoAdmins) parsedData.authorizedCoAdmins = JSON.parse(savedCoAdmins);
      if (savedPending) parsedData.pendingRequests = JSON.parse(savedPending);
      setData(parsedData);
    }
    
    if (savedUser) {
      setCurrentUserEmail(savedUser);
      setIsAdmin(true);
    }
  }, []);

  // Sync to localStorage on update
  useEffect(() => {
    localStorage.setItem('scripture_hub_data', JSON.stringify(data));
    localStorage.setItem('pendingAdminRequests', JSON.stringify(data.pendingRequests));
    localStorage.setItem('coAdmins', JSON.stringify(data.authorizedCoAdmins));
  }, [data]);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setCurrentUserEmail(null);
      localStorage.removeItem('scripture_hub_user');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLogin = () => {
    const coAdmins = JSON.parse(localStorage.getItem('coAdmins') || '[]');
    if (emailInput === ROOT_ADMIN || coAdmins.includes(emailInput) || data.authorizedCoAdmins.includes(emailInput)) {
      setCurrentUserEmail(emailInput);
      setIsAdmin(true);
      setShowAdminLogin(false);
      localStorage.setItem('scripture_hub_user', emailInput);
      setManagerStatus(`Logged in as ${emailInput === ROOT_ADMIN ? 'Root Admin' : 'Co-Admin'}`);
    } else {
      setManagerStatus('Access Denied: Email not in authorized list.');
    }
  };

  const [managerStatus, setManagerStatus] = useState<string | null>(null);
  const [showAdminManagement, setShowAdminManagement] = useState(false);

  const handleRequestAccess = () => {
    if (!emailInput) return;
    
    // Check if already pending
    if (data.pendingRequests.some(r => r.email === emailInput)) {
      setManagerStatus('Request already pending approval.');
      return;
    }

    const newRequest: AdminRequest = {
      id: Math.random().toString(36).substr(2, 9),
      email: emailInput,
      timestamp: new Date().toLocaleString()
    };

    const updatedPending = [...data.pendingRequests, newRequest];
    setData(prev => ({
      ...prev,
      pendingRequests: updatedPending
    }));
    
    setManagerStatus('Admin request sent to Root for approval.');
    setEmailInput('');
  };

  const approveRequest = (request: AdminRequest) => {
    setData(prev => ({
      ...prev,
      authorizedCoAdmins: [...prev.authorizedCoAdmins, request.email],
      pendingRequests: prev.pendingRequests.filter(r => r.id !== request.id)
    }));
  };

  const deleteRequest = (id: string) => {
    setData(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests.filter(r => r.id !== id)
    }));
  };

  // Admin Actions
  const updateProject = (id: string, updates: Partial<Project>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const addProject = () => {
    if (!projectForm.name) return;
    const project: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: projectForm.name || 'New Project',
      description: projectForm.description || '',
      progress: projectForm.progress || 0,
      lastStatus: projectForm.lastStatus || 'Project initiated.',
      image: projectForm.image || 'https://images.unsplash.com/photo-1544923246-77307dd654ca',
      howToSupport: projectForm.howToSupport || 'Contact your local project coordinator for more information on how to support this initiative.'
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, project] }));
    setIsAddingProject(false);
    setProjectForm({ name: '', description: '', progress: 0, lastStatus: '', image: 'https://images.unsplash.com/photo-1544923246-77307dd654ca', howToSupport: '' });
  };

  const deleteProject = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addScheduleEvent = () => {
    if (!eventForm.title || !eventForm.date) return;
    const newEvent: ScheduleEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: eventForm.title,
      date: eventForm.date,
      type: eventForm.type as any || 'workshop',
      description: eventForm.description || '',
      participants: eventForm.participants || []
    };
    setData(prev => ({ ...prev, schedule: [...(prev.schedule || []), newEvent] }));
    setIsAddingEvent(false);
    setEventForm({ title: '', date: new Date().toISOString().split('T')[0], type: 'workshop', description: '', participants: [] });
  };

  const deleteScheduleEvent = (id: string) => {
    setData(prev => ({ ...prev, schedule: prev.schedule.filter(s => s.id !== id) }));
  };
  
  const updateVideo = (id: string, updates: Partial<VideoBlock>) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  };

  const updateFooter = () => {
    setData(prev => ({ ...prev, footer: footerForm }));
    setShowFooterAdmin(false);
  };

  const addFileToReport = (reportId: string, fileName: string, fileType: 'pdf' | 'docx') => {
    const newFile: AppFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName,
      type: fileType,
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      reports: prev.reports.map(r => r.id === reportId ? { 
        ...r, 
        files: [...r.files, newFile],
        count: r.files.length + 1
      } : r)
    }));
    // Update selectedReport if open
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => prev ? ({
        ...prev,
        files: [...prev.files, newFile],
        count: prev.files.length + 1
      }) : null);
    }
  };

  const deleteFileFromReport = (reportId: string, fileId: string) => {
    setData(prev => ({
      ...prev,
      reports: prev.reports.map(r => r.id === reportId ? { 
        ...r, 
        files: r.files.filter(f => f.id !== fileId),
        count: r.files.length - 1
      } : r)
    }));
    // Update selectedReport if open
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => prev ? ({
        ...prev,
        files: prev.files.filter(f => f.id !== fileId),
        count: prev.files.length - 1
      }) : null);
    }
  };

  const addReport = () => {
    if (!newReport.title) return;
    const report: Report = {
      id: Math.random().toString(36).substr(2, 9),
      title: newReport.title,
      category: newReport.category || 'General',
      count: 0,
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1524338198850-e966434a81ed?auto=format&fit=crop&q=80&w=800',
      files: []
    };
    setData(prev => ({ ...prev, reports: [...prev.reports, report] }));
    setShowReportForm(false);
    setNewReport({ title: '', category: '', count: 0 });
  };

  const deleteReport = (id: string) => {
    setData(prev => ({ ...prev, reports: prev.reports.filter(r => r.id !== id) }));
  };

  const toggleEquipmentStatus = (id: string) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(e => {
        if (e.id === id) {
          const newStatus = e.status === 'Available' ? 'In-use' : 'Available';
          return { 
            ...e, 
            status: newStatus,
            inUseCount: newStatus === 'In-use' ? Math.min(e.inUseCount + 1, e.totalQuantity) : Math.max(0, e.inUseCount - 1),
            assignedTo: newStatus === 'Available' ? undefined : e.assignedTo || 'Staff Member',
            checkoutDate: newStatus === 'In-use' ? new Date().toISOString().split('T')[0] : undefined,
            expectedReturnDate: newStatus === 'In-use' ? e.expectedReturnDate || '' : undefined,
          };
        }
        return e;
      })
    }));
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const addEquipment = (name: string, type: string, totalQuantity: number = 1) => {
    const newItem: Equipment = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      status: 'Available',
      totalQuantity,
      inUseCount: 0
    };
    setData(prev => ({ ...prev, equipment: [...prev.equipment, newItem] }));
  };

  return (
    <div className="min-h-screen bg-sand selection:bg-emerald selection:text-sand overflow-x-hidden">
      <Navbar isAdmin={isAdmin} onToggleAdmin={handleAdminToggle} userType={userType} />
      
      <main>
        <Hero />

        {/* Mission Story Videos Section */}
        <section className="max-w-6xl mx-auto px-6 mb-32 relative z-30">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-1 bg-emerald rounded-full"></div>
                <span className="text-emerald font-bold uppercase tracking-[0.2em] text-[10px]">Visual Stewardship</span>
              </div>
              <h2 className="font-serif text-5xl font-bold text-emerald-dark tracking-tighter">Mission Story Videos</h2>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowVideoAdmin(!showVideoAdmin)}
                className="bg-emerald/10 text-emerald px-6 py-3 rounded-2xl text-[10px] font-bold flex items-center gap-2 hover:bg-emerald/20 transition-all uppercase tracking-widest"
              >
                {showVideoAdmin ? <X size={16} /> : <Pencil size={16} />}
                {showVideoAdmin ? 'Finish Editing' : 'Edit Media Slots'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.videos?.map((video, idx) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative flex flex-col"
              >
                <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-emerald-dark/5 shadow-2xl relative border border-emerald/5">
                  {/* Thumbnail background for slow internet persistence */}
                  <div className="absolute inset-0 z-0">
                    <SafeImage src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-50" />
                  </div>
                  {showVideoAdmin ? (
                    <div className="absolute inset-0 bg-sand/95 backdrop-blur-sm z-20 p-6 flex flex-col justify-center space-y-4">
                      <input 
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                        placeholder="Video Title"
                        className="bg-emerald/5 border border-emerald/10 p-3 rounded-xl text-sm font-bold w-full"
                      />
                      <input 
                        value={video.url}
                        onChange={(e) => updateVideo(video.id, { url: e.target.value })}
                        placeholder="Embed URL (YouTube/Vimeo)"
                        className="bg-emerald/5 border border-emerald/10 p-3 rounded-xl text-xs w-full"
                      />
                      <p className="text-[9px] text-emerald/40 font-bold uppercase text-center">Admin Controls Enabled</p>
                    </div>
                  ) : (
                    <>
                      <iframe 
                        src={video.url}
                        title={video.title}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <div className="absolute inset-0 pointer-events-none group-hover:bg-emerald-dark/10 transition-colors"></div>
                    </>
                  )}
                </div>
                <div className="mt-4 px-4 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald/10 flex items-center justify-center text-emerald">
                         <Play size={14} fill="currentColor" />
                      </div>
                      <h4 className="font-serif text-xl font-bold text-emerald-dark tracking-tight">{video.title}</h4>
                   </div>
                   <Video size={16} className="text-emerald/20" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Strategic Priorities */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-1 bg-emerald rounded-full"></div>
                <span className="text-emerald font-bold uppercase tracking-[0.2em] text-[10px]">Strategic Focus</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-emerald-dark tracking-tighter">Strategic Priorities</h2>
              <p className="text-emerald/60 mt-3 max-w-lg font-medium leading-relaxed">
                Transforming lives through scripture application literacy and foundational trauma healing across Papua New Guinea.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              {isAdmin && (
                <button 
                  onClick={() => setIsAddingProject(true)}
                  className="bg-emerald text-sand px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-light transition-all shadow-lg shadow-emerald/10 uppercase tracking-widest"
                >
                  <Plus size={18} /> New Priority
                </button>
              )}
              <button 
                onClick={() => setShowManagerMessage(true)}
                className="flex items-center gap-2 text-emerald font-bold border-b-2 border-emerald/20 hover:border-emerald transition-all pb-1 group text-sm uppercase tracking-widest"
              >
                Manager Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {data.projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedProject(project);
                  setShowProjectModal(true);
                }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-emerald/5 hover:shadow-[0_20px_50px_rgba(4,47,46,0.1)] transition-all cursor-pointer relative"
              >
                {isAdmin && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                    className="absolute top-4 right-4 z-20 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <SafeImage 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <ProgressRing progress={project.progress} />
                  </div>
                </div>
                <div className="p-8 flex flex-col h-[300px]">
                  <h4 className="font-serif text-2xl font-bold text-emerald-dark mb-3 tracking-tight line-clamp-1">{project.name}</h4>
                  <p className="text-emerald/60 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">{project.description}</p>
                  
                  {isAdmin ? (
                    <div className="pt-6 border-t border-emerald/5 mt-auto space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-bold text-emerald/40 uppercase tracking-widest block">Financial Status</span>
                          <span className="text-[10px] font-bold text-emerald">{project.progress}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={project.progress}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateProject(project.id, { progress: Number(e.target.value) })}
                          className="w-full accent-emerald h-1.5 rounded-full cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-emerald/5 mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-emerald tracking-[0.2em] mb-1">Latest Update</p>
                        <p className="text-xs text-emerald-dark/80 italic font-medium truncate max-w-[140px] leading-relaxed">"{project.lastStatus}"</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald/5 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-sand transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Project Schedule & Timeline Calendar */}
          <div className="bg-emerald-dark/5 rounded-[3rem] p-10 border border-emerald/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Calendar size={200} className="text-emerald" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-1 bg-emerald-light rounded-full"></div>
                  <span className="text-emerald font-bold uppercase tracking-widest text-[9px]">Mission Timeline</span>
                </div>
                <h3 className="font-serif text-4xl font-bold text-emerald-dark tracking-tight">Project Schedule</h3>
                <p className="text-emerald/60 text-sm font-medium mt-1">Tracking key milestones and community workshops across PNG.</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => setIsAddingEvent(true)}
                  className="bg-emerald text-sand px-6 py-3 rounded-2xl text-[10px] font-bold flex items-center gap-2 hover:bg-emerald-light transition-all shadow-lg shadow-emerald/10 uppercase tracking-widest"
                >
                  <Plus size={16} /> Add Event
                </button>
              )}
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 relative z-10">
              {/* Calendar Grid UI (Left Side) */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-emerald/5 h-full">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-serif text-2xl font-bold text-emerald-dark">
                    {viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
                      className="p-2 hover:bg-emerald/5 rounded-full text-emerald transition-colors"
                    >
                      <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <button 
                      onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
                      className="p-2 hover:bg-emerald/5 rounded-full text-emerald transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] uppercase font-bold text-emerald/30 tracking-widest pb-4">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const year = viewDate.getFullYear();
                    const month = viewDate.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const prevMonthDays = new Date(year, month, 0).getDate();
                    
                    const days = [];
                    // Previous month pad
                    for (let i = 0; i < firstDay; i++) {
                      days.push(
                        <div key={`prev-${i}`} className="aspect-square flex items-center justify-center text-emerald/10 text-xs font-bold">
                          {prevMonthDays - firstDay + i + 1}
                        </div>
                      );
                    }
                    
                    // Current month days
                    for (let d = 1; d <= daysInMonth; d++) {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const dayEvents = data.schedule?.filter(e => e.date === dateStr) || [];
                      const isToday = new Date().toISOString().split('T')[0] === dateStr;

                      days.push(
                        <div 
                          key={d} 
                          onClick={() => {
                            if (isAdmin) {
                              setEventForm({ ...eventForm, date: dateStr });
                              setIsAddingEvent(true);
                            }
                          }}
                          className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl border transition-all cursor-pointer group
                            ${isToday ? 'bg-emerald text-sand border-emerald shadow-lg' : 'bg-transparent border-emerald/5 hover:border-emerald/20 hover:bg-emerald/5'}
                          `}
                        >
                          <span className={`text-sm font-bold ${isToday ? 'text-sand' : 'text-emerald-dark'}`}>{d}</span>
                          {dayEvents.length > 0 && (
                            <div className="absolute bottom-2 flex gap-0.5">
                              {dayEvents.slice(0, 3).map((_, i) => (
                                <div key={i} className={`w-1 h-1 rounded-full ${isToday ? 'bg-sand' : 'bg-emerald'}`} />
                              ))}
                            </div>
                          )}
                          {isAdmin && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-emerald/10 rounded-2xl pointer-events-none">
                              <Plus size={16} className="text-emerald" />
                            </div>
                          )}
                        </div>
                      );
                    }
                    return days;
                  })()}
                </div>
              </div>

              {/* Event List (Right Side) */}
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                   <h5 className="font-serif text-2xl font-bold text-emerald-dark tracking-tight">
                     {(() => {
                        const monthEvents = data.schedule?.filter(e => {
                          const eventDate = new Date(e.date);
                          return eventDate.getMonth() === viewDate.getMonth() && eventDate.getFullYear() === viewDate.getFullYear();
                        }) || [];
                        return monthEvents.length > 0 ? 'Project Activity Blocks' : 'General Department Schedule';
                     })()}
                   </h5>
                   <div className="w-10 h-10 rounded-full bg-emerald/5 flex items-center justify-center text-emerald">
                      <Calendar size={18} />
                   </div>
                </div>
                <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-grow min-h-[400px]">
                  {(() => {
                    const monthEvents = data.schedule?.filter(e => {
                      const eventDate = new Date(e.date);
                      return eventDate.getMonth() === viewDate.getMonth() && eventDate.getFullYear() === viewDate.getFullYear();
                    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

                    if (monthEvents.length > 0) {
                      return monthEvents.map((event, idx) => (
                        <motion.div 
                          key={event.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowParticipantModal(true);
                          }}
                          className="bg-white p-6 rounded-[2rem] border border-emerald/5 shadow-sm hover:shadow-xl transition-all group relative cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-3">
                             <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                event.type === 'milestone' ? 'bg-purple-100 text-purple-600' :
                                event.type === 'deadline' ? 'bg-red-100 text-red-600' :
                                'bg-emerald/10 text-emerald'
                             }`}>
                                {event.type}
                             </div>
                             <p className="text-[10px] font-bold text-emerald/40 font-mono">{event.date}</p>
                          </div>
                          <h6 className="font-bold text-emerald-dark text-base mb-2 group-hover:text-emerald transition-colors">{event.title}</h6>
                          <p className="text-xs text-emerald-dark/40 line-clamp-2 leading-relaxed">{event.description}</p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {event.participants?.slice(0, 3).map((p, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-emerald/10 border-2 border-white flex items-center justify-center text-[8px] font-bold text-emerald">
                                  {p.charAt(0)}
                                </div>
                              ))}
                              {(event.participants?.length || 0) > 3 && (
                                <div className="w-6 h-6 rounded-full bg-emerald/5 border-2 border-white flex items-center justify-center text-[8px] font-bold text-emerald">
                                  +{(event.participants?.length || 0) - 3}
                                </div>
                              )}
                            </div>
                            <Users size={14} className="text-emerald/20" />
                          </div>

                          {isAdmin && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteScheduleEvent(event.id); }}
                              className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </motion.div>
                      ));
                    } else {
                      return (
                        <div className="py-20 text-center bg-white/30 rounded-[2rem] border-2 border-dashed border-emerald/5">
                          <p className="text-emerald/20 font-serif italic text-sm">No special project blocks this month.</p>
                          <p className="text-[9px] uppercase font-bold text-emerald/10 tracking-widest mt-2">Standard operations active</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Equipment & Asset Management Dashboard */}
        <section id="equipment-dashboard" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-emerald/5 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Package size={300} className="text-emerald" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-6">
              <div>
                <h2 className="font-serif text-5xl font-bold text-emerald-dark tracking-tighter mb-4">Asset Management</h2>
                <p className="text-emerald/60 max-w-xl font-medium">Restored tracking system for department assets, inventory, and field equipment.</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => addEquipment('New Mission Asset', 'Hardware', 1)}
                  className="bg-emerald text-sand px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-light transition-all shadow-lg shadow-emerald/10 uppercase tracking-widest"
                >
                  <Plus size={18} /> Add New Asset
                </button>
              )}
            </div>

            <div className="relative z-10 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald/10">
                    <th className="text-left py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold">Item & Name</th>
                    <th className="text-left py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold">Status</th>
                    <th className="text-left py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold">Qty</th>
                    <th className="text-left py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold">Checkout Date</th>
                    <th className="text-left py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold">Return Date</th>
                    {isAdmin && <th className="text-right py-4 text-[10px] uppercase tracking-widest text-emerald/40 font-bold tracking-[0.2em]">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald/5">
                  {data.equipment.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-sand/30 transition-colors group"
                    >
                      <td className="py-5">
                        {isAdmin ? (
                          <input 
                            value={item.name}
                            onChange={(e) => updateEquipment(item.id, { name: e.target.value })}
                            className="font-bold text-emerald-dark bg-transparent border-none focus:ring-0 w-full p-0"
                          />
                        ) : (
                          <span className="font-bold text-emerald-dark">{item.name}</span>
                        )}
                      </td>
                      <td className="py-5">
                        {isAdmin ? (
                          <button 
                            onClick={() => toggleEquipmentStatus(item.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              item.status === 'Available' ? 'bg-emerald/10 text-emerald' : 'bg-orange-100 text-orange-600'
                            } hover:scale-105`}
                          >
                            {item.status}
                          </button>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'Available' ? 'bg-emerald/10 text-emerald' : 'bg-orange-100 text-orange-600'}`}>
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="py-5">
                        {isAdmin ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateEquipment(item.id, { totalQuantity: Math.max(1, item.totalQuantity - 1) })}
                              className="w-6 h-6 rounded bg-emerald/5 flex items-center justify-center text-emerald hover:bg-emerald/10"
                            >
                              -
                            </button>
                            <span className="font-bold text-sm min-w-[1.2rem] text-center">{item.totalQuantity}</span>
                            <button 
                              onClick={() => updateEquipment(item.id, { totalQuantity: item.totalQuantity + 1 })}
                              className="w-6 h-6 rounded bg-emerald/5 flex items-center justify-center text-emerald hover:bg-emerald/10"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-sm font-bold text-emerald/60">{item.totalQuantity} Units</span>
                        )}
                      </td>
                      <td className="py-5">
                        {isAdmin ? (
                          <input 
                            type="date"
                            value={item.checkoutDate || ''}
                            onChange={(e) => updateEquipment(item.id, { checkoutDate: e.target.value })}
                            className="bg-sand/40 text-[10px] font-bold px-2 py-1 rounded focus:outline-none border border-emerald/5"
                          />
                        ) : (
                          <span className="text-xs text-emerald-dark/60 font-medium">{item.checkoutDate || 'Not Tracked'}</span>
                        )}
                      </td>
                      <td className="py-5">
                        {isAdmin ? (
                          <input 
                            type="date"
                            value={item.expectedReturnDate || ''}
                            onChange={(e) => updateEquipment(item.id, { expectedReturnDate: e.target.value })}
                            className="bg-sand/40 text-[10px] font-bold px-2 py-1 rounded focus:outline-none border border-emerald/5"
                          />
                        ) : (
                          <span className="text-xs text-orange-600/80 font-bold">{item.expectedReturnDate || '--'}</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="py-5 text-right">
                          <button 
                            onClick={() => setData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e.id !== item.id) }))}
                            className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl"
                            title="Remove Asset"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Report Archive Section */}
        <section className="relative bg-emerald-dark py-32 text-sand overflow-hidden">
          {/* Authentic PNG Highlands Foggy Landscape Background */}
          <div className="absolute inset-0 z-0">
            <SafeImage 
              src="https://images.unsplash.com/photo-1524338198850-e966434a81ed?auto=format&fit=crop&q=80&w=2000" 
              alt="PNG Highlands" 
              className="w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-dark via-emerald-dark/80 to-emerald-dark"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="w-12 h-1 bg-emerald-light rounded-full"></div>
                  <span className="text-emerald-light font-bold uppercase tracking-[0.2em] text-[10px]">Resource Ecosystem</span>
                </div>
                <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter mb-4">Report Archive</h2>
                <p className="text-sand/40 max-w-lg font-medium">Strategic documentation, impact stories, and field data stored for departmental transparency.</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => setShowReportForm(true)}
                  className="flex items-center gap-2 bg-emerald-light px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-sand hover:text-emerald-dark transition-all shadow-2xl shadow-emerald-light/20"
                >
                  <Plus size={18} /> New Archive
                </button>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth">
              {data.reports.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedReport(item);
                    setShowReportFilesModal(true);
                  }}
                  className="min-w-[12rem] md:min-w-[14rem] snap-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden h-48 shadow-2xl hover:border-emerald-light/30"
                >
                  <SafeImage 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/95 via-emerald-dark/40 to-transparent"></div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                    {isAdmin && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteReport(item.id); }}
                        className="absolute top-4 right-4 p-1.5 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white rounded-lg bg-emerald-dark/40"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    <div className="text-emerald-light mb-2 transform group-hover:scale-110 transition-transform origin-left">
                      {item.title.toLowerCase().includes('budget') || item.title.toLowerCase().includes('finance') ? <BarChart3 size={24}/> : <FileText size={24} />}
                    </div>
                    <div>
                      <h5 className="font-serif text-base font-bold mb-1 tracking-tight leading-tight">{item.title}</h5>
                      <div className="flex items-center justify-between">
                        <p className="text-sand/40 text-[7px] uppercase tracking-[0.2em] font-bold">
                          {item.files?.length || 0} Documents
                        </p>
                        <Download size={10} className="text-emerald-light/40 group-hover:text-emerald-light transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Root Admin Notice / Request Management */}
        {userType === 'Root' && isAdmin && data.pendingRequests.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-20 bg-sand/10">
            <div className="bg-orange-50 border-2 border-orange-100 p-10 rounded-[3rem] shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <UserPlus size={24} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-orange-900 tracking-tight">Access Requests</h3>
                <span className="ml-auto bg-orange-200 text-orange-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Action Required</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.pendingRequests.map(req => (
                  <motion.div 
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col justify-between"
                  >
                    <div className="mb-6">
                      <p className="font-bold text-emerald-dark mb-1 text-lg">{req.email}</p>
                      <p className="text-[10px] text-emerald/40 uppercase font-bold tracking-widest">{req.timestamp}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveRequest(req)}
                        className="flex-1 bg-emerald text-sand py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-light transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => deleteRequest(req.id)}
                        className="px-5 border border-red-100 text-red-500 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
                      >
                        Refuse
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Final Footer Component */}
        <footer className="bg-emerald-dark text-sand py-20 px-6 mt-20 relative overflow-hidden">
          {/* Ukarumpa Base Background Overlay */}
          <div className="absolute inset-0 z-0">
            <SafeImage 
              src="http://googleusercontent.com/image_collection/image_retrieval/2383520574522617965"
              alt="Ukarumpa Base"
              className="w-full h-full object-cover opacity-10"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-light"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald rounded-full flex items-center justify-center text-sand font-serif font-bold text-xl">S</div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight uppercase">Scripture Access PNG</h3>
                </div>
                <p className="text-sand/60 max-w-md text-sm leading-relaxed mb-6">
                  Dedicated to making the living word accessible to every language group in Papua New Guinea through innovative digital tracking and community-based scripture application.
                </p>
                <div className="flex gap-4">
                  {isAdmin && (
                    <button 
                      onClick={() => setShowFooterAdmin(true)}
                      className="text-[10px] font-bold uppercase tracking-widest text-emerald-light border border-emerald-light/20 px-4 py-2 rounded-xl hover:bg-emerald-light/10 transition-all"
                    >
                      <Pencil size={12} className="inline mr-1" /> Edit Contact Info
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-serif text-lg font-bold mb-6 text-emerald-light">Contact Information</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="text-emerald-light mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-sand/30 tracking-widest">Official Email</span>
                      <span className="text-sm font-medium">{data.footer.email}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users size={16} className="text-emerald-light mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-sand/30 tracking-widest">Phone Number</span>
                      <span className="text-sm font-medium">{data.footer.phone}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold mb-6 text-emerald-light">Office Location</h4>
                <li className="flex items-start gap-3 list-none">
                  <ShieldCheck size={16} className="text-emerald-light mt-1 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-sand/30 tracking-widest">Headquarters</span>
                    <span className="text-sm font-medium leading-relaxed">{data.footer.location}</span>
                  </div>
                </li>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] uppercase font-bold text-sand/20 tracking-[0.3em]">
                &copy; {new Date().getFullYear()} Scripture Access PNG Dept. All Rights Reserved.
              </p>
              <div className="flex gap-6 text-[10px] uppercase font-bold text-sand/20 tracking-tighter">
                <span className="opacity-50">Data Secure</span>
                <span className="opacity-50">V.{data.reports.length}.{data.projects.length}</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* --- Modals Ecosystem --- */}

      {/* Project Details / Edit Modal */}
      <AnimatePresence>
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-emerald-dark/90 backdrop-blur-xl" onClick={() => setShowProjectModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-sand rounded-[3rem] overflow-hidden max-w-4xl w-full relative z-10 shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              <button 
                onClick={() => setShowProjectModal(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center text-emerald-dark hover:bg-emerald hover:text-sand transition-all z-20"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-2/5 relative h-64 md:h-full">
                <SafeImage 
                  src={selectedProject.image} 
                  alt={selectedProject.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-sand md:hidden"></div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                {isAdmin ? (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Project Title</label>
                      <input 
                        value={selectedProject.name}
                        onChange={(e) => updateProject(selectedProject.id, { name: e.target.value })}
                        className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-2xl font-serif font-bold text-emerald-dark"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Project Overview (Comprehensive)</label>
                      <textarea 
                        value={selectedProject.description}
                        onChange={(e) => updateProject(selectedProject.id, { description: e.target.value })}
                        className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-sm leading-relaxed text-emerald-dark/70 h-32 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">How to Support (Methods & Sponsorship)</label>
                      <textarea 
                        value={selectedProject.howToSupport || ''}
                        onChange={(e) => updateProject(selectedProject.id, { howToSupport: e.target.value })}
                        placeholder="Provide details on how donors can sponsor this specific initiative..."
                        className="w-full bg-emerald/10 border border-emerald/20 p-4 rounded-2xl text-sm leading-relaxed text-emerald h-32 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Latest Status Update</label>
                      <textarea 
                        value={selectedProject.lastStatus}
                        onChange={(e) => updateProject(selectedProject.id, { lastStatus: e.target.value })}
                        className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-xs italic text-emerald leading-relaxed h-20 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-emerald rounded-full"></div>
                        <span className="text-emerald font-bold uppercase tracking-widest text-[10px]">Active Priority</span>
                      </div>
                      <h3 className="font-serif text-5xl font-bold text-emerald-dark tracking-tighter leading-tight">{selectedProject.name}</h3>
                    </div>
                    
                    <div className="space-y-8">
                      <section>
                        <h5 className="text-[10px] uppercase font-black text-emerald tracking-[0.3em] mb-4">Project Overview</h5>
                        <p className="text-emerald-dark/70 text-lg leading-relaxed font-normal">
                          {selectedProject.description}
                        </p>
                      </section>

                      <section className="bg-emerald/5 rounded-[2.5rem] p-8 md:p-10 border border-emerald/10">
                        <div className="flex items-center gap-3 mb-6">
                           <TrendingUp className="text-emerald" size={20} />
                           <h5 className="font-serif text-2xl font-bold text-emerald-dark">How to Support</h5>
                        </div>
                        <p className="text-emerald-dark/80 text-base leading-relaxed mb-8">
                          {selectedProject.howToSupport || "Thank you for your interest in our mission. Details on specific support needs for this project are currently being updated. Please contact our main office for sponsorship opportunities."}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <button className="bg-emerald text-sand py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">Sponsor Now</button>
                           <button className="bg-sand border border-emerald/20 text-emerald py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald/5 transition-all">Get Materials</button>
                        </div>
                      </section>
                    </div>

                    <div className="bg-emerald-dark p-8 rounded-[2rem] text-sand shadow-2xl">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-emerald-light tracking-widest mb-1">Financial Impact</p>
                          <h6 className="font-serif text-2xl font-bold">Strategic Milestone</h6>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-serif font-bold text-emerald-light">{selectedProject.progress}%</span>
                          <p className="text-[10px] font-bold text-sand/40">FUNDING REACHED</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-sand/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedProject.progress}%` }}
                          className="h-full bg-emerald-light rounded-full"
                        />
                      </div>
                    </div>

                    <div className="border-l-4 border-emerald-light pl-6 py-2">
                      <p className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2">Field Intelligence</p>
                      <p className="text-emerald-dark italic text-lg leading-relaxed font-medium">"{selectedProject.lastStatus}"</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Files Viewer / Upload Modal */}
      <AnimatePresence>
        {showReportFilesModal && selectedReport && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-dark/90 backdrop-blur-xl" onClick={() => setShowReportFilesModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-sand rounded-[3.5rem] overflow-hidden max-w-2xl w-full relative z-10 shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-10 border-b border-emerald/10 flex justify-between items-center bg-sand/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald/10 rounded-2xl text-emerald">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-emerald-dark tracking-tight">{selectedReport.title}</h3>
                    <p className="text-[10px] font-bold text-emerald/40 uppercase tracking-widest">{selectedReport.files?.length || 0} Documents Logged</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReportFilesModal(false)}
                  className="p-3 text-emerald/40 hover:text-emerald transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-4">
                {selectedReport.files && selectedReport.files.length > 0 ? (
                  selectedReport.files.map((file, idx) => (
                    <motion.div 
                      key={file.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-emerald/5 hover:border-emerald/20 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${file.type === 'pdf' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-dark group-hover:text-emerald transition-colors">{file.name}</p>
                          <p className="text-[10px] text-emerald/40 uppercase font-bold tracking-widest">{file.date} • {file.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-emerald/40 hover:text-emerald hover:bg-emerald/5 rounded-lg transition-all" title="View Source">
                          <Eye size={18} />
                        </button>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert(`Downloading ${file.name}...`); }}
                          className="p-2 text-emerald/40 hover:text-emerald hover:bg-emerald/5 rounded-lg transition-all" 
                          title="Download Document"
                        >
                          <Download size={18} />
                        </a>
                        {isAdmin && (
                          <button 
                            onClick={() => deleteFileFromReport(selectedReport.id, file.id)}
                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-emerald/20 font-serif text-xl italic">No documents available in this archive yet.</p>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="p-8 bg-emerald/5 border-t border-emerald/10 flex items-center gap-4">
                  <div className="flex-1 text-center border-2 border-dashed border-emerald/20 p-4 rounded-2xl hover:border-emerald transition-all cursor-pointer group"
                    onClick={() => {
                      const name = prompt("Enter file name:");
                      const type = confirm("Is it a PDF? (Cancel for DOCX)") ? 'pdf' : 'docx';
                      if (name) addFileToReport(selectedReport.id, name, type);
                    }}
                  >
                    <p className="text-[10px] font-bold text-emerald/40 tracking-widest uppercase group-hover:text-emerald transition-colors flex items-center justify-center gap-2">
                      <FileUp size={16} /> Click to Upload Document (PDF/DOCX)
                    </p>
                  </div>
                </div>
              )}
              
              {/* Public specific download for Project Reports DOCX */}
              {selectedReport.title === 'Project Reports' && !isAdmin && (
                <div className="p-8 bg-emerald-dark text-sand">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-emerald-light mb-1">Public Resource</p>
                      <h6 className="font-serif text-lg font-bold">Standard Report Template</h6>
                    </div>
                    <button 
                      onClick={() => alert('Downloading Word Template (.docx)...')}
                      className="flex items-center gap-2 bg-emerald-light px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-emerald-dark hover:bg-sand transition-all"
                    >
                      <Download size={14} /> Download Word Resource
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Project Priority Modal */}
      <AnimatePresence>
        {isAddingProject && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-dark/90 backdrop-blur-xl" onClick={() => setIsAddingProject(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sand p-10 rounded-[3rem] max-w-xl w-full relative z-10 shadow-2xl border border-emerald/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-4xl font-bold text-emerald-dark tracking-tight">New Strategic Priority</h3>
                <button onClick={() => setIsAddingProject(false)} className="text-emerald/40 hover:text-emerald"><X size={32}/></button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Priority Name</label>
                  <input 
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    placeholder="e.g. Literacy Training"
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Mission Content</label>
                  <textarea 
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="Comprehensive description of the mission..."
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl h-32 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">How to Support</label>
                  <textarea 
                    value={projectForm.howToSupport}
                    onChange={(e) => setProjectForm({...projectForm, howToSupport: e.target.value})}
                    placeholder="Specific instructions for sponsorship and support..."
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl h-24 focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Initial Financial status (%)</label>
                    <input 
                      type="number"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({...projectForm, progress: Number(e.target.value)})}
                      className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald/20" />
                      <input 
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                        className="w-full bg-emerald/5 border border-emerald/10 pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={addProject}
                  className="w-full bg-emerald text-sand py-5 rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:bg-emerald-light transition-all shadow-xl shadow-emerald/20"
                >
                  Publish Priority Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Schedule Event Modal */}
      <AnimatePresence>
        {isAddingEvent && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-dark/90 backdrop-blur-xl" 
              onClick={() => setIsAddingEvent(false)}
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-sand p-10 rounded-[3rem] max-w-xl w-full z-10 shadow-2xl border border-emerald/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Calendar size={180} className="text-emerald" />
              </div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-serif text-4xl font-bold text-emerald-dark tracking-tight">Schedule New Event</h3>
                <button onClick={() => setIsAddingEvent(false)} className="w-10 h-10 rounded-full bg-emerald/5 flex items-center justify-center text-emerald hover:bg-emerald/10 transition-all">
                  <X size={20}/>
                </button>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Event Title</label>
                    <input 
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      placeholder="e.g. Highlands Workshop"
                      className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald/20 text-emerald-dark font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Event Date</label>
                    <input 
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald/20 text-emerald-dark font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Type</label>
                    <select 
                      value={eventForm.type}
                      onChange={(e) => setEventForm({...eventForm, type: e.target.value as any})}
                      className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald/20 text-emerald-dark font-bold"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="milestone">Milestone</option>
                      <option value="deadline">Deadline</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 block">Brief Summary</label>
                  <textarea 
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Details about this event..."
                    rows={3}
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald/20 text-emerald-dark font-medium resize-none"
                  />
                </div>
                <button 
                  onClick={addScheduleEvent}
                  className="w-full bg-emerald text-sand py-5 rounded-[2rem] font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-light transition-all shadow-xl shadow-emerald/20 mt-4"
                >
                  Confirm Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManagerMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-emerald-dark/60 backdrop-blur-md" onClick={() => setShowManagerMessage(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-sand rounded-[40px] overflow-hidden max-w-lg w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowManagerMessage(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-sand rounded-full flex items-center justify-center text-emerald-dark shadow-md hover:bg-emerald hover:text-sand transition-all z-20"
              >
                <X size={20} />
              </button>
              <div className="relative h-64">
                <SafeImage 
                  src="https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&q=80&w=800" 
                  alt="PNG Nature" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sand via-transparent to-transparent"></div>
              </div>
              <div className="p-10 text-center">
                <span className="text-emerald-light uppercase font-bold tracking-widest text-[10px]">A Message From Management</span>
                <h3 className="font-serif text-3xl font-bold text-emerald-dark mt-2 mb-4 italic">"Transforming Lives Through Access"</h3>
                <p className="text-emerald-dark/60 text-sm leading-relaxed mb-8">
                  Welcome to our new digital hub. This platform represents our commitment to transparency and efficiency as we bring the Word of God to every corner of PNG. Thank you for your continued support in our strategic priorities.
                </p>
                <button 
                  onClick={() => setShowManagerMessage(false)}
                  className="bg-emerald-dark text-sand w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald transition-colors"
                >
                  Close Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-dark/80 backdrop-blur-sm" onClick={() => setShowAdminLogin(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sand p-10 rounded-[2.5rem] max-w-md w-full relative z-10 shadow-2xl border border-emerald/10"
            >
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-6 right-6 p-2 text-emerald/40 hover:text-emerald transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} className="text-emerald" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-emerald-dark">Admin Access</h3>
                <p className="text-emerald/60 text-sm mt-2">Enter your authorized email to continue.</p>
              </div>
              <div className="space-y-4">
                {managerStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest ${
                      managerStatus.includes('Denied') || managerStatus.includes('already') 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : 'bg-emerald/5 text-emerald border border-emerald/10'
                    }`}
                  >
                    {managerStatus}
                  </motion.div>
                )}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 mb-2 tracking-[0.2em]">Authorized Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald/20" />
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.g. manager@sil.org.pg"
                      className="w-full bg-emerald/5 border border-emerald/10 px-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald/20 font-medium text-emerald-dark"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleLogin}
                    className="flex-1 bg-emerald text-sand py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-light transition-all shadow-lg shadow-emerald/10"
                  >
                    Login
                  </button>
                  <button 
                    onClick={handleRequestAccess}
                    className="flex-1 bg-emerald/10 text-emerald py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald/20 transition-all"
                  >
                    Request Access
                  </button>
                </div>
                <p className="text-[10px] text-center text-emerald/30 font-medium px-4 mt-4">
                  By logging in, you agree to our internal safety and transparency protocols.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Archive Add Form */}
      <AnimatePresence>
        {showReportForm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-dark/80 backdrop-blur-sm" onClick={() => setShowReportForm(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sand p-10 rounded-[2.5rem] max-w-md w-full relative z-10 shadow-2xl border border-emerald/10"
            >
              <h3 className="font-serif text-3xl font-bold text-emerald-dark mb-6">New Archive block</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 mb-2">Block Title</label>
                  <input 
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    placeholder="e.g. Financial Audit 2024"
                    className="w-full bg-emerald/5 border border-emerald/10 px-5 py-4 rounded-2xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 mb-2">Category</label>
                  <input 
                    value={newReport.category}
                    onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                    placeholder="e.g. Finance"
                    className="w-full bg-emerald/5 border border-emerald/10 px-5 py-4 rounded-2xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 mb-2">Document Count</label>
                  <input 
                    type="number"
                    value={newReport.count}
                    onChange={(e) => setNewReport({...newReport, count: Number(e.target.value)})}
                    className="w-full bg-emerald/5 border border-emerald/10 px-5 py-4 rounded-2xl focus:outline-none"
                  />
                </div>
                <button 
                  onClick={addReport}
                  className="w-full bg-emerald text-sand py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-light transition-all"
                >
                  Create Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Participant Modal */}
      <AnimatePresence>
        {showParticipantModal && selectedEvent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowParticipantModal(false)}
              className="absolute inset-0 bg-emerald-dark/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-sand w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl border border-emerald/10"
            >
              <div className="bg-emerald p-10 text-sand relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                   <Users size={120} />
                </div>
                <button 
                  onClick={() => setShowParticipantModal(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <X size={20} />
                </button>
                <div className="relative z-10">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">{selectedEvent.type}</span>
                  <h3 className="font-serif text-3xl font-bold mb-2">{selectedEvent.title}</h3>
                  <p className="text-sand/70 text-sm font-mono">{selectedEvent.date}</p>
                </div>
              </div>
              <div className="p-10">
                <h4 className="text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-emerald/20"></div> Who is Participating?
                </h4>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                    selectedEvent.participants.map((person, i) => (
                      <motion.div 
                        key={person + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 bg-emerald/5 rounded-2xl border border-emerald/5"
                      >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center text-emerald font-bold">
                             {person.charAt(0)}
                           </div>
                           <span className="font-bold text-emerald-dark">{person}</span>
                         </div>
                         {isAdmin && (
                           <button 
                             onClick={() => {
                               const updatedParticipants = selectedEvent.participants?.filter(p => p !== person) || [];
                               const updatedEvent = { ...selectedEvent, participants: updatedParticipants };
                               setSelectedEvent(updatedEvent);
                               setData(prev => ({
                                 ...prev,
                                 schedule: prev.schedule.map(s => s.id === selectedEvent.id ? updatedEvent : s)
                               }));
                             }}
                             className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                           >
                             <Trash2 size={16} />
                           </button>
                         )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm italic text-emerald/40 text-center py-6">No participants listed.</p>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex gap-3 pt-6 border-t border-emerald/5">
                    <input 
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      placeholder="Add person/team..."
                      className="flex-1 bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-emerald outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (!participantInput) return;
                        const updatedParticipants = [...(selectedEvent.participants || []), participantInput];
                        const updatedEvent = { ...selectedEvent, participants: updatedParticipants };
                        setSelectedEvent(updatedEvent);
                        setData(prev => ({
                          ...prev,
                          schedule: prev.schedule.map(s => s.id === selectedEvent.id ? updatedEvent : s)
                        }));
                        setParticipantInput('');
                      }}
                      className="bg-emerald text-sand px-6 rounded-2xl font-bold flex items-center justify-center hover:bg-emerald-light transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Request Management Toggle (Root Only) */}
      <AnimatePresence>
        {isAdmin && userType === 'Root' && (
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setShowAdminManagement(true)}
              className="w-16 h-16 bg-emerald text-sand rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative"
            >
              <Users size={24} />
              {data.pendingRequests.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-sand font-bold">
                  {data.pendingRequests.length}
                </div>
              )}
              <span className="absolute right-20 bg-emerald-dark text-sand px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Admin Management
              </span>
            </button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdminManagement && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-emerald-dark/60 backdrop-blur-md" onClick={() => setShowAdminManagement(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-sand p-10 rounded-[3rem] max-w-2xl w-full relative z-10 shadow-3xl border border-emerald/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-emerald-dark">Admin Request Management</h3>
                  <p className="text-emerald/60 text-sm mt-1">Review and approve access for department staff.</p>
                </div>
                <button 
                  onClick={() => setShowAdminManagement(false)}
                  className="w-12 h-12 rounded-full bg-emerald/5 flex items-center justify-center text-emerald hover:bg-emerald/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-emerald/40 tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-emerald/20"></div> Pending Requests ({data.pendingRequests.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                    {data.pendingRequests.length > 0 ? (
                      data.pendingRequests.map((req) => (
                        <div key={req.id} className="bg-white p-5 rounded-2xl border border-emerald/5 flex items-center justify-between group">
                          <div>
                            <p className="font-bold text-emerald-dark">{req.email}</p>
                            <p className="text-[10px] text-emerald/40 font-mono">{req.timestamp}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => approveRequest(req)}
                              className="px-4 py-2 bg-emerald text-sand rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-light transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => deleteRequest(req.id)}
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-emerald/5 rounded-2xl border border-dashed border-emerald/10">
                        <p className="text-sm italic text-emerald/30 font-serif">No pending requests at this time.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold text-emerald/40 tracking-[0.2em] mb-4 flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-emerald/20"></div> Authorized Co-Admins ({data.authorizedCoAdmins.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.authorizedCoAdmins.map((email) => (
                      <div key={email} className="bg-emerald/10 px-4 py-2 rounded-xl flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald">{email}</span>
                        <button 
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              authorizedCoAdmins: prev.authorizedCoAdmins.filter(e => e !== email)
                            }));
                          }}
                          className="text-emerald/40 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {data.authorizedCoAdmins.length === 0 && (
                      <p className="text-xs italic text-emerald/30">No co-admins authorized yet.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-emerald/5 text-center">
                <p className="text-[10px] text-emerald/30 font-medium">
                  Root Admin Status: {ROOT_ADMIN}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFooterAdmin && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFooterAdmin(false)}
              className="absolute inset-0 bg-emerald-dark/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-sand w-full max-w-lg rounded-[3rem] p-10 overflow-hidden shadow-2xl border border-emerald/10"
            >
              <h3 className="font-serif text-3xl font-bold text-emerald-dark mb-8">Update Footer Contact</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 px-1">Official Email</label>
                  <input 
                    value={footerForm.email}
                    onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 px-1">Phone Number</label>
                  <input 
                    value={footerForm.phone}
                    onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald/40 tracking-widest mb-2 px-1">Office Location</label>
                  <textarea 
                    value={footerForm.location}
                    onChange={(e) => setFooterForm({ ...footerForm, location: e.target.value })}
                    rows={2}
                    className="w-full bg-emerald/5 border border-emerald/10 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald resize-none"
                  />
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => setShowFooterAdmin(false)}
                    className="flex-1 py-4 text-emerald font-bold hover:bg-emerald/5 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={updateFooter}
                    className="flex-1 py-4 bg-emerald text-sand font-bold rounded-2xl shadow-lg shadow-emerald/20 hover:bg-emerald-light transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

