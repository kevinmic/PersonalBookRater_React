import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import './app.css';
import Routes from './Routes';

ReactDOM.render(
  <Routes/>,
  document.getElementById('root')
);
