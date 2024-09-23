// components/MainApp.js
import React, { useState, useEffect, useCallback } from 'react';
import { logout } from '../Auth';
import { auth, db } from '../Firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

import VideoPlayer from './VideoPlayer';
import VideoList from './VideoList';
import Loader from './Loader';
import { Link, useNavigate } from 'react-router-dom';
import './MainApp.css';

function MainApp() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch the current authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Update LastSeen when user is authenticated
        const userRef = doc(db, 'students', currentUser.uid);
        try {
          await updateDoc(userRef, {
            LastSeen: Timestamp.now(),
          });
        } catch (error) {
          console.error('Error updating LastSeen:', error);
        }
      } else {
        // If not authenticated, redirect to login
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
              likes: data.likes || 0,
              dislikes: data.dislikes || 0,
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
    navigate('/');
  };

  return (
    <div className="main-app">
      <nav className="navigation">
        <h1>LearnryFi</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="content">
        <div className="video-player-container">
          {loading ? (
            <Loader />
          ) : (
            <VideoPlayer video={currentVideo} user={user} />
          )}
        </div>
        <div className="video-list-container">
          <VideoList videos={videos} onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    </div>
  );
}

export default MainApp;
