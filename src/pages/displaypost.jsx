import React, { useState, useEffect } from 'react';
import FloatingWindow from './validation';

const Post = ({ post }) => {
  const [isFloatingWindowVisible, setFloatingWindowVisible] = useState(false);
  const [validatedPhoto, setValidatedPhoto] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState('');
  const [isValidated, setIsValidated] = useState(false); // Added state for validation status

  const handleValidate = () => {
    setFloatingWindowVisible(true);
  };

  const handleClose = () => {
    setFloatingWindowVisible(false);
  };

  const handleConfirm = (image) => {
    setValidatedPhoto(image);
    setFloatingWindowVisible(false);
    setIsValidated(true); // Set validation status to true on confirmation
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
    <div style={{ marginBottom: '2rem', textAlign: 'left', color: '#fff', backgroundColor: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1px' }}>
        <img 
          src={post.profilePhoto} 
          alt="profile"
          style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            marginRight: '10px',
            marginLeft: '-525px' 
          }} 
        />
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{post.username}</span>
      </div>
      <div 
        style={{ 
          padding: '1rem', 
          borderRadius: '5px', 
          width: '50%', 
          maxWidth: '500px', 
          margin: '0 auto',
          position: 'relative',
          backgroundColor: '#1c1c1c',
          textAlign: 'left'
        }}
      >
        <img 
          src={post.image} 
          alt="photo" 
          style={{ 
            width: '500px', 
            height: '300px', 
            objectFit: 'cover', 
            marginBottom: '1rem',
          }} 
        />
        <p>Location: {post.location}</p>
        <p><b>{post.caption}</b></p>
        <p>Category: {post.postType}</p>
        <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
        
        {/* Validate Button */}
        <button 
          style={{ 
            padding: '10px',
            position: 'relative',
            borderRadius: '10px',
            backgroundColor: isValidated ? '#000000' : '#34cc54', // Change color based on validation status
            color: isValidated ? '#34cc54' : '#000000', // Change color based on validation status
            cursor: 'pointer',
            marginBottom: '1rem'
          }} 
          onClick={handleValidate}  
          disabled={isValidated} // Disable the button if validated

        >
          Validate
        </button>

        {/* Display validated photo if exists */}
        {validatedPhoto && (
          <>
            <p>Validated photo:</p>
            <img 
              src={validatedPhoto} 
              alt="Validated" 
              style={{ 
                width: '150px', 
                height: '100px', 
                objectFit: 'contain', 
                marginTop: '10px',
                borderRadius: '10px'
              }} 
            />
            <p style={{ color: '#fff' }}>
              Live Location: 
              {currentLocation.lat && currentLocation.lon
                ? `${currentLocation.lat},${currentLocation.lon}`
                : " Fetching location..."}<span>{address}</span> 
            </p>
          </>
        )}
      </div>

      {isFloatingWindowVisible && 
        <FloatingWindow post={post} onClose={handleClose} onConfirm={handleConfirm} />
      }
    </div>
  );
};

export default Post;
