
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function Dashboard() {
  const {user}=useAuth(); const [tasks,setTasks]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [show,setShow]=useState(false); const [saving,setSaving]=useState(false); const [editing,setEditing]=useState(null);
  const load=()=>{setLoading(true);api.get("/tasks").then(({data})=>{setTasks(data.tasks);setError("");}).catch(e=>setError(e.response?.data?.message||"Could not load tasks. Check your connection.")).finally(()=>setLoading(false));};
  useEffect(()=>{load();},[]);
  const stats=useMemo(()=>[{label:"Total tasks",value:tasks.length,icon:"bi-layers",tone:"violet"},{label:"Pending",value:tasks.filter(t=>t.status==="Pending").length,icon:"bi-hourglass-split",tone:"amber"},{label:"In progress",value:tasks.filter(t=>t.status==="In Progress").length,icon:"bi-arrow-repeat",tone:"blue"},{label:"Completed",value:tasks.filter(t=>t.status==="Completed").length,icon:"bi-check2-circle",tone:"green"}],[tasks]);
  const save=async(data)=>{setSaving(true);try{if(editing){const r=await api.put(`/tasks/${editing._id}`,data);setTasks(old=>old.map(t=>t._id===editing._id?r.data.task:t));}else{const r=await api.post("/tasks",data);setTasks(old=>[r.data.task,...old]);}}finally{setSaving(false);}};
  const edit=(task)=>{setEditing(task);setShow(true);}; const create=()=>{setEditing(null);setShow(true);};
  const remove=async(id)=>{if(!window.confirm("Delete this task? This cannot be undone."))return;try{await api.delete(`/tasks/${id}`);setTasks(old=>old.filter(t=>t._id!==id));}catch(e){setError(e.response?.data?.message||"Could not delete task.");}};
  const status=async(id,value)=>{try{const r=await api.put(`/tasks/${id}`,{status:value});setTasks(old=>old.map(t=>t._id===id?r.data.task:t));}catch(e){setError(e.response?.data?.message||"Could not update task.");}};
  const recent=tasks.slice(0,4);
  return <><div className="welcome-row"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Good to see you, {user?.name?.split(" ")[0]} <span className="wave">✦</span></h1><p>Here's what's happening with your tasks today.</p></div><button className="btn btn-primary create-btn" onClick={create}><i className="bi bi-plus-lg me-2"/>New task</button></div>
    {error&&<div className="alert alert-warning">{error} <button className="btn btn-sm btn-link" onClick={load}>Try again</button></div>}
    <div className="stats-grid">{stats.map(s=><div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><i className={`bi ${s.icon}`}/></div><div><div className="stat-value">{loading?"—":s.value}</div><div className="stat-label">{s.label}</div></div></div>)}</div>
    <div className="section-heading"><div><span className="eyebrow">STAY ON TRACK</span><h3>Recent tasks</h3></div><Link to="/tasks" className="text-link">View all tasks <i className="bi bi-arrow-right"/></Link></div>
    {loading?<div className="empty-state"><div className="spinner-border text-primary"/></div>:recent.length?<div className="task-list">{recent.map(t=><TaskCard key={t._id} task={t} onEdit={edit} onDelete={remove} onStatus={status}/>)}</div>:<div className="empty-state"><div className="empty-icon"><i className="bi bi-clipboard2-check"/></div><h5>Your task list is clear</h5><p>Create your first task and start making progress.</p><button className="btn btn-primary" onClick={create}>Create your first task</button></div>}
    <TaskModal show={show} onClose={()=>setShow(false)} onSave={save} task={editing} saving={saving}/>
  </>;
}
