import { useEffect, useMemo, useState } from "react";
import api from "../api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
export default function Tasks() {
  const [tasks,setTasks]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [filter,setFilter]=useState("All");const [search,setSearch]=useState("");const [show,setShow]=useState(false);const [editing,setEditing]=useState(null);const [saving,setSaving]=useState(false);
  const load=()=>{setLoading(true);api.get("/tasks").then(r=>setTasks(r.data.tasks)).catch(e=>setError(e.response?.data?.message||"Could not load tasks.")).finally(()=>setLoading(false));};useEffect(()=>{load();},[]);
  const filtered=useMemo(()=>tasks.filter(t=>(filter==="All"||t.status===filter)&&`${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())),[tasks,filter,search]);
  const save=async(data)=>{setSaving(true);try{if(editing){const r=await api.put(`/tasks/${editing._id}`,data);setTasks(old=>old.map(t=>t._id===editing._id?r.data.task:t));}else{const r=await api.post("/tasks",data);setTasks(old=>[r.data.task,...old]);}}finally{setSaving(false);}};
  const remove=async(id)=>{if(!confirm("Delete this task?"))return;try{await api.delete(`/tasks/${id}`);setTasks(old=>old.filter(t=>t._id!==id));}catch(e){setError(e.response?.data?.message||"Could not delete task.");}};
  const status=async(id,value)=>{try{const r=await api.put(`/tasks/${id}`,{status:value});setTasks(old=>old.map(t=>t._id===id?r.data.task:t));}catch(e){setError(e.response?.data?.message||"Could not update task.");}};
  return <><div className="welcome-row"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>My tasks</h1><p>Keep every little thing moving forward.</p></div><button className="btn btn-primary create-btn" onClick={()=>{setEditing(null);setShow(true);}}><i className="bi bi-plus-lg me-2"/>New task</button></div>
    <div className="task-toolbar"><div className="filter-tabs">{["All","Pending","In Progress","Completed"].map(x=><button key={x} className={filter===x?"selected":""} onClick={()=>setFilter(x)}>{x}<span>{x==="All"?tasks.length:tasks.filter(t=>t.status===x).length}</span></button>)}</div><div className="search-box"><i className="bi bi-search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."/></div></div>
    {error&&<div className="alert alert-warning">{error}</div>}
    {loading?<div className="empty-state"><div className="spinner-border text-primary"/></div>:filtered.length?<div className="task-list">{filtered.map(t=><TaskCard key={t._id} task={t} onEdit={task=>{setEditing(task);setShow(true);}} onDelete={remove} onStatus={status}/>)}</div>:<div className="empty-state"><div className="empty-icon"><i className="bi bi-search"/></div><h5>{search?"No matching tasks":"Nothing here yet"}</h5><p>{search?"Try another search term or status filter.":"Tasks matching this section will appear here."}</p></div>}
    <TaskModal show={show} onClose={()=>setShow(false)} onSave={save} task={editing} saving={saving}/>
  </>;
}
