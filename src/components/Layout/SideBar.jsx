import React from 'react'
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
      <div className="sidebar">
        <Link to="/">Profile</Link>
        <Link to="/assets">Assets</Link>
        <Link to="/fundTransfer">Fund Transfer</Link>
      </div>
    );
  };
export default Sidebar