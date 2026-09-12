import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { PageLoader } from './components/ui/Loading';

import Login from './pages/Login';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminTasks from './pages/admin/Tasks';
import TeamProgress from './pages/admin/TeamProgress';
import AdminTaskHistory from './pages/admin/TaskHistory';
import AdminSettings from './pages/admin/Settings';

import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/Dashboard';
import MyTasks from './pages/user/MyTasks';
import MyProgress from './pages/user/MyProgress';
import UserTaskHistory from './pages/user/TaskHistory';
import UserSettings from './pages/user/Settings';

function RootRedirect() {
  const { user, initializing } = useAuth();
  if (initializing) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
}

function LoginRoute() {
  const { user, initializing } = useAuth();
  if (initializing) return <PageLoader />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  return <Login />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginRoute />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="tasks" element={<AdminTasks />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetail />} />
                <Route path="team-progress" element={<TeamProgress />} />
                <Route path="history" element={<AdminTaskHistory />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route
                path="/app"
                element={
                  <ProtectedRoute role="employee">
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="my-progress" element={<MyProgress />} />
                <Route path="history" element={<UserTaskHistory />} />
                <Route path="settings" element={<UserSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
