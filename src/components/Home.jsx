import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import algosdk from 'algosdk';
import { Buffer } from 'buffer';

const Home = () => {
    const navigate = useNavigate();
    const {setUser, setAccount, user, setAccountInfo} = useAuth();
    const [formTab, setFromTab] = useState("login");

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [username, setUsername] = useState("");
    const [walletname, setWalletname] = useState("");

    const [error, setError] = useState("");
    useEffect(() => {
        if (user){
            navigate("/");
        }
    },[user])
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try{
            let user = await axios.post('https://spotless-gold-garment.cyclic.app/login', {email: email, password: pass})
            localStorage.setItem("token", user?.data?.token);
            setUser(user?.data?.user);
            let acc = {addr: user?.data?.user.wallets[0].address, sk: new Uint8Array(user?.data?.user?.wallets[0].secretKey?.data)}
            setAccount(acc);
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            let accountInfo = await algodClient.accountInformation(acc?.addr).do();
            setAccountInfo(accountInfo);
            navigate("/");
        }catch(err){
            setError("No User with the given credentials exists!");
            console.error(err);
        }
    }

    const handleSignup = async (e) => {
        setError(null);
        e.preventDefault();
        try{
            const account = algosdk.generateAccount();
            console.log(account.sk?.buffer);
            let key = Buffer.from(account.sk?.buffer);
            await axios.post('https://spotless-gold-garment.cyclic.app/signup', {email: email, password: pass, name: username, walletName: walletname, address: account.addr, secretKey: key});
        }catch(err){
            setError("User already exists with the given credentials!");
            console.error(err);
        }
    }
  return (
    <>
    <img style={{position: 'absolute', top: "1rem", left: '1rem', width: '100px', height: 'auto'}} src="./images/Astrix_logo.png"/>
    {formTab == "login" ? <div class="wrapper">
        <div class="inner">
            <img src="./images/image-1.png" alt="" class="image-1"/>
            <form action="" onSubmit={handleLogin}>
                <h3>Login to Algo Account</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="Username" onChange={(e) => {
                        setUsername(e.target.value);
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-envelope"></span>
                    <input type="text" class="form-control" placeholder="Mail" onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="password" class="form-control" placeholder="Password" onChange={(e) => {
                        setPass(e.target.value)
                    }}/>
                </div>
                <button className='credential-btn'>
                    <span>Login</span>
                </button>
                <p>Don't Have an Account? <span style={{cursor: "pointer", color: "#1e9696"}} onClick={() => setFromTab("signup")}>Register here</span></p>
                <p style={{color: "red", position: 'relative', top: "3rem", textAlign: "center"}}>{error}</p>
            </form>
            <img src="images/image-2.png" alt="" class="image-2"/>
        </div>
    </div> : <div class="wrapper">
        <div class="inner">
            <img src="./images/image-1.png" alt="" class="image-1"/>
            <form action="" onSubmit={handleSignup}>
                <h3>New Account?</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="Username" onChange={(e) => {
                        setUsername(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-phone-handset"></span>
                    <input type="text" class="form-control" placeholder="Algo Wallet name" onChange={(e) => {
                        setWalletname(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-envelope"></span>
                    <input type="text" class="form-control" placeholder="Mail" onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="password" class="form-control" placeholder="Create Password" onChange={(e) => {
                        setPass(e.target.value)
                    }}/>
                </div>
                <button className='credential-btn'>
                    <span>Register</span>
                </button>
                <p>Already have an account? <span style={{cursor: "pointer", color: "#1e9696"}} onClick={() => setFromTab("login")}>login here</span></p>
            </form>
            <img src="images/image-2.png" alt="" class="image-2"/>
        </div>
    </div>}
    </>
  )
}

export default Home;