'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const videos = [
      {
        title: 'Full Body Workout - 30 Minutes',
        description: 'Complete full body workout routine that builds strength and endurance. Perfect for beginners and intermediate level fitness enthusiasts.',
        youtubeId: 'UBMk30rjy0o',
        category: 'Full Body',
        difficulty: 'Beginner',
        duration: 30,
        targetArea: 'Full Body',
        trainer: 'Mike Johnson',
        rating: 4.8,
        views: 1250
      },
      {
        title: 'HIIT Cardio Blast - 20 Minutes',
        description: 'High-intensity interval training to boost your cardiovascular fitness and burn maximum calories in minimal time.',
        youtubeId: '50kH47ZztHs',
        category: 'Cardio',
        difficulty: 'Intermediate',
        duration: 20,
        targetArea: 'Cardio',
        trainer: 'Sarah Chen',
        rating: 4.9,
        views: 2100
      },
      {
        title: 'Chest & Triceps Workout',
        description: 'Focused upper body workout targeting chest and triceps with effective strength-building exercises.',
        youtubeId: 'gC_L9qAHVJ8',
        category: 'Strength Training',
        difficulty: 'Intermediate',
        duration: 45,
        targetArea: 'Chest & Triceps',
        trainer: 'Mike Johnson',
        rating: 4.7,
        views: 1850
      },
      {
        title: 'Back & Biceps Strength',
        description: 'Build a strong back and biceps with this comprehensive workout routine using proper form and technique.',
        youtubeId: 'VHyGqsPOUHs',
        category: 'Strength Training',
        difficulty: 'Intermediate',
        duration: 40,
        targetArea: 'Back & Biceps',
        trainer: 'David Kumar',
        rating: 4.8,
        views: 1720
      },
      {
        title: 'Legs & Glutes - Lower Body',
        description: 'Complete lower body workout focusing on legs and glutes to build strength and shape.',
        youtubeId: '3p8EBPVZ2Iw',
        category: 'Strength Training',
        difficulty: 'Intermediate',
        duration: 50,
        targetArea: 'Legs & Glutes',
        trainer: 'Emma Wilson',
        rating: 5.0,
        views: 2340
      },
      {
        title: 'Core & Abs Workout',
        description: 'Targeted core and abdominal exercises to strengthen your midsection and improve stability.',
        youtubeId: 'ml6cT4AZdqI',
        category: 'Core Training',
        difficulty: 'Beginner',
        duration: 20,
        targetArea: 'Core & Abs',
        trainer: 'Sarah Chen',
        rating: 4.6,
        views: 1500
      },
      {
        title: 'Yoga for Flexibility',
        description: 'Gentle yoga session designed to improve flexibility, reduce stress, and increase overall mobility.',
        youtubeId: 'v7AYKMP6rOE',
        category: 'Yoga',
        difficulty: 'Beginner',
        duration: 35,
        targetArea: 'Full Body',
        trainer: 'Priya Sharma',
        rating: 4.9,
        views: 980
      },
      {
        title: 'Pilates Core Strength',
        description: 'Pilates-based exercises focusing on core strength, stability, and proper body alignment.',
        youtubeId: 'Mvo2snJGhtM',
        category: 'Pilates',
        difficulty: 'Intermediate',
        duration: 30,
        targetArea: 'Core',
        trainer: 'Alex Rodriguez',
        rating: 4.7,
        views: 1100
      },
      {
        title: 'Morning Stretch Routine',
        description: 'Gentle stretching routine to start your day energized and improve your range of motion.',
        youtubeId: 'L_xrDAtykMI',
        category: 'Stretching',
        difficulty: 'Beginner',
        duration: 15,
        targetArea: 'Full Body',
        trainer: 'Emma Wilson',
        rating: 4.5,
        views: 850
      },
      {
        title: 'Advanced HIIT Challenge',
        description: 'High-intensity workout for advanced athletes. Expect intense intervals and maximum calorie burn.',
        youtubeId: 'ixkQaZXVQjs',
        category: 'Cardio',
        difficulty: 'Advanced',
        duration: 25,
        targetArea: 'Cardio',
        trainer: 'Mike Johnson',
        rating: 4.9,
        views: 1650
      },
      {
        title: 'Shoulder & Arms Workout',
        description: 'Targeted shoulder and arm exercises to build definition and increase upper body strength.',
        youtubeId: 'kL_NJAkCQBg',
        category: 'Strength Training',
        difficulty: 'Intermediate',
        duration: 35,
        targetArea: 'Shoulders & Arms',
        trainer: 'David Kumar',
        rating: 4.8,
        views: 1320
      },
      {
        title: 'Cool Down Stretching',
        description: 'Post-workout stretching routine to aid recovery and reduce muscle soreness.',
        youtubeId: 'inpok4MKVLM',
        category: 'Stretching',
        difficulty: 'Beginner',
        duration: 10,
        targetArea: 'Full Body',
        trainer: 'Priya Sharma',
        rating: 4.7,
        views: 920
      }
    ];

    await queryInterface.bulkInsert('WorkoutVideos', videos, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WorkoutVideos', {}, {});
  }
};
