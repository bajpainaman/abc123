// components/MainApp.js

import React, { useState, useEffect, useCallback } from 'react';
import { logout } from '../Auth';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';

import VideoPlayer from './VideoPlayer';
import VideoList from './VideoList';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import './MainApp.css'; // Import the CSS file

function MainApp({ user }) {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch videos from Firestore
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const clipsCollection = collection(
        db,
        'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips'
      );
      const snapshot = await getDocs(clipsCollection);

      if (snapshot.empty) {
        console.log('No video documents found in Firestore.');
      }

      const videosList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (data.link) {
            return {
              id: doc.id,
              name: data.Name,
              description: data.description,
              videoURL: data.link,
              thumbnail: data.img, // Include the thumbnail image URL
              views: data.Views || 0,
            };
          } else {
            console.error('No link found in the document:', doc.id);
          }
          return null;
        })
        .filter((video) => video !== null);

      setVideos(videosList);
      if (videosList.length > 0) {
        setCurrentVideo(videosList[0]); // Automatically play the first video
      } else {
        console.log('No valid videos found.');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  }, []);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // When a user clicks on a video in the list, this function will set the current video
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="main-app">
      <nav className="navigation">
        <h1>LearnryFi</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/upload">Upload Video</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="content">
        <div className="video-player-container">
          {loading ? <Loader /> : <VideoPlayer video={currentVideo} />}
        </div>
        <div className="video-list-container">
          <VideoList videos={videos} onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </div>
  );
}

export default MainApp;
