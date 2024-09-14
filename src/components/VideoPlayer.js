import React from 'react';
import Loader from './Loader';
import './VideoPlayer.css';

const VideoPlayer = ({ video }) => {
  if (!video) {
    return <Loader />;
  }

  return (
    <div className="video-player">
      <video width="100%" height="auto" controls autoPlay>
        <source src={video.videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-details">
        <h2>{video.name}</h2>
        <p>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
