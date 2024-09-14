import React, { useState, useEffect, useCallback } from 'react';
import { signup, signin, logout } from './Auth';
import { auth, db, storage } from './Firebase'; // Import Firebase auth, Firestore, and Storage
import { onAuthStateChanged } from "firebase/auth"; // For auth state changes
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Track authenticated user
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null); // For file upload
  const [name, setName] = useState(''); // Name for the uploaded video
  const [description, setDescription] = useState(''); // Description for the uploaded video
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress

  // Fetch videos from Firestore
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const clipsCollection = collection(db, 'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips');
      const snapshot = await getDocs(clipsCollection);

      if (snapshot.empty) {
        console.log("No video documents found in Firestore.");
      }

      const videosList = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.link) {
          return { id: doc.id, name: data.Name, description: data.description, videoURL: data.link };
        } else {
          console.error("No link found in the document:", doc.id);
        }
        return null;
      }).filter(video => video !== null);

      setVideos(videosList);
      if (videosList.length > 0) {
        setCurrentVideo(videosList[0]); // Automatically play the first video
      } else {
        console.log("No valid videos found.");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!file || !name || !description) {
      alert('Please select a file and enter a name and description.');
      return;
    }

    // Upload video to Firebase Storage
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        // Once the upload is done, get the video URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Store the video metadata in Firestore
        await addDoc(collection(db, 'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips'), {
          Name: name,
          link: downloadURL, // Store the download URL for later use
          description: description,
          Views: 0
        });

        setFile(null);
        setName('');
        setDescription('');
        setUploadProgress(0);
        fetchVideos(); // Refresh the video list after upload
      }
    );
  };

  // Check user authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchVideos(); // Fetch videos after successful authentication
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [fetchVideos]);

  const handleSignup = async () => {
    await signup(email, password);
  };

  const handleSignin = async () => {
    await signin(email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  // When a user clicks on a video in the list, this function will set the current video
  const handleVideoSelect = (video) => {
    setCurrentVideo(video); // Ensure the current video is updated
  };

  return (
    <div>
      <h1>LeanryFi</h1>

      {!user ? (
        <div>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={handleSignin}>Sign In</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>

          {/* Video Upload Section */}
          <div>
            <h2>Upload a New Video</h2>
            <input type="file" onChange={handleFileChange} />
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
            <button onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
          </div>

          {/* Video Section */}
          <div className="app">
            <div className="main-video">
              {loading ? <Loader /> : <VideoPlayer video={currentVideo} />} {/* Pass the selected video to VideoPlayer */}
            </div>
            <div className="video-list">
              <VideoList videos={videos} onVideoSelect={handleVideoSelect} /> {/* Clickable video list */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
