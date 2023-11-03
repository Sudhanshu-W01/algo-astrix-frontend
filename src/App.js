// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Profile from './components/Profile';
import Assets from './components/Assets';
import FundTransfer from './components/FundTransfer';
import TopBar from './components/Layout/TopBar';
import SideBar from './components/Layout/SideBar';
import { AuthContextProvider } from './Context/AuthContext';
import Layout from './components/Layout/Layout';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout children={<Profile/>}/>} />
          <Route path="/login" exact element={<Home/>} />
          <Route path="/assets" element={<Layout children={<Assets/>}/>} />
          <Route path="/fundTransfer" element={<Layout children={<FundTransfer/>}/>} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
