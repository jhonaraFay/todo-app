import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [viewFilter, setViewFilter] = useState("all");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, done: false }]);
    setNewTask("");
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTaskStatus = (index) => {
    setTasks(tasks.map((task, i) => i === index ? { ...task, done: !task.done } : task));
  };

  const startEditing = (index) => {
    setEditingTask(index);
    setUpdatedText(tasks[index].text);
  };

  const saveEdit = (index) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, text: updatedText } : task)));
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (viewFilter === "completed") return task.done;
    if (viewFilter === "pending") return !task.done;
    return true;
  });

  return (
    <div className="task-wrapper">
      <header>
        <h1>Task Manager</h1>
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌑 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={handleAddTask}>Add</button>
      </div>
      <div className="filter-section">
        <button onClick={() => setViewFilter("all")}>All</button>
        <button onClick={() => setViewFilter("completed")}>Completed</button>
        <button onClick={() => setViewFilter("pending")}>Pending</button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className={`task-item ${task.done ? "finished" : ""}`}>
            {editingTask === index ? (
              <input
                type="text"
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
              />
            ) : (
              <span className="task-text" onClick={() => toggleTaskStatus(index)}>{task.text}</span>
            )}
            <div className="task-controls">
			    <button className="complete-btn" onClick={() => toggleTaskStatus(index)}>
                {task.done ? "✅ Completed" : "✔ Complete"}
              </button>
              <button className="delete-btn" onClick={() => handleDeleteTask(index)}>❌</button>
              {editingTask === index ? (
                <button className="save-btn" onClick={() => saveEdit(index)}>💾</button>
              ) : (
                <button className="edit-btn" onClick={() => startEditing(index)}>✏️</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
