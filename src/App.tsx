import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import ApprovedRoute from './components/common/ApprovedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ExamAnalysisPage from './pages/ExamAnalysisPage';
import FunctionDictionaryPage from './pages/FunctionDictionaryPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import BoardPage from './pages/BoardPage';
import QuestionCreatePage from './pages/QuestionCreatePage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import QuestionEditPage from './pages/QuestionEditPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={
                <ApprovedRoute>
                  <ExamAnalysisPage />
                </ApprovedRoute>
              } />
              <Route path="dashboard" element={
                <ApprovedRoute>
                  <DashboardPage />
                </ApprovedRoute>
              } />
              <Route path="settings" element={<AccountSettingsPage />} />
              <Route path="exam-analysis" element={
                <ApprovedRoute>
                  <ExamAnalysisPage />
                </ApprovedRoute>
              } />
              <Route path="function-dictionary" element={
                <ApprovedRoute>
                  <FunctionDictionaryPage />
                </ApprovedRoute>
              } />
              <Route path="board" element={
                <ApprovedRoute>
                  <BoardPage />
                </ApprovedRoute>
              } />
              <Route path="board/new" element={
                <ApprovedRoute>
                  <QuestionCreatePage />
                </ApprovedRoute>
              } />
              <Route path="board/:questionId" element={
                <ApprovedRoute>
                  <QuestionDetailPage />
                </ApprovedRoute>
              } />
              <Route path="board/:questionId/edit" element={
                <ApprovedRoute>
                  <QuestionEditPage />
                </ApprovedRoute>
              } />
              <Route path="upload" element={
                <AdminRoute>
                  <UploadPage />
                </AdminRoute>
              } />
              <Route path="admin" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
              <Route path="admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
