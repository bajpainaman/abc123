import React, { useState } from 'react';
import { storage, db } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

function UploadPage({ user }) {
  const [file, setFile] = useState(null); // For video file upload
  const [thumbnailFile, setThumbnailFile] = useState(null); // For thumbnail upload
  const [name, setName] = useState(''); // Name for the uploaded video
  const [description, setDescription] = useState(''); // Description for the uploaded video
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
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

        // Upload thumbnail if provided
        let thumbnailURL = '';
        if (thumbnailFile) {
          const thumbnailRef = ref(storage, `thumbnails/${thumbnailFile.name}`);
          const thumbnailUploadTask = await uploadBytesResumable(thumbnailRef, thumbnailFile);
          thumbnailURL = await getDownloadURL(thumbnailUploadTask.snapshot.ref);
        }

        // Store the video metadata in Firestore
        await addDoc(collection(db, 'professor/HUNxLpQ1rhuzi4BkBlrQ/lecture/3LZcH6EWnC1ZE076357j/clips'), {
          Name: name,
          link: downloadURL,
          description: description,
          Views: 0,
          img: thumbnailURL,
        });

        setFile(null);
        setThumbnailFile(null);
        setName('');
        setDescription('');
        setUploadProgress(0);

        alert('Video uploaded successfully!');
      }
    );
  };

  return (
    <div>
      <h1>Upload a New Video</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <input type="file" onChange={handleThumbnailChange} /> {/* Thumbnail input */}
        <input
          type="text"
          placeholder="Video Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      </div>
    </div>
  );
}

export default UploadPage;
