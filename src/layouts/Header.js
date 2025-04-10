import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { FaGithub, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Aggiungi icone

class Header extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="flex items-center space-x-2 text-white">
            <FaUserCircle size={24} />
            <span>{user.name}</span>
          </button>
          <div className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md ${this.state.isOpen ? 'block' : 'hidden'}`}>
            <button
              onClick={this.onLogoutClick.bind(this)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
            <div className="border-t border-gray-200"></div>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
              Settings
            </button>
          </div>
        </div>
      </div>
    );

    const guestLinks = (
      <div className="flex items-center space-x-4">
        <a href="/register" className="text-white hover:text-blue-400">Register</a>
        <a href="/login" className="text-white hover:text-blue-400">Login</a>
        <a href="https://github.com/riteshsingh1/mern-starter" className="text-white hover:text-blue-400">
          <FaGithub className="inline-block" />
        </a>
      </div>
    );

    return (
      <div className="bg-gray-900 p-4">
        <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo e Nome */}
          <div className="text-white font-semibold text-xl">
            <a href="/">Mern Starter</a>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? authLinks : guestLinks}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={this.toggle}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden ${this.state.isOpen ? 'block' : 'hidden'}`}>
          {isAuthenticated ? (
            <div className="bg-gray-800 p-4 text-white">
              <button
                onClick={this.onLogoutClick.bind(this)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
              <div className="border-t border-gray-700"></div>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-700">
                Settings
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 text-white">
              <a href="/register" className="block px-4 py-2 hover:bg-gray-700">Register</a>
              <a href="/login" className="block px-4 py-2 hover:bg-gray-700">Login</a>
              <a href="https://github.com/riteshsingh1/mern-starter" className="block px-4 py-2 hover:bg-gray-700">
                <FaGithub className="inline-block mr-2" />
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Header);
