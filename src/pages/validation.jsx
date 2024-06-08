import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const FloatingWindow = ({ post, onClose, onConfirm }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState('');

  const videoConstraints = {
    width: 200,
    height: 200,
    facingMode: "user"
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lon: longitude });
        fetchAddress(latitude, longitude);
      });
    }
  }, []);

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <div 
      style={{ 
        width: '900px',
        height: '450px',
        position: 'fixed', 
        top: '55%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        backgroundColor: '#1c1c1c', 
        boxSizing: 'border-box', 
        border: '1px solid #34cc54', 
        padding: '2rem', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {capturedImage ? (
        <img 
          src={capturedImage} 
          alt="Captured" 
          style={{ 
            width: '200px', 
            height: '200px', 
            objectFit: 'cover', 
            marginBottom: '1rem', 
            borderRadius: '10px',
            padding: '10px' 
          }} 
        />
      ) : (
        <Webcam 
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={300}
          height={250}
          videoConstraints={videoConstraints}
          style={{ 
            marginBottom: '1rem', 
            borderRadius: '15px' 
          }}
        />
      )}
<p style={{ color: '#fff' }}>
  Live Location: 
  {currentLocation.lat && currentLocation.lon
    ? `${currentLocation.lat},${currentLocation.lon}`
    : " Fetching location..."}<span>{address}</span> 
</p>

      <button 
        style={{ 
          padding: '10px', 
          borderRadius: '10px', 
          backgroundColor: '#34cc54', 
          color: '#000000', 
          cursor: 'pointer', 
          marginBottom: '1rem'
        }} 
        onClick={capture}
      >
        Capture Photo
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button 
          style={{ 
            padding: '10px', 
            borderRadius: '10px', 
            backgroundColor: '#34cc54', 
            color: '#000000', 
            cursor: 'pointer'
          }} 
          onClick={() => { onConfirm(capturedImage); onClose(); }}
        >
          Confirm
        </button>
        <button 
          style={{ 
            padding: '10px', 
            borderRadius: '10px', 
            backgroundColor: '#34cc54', 
            color: '#000000', 
            cursor: 'pointer'
          }} 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FloatingWindow;