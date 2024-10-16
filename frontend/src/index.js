// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddPost from './components/AddPost.jsx';
import LikedPosts from './components/LikedPosts.jsx';
import PostDetail from './components/PostDetail.jsx';
import CategoryPage from './components/CategoryPage.jsx';
import MyPosts from './components/MyPosts.jsx';
import MyProfile from './components/MyProfile.jsx';
import FriendRequests from './components/FriendRequests.jsx';
import AcceptFriendRequestButton from './components/AcceptFriendRequestButton.jsx'; 
import SendFriendRequestButton from './components/SendFriendRequestButton.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (<Home />),
  },
  {
    path: "/category/:catName",
    element: (<CategoryPage />),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: (<Login />),
  },
  {
    path: "/register",
    element: (<Register />),
  },
  {
    path: "/add-post",
    element: (<AddPost />),
  },
  {
    path: "/liked-posts",
    element: (<LikedPosts />),
  },
  {
    path: "/my-posts",
    element: (<MyPosts />),
  },
  {
    path: "/post/:postId",
    element: (<PostDetail />),
  },
  {
    path: "/my-profile",
    element: (<MyProfile />),
  },
  {
    path: "/friend-requests", 
    element: (<FriendRequests />),
  },
  {
    path:"/accept-friend-request",
    element:(<AcceptFriendRequestButton/>),
  },
  {
    path:"/send-friend-request",
    element:(<SendFriendRequestButton/>),
  }
  
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

