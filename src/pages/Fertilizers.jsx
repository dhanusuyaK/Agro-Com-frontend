import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultprofile from '../assets/default-profile.jpg';

const Menu = ({ fERTILIZERS }) => {
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
    { label: "Shopping", path: "/shopping" },
    { label: "Workers", path: "/work" },
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

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 20px",
        boxSizing: "border-box",
        width: "100%",
        backgroundColor: "#34cc54",
        color: "#000",
        fontFamily: "Times New Roman",
        position: "fixed",
        top: 0,
        right:0,
        zIndex: 1000,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={toggleMenu}
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
            style={{ height: "35px", width: "35px" }}
            loading="lazy"
            alt="Menu"
            src="https://cdn-icons-png.flaticon.com/512/54/54630.png"
          />
        </button>
        <h1 style={{ margin: "0", fontWeight: "bold" }}>{fERTILIZERS}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          onClick={handleAddPost}
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
            style={{ height: "35px", width: "35px" }}
            loading="lazy"
            alt="Add Post"
            src="https://www.svgrepo.com/show/59773/plus-square-button.svg"
          />
        </button>
        <button
          onClick={handleProfileClick}
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
            style={{ height: "35px", width: "35px" }}
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

const Fertilizers = () => {
  const handleShopNowClick = (shopUrl) => {
    window.location.href = shopUrl;
  };

  const cardStyle = {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
    padding: "15px",
    maxWidth: "500px",
    width: "100%",
  };

  const cardImageStyle = {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  };

  const cardContentStyle = {
    marginLeft: "20px",
    display: "flex",
    flexDirection: "column",
    color:"#34cc54",
    justifyContent: "space-between",
  };

  const buttonStyle = {
    backgroundColor: "#34cc54",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    marginTop: "10px",
  };

  return (
    <div style={{ padding: "25px", backgroundColor: "#000000", minHeight: "100vh", marginTop: "80px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center",  flexDirection: "column",alignItems:"center" }}>
        <div style={cardStyle}>
          <img
            style={cardImageStyle}
            loading="lazy"
            alt="N. P. K. (19-19-19)"
            src="/shopping-1@2x.png"
          />
          <div style={cardContentStyle}>
            <p>N. P. K. (19-19-19) 100% Water Soluble Fertiliser For Foliar Spray and Fertigation</p>
            <button style={buttonStyle} onClick={() => handleShopNowClick("https://www.iffcobazar.in/en/product/n-p-k-19-19-19#wsf-19-19-19-imported-1-kg")}>Shop Now</button>
          </div>
        </div>
        <div style={cardStyle}>
          <img
            style={cardImageStyle}
            loading="lazy"
            alt="Urea Fertilizer"
            src="/shopping-1-1@2x.png"
          />
          <div style={cardContentStyle}>
            <p>Urea fertilizer is a high-quality fertilizer that is used to help plants grow.</p>
            <button style={buttonStyle} onClick={() => handleShopNowClick("https://samalagrotech.in/product/3330178/urea-fertilizer-1Kg?utm_source=GMC")}>Shop Now</button>
          </div>
        </div>
        <div style={cardStyle}>
          <img
            style={cardImageStyle}
            loading="lazy"
            alt="Tata Surplus Micro Nutrients Fertilizer"
            src="/shopping-3-1@2x.png"
          />
          <div style={cardContentStyle}>
            <p>Tata Surplus Micro Nutrients Fertilizer in enhancing crop nutrition.</p>
            <button style={buttonStyle} onClick={() => handleShopNowClick("https://kisancenter.in/product/23803954/Tata-Surplus-Micro-Nutrients-Fertilizer")}>Shop Now</button>
          </div>
        </div>
        <div style={cardStyle}>
          <img
            style={cardImageStyle}
            loading="lazy"
            alt="Potash Fertilizer"
            src="/shopping-2-1@2x.png"
          />
          <div style={cardContentStyle}>
            <p>This potash fertilizer is a concentrated form of potassium that is essential for plant growth.</p>
            <button style={buttonStyle} onClick={() => handleShopNowClick("https://samalagrotech.in/product/3330151/potash-fertilizer-1KG?utm_source=GMC")}>Shop Now</button>
          </div>
        </div>
      </div>
      <Menu fERTILIZERS="FERTILIZERS" />
    </div>
  );
};

export default Fertilizers;