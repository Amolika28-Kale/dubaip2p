import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER FROM TOKEN ================= */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (t) => {
    try {
      const res = await fetch(
        "https://dubaip2p.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        }
      );

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const signup = async (email, password, username) => {
    try {
      const res = await fetch(
        "https://dubaip2p.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      const res = await fetch(
        "https://dubaip2p.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return data.message || "Login failed";
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return "Server error. Try again later.";
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (username, password) => {
    try {
      const res = await fetch(
        "https://dubaip2p.onrender.com/api/auth/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return false;
      }

      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
