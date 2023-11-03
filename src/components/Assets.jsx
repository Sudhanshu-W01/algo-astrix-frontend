import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/AuthContext';
import algosdk from 'algosdk';
import { useNavigate } from 'react-router-dom';

const Assets = () => {
    const {account, user, accountInfo} = useAuth();
    const [tab, setTab] = useState(null);
    const [error, setError] = useState(null);

    const [assetname, setAssetName] = useState("");
    const [unitname,setUnitName] = useState("");
    const [units, setUnits] = useState("");
    const [reserve, setReserve] = useState("");
    const [freeze, setFreeze] = useState("");
    const [clowback, setClowback] = useState("");
    const [manage, setManage] = useState("");
    const [assetInd, setAssetIndex] = useState("");
    const [reciever, setReciever] = useState("");
    const [amount, setAmount] = useState("");
    const [Img, setImg] = useState("");
    const [assets, setAssets] = useState([]);
    const [metadata, setMetadata] = useState("");

    const navigate = useNavigate();
    

    const handleCreateAsset = async (e) => {
        e.preventDefault();
        setError(null);
        console.log(assetname, unitname, units, reserve, manage, freeze, clowback)
        try{
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            const suggestedParams = await algodClient.getTransactionParams().do();
            const roundsToWait = 3;

            console.log(suggestedParams);
            console.log(account, user);


            const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                suggestedParams,
                from: account.addr, // The account that will create the asset
                assetName: assetname, // The name of the asset
                unitName: unitname, // The short name of the asset
                total: Number(units), // The total amount of the smallest unit of the asset
                decimals: 0, // The number of decimals in the asset
                reserve: reserve, // The address of the account that holds the uncirculated/unminted supply of the asset
                freeze: freeze, // The address of the account that can freeze or unfreeze the asset in a specific account
                defaultFrozen: false, // Whether or not the asset is frozen by default
                clawback: clowback, // The address of the account that can clawback the asset
                assetURL: Img, // The URL where more information about the asset can be retrieved
                manager: manage, // The address of the account that can change the reserve, freeze, clawback, and manager addresses
            });

            console.log("secretKEy: ", typeof account.sk, new Uint8Array(account.sk))
            const signedAssetCreateTxn = assetCreateTxn.signTxn(account.sk);

            await algodClient.sendRawTransaction(signedAssetCreateTxn).do();
            await algosdk.waitForConfirmation(algodClient, assetCreateTxn.txID(), roundsToWait);

            const assetCreateInfo = await algodClient.pendingTransactionInformation(assetCreateTxn.txID()).do();
            const assetIndex = assetCreateInfo['asset-index'];
            console.log("create assets", assetIndex);
        }catch(err){
            setError(err.message);
        }
    }

    const getAssets = async () => {
        const algodToken = "";
        const algodServer = 'https://testnet-api.algonode.cloud';
        const algodPort = undefined;
        const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        let asset = [];

        for (let i=0; i<accountInfo.assets.length; i++){
            let el = accountInfo.assets[i];
            let temp = await algodClient.getAssetByID(el?.["asset-id"]).do();
            asset.push({...temp, amount: el?.amount});
        }
        console.log("assets: ", asset);
        setAssets(asset);
    }


    useEffect(() => {
        if (accountInfo){
            getAssets();
        }
    },[accountInfo?.assets.length != assets.length])

    const handleOptInAssets = async (e) => {
        e.preventDefault()
        
        try{
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            const suggestedParams = await algodClient.getTransactionParams().do();
            const roundsToWait = 3;
            console.log(suggestedParams);
            const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                from: account.addr,
                to: account.addr,
                amount: 0,
                assetIndex: Number(assetInd),
                // Set fee to zero since account will be paying double fee
            });

            const signedPaymentTxn = optInTxn.signTxn(account.sk);

            await algodClient.sendRawTransaction(signedPaymentTxn).do();
            console.log(`Sending payment transaction ${optInTxn.txID()}...`);
            
            await algosdk.waitForConfirmation(algodClient, optInTxn.txID(), roundsToWait);
            
            console.log(`Payment transaction ${optInTxn.txID()} confirmed! See it at https://testnet.algoexplorer.io/tx/${optInTxn.txID()}`);
        }catch(err){
            console.log("err: ", err);
        }
    }

    const nftImgs = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9gjz-ccJ13kry3_GsZc1b0c3G76cFhIvVNg&usqp=CAU", "https://cdn.dribbble.com/users/383277/screenshots/18055765/media/e5fc935b60035305099554810357012a.png?resize=400x0", "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"]
    const handleSendAsset = async (e) => {
        e.preventDefault()
        
        try{
            const algodToken = "";
            const algodServer = 'https://testnet-api.algonode.cloud';
            const algodPort = undefined;
            const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
            const suggestedParams = await algodClient.getTransactionParams().do();
            const roundsToWait = 3;
            console.log(suggestedParams);
            const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                from: account.addr,
                to: reciever,
                amount: Number(amount),
                assetIndex: Number(assetInd),
                // Set fee to zero since account will be paying double fee
            });

            const signedPaymentTxn = optInTxn.signTxn(account.sk);

            await algodClient.sendRawTransaction(signedPaymentTxn).do();
            console.log(`Sending payment transaction ${optInTxn.txID()}...`);
            
            await algosdk.waitForConfirmation(algodClient, optInTxn.txID(), roundsToWait);
            
            console.log(`Payment transaction ${optInTxn.txID()} confirmed! See it at https://testnet.algoexplorer.io/tx/${optInTxn.txID()}`);
        }catch(err){
            console.log("err: ", err);
        }
    }
  return (
    <div style={{margin: '1.5rem'}}>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: "space-between"
        }}>
            <button class="button-50" role="button" onClick={() => {
                if (tab == null || tab != "create_asset"){
                    setTab("create_asset")
                }else {
                    setTab(null);
                }
            }}>Create Asset</button>
           <button class="button-50" role="button" onClick={() => {
                if (tab == null || tab != "optin_assets"){
                    setTab("optin_assets")
                }else {
                    setTab(null);
                }
            }}>OptIn Asset</button>
            <button class="button-50" role="button" onClick={() => {
                if (tab == null || tab != "send_asset"){
                    setTab("send_asset")
                }else {
                    setTab(null);
                }
            }}>Send Asset</button>
        </div>

        <div>
            {tab == "create_asset" && <form style={{padding: "1rem"}} action="" onSubmit={handleCreateAsset}>
                <h3 style={{marginBottom: 0}}>Create Asset</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="Asset Name" onChange={(e) => {
                        setAssetName(e.target.value);
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-envelope"></span>
                    <input type="text" class="form-control" placeholder="Unit Name" onChange={(e) => {
                        setUnitName(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Total units" onChange={(e) => {
                        setUnits(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Asset Img URI" onChange={(e) => {
                        setImg(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Reserver Address" onChange={(e) => {
                        setReserve(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Freezer Address" onChange={(e) => {
                        setFreeze(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Clowback Address" onChange={(e) => {
                        setClowback(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Manager Address" onChange={(e) => {
                        setManage(e.target.value)
                    }}/>
                </div>
                <button style={{marginTop: 0}} className='credential-btn'>
                    <span>Create</span>
                </button>
                <p style={{color: "red", position: 'relative', top: "3rem", textAlign: "center"}}>{error}</p>
            </form>}
            {tab == "send_asset" && <form action="" onSubmit={handleSendAsset}>
                <h3>Send / Transfer Assets</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="Reciever's Address" value={reciever} onChange={(e) => {
                        setReciever(e.target.value);
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-envelope"></span>
                    <input type="text" class="form-control" placeholder="amount" value={amount} onChange={(e) => {
                        setAmount(e.target.value)
                    }}/>
                </div>
                <div class="form-holder">
                    <span class="lnr lnr-lock"></span>
                    <input type="text" class="form-control" placeholder="Asset Index ID" value={assetInd} onChange={(e) => {
                        setAssetIndex(e.target.value)
                    }}/>
                </div>
                <button className='credential-btn'>
                    <span>Send</span>
                </button>
                <p style={{color: "red", position: 'relative', top: "3rem", textAlign: "center"}}>{error}</p>
            </form>}
            {tab == "optin_assets" &&<form action="" onSubmit={handleOptInAssets}>
                <h3>OptIn / Allow Assets to Account</h3>
                <div class="form-holder">
                    <span class="lnr lnr-user"></span>
                    <input type="text" class="form-control" placeholder="AssetIndex" onChange={(e) => {
                        setAssetIndex(e.target.value);
                    }}/>
                </div>
                <button className='credential-btn'>
                    <span>Opt-In Asset</span>
                </button>
                <p style={{color: "red", position: 'relative', top: "3rem", textAlign: "center"}}>{error}</p>
            </form>}
            {tab == null && assets && <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: "1rem", height: "fit-content", paddingTop: "1rem"}}>
                {assets.map((el) => {
                    return <div className='nfts' style={{borderRadius: '10px', boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", opacity: el?.params?.['default-frozen'] ? 0.6 : 1}}>
                        <div><img style={{cursor: 'pointer' ,borderRadius: "10px 10px 0 0"}} src={el?.params?.url}/></div>
                        <div style={{padding: "0.2rem 0.5rem"}}>
                            <h4>{`${el?.params.name} (${el?.params?.['unit-name']})`}</h4>
                            <p>{`Units Available - ${el?.amount}`}</p>
                            <p>{`Asset ID - ${el?.index}`}</p>
                        </div>

                        <div className='ticket-line'>
                            <div></div>
                            <hr style={{border: 'none', borderTop: '1px dashed black', width: '100%', height: '3px'}}/>
                            <div></div>
                        </div>
                        <div className='low-head' onClick={() => {
                            setAssetIndex(el?.index);
                            setAmount(el?.amount);
                            setTab("send_asset");
                        }}>
                            Transfer
                        </div>
                    </div>
                })}
            </div>}
        </div>
        
    </div>
  )
}

export default Assets