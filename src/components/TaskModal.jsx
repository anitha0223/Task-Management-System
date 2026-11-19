import { useEffect, useState } from "react";
const empty = { title:"", description:"", dueDate:"", priority:"Medium", status:"Pending" };
export default function TaskModal({ show, onClose, onSave, task, saving }) {
  const [form, setForm] = useState(empty); const [error, setError] = useState("");
  useEffect(() => { setForm(task ? {...empty,...task,dueDate:task.dueDate?new Date(task.dueDate).toISOString().slice(0,10):""} : empty); setError(""); }, [task, show]);
  if (!show) return null;
  const change = (e) => setForm({...form,[e.target.name]:e.target.value});
  const submit = async (e) => { e.preventDefault(); if (!form.title.trim()) return setError("Please enter a task title."); try { await onSave({...form,title:form.title.trim(),dueDate:form.dueDate||null}); onClose(); } catch (err) { setError(err.response?.data?.message || "Could not save task."); } };
  return <div className="modal-backdrop-custom" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><div className="task-modal">
    <div className="modal-head"><div><span className="eyebrow">TASK DETAILS</span><h3>{task?"Edit task":"Create a task"}</h3></div><button className="icon-button" onClick={onClose}><i className="bi bi-x-lg"/></button></div>
    <form onSubmit={submit}><label className="form-label">Task title *</label><input className="form-control" name="title" value={form.title} onChange={change} placeholder="e.g. Finish project report" maxLength="100" autoFocus/>
    <label className="form-label mt-3">Description</label><textarea className="form-control" name="description" rows="3" value={form.description} onChange={change} placeholder="Add a few details..."/>
    <div className="row g-3 mt-1"><div className="col-6"><label className="form-label">Due date</label><input type="date" className="form-control" name="dueDate" value={form.dueDate} onChange={change}/></div><div className="col-6"><label className="form-label">Priority</label><select className="form-select" name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></div></div>
    {task&&<><label className="form-label mt-3">Status</label><select className="form-select" name="status" value={form.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select></>}
    {error&&<div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
    <div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary px-4" disabled={saving}>{saving?"Saving...":task?"Save changes":"Create task"}</button></div>
    </form></div></div>;
}
