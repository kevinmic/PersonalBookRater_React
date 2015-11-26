import React, { Component } from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar';
import SearchMain from './SearchMain';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        {this.props.children}
      </div>
    );
  }
}
