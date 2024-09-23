// components/ProfileForm.js

import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProfileForm.css';

function ProfileForm() {
  const [name, setName] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the user object from route state
  const user = location.state?.user;

  // Redirect to login if user is not available
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // If user is not available, don't render the form
  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !learningStyle) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create a user profile document in Firestore
      const userRef = doc(db, 'students', user.uid);
      await setDoc(userRef, {
        name: name,
        email: user.email,
        LearningStyle: parseInt(learningStyle),
        UID: `/students/${user.uid}`,
        // Initialize other metrics
        CompletedVideos: [],
        LastSeen: new Date(),
        LastWatched: null,
        LastWatchedVideo: null,
        ProfilePicture: null,
        TotalVideosWatched: 0,
        VideosPerLecture: 0,
        VideosWatchedPerDay: [],
        WatchTime: 0,
        bookmarkedvideos: [],
      });

      // Redirect to the main app or dashboard
      navigate('/main');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="profile-form-container">
      <h2>Complete Your Profile</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="learningStyle">Learning Style (1-4)</label>
          <input
            type="number"
            id="learningStyle"
            min="1"
            max="4"
            required
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="submit-button">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;
