import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

const AddPost = () => {
  const navigate = useNavigate();
  const storedUserId = sessionStorage.getItem('username');
  const token = localStorage.getItem('token');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState({ coords:'',address:''});
  const [postType, setPostType] = useState('normal');
  const [photo, setPhoto] = useState(null);
  const webcamRef = useRef(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    let watchId;
    if (postType === 'credits') {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          position => {
            const { latitude, longitude } = position.coords;
            fetchAddress(latitude, longitude);
          },
          error => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [postType]);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      if (data && data.display_name) {
        const address = data.display_name;
        setLocation({ coords: `${latitude}, ${longitude}`, address });
      } else {
        console.error('No address found for coordinates.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let imageData = null;

    // Check if photo is already a base64 string (from webcam capture)
    if (photo.startsWith('data:image')) {
      imageData = photo;
    } else {
      // Convert selected file to base64
      const file = photoInputRef.current.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imageData = reader.result;
          // Now imageData contains the base64 string of the selected file
          sendData(imageData);
        };
        reader.readAsDataURL(file);
      }
    }

    // Send imageData to the server
    if (imageData) {
      sendData(imageData);
    }
  };

  const sendData = async (imageData) => {
    console.log({ caption, location, postType, photo: imageData });
    try {
      let locationToSend = {};
      
      if (postType === 'normal' || postType === 'watermanagement') {
        // For 'normal' and 'watermanagement' post types, only send the manually entered location
        locationToSend = { address: location.address };
      } else {
        // For other post types, send both coordinates and address
        locationToSend = { coords: location.coords, address: location.address };
      }

      const response = await fetch(`http://localhost:5000/api/posts/create/${storedUserId}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caption: caption,
          location: JSON.stringify(locationToSend),
          postType: postType,
          image: imageData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        return;
      }
      navigate("/");

      const responseData = await response.json();
      console.log('Success:', responseData);

    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#34cc54', backgroundColor: '#000000', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create New Post</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ flex: 1, maxWidth: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ width: '100%', height: '300px', marginBottom: '1rem' }}
          />
          <button
            type="button"
            onClick={handleCapture}
            style={{ display: 'block', marginBottom: '1rem', width: '50%', padding: '1rem', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer', textAlign: 'center' }}
          >
            Capture Photo
          </button>
          <label style={{ display: 'block', marginBottom: '1rem', width: '45%', textAlign: 'left', paddingLeft: '40%', paddingRight: '45%' }}>
            Or select a file:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={photoInputRef}
              style={{ display: 'block', margin: '0 auto', width: '100%', padding: '1rem', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer' }}
            />
          </label>
          {photo && (
            <div>
              <img src={photo} alt="Captured" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, maxWidth: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1rem', width: '80%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption..."
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem', width: '80%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Post Type</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                <option value="normal">Normal</option>
                <option value="credits">Credits</option>
                <option value="watermanagement">Water Management</option>
              </select>
            </div>
            {postType === 'credits' && (
              <div style={{ marginBottom: '1rem', width: '80%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Location</label>
                <input
                  type="text"
                  value={location.address}
                  placeholder="Fetching location..."
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', backgroundColor: '#ffffff', color: '#000000' }}
                  disabled
                />
              </div>
            )}
            {postType === 'normal' && (
              <div style={{ marginBottom: '1rem', width: '80%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Location</label>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, coords: e.target.value })}
                  placeholder="Enter location..."
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                />
              </div>
            )}
            {postType === 'watermanagement' && (
              <div style={{ marginBottom: '1rem', width: '80%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffffff' }}>Location</label>
                <input
                  type="text"
                  value={location.coords}
                  onChange={(e) => setLocation({ ...location, coords: e.target.value })}
                  placeholder="Enter location..."
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                />
              </div>
            )}
            <button
              type="submit"
              style={{ width: '80%', padding: '1rem', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer' }}
            >
              Submit Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



export default AddPost;