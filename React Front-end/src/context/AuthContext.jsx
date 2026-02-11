import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ideally verify token with backend, but for now just acknowledge it exists
            // Or decode it if it's a JWT to get user info
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            const { token } = response.data; // Adjust based on actual API response structure
            localStorage.setItem('token', token);
            setUser({ token });
            toast.success('Login successful!');
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Login failed');
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            await api.post('/register', { username, password });
            toast.success('Registration successful! Please login.');
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
