

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import './bootstrap';

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/toast-overrides.css';
import AppRouter from './router-new';

// Mount the React app into an element with id "app" (present in layouts)
const el = document.getElementById('app');
if (el) {
	ReactDOM.render(
		<>
			<AppRouter />
			<ToastContainer position="top-center" newestOnTop closeOnClick pauseOnHover />
		</>,
		el
	);
}
