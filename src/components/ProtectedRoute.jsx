import { useAuth } from '../context/AuthContext';

/**
 * Wraps a page component. Redirects to /login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        window.location.replace('/login');
        return null;
    }

    return children;
};

export default ProtectedRoute;
