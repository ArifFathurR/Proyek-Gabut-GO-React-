import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    // If still loading auth state, show nothing or a spinner
    if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>Loading...</div>;

    // If not authenticated, redirect to login
    if (!user && !localStorage.getItem('token')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
