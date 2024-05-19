const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const { auth } = require('../middleware/authentication');
const { getTasks, createTask, updateTask, deleteTask, getTask } = require('../controllers/userController');
const { getTaskValidation, createTaskValidation, modifyTaskValidation } = require('../middleware/validations');

app.use(cors());



router.get('/tasks', auth, getTasks)

router.get('/tasks/get-task/:id', auth, getTaskValidation, getTask)

router.post('/tasks/create-task', auth, createTaskValidation, createTask)

router.put('/tasks/modify-task/:id', auth, modifyTaskValidation, updateTask)

router.delete('/tasks/delete-task/:id', auth, getTaskValidation, deleteTask)


module.exports = router;

