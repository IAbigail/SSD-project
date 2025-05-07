import React, { useState, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const taskCollection = collection(firestore, 'tasks');
      const taskSnapshot = await getDocs(taskCollection);
      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList); // Set the fetched tasks to the state
    };
    fetchTasks();
  }, []);

  // Add or update a task in Firestore
  const handleSaveTask = async () => {
    if (newTask.trim()) {
      const taskCollection = collection(firestore, 'tasks');
      const taskData = {
        name: newTask,
        category,
        dueDate,
        status: 'To-Do',
      };

      if (editTaskId) {
        // Update existing task
        const taskDoc = doc(firestore, 'tasks', editTaskId);
        await updateDoc(taskDoc, taskData);
        setEditTaskId(null); // Clear edit mode after update

        // Update the tasks state locally without re-fetching from Firestore
        setTasks(tasks.map(task => task.id === editTaskId ? { ...task, ...taskData } : task));
      } else {
        // Add new task
        const newDoc = await addDoc(taskCollection, taskData);

        // Add the new task to the local state
        setTasks([...tasks, { id: newDoc.id, ...taskData }]);
      }

      // Clear input fields
      setNewTask("");
      setCategory("");
      setDueDate("");
    }
  };

  // Update task status
  const handleUpdateStatus = async (taskId: string, status: string) => {
    const taskDoc = doc(firestore, 'tasks', taskId);
    await updateDoc(taskDoc, { status });

    // Update the status locally in state without re-fetching
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status } : task));
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const taskDoc = doc(firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);

    // Remove the task from state locally without re-fetching
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Handle editing a task
  const handleEditTask = (task: any) => {
    setNewTask(task.name);
    setCategory(task.category);
    setDueDate(task.dueDate);
    setEditTaskId(task.id); // Set edit mode
  };

  return (
    <div className="task-manager-container">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category (e.g. Invitations)"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleSaveTask}>{editTaskId ? 'Update Task' : 'Add Task'}</button>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-list-item">
            <span>{task.name}</span>
            <span className="task-category">{task.category}</span>
            <span className="task-due-date">{task.dueDate}</span>
            <span className="task-status">{task.status}</span>
            <div className="task-status-buttons">
              <button onClick={() => handleUpdateStatus(task.id, 'In Progress')}>In Progress</button>
              <button onClick={() => handleUpdateStatus(task.id, 'Completed')}>Completed</button>
            </div>
            <button onClick={() => handleEditTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
