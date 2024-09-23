// components/VideoPlayer.js
import React, { useState } from 'react';
import { db } from '../Firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import './VideoPlayer.css';

function VideoPlayer({ video }) {
  // Local state for likes and dislikes
  const [likes, setLikes] = useState(video.likes);
  const [dislikes, setDislikes] = useState(video.dislikes);

  if (!video) {
    return <div className="video-player">Select a video to play</div>;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = video.videoURL;
    link.download = `${video.name}.mp4`; // Adjust file extension if needed
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <p className="video-views">{video.views} views</p>
        <div className="video-actions">
          <button
            className="action-button"
            aria-label="Like"
            title="Like"
            onClick={() => handleLike(video.id)}
          >
            👍 {likes}
          </button>
          <button
            className="action-button"
            aria-label="Dislike"
            title="Dislike"
            onClick={() => handleDislike(video.id)}
          >
            👎 {dislikes}
          </button>
          <button
            className="action-button"
            onClick={handleDownload}
            aria-label="Download"
            title="Download"
          >
            🔻
          </button>
        </div>
        <hr className="hr" />
        <p className="video-description">{video.description}</p>
      </div>
    </div>
  );

  // Event handlers for likes and dislikes
  async function handleLike(videoId) {
    try {
      const videoRef = doc(
        db,
        'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips',
        videoId
      );
      await updateDoc(videoRef, {
        likes: increment(1),
      });
      setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  }

  async function handleDislike(videoId) {
    try {
      const videoRef = doc(
        db,
        'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips',
        videoId
      );
      await updateDoc(videoRef, {
        dislikes: increment(1),
      });
      setDislikes((prevDislikes) => prevDislikes + 1);
    } catch (error) {
      console.error('Error updating dislikes:', error);
    }
  }
}

export default VideoPlayer;
