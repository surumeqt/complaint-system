import { useState } from 'react';
import { AuthService } from '../services/auth.service';
import { AuthContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const navigateByrole = (role) => {
    switch (role) {
      case 'user':
        navigate('/user/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/login?error=unknown-role');
        break;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(email, password);
      navigateByrole(response.role);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    setMessage('');
    setShowToast(false);
    try {
      const response = await AuthService.register(name, email, password);
      setMessage(response.message);
      setShowToast(true);
      setTimeout(() => {
        navigate('/login');
        setShowToast(false);
        setMessage('');
        setError(null);
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.logout();
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
        console.error('Logout error:', error);
        setError(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, message, setUser, login, register, logout, showToast }}>
      {children}
    </AuthContext.Provider>
  );
};