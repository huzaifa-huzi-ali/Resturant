import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuthContext();

  const login = (userData) => {
    // Login logic
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
