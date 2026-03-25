const db = require('../models');
const { Op } = require('sequelize');

// Get all active workout videos
exports.getWorkoutVideos = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const where = { isActive: true };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { targetArea: { [Op.like]: `%${search}%` } }
      ];
    }

    const videos = await db.WorkoutVideo.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({ success: true, data: videos });
  } catch (err) {
    next(err);
  }
};

// Get single workout video
exports.getWorkoutVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await db.WorkoutVideo.findByPk(id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Increment views
    await video.increment('views');

    res.json({ success: true, data: video });
  } catch (err) {
    next(err);
  }
};

// Get videos by category
exports.getVideosByCategory = async (req, res, next) => {
  try {
    const videos = await db.WorkoutVideo.findAll({
      where: { isActive: true },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categories = videos.map(v => v.category);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// Get recommended videos (high rated)
exports.getRecommendedVideos = async (req, res, next) => {
  try {
    const videos = await db.WorkoutVideo.findAll({
      where: { isActive: true },
      order: [['rating', 'DESC'], ['views', 'DESC']],
      limit: 12
    });

    res.json({ success: true, data: videos });
  } catch (err) {
    next(err);
  }
};

// Admin: Create workout video
exports.createWorkoutVideo = async (req, res, next) => {
  try {
    const { title, description, youtubeId, category, difficulty, duration, targetArea, trainer } = req.body;

    const video = await db.WorkoutVideo.create({
      title,
      description,
      youtubeId,
      category,
      difficulty,
      duration,
      targetArea,
      trainer
    });

    res.status(201).json({ success: true, message: 'Video created successfully', data: video });
  } catch (err) {
    next(err);
  }
};

// Admin: Update workout video
exports.updateWorkoutVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, duration, targetArea, trainer, isActive } = req.body;

    const video = await db.WorkoutVideo.findByPk(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await video.update({
      title,
      description,
      category,
      difficulty,
      duration,
      targetArea,
      trainer,
      isActive
    });

    res.json({ success: true, message: 'Video updated successfully', data: video });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete workout video
exports.deleteWorkoutVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await db.WorkoutVideo.findByPk(id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await video.destroy();
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    next(err);
  }
};
