import React, { useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';

function App() {
    const [userGroups, setUserGroups] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch user groups from the JWT token
    useEffect(() => {
        async function fetchUser() {
            const user = await Auth.currentAuthenticatedUser();
            const groups = user.signInUserSession.accessToken.payload["cognito:groups"] || [];
            setUserGroups(groups);
            fetchTasks(user.username, groups);
        }
        fetchUser();
    }, []);

    // Fetch tasks for the user or all tasks if admin
    async function fetchTasks(username, groups) {
        setLoading(true);
        try {
            let path = '/tasks';
            // If member, get only their tasks
            if (!groups.includes('Admins')) {
                path = `/tasks?assignedTo=${username}`;
            }
            const response = await API.get('TaskAPI', path);
            setTasks(response);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
        setLoading(false);
    }

    // Admin: Create a new task
    async function createTask() {
        if (!newTaskTitle.trim()) return;
        setLoading(true);
        try {
            const input = {
                title: newTaskTitle,
                description: newTaskDescription,
                status: 'Pending',
                assignedTo: '', // Optionally assign here or later
                createdAt: new Date().toISOString(),
            };
            await API.post('TaskAPI', '/tasks', { body: input });
            setNewTaskTitle('');
            setNewTaskDescription('');
            fetchTasks((await Auth.currentAuthenticatedUser()).username, userGroups);
        } catch (error) {
            console.error('Error creating task:', error);
        }
        setLoading(false);
    }

    // Member/Admin: Update task status
    async function updateTaskStatus(taskId, newStatus) {
        setLoading(true);
        try {
            await API.patch('TaskAPI', `/tasks/${taskId}`, { body: { status: newStatus } });
            fetchTasks((await Auth.currentAuthenticatedUser()).username, userGroups);
        } catch (error) {
            console.error('Error updating task:', error);
        }
        setLoading(false);
    }

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <Heading level={2}>Task Management System</Heading>
            <p>Logged in as: {userGroups.includes('Admins') ? 'Admin' : 'Member'}</p>

            {userGroups.includes('Admins') && (
                <div style={{ marginBottom: 30 }}>
                    <h3>Create New Task</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        style={{ width: '100%', padding: 8, marginBottom: 8 }}
                    />
                    <textarea
                        placeholder="Description"
                        value={newTaskDescription}
                        onChange={e => setNewTaskDescription(e.target.value)}
                        style={{ width: '100%', padding: 8, marginBottom: 8 }}
                    />
                    <Button onClick={createTask} isDisabled={loading}>Create Task</Button>
                </div>
            )}

            <h3>Your Tasks</h3>
            {loading ? <p>Loading tasks...</p> : (
                tasks.length === 0 ? <p>No tasks assigned.</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tasks.map(task => (
                            <li key={task.id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12, borderRadius: 6 }}>
                                <strong>{task.title}</strong>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <div>
                                    <label>Change Status: </label>
                                    <select
                                        value={task.status}
                                        onChange={e => updateTaskStatus(task.id, e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}

export default withAuthenticator(App);

