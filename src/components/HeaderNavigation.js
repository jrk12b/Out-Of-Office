import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const HeaderNavigation = ({ activeYear, setActiveYear }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Out Of Office</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActiveYear('2024')} active={activeYear === '2024'}>
              2024
            </Nav.Link>
            <Nav.Link onClick={() => setActiveYear('2023')} active={activeYear === '2023'}>
              2023
            </Nav.Link>
            <Nav.Link onClick={() => setActiveYear('2022')} active={activeYear === '2022'}>
              2022
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNavigation;
