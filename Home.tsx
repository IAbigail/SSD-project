import React, { useState } from 'react';
import QRCode from 'qrcode.react'; // Ensure you have this package installed

const MediaStorage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>(''); // Placeholder for QR code data

  // Function to handle media file upload (wedding-related media)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setMediaFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Function to handle guest photo upload
  const handleGuestPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setGuestPhoto(file);
    }
  };

  // Generate QR code with a unique URL for guests to upload their photos
  const generateQrCode = () => {
    // Generate a unique URL or token for each event or guest
    const uniqueUrl = `https://wedding-photos.com/upload/${Date.now()}`;
    setQrCodeData(uniqueUrl);
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Our Wedding!</h1>
      <p>Upload your wedding photos and videos, and allow guests to upload their moments too!</p>

      {/* Section to upload wedding-related media */}
      <div>
        <h2>Upload Wedding Media</h2>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaUpload}
        />
        {mediaFiles.length > 0 && (
          <div>
            <h3>Uploaded Wedding Media</h3>
            <ul>
              {mediaFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section to upload guest photo */}
      <div>
        <h2>Upload Your Moment</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleGuestPhotoUpload}
        />
        {guestPhoto && (
          <div>
            <h3>Guest Photo Preview</h3>
            <img
              src={URL.createObjectURL(guestPhoto)}
              alt="Guest Upload"
              style={{ width: '200px', height: 'auto', marginTop: '10px' }}
            />
          </div>
        )}
      </div>

      {/* Section to generate QR Code */}
      <div>
        <h2>Generate QR Code for Guest Uploads</h2>
        <button onClick={generateQrCode}>Generate QR Code</button>
        {qrCodeData ? (
          <div style={{ marginTop: '20px' }}>
          
            <p>Share this QR code with your guests to upload their photos!</p>
          </div>
        ) : (
          <p>No QR code data available. Click the button above to generate one.</p>
        )}
      </div>
    </div>
  );
};

// Explicitly type the styles object
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
};

export default MediaStorage;
