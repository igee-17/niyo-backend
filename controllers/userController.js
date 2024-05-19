const { io } = require('../app');
const pool = require('../db/db');
const { getUserEmail } = require('../middleware/userMiddleware');

exports.getTasks = async (req, res) => {
    try {
        const { userId } = req; // Assuming you have middleware to attach userId to the request

        // Assuming you have a function to get the userEmail from userId
        const userEmail = await getUserEmail(userId, pool);

        const [rows] = await pool.query('SELECT * FROM tasks WHERE userEmail = ?', [userEmail]);

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No tasks found', tasks: [] });
        }

        res.status(200).json({ tasks: rows });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getTask = async (req, res) => {
    try {
        const { userId } = req;
        const taskId = req.params.id;

        const userEmail = await getUserEmail(userId, pool);

        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND userEmail = ?', [taskId, userEmail]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createTask = async (req, res) => {
    try {
        const { userId } = req;
        const { title, description } = req.body;
        const userEmail = await getUserEmail(userId, pool);

        const [result] = await pool.query('INSERT INTO tasks (title, description, userEmail, status) VALUES (?, ?, ?, ?)',
            [title, description || null, userEmail, 'in-progress']);

        const newTaskId = result.insertId;

        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [newTaskId]);

        io.emit('newTask', rows[0]);

        res.status(201).json(rows[0]);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { userId } = req;
        const taskId = req.params.id;
        const { title, description, status } = req.body;

        if (!title && !description && !status) {
            return res.status(404).json({ message: 'title, description or status is required' });

        }

        const userEmail = await getUserEmail(userId, pool);

        // Check if the task exists and belongs to the user
        const [existingTask] = await pool.query('SELECT * FROM tasks WHERE id = ? AND userEmail = ?', [taskId, userEmail]);
        if (existingTask.length === 0) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
        }

        // Build the update query dynamically
        const updates = [];
        const values = [];
        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }
        values.push(taskId); // Add the task ID to the end of the values array for the WHERE clause

        // Construct the SQL query 
        const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        await pool.query(sql, values);

        // Fetch updated task and send response
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);

        io.emit('updateTask', rows[0]);

        res.json(rows[0]);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { userId } = req;
        const taskId = req.params.id;

        const userEmail = await getUserEmail(userId, pool);

        // Check if the task exists and belongs to the user
        const [existingTask] = await pool.query('SELECT * FROM tasks WHERE id = ? AND userEmail = ?', [taskId, userEmail]);
        if (existingTask.length === 0) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
        }

        // Delete the task
        await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);

        io.emit('deleteTask', taskId);

        res.json({ message: 'Task deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}