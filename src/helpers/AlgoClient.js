import algosdk from "algosdk";

export const getAlgoClient = async () => {
    const algodToken = "";
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = undefined;
    return new algosdk.Algodv2(algodToken, algodServer, algodPort);
}