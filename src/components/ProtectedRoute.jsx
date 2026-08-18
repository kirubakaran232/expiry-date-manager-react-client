import { useAuth } from '../context/AuthContext';

/**
 * Wraps a page component. Waits for the session check to resolve, then
 * redirects to /login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Still verifying the cookie with the server — don't redirect yet
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        window.location.replace('/login');
        return null;
    }

    return children;
};

export default ProtectedRoute;
