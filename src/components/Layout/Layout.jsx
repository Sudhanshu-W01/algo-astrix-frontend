import React, { useEffect } from 'react'
import TopBar from './TopBar'
import Sidebar from './SideBar'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Layout = ({children}) => {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user){
            navigate("/login");
        }else {
          navigate("/");
        }
    },[user])
  return (
    <div className="app-container">
    <TopBar />
    <div className="content-container">
      <Sidebar />
      <div className='some'>
        {children}
      </div>
    </div>
  </div>
  )
}

export default Layout