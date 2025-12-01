import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CircularProgress, Stack } from '@mui/material';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import LoginPage from './pages/Login.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import EventsPage from './pages/Events.jsx';
import AlertsPage from './pages/Alerts.jsx';
import PoliciesPage from './pages/Policies.jsx';
import ReportsPage from './pages/Reports.jsx';
import MonitoringPage from './pages/Monitoring.jsx';
import ResourcesMonitoringPage from './pages/ResourcesMonitoring.jsx';
import LogsPage from './pages/Logs.jsx';
import TicketsPage from './pages/Tickets.jsx';
import TrafficFlowPage from './pages/TrafficFlow.jsx';
import { useAuthContext } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="resources" element={<ResourcesMonitoringPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="traffic-flow" element={<TrafficFlowPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
