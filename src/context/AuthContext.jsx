import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me").then(({ data }) => setUser(data.user))
      .catch(() => { localStorage.removeItem("taskflow_token"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  const authenticate = (data) => { localStorage.setItem("taskflow_token", data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem("taskflow_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
