import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CreateMomFlow } from './components/CreateMomFlow';
import { HistoryView } from './components/HistoryView';
import { AuthLayout } from './components/auth/AuthLayout';
import { ViewState, MeetingRecord, Supplier } from './types';
import { getSuppliers, getMeetingRecords } from './services/storageService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard: React.FC<{ onChangeView: (v: ViewState) => void }> = ({ onChangeView }) => {
  const [records, setRecords] = useState<MeetingRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [r, s] = await Promise.all([getMeetingRecords(), getSuppliers()]);
      setRecords(r);
      setSuppliers(s);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Basic stats
  const totalVisits = records.length;
  const totalOpenPoints = records.reduce((acc, r) => acc + r.observations.filter(o => o.status === 'OPEN').length, 0);

  // Data for charts
  const statusData = [
    { name: 'Open Issues', value: totalOpenPoints, color: '#EF4444' },
    { name: 'Closed Issues', value: records.reduce((acc, r) => acc + r.observations.filter(o => o.status === 'CLOSED').length, 0), color: '#10B981' },
  ];

  const recentVisits = records.slice(0, 5).map(r => ({
    name: r.supplierName.substring(0, 10),
    issues: r.observations.length
  }));

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Total Visits</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Active Suppliers</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{suppliers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium uppercase">Open Action Points</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{totalOpenPoints}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Observation Status</h3>
          <div className="h-64 w-full">
            {totalVisits > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-slate-400">No data available</div>}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Issues per Recent Visit</h3>
          <div className="h-64 w-full">
            {totalVisits > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentVisits}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="issues" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-slate-400">No data available</div>}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => onChangeView('CREATE_MOM')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg transform transition hover:-translate-y-1 text-lg flex items-center"
        >
          Start New Supplier Visit
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [editingRecord, setEditingRecord] = useState<MeetingRecord | null>(null);

  const handleChangeView = (view: ViewState) => {
    // If switching to Create MOM manually (e.g. from nav), we assume new visit, so clear edit state.
    // If we are actually coming from 'Edit', the edit handler would have set the state and changed view already.
    if (view === 'CREATE_MOM') {
      setEditingRecord(null);
    }
    setCurrentView(view);
  };

  const handleEditRecord = (record: MeetingRecord) => {
    setEditingRecord(record);
    setCurrentView('CREATE_MOM');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard onChangeView={handleChangeView} />;
      case 'CREATE_MOM':
        return (
          <CreateMomFlow
            onComplete={() => {
              setEditingRecord(null);
              setCurrentView('HISTORY');
            }}
            initialData={editingRecord}
          />
        );
      case 'HISTORY':
        return <HistoryView onEdit={handleEditRecord} />;
      default:
        return <Dashboard onChangeView={handleChangeView} />;
    }
  };

  return (
    <AuthLayout>
      <Layout currentView={currentView} onChangeView={handleChangeView}>
        {renderContent()}
      </Layout>
    </AuthLayout>
  );
};

export default App;