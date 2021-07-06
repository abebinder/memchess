import React from "react";
import {Nav, Navbar} from "react-bootstrap";

export class Header extends React.Component {




    render(): JSX.Element {

        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Memchess</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Trainer</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}