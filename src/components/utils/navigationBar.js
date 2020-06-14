import React, { Component } from "react";
import {
    Navbar,
    NavbarBrand,
    Collapse,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import {apiLogout, isAuthenticated} from "../../api/functions";

class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isAuthorized: false
        };

    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                const isLoaded = true;
                const user = data.user;

                let name = null;
                if (user) {
                    name = user.first_name + ' ' + user.last_name || null;
                }

                this.setState({isAuthorized, isLoaded, name});
            });
    }

    logoutHandler() {
        apiLogout();

    }

    renderName() {
        if (this.state.name) {
            return (
                <NavItem>
                    <NavLink href="/" >{ this.state.name }</NavLink>
                </NavItem>
            );
        }
    }

    renderNavItems() {
        const isLoaded = this.state.isLoaded;
        const isAuthorized = this.state.isAuthorized;
        if (!isLoaded) return;

        if (isAuthorized) {
            return (
                <Collapse isOpen={true} navbar>
                    <Nav className="ml-auto" navbar>
                        { this.renderName() }
                        <NavItem>
                            <NavLink onClick={ () => this.logoutHandler() } href="/login" >Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            );
        } else {
            return (
                <Collapse isOpen={true} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/register">Register</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            );
        }

    }

    render() {
        return (
            <div className="margin-bottom">
                <Navbar className="navbar-theme" expand="md">
                    <NavbarBrand href="/">Snippets</NavbarBrand>
                    { this.renderNavItems() }
                </Navbar>
            </div>
        );
    }

}

export default NavigationBar;
