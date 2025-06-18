import React, { useState } from 'react'; // Import React and useState hook
import { useParams } from 'react-router-dom'; // Import useParams to read the unique token from the URL
import { storage } from '../services/firebase'; // Import Firebase Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import getDownloadURL here


const GuestUpload: React.FC = () => {
  const { uniqueToken } = useParams(); // Get the unique token from the URL
  const [guestPhotos, setGuestPhotos] = useState<File[]>([]); // Store multiple photos
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // To keep track of successfully uploaded files

  // Handle multiple photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setGuestPhotos(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
  };

  // Upload multiple photos to Firebase Storage
  const handleUpload = async () => {
    if (guestPhotos.length === 0) return;

    setUploading(true);
    setUploadSuccess(null);
    const uploadedFileUrls: string[] = []; // To store the URLs of successfully uploaded files

    try {
      for (const photo of guestPhotos) {
        const storageRef = ref(storage, `uploads/${uniqueToken}/${photo.name}`);
        await uploadBytes(storageRef, photo);
        
        // Get the download URL after uploading the file
        const fileUrl = await getDownloadURL(storageRef); // Correct way to get download URL
        uploadedFileUrls.push(fileUrl); // Add the URL to the array
      }

      setUploadSuccess(true);
      setUploadedFiles(uploadedFileUrls); // Update the list of uploaded files with their URLs
    } catch (error) {
      console.error('Error uploading photos:', error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <p>Upload your photos for the wedding event: {uniqueToken}</p>

      {/* File input for multiple photo uploads */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
      />

      {guestPhotos.length > 0 && (
        <div>
          <h3>Preview:</h3>
          {guestPhotos.map((photo, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <img
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index}`}
                style={{ width: '150px', height: 'auto' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Photos'}
      </button>

      {uploadSuccess !== null && (
        <div>
          {uploadSuccess ? (
            <div>
              <p>Photos uploaded successfully!</p>
              <h4>Uploaded Files:</h4>
              <ul>
                {uploadedFiles.map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      View File {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>There was an error uploading your photos. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Styles for the upload page
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
};

export default GuestUpload;
