import React, { useEffect, useState } from "react";

export default function VideoModal({ workout, onClose }) {
  const [iframeSrc, setIframeSrc] = useState("");
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (!workout) {
      setIframeSrc("");
      setVideoError(false);
      return;
    }

    const videoId = workout.videoId || workout.youtubeId;
    if (!videoId) {
      setIframeSrc("");
      setVideoError(true);
      return;
    }

    setVideoError(false);
    setIframeSrc(`https://www.youtube.com/embed/${videoId}?autoplay=1`);

    return () => {
      // Clear src on close/unmount to stop playback.
      setIframeSrc("");
      setVideoError(false);
    };
  }, [workout]);

  if (!workout) return null;

  const closeModal = () => {
    setIframeSrc("");
    onClose();
  };

  return (
    <div className="wv-modal-overlay" onClick={closeModal}>
      <div className="wv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wv-modal-close" onClick={closeModal}>✕</button>

        <div className="wv-video-player">
          {!videoError && iframeSrc ? (
            <iframe
              width="100%"
              height="400"
              src={iframeSrc}
              title="Workout Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              onError={() => {
                setVideoError(true);
                setIframeSrc("");
              }}
            />
          ) : (
            <div className="wv-empty-state" style={{ minHeight: "180px", marginTop: 0 }}>
              <p className="wv-empty-title">Video cannot be played</p>
            </div>
          )}
        </div>

        <div className="wv-modal-body">
          <h2 className="wv-modal-title">{workout.title}</h2>

          <div className="wv-modal-meta">
            <span className="wv-modal-trainer">👤 {workout.trainer}</span>
            <span className="wv-modal-category">{workout.category}</span>
            <span className="wv-modal-difficulty">{workout.level}</span>
          </div>

          <p className="wv-modal-description">{workout.description}</p>

          <div className="wv-modal-stats">
            <div className="wv-stat">
              <div className="wv-stat-label">Duration</div>
              <div className="wv-stat-value">{workout.duration}</div>
            </div>
            <div className="wv-stat">
              <div className="wv-stat-label">Target Area</div>
              <div className="wv-stat-value">{workout.target}</div>
            </div>
            <div className="wv-stat">
              <div className="wv-stat-label">Rating</div>
              <div className="wv-stat-value">⭐ {workout.rating}</div>
            </div>
            <div className="wv-stat">
              <div className="wv-stat-label">Views</div>
              <div className="wv-stat-value">{workout.views.toLocaleString()}</div>
            </div>
          </div>

          <div className="wv-modal-actions">
            <button className="wv-btn wv-btn--primary" onClick={closeModal}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
