import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultprofile from '../assets/default-profile.jpg';

const Menu = ({ wORKERS }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const profilePhoto = localStorage.getItem('profilePhoto');

  const menuButtons = [
    { label: "Home", path: "/home" },
    { label: "Schemes", path: "/schemes" },
    { label: "Industries", path: "/industries" },
    { label: "Individuals", path: "/individuals" },
    { label: "Subsidies", path: "/subsidies" },
    { label: "Dry-zone", path: "/dryzone" },
    { label: "Water management", path: "/wm" },
    { label: "Fertilizers", path: "/fertilizers" },
    { label: "Shopping", path: "/shopping" },
  ];

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigateToPage = (path) => {
    navigate(path);
    toggleMenu();
  };

  const handleAddPost = () => {
    navigate("/addpost");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSignOutClick = () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      navigate("/login");
    }
  };

  const menuStyles = {
    position: "absolute",
    top: "80px",
    left: "20px",
    backgroundColor: "#1c1c1c",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    padding: "1rem",
    borderRadius: "0.5rem",
    zIndex: 1000,
  };

  const buttonStyles = {
    display: "block",
    padding: "0.5rem 1rem",
    color: "#34cc54",
    backgroundColor: "#000000",
    cursor: "pointer",
    borderRadius: "0.25rem",
    marginBottom: "0.5rem",
    width: "100%",
    textAlign: "center",
    fontSize: "1.3rem",
  };


  const buttonHoverStyles = {
    backgroundColor: "#eaeaea",
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        boxSizing: "border-box",
        width: "100%",
        textAlign: "left",
        fontSize: "20px",
        backgroundColor: "#34cc54",
        color: "#000000",
        fontFamily: "times new roman",
        position: "fixed",
        zIndex: 1000, 
        top:0
      }}
    >
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={toggleMenu}
          style={{
            backgroundColor: "transparent",
            cursor: "pointer",
            border: "none",
            height: "50px",
            width: "50px",
            position: "relative",
            overflow: "hidden",
            minWidth: "50px",
          }}
        >
          <img
            style={{
              height: "35px",
              width: "35px",
              position: "relative",
              overflow: "hidden",
              minWidth: "40px",
            }}
            loading="lazy"
            alt="Menu"
            src="https://cdn-icons-png.flaticon.com/512/54/54630.png"
          />
        </button>
        <h1
          style={{
            margin: "0",
            position: "relative",
            fontWeight: "bold",
            display: "inline-block",
            paddingLeft: "10px",
            color: "#000000",
          }}
        >
          {wORKERS}
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={handleAddPost}
          style={{
            backgroundColor: "transparent",
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
          onClick={handleProfileClick}
          style={{
            backgroundColor: "transparent",
            cursor: "pointer",
            border: "none",
            height: "50px",
            width: "50px",
            position: "relative",
            overflow: "hidden",
            minWidth: "50px",
          }}
        >
          <img
            style={{
              height: "45px",
              width: "45px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            loading="lazy"
            alt="Profile"
            src={profilePhoto || defaultprofile}
          />
        </button>
        <button
          onClick={handleSignOutClick}
          style={{
            backgroundColor: "transparent",
            cursor: "pointer",
            border: "none",
            height: "50px",
            width: "50px",
            position: "relative",
            overflow: "hidden",
            minWidth: "50px",
          }}
        >
          <img
            style={{
              height: "35px",
              width: "35px",
              position: "relative",
              overflow: "hidden",
              minWidth: "40px",
            }}
            loading="lazy"
            alt="Sign Out"
            src="/uilsignout.svg"
          />
        </button>
      </div>
      {showMenu && (
        <div style={menuStyles}>
          {menuButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => navigateToPage(button.path)}
              style={buttonStyles}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

const Workers = () => {
  const containerStyle = {
    width: "100%",
    position: "relative",
    backgroundColor: "#000000",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "100px",
    boxSizing: "border-box",
    lineHeight: "2",
    letterSpacing: "normal",
  };

  const mainStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "35px",
    paddingRight: "5px",
    paddingLeft: "5px",
    boxSizing: "border-box",
    gap: "30px",
    maxWidth: "1200px",
    width: "100%",
    textAlign: "left",
    fontSize: "14px",
    color: "#34cc54",
    fontFamily: "Times new Roman",
  };

  const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
  };

  const detailsContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
    gap: "20px",
  };

  const detailBoxStyle = {
    width: "100%",
    borderRadius: "10px",
    backgroundColor: "#1c1c1c",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    padding: "20px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  };

  const detailBoxHoverStyle = {
    transform: "translateY(-5px)",
  };

  const detailTextStyle = {
    width: "100%",
    margin: "0",
    fontSize: "16px",
    color: "#34cc54",
  };

  const dividerLineStyle = {
    height: "100%",
    width: "1px",
    backgroundColor: "#fff",
  };

  const rightDetailsContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
    gap: "20px",
  };

  return (
    <div style={containerStyle}>
      <Menu wORKERS="WORKERS" />
      <main style={mainStyle}>
        <div style={detailsContainerStyle}>
          <div
            style={detailBoxStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <p style={detailTextStyle}><b>HARVESTING</b></p>
            <p style={detailTextStyle}>Contact No: 9876543210</p>
            <p style={detailTextStyle}>Location: Coimbatore</p>
            <p style={detailTextStyle}>Salary: 7000-10000</p>
          </div>
          <div
            style={detailBoxStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <p style={detailTextStyle}><b>CATTLE DOCTORING</b></p>
            <p style={detailTextStyle}>Contact No: 9876543210</p>
            <p style={detailTextStyle}>Location: Erode</p>
            <p style={detailTextStyle}>Salary: 6000-12000</p>
          </div>
        </div>
        <div style={dividerLineStyle} />
        <div style={rightDetailsContainerStyle}>
          <div
            style={detailBoxStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <p style={detailTextStyle}><b>FERTILIZING</b></p>
            <p style={detailTextStyle}>Contact No: 9876543210</p>
            <p style={detailTextStyle}>Location: Karur</p>
            <p style={detailTextStyle}>Salary: 5000-8000</p>
          </div>
          <div
            style={detailBoxStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <p style={detailTextStyle}><b>PACKING</b></p>
            <p style={detailTextStyle}>Contact No: 9876543210</p>
            <p style={detailTextStyle}>Location: Ooty</p>
            <p style={detailTextStyle}>Salary: 6000-12000</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workers;