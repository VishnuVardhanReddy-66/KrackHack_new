
import React from 'react';
import { UserRole } from '../types';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
        {trend && <p className="text-xs text-emerald-600 mt-2 font-medium">↑ {trend} from last month</p>}
      </div>
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
        {icon}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<{ role: UserRole }> = ({ role }) => {
  const renderStudentDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Current GPA" value="3.85" icon="🎓" trend="0.2" />
        <MetricCard label="Mess Balance" value="₹4,200" icon="🍱" />
        <MetricCard label="Attendance" value="92%" icon="📈" />
        <MetricCard label="Next Class" value="10:30 AM" icon="⏰" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Academic Tracker</h4>
          <div className="space-y-4">
            {[
              { name: 'Data Structures (CS201)', progress: 75 },
              { name: 'Microprocessors (EE301)', progress: 40 },
              { name: 'Environmental Science', progress: 90 },
            ].map(course => (
              <div key={course.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{course.name}</span>
                  <span className="text-slate-500 font-mono font-bold">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h4 className="text-lg font-bold mb-2">Hostel Insight</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your room maintenance for Surajtaal - α is pending. Weekly hygiene audit scheduled for Friday.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-blue-400 transition-colors">View Audit Details</button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  const renderFacultyDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Students Advised" value="45" icon="👥" />
        <MetricCard label="Research Grants" value="2" icon="🔬" />
        <MetricCard label="Grievances Resolved" value="12" icon="✅" trend="4" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4">Lecture Schedule - North Campus</h4>
        <div className="divide-y divide-slate-100">
          {[
            { time: '09:00 AM', event: 'CS101 - Intro to Programming', location: 'Hall A1' },
            { time: '11:30 AM', event: 'Faculty Meeting', location: 'Main Admin' },
            { time: '02:00 PM', event: 'Lab Session - OS', location: 'Computer Lab 2' },
          ].map((item, i) => (
            <div key={i} className="py-4 flex items-center justify-between group">
              <div className="flex gap-4">
                <span className="font-mono text-blue-600 font-bold">{item.time}</span>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.event}</p>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">⋯</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Students" value="1,840" icon="🎓" />
        <MetricCard label="Mess Revenue" value="₹1.2Cr" icon="💳" />
        <MetricCard label="Maintenance Tasks" value="18" icon="🛠️" />
        <MetricCard label="Safety Alerts" value="0" icon="🛡️" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="text-lg font-bold text-slate-800">Operational Logs</h4>
          <button className="text-blue-600 text-sm font-bold hover:underline transition-colors">Download CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-3">Log ID</th>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {[
                { id: 'LOG-891', entity: 'Alder Mess', action: 'Menu Updated', time: '12:05' },
                { id: 'LOG-892', entity: 'Surajtaal - α', action: 'Maintenance Ticket Closed', time: '11:50' },
                { id: 'LOG-893', entity: 'Peepal Mess', action: 'Hygiene Audit Logged', time: '10:15' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">{log.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{log.entity}</td>
                  <td className="px-6 py-4 text-slate-600">{log.action}</td>
                  <td className="px-6 py-4 text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold text-slate-900">Welcome, {role === UserRole.STUDENT ? 'Student' : role}!</h3>
          <p className="text-slate-500 font-medium">IIT Mandi Unified Ecosystem | North & South Campus Connectivity</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Environment</p>
          <p className="text-xl font-bold text-slate-800">14°C Mandi, HP</p>
        </div>
      </div>

      {role === UserRole.STUDENT && renderStudentDashboard()}
      {role === UserRole.FACULTY && renderFacultyDashboard()}
      {role === UserRole.ADMIN && renderAdminDashboard()}
    </div>
  );
};
