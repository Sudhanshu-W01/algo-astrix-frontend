import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import algosdk from "algosdk";

const Profile = () => {
    const {user, account, setAccountInfo, accountInfo} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || account == null || accountInfo == null){
            navigate("/login");
        }
    },[user])

    const getAccountDetails = async () => {
        try{
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            let accountInfo = await algodClient.accountInformation(account?.addr).do();
            setAccountInfo(accountInfo);
        }catch(err){
            console.log("err: ", err);
        }
    }

    useEffect(() => {
        getAccountDetails();
    },[account])


  return (
    <div class="main">
        <h2>IDENTITY</h2>
        <div class="card">
            <div class="card-body">
                <i class="fa fa-pen fa-xs edit"></i>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>:</td>
                            <td>{user?.name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>:</td>
                            <td>{user?.email}</td>
                        </tr>
                        <tr>
                            <td>No of Assets</td>
                            <td>:</td>
                            <td>{accountInfo?.assets?.length}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>:</td>
                            <td>{account?.addr}</td>
                        </tr>
                        <tr>
                            <td>Algo Balance</td>
                            <td>:</td>
                            <td>{accountInfo?.amount != 0 ? accountInfo?.amount / 10 ** 6 : accountInfo?.amount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Profile