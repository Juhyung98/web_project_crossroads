import React, { useState } from "react";
import { Container, NavbarText } from "reactstrap";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar
        dark
        style={{ backgroundColor: "#edf5f5", display: "block" }}
        light
        expand="md"
        fixed="top"
      >
        <Container className="themed-container">
          <span>
            <a href="/">
              <img src="logo2.png" alt="logo" width="50" />
            </a>
          </span>
          <NavbarBrand
            href="/"
            style={{ marginLeft: "1.5rem", color: "#000000" }}
          >
            고민사거리
          </NavbarBrand>
          <NavbarToggler style={{}} onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/about" style={{ color: "#000000" }}>
                  About
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/menu" style={{ color: "#000000" }}>
                  Menu
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/mypick" style={{ color: "#000000" }}>
                  MyPick
                </NavLink>
              </NavItem>
            </Nav>
            <NavbarText>
              <a
                href="https://github.com/Juhyung98/web_project.git"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#000000", textDecoration: "none" }}
              >
                Web Project
              </a>
            </NavbarText>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
