// components/VideoPlayer.js

import React from 'react';
import './VideoPlayer.css';

function VideoPlayer({ video }) {
  if (!video) {
    return <div className="video-player">Select a video to play</div>;
  }

  return (
    <div className="video-player">
      <video
        key={video.id}
        src={video.videoURL}
        controls
        autoPlay
        poster={video.thumbnail}
      />
      <div className="video-details">
        <h2 className="video-title">{video.name}</h2>
        <p className="video-views">{video.views} views • {video.uploadDate}</p>
        <div className="video-actions">
          <button className="action-button">👍 Like</button>
          <button className="action-button">👎 Dislike</button>
          <button className="action-button">🔗 Share</button>
          <button className="action-button">💾 Save</button>
        </div>
        <hr />
        <p className="video-description">{video.description}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;
