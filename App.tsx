
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserRole } from './types';
import { Dashboard } from './views/Dashboard';
import { GrievanceView } from './views/GrievanceView';
import { AcademicVault } from './views/AcademicVault';
import { OpportunityPortal } from './views/OpportunityPortal';
import { CampusHub } from './views/CampusHub';
import { MessHostelPortal } from './views/MessHostelPortal';
import { Login } from './views/Login';
import { ProgrammingHub } from './views/ProgrammingHub';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.STUDENT);
  const [userId, setUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Clear tab on role switch
  useEffect(() => {
    if (currentRole === UserRole.STUDENT && activeTab === 'admin-panel') {
      setActiveTab('dashboard');
    }
    if (currentRole === UserRole.ADMIN && (activeTab === 'vault' || activeTab === 'opportunities' || activeTab === 'programming-hub')) {
      setActiveTab('dashboard');
    }
  }, [currentRole]);

  const handleLogin = (role: UserRole, id: string) => {
    setCurrentRole(role);
    setUserId(id);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={currentRole} />;
      case 'hostel-mess':
        return <MessHostelPortal />;
      case 'programming-hub':
        return <ProgrammingHub />;
      case 'grievances':
        return <GrievanceView role={currentRole} />;
      case 'vault':
        return <AcademicVault role={currentRole} />;
      case 'opportunities':
        return <OpportunityPortal />;
      case 'hub':
        return <CampusHub />;
      case 'admin-panel':
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold mb-4">System Settings</h3>
            <p className="text-slate-500">Advanced configurations for AEGIS Protocol administrators.</p>
            <div className="mt-8 space-y-6">
              <div className="p-4 border rounded-xl flex justify-between items-center bg-slate-50/50">
                <div>
                  <p className="font-bold">Role Propagation</p>
                  <p className="text-xs text-slate-500">Enable automatic permission sync across services.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="p-4 border rounded-xl flex justify-between items-center bg-slate-50/50">
                <div>
                  <p className="font-bold">AI Moderation</p>
                  <p className="text-xs text-slate-500">Use Gemini to pre-screen grievance submissions.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard role={currentRole} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentRole={currentRole} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
