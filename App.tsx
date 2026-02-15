import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { UserRole, User, Announcement, Grievance, GrievanceStatus, Carpool, Course } from './types';
import { Dashboard } from './views/Dashboard';
import { GrievanceView } from './views/GrievanceView';
import { AcademicVault } from './views/AcademicVault';
import { OpportunityPortal } from './views/OpportunityPortal';
import { CampusHub } from './views/CampusHub';
import { MessHostelPortal } from './views/MessHostelPortal';
import { Login } from './views/Login';
import { ProgrammingHub } from './views/ProgrammingHub';
import { AdminHub } from './views/AdminHub';

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: 'a1', 
    title: 'Campus Network Maintenance', 
    author: 'IT ADMIN', 
    date: '2 hours ago', 
    content: 'Scheduled maintenance for the campus backbone network will occur this Sunday from 2 AM to 6 AM.', 
    elaboration: 'The maintenance will focus on upgrading the core routers in North Campus to support the new AEGIS Ecosystem integration.',
    priority: 'HIGH',
    targetAudience: 'GLOBAL'
  },
  { 
    id: 'a2', 
    title: 'Faculty Research Grant Applications', 
    author: 'DEAN OFFICE', 
    date: '5 hours ago', 
    content: 'The 2024-25 Himalayan Research Grant window is now open for all tenure-track faculty.', 
    elaboration: 'Grants up to 25L available for projects focusing on sustainable development.',
    priority: 'MEDIUM',
    targetAudience: 'FACULTY'
  }
];

const INITIAL_GRIEVANCES: Grievance[] = [
  { id: 'C-001', category: 'Hostel - Water Supply Issue', description: 'No water in Block C since morning.', status: GrievanceStatus.RESOLVED, submittedBy: 'B25001', date: '2026-02-10', adminComment: 'Water pump was replaced. System is back online.' },
  { id: 'C-002', category: 'Mess - Food Quality', description: 'The lunch served today was undercooked.', status: GrievanceStatus.PENDING, submittedBy: 'B24123', date: '2026-02-14' },
];

const INITIAL_CARPOOLS: Carpool[] = [
  { id: 'cp1', author: 'B22005', from: 'North Campus', to: 'Mandi Bus Stand', time: '14:30 Today', carType: 'SUV', joined: 2, max: 4, totalPrice: 800, status: 'OPEN', joinedUserIds: ['B22005', 'B22010'] },
  { id: 'cp2', author: 'B23441', from: 'Kamand', to: 'Rewalsar Lake', time: '09:00 Tomorrow', carType: 'Sedan', joined: 1, max: 3, totalPrice: 1200, status: 'OPEN', joinedUserIds: ['B23441'] },
];

const TEACHERS = ['Dr. S. Shukla', 'Deepak Sachan', 'Dr. Rahul Dev', 'Dr. Amit Singh', 'Dr. Priya Das', 'Prof. Khanna', 'Dr. Vikram Seth'];

const INITIAL_COURSES: any[] = [
  { id: '1-MA101', code: 'MA101', name: 'Calculus & Linear Algebra', credits: 4, instructor: 'Dr. Rahul Dev', teacher: 'Dr. Rahul Dev', semester: 1, materialsCount: 15, progress: 100, grade: 'A', syllabusMid: ['Foundations', 'History'], syllabusEnd: ['Optimization'], midSemDate: '2026 Sept 15', endSemDate: '2026 Nov 22' },
  { id: '2-CS102', code: 'CS102', name: 'Data Structures', credits: 4, instructor: 'Dr. S. Shukla', teacher: 'Dr. S. Shukla', semester: 2, materialsCount: 12, progress: 100, grade: 'S', syllabusMid: ['Arrays', 'Lists'], syllabusEnd: ['Graphs'], midSemDate: '2026 March 15', endSemDate: '2026 May 22' },
  { id: '5-CS301', code: 'CS301', name: 'Computer Networks', credits: 4, instructor: 'Dr. Amit Singh', teacher: 'Dr. Amit Singh', semester: 5, materialsCount: 20, progress: 65, syllabusMid: ['OSI Model'], syllabusEnd: ['Routing'], midSemDate: '2026 Sept 15', endSemDate: '2026 Nov 22' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('general');
  const [hubSection, setHubSection] = useState<'ANNOUNCEMENTS' | 'CARPOOL'>('ANNOUNCEMENTS');
  
  const [globalAnnouncements, setGlobalAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [allGrievances, setAllGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [allCarpools, setAllCarpools] = useState<Carpool[]>(INITIAL_CARPOOLS);
  const [allCourses, setAllCourses] = useState<any[]>(INITIAL_COURSES);

  useEffect(() => {
    if (currentUser?.role === UserRole.STUDENT && activeTab === 'admin-panel') {
      setActiveTab('dashboard');
    }
  }, [currentUser?.role]);

  const handleLogin = (role: UserRole, id: string, semester?: number) => {
    setCurrentUser({
      id,
      name: role === UserRole.STUDENT ? `Student ${id}` : role === UserRole.FACULTY ? `Prof. ${id}` : 'AEGIS Superuser',
      email: `${id.toLowerCase()}@campus.edu`,
      role,
      department: role === UserRole.ADMIN ? 'System Control' : 'Computer Science',
      semester: semester,
      teachingSubjectPrefix: role === UserRole.FACULTY ? 'CS' : undefined
    });
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addAnnouncement = (ann: Announcement) => setGlobalAnnouncements(prev => [ann, ...prev]);
  const removeAnnouncement = (id: string) => setGlobalAnnouncements(prev => prev.filter(a => a.id !== id));

  const addGrievance = (g: Grievance) => setAllGrievances(prev => [g, ...prev]);
  const updateGrievance = (id: string, updates: Partial<Grievance>) => {
    setAllGrievances(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const addCarpool = (cp: Carpool) => setAllCarpools(prev => [cp, ...prev]);
  const joinCarpool = (id: string) => {
    if (!currentUser) return;
    setAllCarpools(prev => prev.map(cp => {
      if (cp.id === id && cp.joined < cp.max && !cp.joinedUserIds.includes(currentUser.id)) {
        const newJoined = cp.joined + 1;
        return { 
          ...cp, 
          joined: newJoined, 
          status: newJoined === cp.max ? 'FILLED' : 'OPEN',
          joinedUserIds: [...cp.joinedUserIds, currentUser.id]
        };
      }
      return cp;
    }));
  };

  const addCourse = (course: any) => setAllCourses(prev => [...prev, course]);
  const removeCourse = (id: string) => setAllCourses(prev => prev.filter(c => c.id !== id));

  const navigateToHubSection = (section: 'ANNOUNCEMENTS' | 'CARPOOL') => {
    setHubSection(section);
    setActiveTab('hub');
  };

  const handleTabChange = (id: string, subSection?: 'ANNOUNCEMENTS' | 'CARPOOL') => {
    setActiveTab(id);
    if (id === 'hub' && subSection) {
      setHubSection(subSection);
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={currentUser.role} subTab={activeSubTab} onNavigateToHub={navigateToHubSection} />;
      case 'hostel-mess':
        return <MessHostelPortal />;
      case 'programming-hub':
        return <ProgrammingHub />;
      case 'grievances':
        return <GrievanceView 
          role={currentUser.role} 
          userId={currentUser.id}
          grievances={allGrievances}
          onAddGrievance={addGrievance}
          onUpdateGrievance={updateGrievance}
        />;
      case 'vault':
        return (
          <AcademicVault 
            user={currentUser} 
            allCourses={allCourses} 
            onAddCourse={addCourse} 
            onRemoveCourse={removeCourse} 
            onAddAnnouncement={addAnnouncement}
          />
        );
      case 'opportunities':
        return <OpportunityPortal />;
      case 'hub':
      case 'announcements':
        return (
          <CampusHub 
            initialSection={hubSection} 
            userRole={currentUser.role} 
            userSemester={currentUser.semester}
            userId={currentUser.id}
            announcements={globalAnnouncements}
            onAddAnnouncement={addAnnouncement}
            onRemoveAnnouncement={removeAnnouncement}
            carpools={allCarpools}
            onAddCarpool={addCarpool}
            onJoinCarpool={joinCarpool}
          />
        );
      case 'admin-panel':
        return (
          <AdminHub 
            announcements={globalAnnouncements} 
            onAdd={addAnnouncement} 
            onRemove={removeAnnouncement} 
          />
        );
      default:
        return <Dashboard role={currentUser.role} subTab={activeSubTab} onNavigateToHub={navigateToHubSection} />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <Layout 
      currentRole={currentUser?.role || UserRole.STUDENT} 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      activeSubTab={activeSubTab}
      onSubTabChange={setActiveSubTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;