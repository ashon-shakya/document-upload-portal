import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const AuthRoute = () => {
    const { userData, isCheckingAuth } = useAppSelector((state) => state.user);

    if (isCheckingAuth) {
        // App.tsx handles the global loader, so we can just return null here
        // or return a local loader if App didn't block rendering.
        return null;
    }

    // If userData is present, allow access to the protected routes
    // Otherwise, redirect to login page
    return userData ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute;
