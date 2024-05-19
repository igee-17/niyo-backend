const express = require('express');

const app = express();
const router = express.Router();
const cors = require('cors');
const { signup, signin, logout } = require('../controllers/authController');


app.use(cors());

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', logout);




module.exports = router;

