import React from 'react';
import { useCase } from './context/CaseContext';

import Sidebar from './components/Navigation/Sidebar';
import Topbar from './components/Navigation/Topbar';
import AiCopilotDrawer from './components/AiCopilot/AiCopilotDrawer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WalletInvestigationPage from './pages/WalletInvestigationPage';
import WorkspacePage from './pages/WorkspacePage';
import TransactionsPage from './pages/TransactionsPage';
import TxDetailPage from './pages/TxDetailPage';
import FundFlowGraphPage from './pages/FundFlowGraphPage';
import CrossChainPage from './pages/CrossChainPage';
import VaspPage from './pages/VaspPage';
import RiskPage from './pages/RiskPage';
import CounterpartiesPage from './pages/CounterpartiesPage';
import AlertsPage from './pages/AlertsPage';
import LiveMonitorPage from './pages/LiveMonitorPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import ProfileModal from './components/Profile/ProfileModal';

export default function App() {
  const { activePage, toasts } = useCase();

  if (activePage === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  if (activePage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'wallet': return <WalletInvestigationPage />;
      case 'workspace': return <WorkspacePage />;
      case 'transactions': return <TransactionsPage />;
      case 'txdetail': return <TxDetailPage />;
      case 'graph': return <FundFlowGraphPage />;
      case 'crosschain': return <CrossChainPage />;
      case 'vasp': return <VaspPage />;
      case 'risk': return <RiskPage />;
      case 'counterparties': return <CounterpartiesPage />;
      case 'alerts': return <AlertsPage />;
      case 'livemonitor': return <LiveMonitorPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      case 'admin': return <AdminPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
      </div>

      {/* Floating AI Copilot Drawer */}
      <AiCopilotDrawer />

      {/* Profile & Credentials Modal */}
      <ProfileModal />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.msg}
        </div>
      ))}
    </div>
  );
}
