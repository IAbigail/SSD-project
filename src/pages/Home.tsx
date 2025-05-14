import React, { useState } from 'react';
import * as QRCode from 'qrcode';
import { useTranslation } from 'react-i18next'; // Import i18n hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const MediaStorage: React.FC = () => {
  const { t } = useTranslation(); // Initialize i18next translation
  const navigate = useNavigate(); // Use useNavigate hook to redirect

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>(''); // Placeholder for QR code data
  const [qrCodeImage, setQrCodeImage] = useState<string>(''); // Placeholder for generated QR code image

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
 // Generate QR code with a unique URL for guests to upload their photos
const generateQrCode = async () => {
  // Generate a unique token for each guest, but do not append it to the URL
  const uniqueToken = `guest-${Date.now()}`;

  // Get the base URL dynamically based on the current environment
  const baseUrl = 'http://localhost:5173/guestupload'; // This is the base URL, without '/upload/{uniqueToken}'
  
  // Construct the URL without '/upload/{uniqueToken}' at the end
  const uniqueUrl = `${baseUrl}`;  // This will now just be 'http://localhost:5173/guestupload'
  
  console.log("Generated QR Code Data:", uniqueUrl); // Log the URL for debugging

  try {
    const qrImage = await QRCode.toDataURL(uniqueUrl); // Generate QR code as base64 image
    setQrCodeImage(qrImage); // Set the generated image as qrCodeImage
  } catch (err) {
    console.error('Error generating QR code', err);
  }
};


  return (
    <div style={styles.container}>
      <h1>{t('welcomeToOurWedding')}</h1>
      <p>{t('uploadWeddingMedia')}</p>

      {/* Section to upload wedding-related media */}
      <div>
        <h2>{t('uploadMediaSectionTitle')}</h2>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaUpload}
        />
        {mediaFiles.length > 0 && (
          <div>
            <h3>{t('uploadedMedia')}</h3>
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
        <h2>{t('uploadYourMoment')}</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleGuestPhotoUpload}
        />
        {guestPhoto && (
          <div>
            <h3>{t('guestPhotoPreview')}</h3>
            <img
              src={URL.createObjectURL(guestPhoto)}
              alt={t('guestPhotoAltText')}
              style={{ width: '100px', height: 'auto', marginTop: '10px' }}
            />
          </div>
        )}
      </div>

      {/* Section to generate QR Code */}
      <div>
        <h2>{t('generateQrCodeTitle')}</h2>
        <button onClick={generateQrCode}>{t('generateQrCodeButton')}</button>
        {qrCodeImage ? (
          <div style={{ marginTop: '20px' }}>
            <p>{t('shareQrCode')}</p>
            <img src={qrCodeImage} alt="QR Code" style={{ width: '100px' }} />
          </div>
        ) : (
          <p>{t('noQrCodeData')}</p>
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
