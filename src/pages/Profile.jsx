import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import defaultprofile from '../assets/default-profile.jpg';
import useFetchUsername from '../username';
import ImagetoBase64 from '../utility/ImagetoBase64';
import Post from './displaypost'; // Assuming you have a Post component
import FloatingWindow from './validation';

const Profile = () => {
  const navigate = useNavigate();
  const storedUserId = sessionStorage.getItem('userId');
  const { username, loading, error } = useFetchUsername(storedUserId);
  const [userData, setUserData] = useState(null);
  const profile = localStorage.getItem('profilePhoto');
  const storedUsername = sessionStorage.getItem('username');
  const [isFloatingWindowVisible, setFloatingWindowVisible] = useState(false);
  const [validatedPhoto, setValidatedPhoto] = useState(null);
  
  const handleValidate = () => {
    setFloatingWindowVisible(true);
  };

  const handleClose = () => {
    setFloatingWindowVisible(false);
  };

  const handleConfirm = (image) => {
    setValidatedPhoto(image);
    setFloatingWindowVisible(false);
  };


  const [user, setUser] = useState({
    profilePicture: defaultprofile,
    username: username,
    fullname: '',
    bio: '',
    category: '',
    followersCount: 0,
    followingCount: 0,
    creditsCount: 0
  });

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(null); // Step 1: Initialize activeTab state
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    bio: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!storedUserId) {
        console.error('User ID not found');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/auth/${storedUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setUser((prevUser) => ({
          ...prevUser,
          username: data.username,
          fullname: data.fullname,
          bio: data.bio,
          category: data.category,
          creditsCount: data.credits,
          followersCount: data.followers,
          followingCount: data.following,
          profilePicture: data.profilePhoto,
        }));
        setForm({
          username: data.username,
          fullname: data.fullname,
          bio: data.bio
        });
        setUserData(data);
        localStorage.setItem('profilePhoto', data.profilePhoto);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storedUserId]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/userposts/${storedUsername}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedData);
        console.log('Posts data:', data); 
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [storedUsername, activeTab]); // Update posts when activeTab changes

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Step 2: Update activeTab state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/profile/edit/${storedUserId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedUser = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        fullname: updatedUser.fullname,
        bio: updatedUser.bio,
      }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setForm({
      username: user.username,
      fullname: user.fullname,
      bio: user.bio
    });
    setEditMode(false);
  };

  const handleUploadProfileImage = async (e) => {
    try {
      const data = await ImagetoBase64(e.target.files[0]);
      console.log("Converted Base64 Image:", data);

      if (!data) {
        throw new Error('Image conversion failed');
      }

      if (!userData) {
        console.error('User data is not loaded');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/profile/photo/${storedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: userData.email, profilePhoto: data })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      console.log("Updated User Data:", updatedUser);

      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: updatedUser.profilePhoto,
      }));
      console.log("Updated User State:", user);

    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleAddClick = () => {
    navigate("/addpost");
  };

  const handleSignOutClick = () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      navigate("/login");
    }
  };

  const renderPosts = () => {
    if (isLoading) {
      return <p>Loading posts...</p>;
    }
  
    return (
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={profile} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
                <span>{post.username}</span>
              </div>
              <div style={{ backgroundColor: '#1c1c1c', borderRadius: '5px', padding: '30px', overflow: 'hidden', width: '400px', margin: '20px ' }}>
                <img src={post.image} alt="Post" style={{ width: '350px', objectFit: 'contain', Height: '200px' }} />
                <div style={{ marginTop: '10px', color: '#ffffff' }}>
                  <p>Location: {post.location}</p>
                  <p>{post.caption}</p>
                  <p>Category: {post.postType}</p>
                  <p>Created At: {post.createdAt}</p>
                  <h3>{post.title}</h3>
                </div>
                <button style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer', borderRadius: '5px' }} onClick={handleValidate}  >Validate</button>
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
          </>
        )}
      </div>

      {isFloatingWindowVisible && 
        <FloatingWindow post={post} onClose={handleClose} onConfirm={handleConfirm} />
      }
              </div>
          ))
        ) : (
          <div className="no-posts">
            <p style={{ marginLeft: '5px' }}>Share your first photo!</p>
            <button onClick={handleAddClick} style={{ marginLeft: '50px', backgroundColor: "#34cc54", borderRadius: "5px", padding: "5px" }}>Share</button>
          </div>
        )}
      </div>
    );
  };
  
  
  
  
  
  return (
    <div style={{ color: '#34cc54', backgroundColor: '#000000', minHeight: '100vh', width: '100%', position: 'absolute' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: '#34cc54', padding: "15px", marginBottom: "10px" }}>
        <h1 style={{ color: '#000000', margin: 0 }}>PROFILE</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', gap: "15px" }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: "#34cc54",
              cursor: "pointer",
              border: "none",
              height: "50px",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{
                height: "45px",
                width: "45px",
              }}
              loading="lazy"
              alt="Home"
              src="/flowbitehomesolid.svg"
            />
          </button>
          <button
            onClick={handleAddClick}
            style={{
              backgroundColor: "#34cc54",
              cursor: "pointer",
              border: "none",
              height: "50px",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{
                height: "35px",
                width: "35px",
              }}
              loading="lazy"
              alt="Add Post"
              src="https://www.svgrepo.com/show/59773/plus-square-button.svg"
            />
          </button>
          <button
            onClick={handleSignOutClick}
            style={{
              backgroundColor: "#34cc54",
              cursor: "pointer",
              border: "none",
              height: "50px",
              width: "50px",
              position: 'relative',
              overflow: 'hidden',
              minWidth: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              style={{
                height: "35px",
                width: "35px",
              }}
              loading="lazy"
              alt="Sign Out"
              src="/uilsignout.svg"
            />
          </button>
        </div>
      </header>
      {isLoading ? (
        <div style={{ textAlign: 'center', color: '#34cc54' }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.profilePicture}
                alt="Profile"
                style={{ width: '250px', height: '250px', borderRadius: '50%', objectFit: 'cover', marginRight: '2rem' , marginLeft:'35px'}}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadProfileImage}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
                    <input
                      type="text"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1c1c1c', border: 'none', color: '#34cc54' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bio:</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1c1c1c', border: 'none', color: '#34cc54' }}
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer', marginRight: '0.5rem' }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 style={{ margin: 0, fontSize: '2rem' }}>{user.username}</h3>
                  <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                    <span>{posts.length} Posts</span>
                    <span>{user.followersCount} Followers</span>
                    <span>{user.followingCount} Following</span>
                    <span>{user.creditsCount} Credits</span>
                  </div>

                  <h4 style={{ margin: 0, fontSize: '1 rem' }}>{user.fullname}</h4>
                  <h6 style={{ margin: 0, fontSize: '1rem', color: '#5a9169' }}>{user.category}</h6>
                  <h5 style={{ margin: 0, fontSize: '1 rem' }}>{user.bio}</h5>
                  <br></br>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: "flex-start", marginLeft: "1px" }}>
                    <button
                      onClick={() => setEditMode(true)}
                      style={{ padding: '10px', backgroundColor: '#34cc54', border: 'none', color: '#000000', cursor: 'pointer', borderRadius: "5px" }}
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <hr style={{ margin: '1rem 0', border: '0.5px solid #807F7F', marginTop: "-25px" }} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => handleTabChange('posts')}
              style={{
                padding: '1rem',
                backgroundColor: activeTab === 'posts' ? '#34cc54' : '#1c1c1c',
                border: 'none',
                borderRadius: "10px",
                color: activeTab === 'posts' ? '#000000' : '#34cc54',
                cursor: 'pointer',
              }}
            >
              Posts
            </button>
            <button
              onClick={() => handleTabChange('saved')}
              style={{
                padding: '1rem',
                backgroundColor: activeTab === 'saved' ? '#34cc54' : '#1c1c1c',
                border: 'none',
                color: activeTab === 'saved' ? '#000000' : '#34cc54',
                cursor: 'pointer',
                borderRadius: "10px"
              }}
            >
              Saved
            </button>
            <button
              onClick={() => handleTabChange('tagged')}
              style={{
                borderRadius: "10px",
                padding: '1rem',
                backgroundColor: activeTab === 'tagged' ? '#34cc54' : '#1c1c1c',
                border: 'none',
                color: activeTab === 'tagged' ? '#000000' : '#34cc54',
                cursor: 'pointer',
              }}
            >
              Tagged
            </button>
          </div>
          {activeTab === 'posts' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              {renderPosts()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
