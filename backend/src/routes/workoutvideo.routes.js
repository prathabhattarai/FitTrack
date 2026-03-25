const express = require('express');
const router = express.Router();
const workoutVideoController = require('../controllers/workoutVideoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', workoutVideoController.getWorkoutVideos);
router.get('/recommended', workoutVideoController.getRecommendedVideos);
router.get('/categories', workoutVideoController.getVideosByCategory);
router.get('/:id', workoutVideoController.getWorkoutVideoById);

// Admin only routes (protected)
router.post('/', authMiddleware, workoutVideoController.createWorkoutVideo);
router.put('/:id', authMiddleware, workoutVideoController.updateWorkoutVideo);
router.delete('/:id', authMiddleware, workoutVideoController.deleteWorkoutVideo);

module.exports = router;
