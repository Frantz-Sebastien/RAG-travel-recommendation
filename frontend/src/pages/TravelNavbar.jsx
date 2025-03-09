import { Navbar, Nav, Container } from "react-bootstrap";
import "../styles/TravelNavbar.css"
import React from 'react'

const TravelNavbar = () => {
    return (
      <Navbar expand="lg" className="custom-navbar">
        <Container fluid className="px-4">
          {/* Brand Logo */}
          <Navbar.Brand 
            href="/" 
            className="brand-logo" 
            style={{display: "flex", alignItems: "center"}}>
                <img 
                    src="/favicon.ico"
                    alt="logo" 
                    style={{ width: "24px", height: "24px", marginRight: "8px" }} 
                    /> 
                    <span style={{ lineHeight: "1" }}>A I &nbsp; Travels</span></Navbar.Brand>
  
          {/* Navbar Toggle Button */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
  
          {/* Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#services">Services</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  
  export default TravelNavbar;