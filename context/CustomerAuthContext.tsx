"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import SignInModal from "@/components/auth/SignInModal";

export interface CustomerUser {
  id: string;
  name: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<{ success: boolean; message?: string }>;
  openSignInModal: (message?: string) => void;
  closeSignInModal: () => void;
  refreshUser: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInModalMessage, setSignInModalMessage] = useState("");

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Invalid credentials." };
    } catch {
      return { success: false, message: "Network connection error. Please retry." };
    }
  };

  const register = async (formData: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Registration could not be completed." };
    } catch {
      return { success: false, message: "Network connection error. Please retry." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData: {
    firstName: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Could not update profile." };
    } catch {
      return { success: false, message: "Network connection error." };
    }
  };

  const changePassword = async (passData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passData),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Could not update password." };
    } catch {
      return { success: false, message: "Network connection error." };
    }
  };

  const openSignInModal = (message?: string) => {
    setSignInModalMessage(message || "");
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        openSignInModal,
        closeSignInModal,
        refreshUser,
      }}
    >
      {children}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        message={signInModalMessage}
      />
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}
