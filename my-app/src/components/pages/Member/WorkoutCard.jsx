import React from "react";

export default function WorkoutCard({ workout, onSelect, IconEye }) {
  return (
    <div className="wv-video-card" onClick={() => onSelect(workout)}>
      <div className="wv-video-thumbnail">
        <img
          src={`https://img.youtube.com/vi/${workout.videoId}/hqdefault.jpg`}
          alt={workout.title}
          className="wv-video-img"
          loading="lazy"
        />
        <div className="wv-video-overlay">
          <div className="wv-play-button">▶</div>
        </div>
        <div className="wv-video-duration">{workout.duration}</div>
        <div className="wv-video-difficulty" data-level={workout.level}>
          {workout.level}
        </div>
      </div>

      <div className="wv-video-info">
        <h3 className="wv-video-title">{workout.title}</h3>
        <p className="wv-video-description">{workout.description}</p>

        <div className="wv-video-meta">
          <div className="wv-meta-item">
            <span className="wv-meta-label">Target:</span>
            <span className="wv-meta-value">{workout.target}</span>
          </div>
          <div className="wv-meta-item">
            <span className="wv-meta-label">Trainer:</span>
            <span className="wv-meta-value">{workout.trainer}</span>
          </div>
        </div>

        <div className="wv-video-footer">
          <div className="wv-rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`wv-star ${i < Math.round(workout.rating) ? "filled" : ""}`}>
                ★
              </span>
            ))}
            <span className="wv-rating-text">{workout.rating}</span>
          </div>
          <div className="wv-views">
            <IconEye />
            <span>{workout.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
