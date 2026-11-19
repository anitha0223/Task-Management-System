const statusClass = {"Pending":"status-pending","In Progress":"status-progress","Completed":"status-completed"};
export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due < new Date(new Date().toDateString()) && task.status !== "Completed";
  return <article className="task-card"><div className="task-main"><div className="task-title-row"><h6 className={task.status==="Completed"?"completed-title":""}>{task.title}</h6><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div>
    {task.description&&<p className="task-description">{task.description}</p>}
    <div className="task-meta"><span className={overdue?"text-danger":""}><i className="bi bi-calendar3"/> {due?due.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"No due date"}{overdue?" · Overdue":""}</span><span className={`status-pill ${statusClass[task.status]}`}>{task.status}</span></div></div>
    <div className="task-actions"><select aria-label="Change task status" className="status-select" value={task.status} onChange={(e)=>onStatus(task._id,e.target.value)}><option>Pending</option><option>In Progress</option><option>Completed</option></select><button className="icon-button" title="Edit task" onClick={()=>onEdit(task)}><i className="bi bi-pencil"/></button><button className="icon-button danger-hover" title="Delete task" onClick={()=>onDelete(task._id)}><i className="bi bi-trash3"/></button></div>
  </article>;
}
