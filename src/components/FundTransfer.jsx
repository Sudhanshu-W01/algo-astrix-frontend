import React, { useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import algosdk from 'algosdk';

const FundTransfer = () => {
    const {account, user} = useAuth();
    const [tab, setTab] = useState(null);
    const [error, setError] = useState(null);

   const [reciever, setReciever] = useState("");
   const [giver, setGiver] = useState(account.addr);
   const [amount, setAmount] = useState("");

    const handleSendFunds = async (e) => {
        e.preventDefault();
        console.log(reciever, giver, amount);
        try{
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            const suggestedParams = await algodClient.getTransactionParams().do();
            const roundsToWait = 3;

            console.log(suggestedParams);
            console.log(account, user);

            const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams,
                from: account.addr,
                to: reciever,
                amount: amount * 1e6, // * 1e6 to convert from ALGO to microALGO
            });
            const signedPaymentTxn = paymentTxn.signTxn(new Uint8Array(account.sk?.buffer));

            await algodClient.sendRawTransaction(signedPaymentTxn).do();
            console.log(`Sending payment transaction ${paymentTxn.txID()}...`);
            await algosdk.waitForConfirmation(algodClient, paymentTxn.txID(), roundsToWait);
            console.log(`Payment transaction ${paymentTxn.txID()} confirmed! See it at https://testnet.algoscan.app/tx/${paymentTxn.txID()}`);
        }catch(err){
            setError(err.message);
        }
    }
  return (
    <div style={{margin: '1.5rem'}}>

        <div>
            <form action="" onSubmit={handleSendFunds}>
                <h3>Send Funds</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="Giver Address" value={account.addr}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-envelope"></span>
                    <input type="text" class="form-control" placeholder="Reciever's Address" onChange={(e) => {
                        setReciever(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Amount to be send" onChange={(e) => {
                        setAmount(e.target.value)
                    }}/>
                </div>
                <button className='credential-btn'>
                    <span>Send</span>
                </button>
                <p style={{color: "red", position: 'relative', top: "3rem", textAlign: "center"}}>{error}</p>
            </form>
        </div>

    </div>
  )
}

export default FundTransfer;