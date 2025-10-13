import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router-new';   // New router with auth and admin features

ReactDOM.render(<AppRouter />, document.getElementById('app'));
