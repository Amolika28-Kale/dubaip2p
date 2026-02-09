import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, signupUser, loginUser, initiateSignup, verifySignup, updateProfile as updateUserProfile } from "../services/authService";
  import { resendOtp as resendOtpApi } from "../services/authService";

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
      const data = await getCurrentUser(t);
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
      const data = await signupUser(email, password, username);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

const initiateOtpSignup = async (name, email, phone, password) => {
  try {
    const data = await initiateSignup(name, email, phone, password);
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const verifyOtpSignup = async (email, otp) => {
  try {
    const data = await verifySignup(email, otp);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};


  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error(err);
      return "Server error. Try again later.";
    }
  };


const resendSignupOtp = async (email) => {
  try {
    await resendOtpApi(email);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
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
        initiateOtpSignup,
        verifyOtpSignup,
        login,
        resendSignupOtp,
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
