// components/VideoList.js

import React from 'react';
import './VideoList.css'; // Import the CSS file

function VideoList({ videos, onVideoSelect }) {
  return (
    <div className="video-list">
      <h3>Up next</h3>
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => onVideoSelect(video)}
          className="video-item"
        >
          <img
            src={video.thumbnail || 'https://via.placeholder.com/168x94'}
            alt={video.name}
            className="video-thumbnail"
          />
          <div className="video-info">
            <p className="video-title">{video.name}</p>
            <p className="video-channel">Channel Name</p>
            <p className="video-views">{video.views} views</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoList;
