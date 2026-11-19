
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const leave = () => { logout(); navigate("/login"); };
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><i className="bi bi-check2-square"/></span> taskflow<span className="brand-dot">.</span></div>
      <div className="nav-caption">WORKSPACE</div>
      <NavLink to="/" end className={({isActive})=>`side-link ${isActive?"active":""}`}><i className="bi bi-grid-1x2"/> Overview</NavLink>
      <NavLink to="/tasks" className={({isActive})=>`side-link ${isActive?"active":""}`}><i className="bi bi-list-task"/> My tasks</NavLink>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="profile-copy"><strong>{user?.name}</strong><small>{user?.email}</small></div></div>
        <button className="side-link logout-link" onClick={leave}><i className="bi bi-box-arrow-left"/> Log out</button>
      </div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand">taskflow<span>.</span></div><div className="topbar-right"><span className="online-dot"/> Workspace</div></header><div className="page-content"><Outlet/></div></main>
  </div>;
}
