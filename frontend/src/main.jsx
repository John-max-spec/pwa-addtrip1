import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
// const DATA = [
//   { id: "todo-0", name: "Eat", completed: true },
//   { id: "todo-1", name: "Sleep", completed: false },
//   { id: "todo-2", name: "Repeat", completed: false },
// ];


if ("serviceWorker" in navigator) {
 window.addEventListener("load", () => {
 navigator.serviceWorker
 .register("./service-worker.js")
 .then((registration) => {
 console.log("Service Worker registered! Scope: ", registration.scope);
 })
 .catch((err) => {
 console.log("Service Worker registration failed: ", err);
 });
 });
}

const DATA = JSON.parse(localStorage.getItem('tasks') ) || [] ;
// console.log(DATA);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <BrowserRouter>
    <App tasks={DATA} />
    </BrowserRouter>
  </React.StrictMode>,
)
