import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';
import DocumentUpload from './pages/DocumentUpload/DocumentUpload';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import AuthRoute from './components/AuthRoute/AuthRoute';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUserData, setIsCheckingAuth } from './store/userSlice';
import apiProcessor from './api/apiProcessor';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiProcessor.get('/auth/profile');
        if (response.data && response.data.data) {
          dispatch(setUserData(response.data.data));
        } else if (response.data) {
          dispatch(setUserData(response.data));
        }
      } catch (error) {
        console.error('Initial auto-login failed or invalid session:', error);
      } finally {
        dispatch(setIsCheckingAuth(false));
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected/Main Routes Wrapped in Layout */}
        <Route element={<AuthRoute />}>
          <Route path="/document-upload" element={<Layout />}>
            <Route index element={<DocumentUpload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
