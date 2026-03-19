const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', trainerController.getTrainers);
router.post('/book', trainerController.bookTrainer);

module.exports = router;
