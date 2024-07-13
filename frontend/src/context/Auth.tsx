"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContextType, User } from "../type/user";

type ContainerProps = {
  children: React.ReactNode;
};

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

// Define context and set defaults
const AuthContext = createContext<AuthContextType | null>(null);

axios.defaults.withCredentials = true;

const AuthProvider = (props: ContainerProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    const token = getCookie("token") || null;
    if (!token) {
      // Validate the token with the backend
      setLoading(true);
      axios
        .post(
          "https://b2b-saas-lead-mangement-main.onrender.com/api/users/validate",
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    }
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const response = await axios.post(
        "https://b2b-saas-lead-mangement-main.onrender.com/api/users/login",
        credentials,
        {
          withCredentials: true,
        }
      );
      const userData: User = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
      return true; // Return true if login was successful
    } catch (error: any) {
      console.error("Failed to login", error);
      setUser(null);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Invalid email or password"
      );
      return false; // Return false if login failed
    }
  };

  const register = async (credentials2: {
    email: string;
    newPassword: string;
  }): Promise<boolean> => {
    try {
      console.log("Registration credentials:", credentials2); // Log credentials
      await axios.post(
        "https://b2b-saas-lead-mangement-main.onrender.com/api/users/register",
        {
          email: credentials2.email,
          password: credentials2.newPassword, // Ensure correct field name
        }
      );

      // console.log('Registration response:', response.data); // Log response data
      return true;
    } catch (error) {
      console.error("Failed to register", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        error,
        setUser,
        login,
        register,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
