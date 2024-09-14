import React from 'react';
import './VideoList.css';

const VideoList = ({ videos, onVideoSelect }) => {
  return (
    <div className="video-list-container">
      {videos.map((video) => (
        <div key={video.id} className="video-item" onClick={() => onVideoSelect(video)}> {/* Click event to select the video */}
          <img src={video.thumbnail || 'default-thumbnail.jpg'} alt={video.name} width="150" />
          <h3>{video.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
