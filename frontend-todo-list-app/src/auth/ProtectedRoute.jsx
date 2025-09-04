import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute() {
    const { isAuth } = useAuth();
    const location = useLocation();

    if (!isAuth) {
        
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <Outlet />;
}
