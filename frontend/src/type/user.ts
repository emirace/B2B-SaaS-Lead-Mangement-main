import React, { SetStateAction } from "react";
// Define the shape of the authentication context
export type AuthContextType = {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  user: User | null;
  error: string;
  setUser: React.Dispatch<SetStateAction<User | null>>;
  login: LoginFunction;
  register: RegisterFunction;
  logout: () => void;
};

// Define the shape of the user object
export interface User {
  email: string;
  role: string;
  name: string;
}

type LoginFunction = (credentials: Credentials) => Promise<boolean>;
type RegisterFunction = (credentials: Credentials2) => Promise<boolean>;

type Credentials = {
  email: string;
  password: string;
};
type Credentials2 = {
  email: string;
  newPassword: string;
};
