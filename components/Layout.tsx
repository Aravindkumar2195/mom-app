import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FilePlus, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded text-white font-bold">MoM</div>
            <h1 className="text-xl font-bold tracking-tight">AutoMoM</h1>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => onChangeView('DASHBOARD')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'DASHBOARD' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => onChangeView('CREATE_MOM')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'CREATE_MOM' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FilePlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Visit</span>
            </button>
            <button
              onClick={() => onChangeView('HISTORY')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'HISTORY' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
