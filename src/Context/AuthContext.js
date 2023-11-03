// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import algosdk from 'algosdk';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const handleGmailUserData = async () => {
    try {
      // Load the Google API client
      if (window.gapi) {
        // Initialize the Google API client with your client ID
        await window.gapi.client.init({
          clientId: '519784112336-herrp4fueogosvf3kvgoke53nov96d23.apps.googleusercontent.com', // Replace with your Google API client ID
          scope: 'https://www.googleapis.com/auth/gmail.readonly', // Adjust scopes as needed
        });

        // Authenticate the user
        const auth = await window.gapi.auth2.getAuthInstance();
        const googleUser = await auth.signIn();

        // Fetch Gmail user data
        const profile = googleUser.getBasicProfile();
        console.log('User ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Email: ' + profile.getEmail());
      } else {
        console.error('Google API client library is not loaded.');
      }
    } catch (error) {
      console.error('Error fetching Gmail user data:', error);
    }
  };

  // Function to set the user in the context
  const loginUser = async () => {
    try{
      let logintoken = localStorage.getItem("token");
      let user = await axios.get('https://spotless-gold-garment.cyclic.app/verify', {
          headers: {
              'authorization' : logintoken,
          }
      })
      setUser(user?.data?.user);
      let acc = {addr: user?.data?.user.wallets[0].address, sk: new Uint8Array(user?.data?.user?.wallets[0].secretKey?.data)}
      console.log("if account is null: ", user?.data, acc);
      const algodToken = "";
      const algodServer = 'https://testnet-api.algonode.cloud';
      const algodPort = undefined;
      const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
      let accountInfo = await algodClient.accountInformation(acc?.addr).do();

      console.log('accountInfo:', accountInfo);
      setAccountInfo(accountInfo);
      setAccount(acc);
    }catch(err){
      console.error(err);
    }
  };

  useEffect(() => {
    loginUser();
  },[])

  // Function to log out and clear the user from the context
  const logoutUser = () => {
    setUser(null);
    setAccount(null);
    setAccountInfo(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, setUser, account, setAccount, accountInfo, setAccountInfo }}>
      {children}
    </AuthContext.Provider>
  );
}
