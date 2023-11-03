import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';
import {GoogleLogin} from "react-google-login"
import { Link, useNavigate } from 'react-router-dom';

const TopBar = () => {
    const {user, logoutUser} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user == null){
            navigate("/login");
        }
    },[])

    const responseGoogle = async(response) => {
        if (response.error){
            return
        }
        try {
            console.log("response user: ", response);
        }catch(err){
            console.log("err: ", err);
        }
    }

    return (
      <div className="topbar">
        <div className="topbar-right">
          <span style={{borderRadius: "50%", width: "40px", height: "40px", color: "white", backgroundColor: "orangered", display: 'flex', alignItems: "center", justifyContent: "center"}}>{user?.name[0].toUpperCase()}</span>
          {!user ? <div><GoogleLogin
            clientId="519784112336-racri96jra8i26s2d51mh47j0aiqda62.apps.googleusercontent.com"
            buttonText="Login via Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
        <Link to={"/login"}><button className='login-btn'>Login via gmail</button></Link>
        </div> : <span>{user?.name}</span>}
        </div>
        {user && <button className='button-50' role="button" onClick={() => {
            logoutUser();
        }}>
            Logout
        </button>}
      </div>
    );
  };

export default TopBar