
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import { Login, Register } from "./pages/AuthPages";
export default function App() {
 const {user}=useAuth();
 return <Routes>
  <Route path="/login" element={user?<Navigate to="/" replace/>:<Login/>}/>
  <Route path="/register" element={user?<Navigate to="/" replace/>:<Register/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/tasks" element={<Tasks/>}/></Route></Route>
  <Route path="*" element={<Navigate to={user?"/":"/login"} replace/>}/>
 </Routes>;
}
