import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attach token to axios automatically
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/`);
      setUser(res.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    setAuthToken(res.data.access);
    await fetchUser();
    navigate("/");
  };

  const register = async (username, firstName, lastName, email, password) => {
    await axios.post(`${API_URL}/register/`, {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
