import { JsonRpcProvider } from "ethers";
import axios from "axios";

let CURRENT_BLOCK_NUMBER = 21695414;
const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/CHBrMPyFqQsNKl-rVKw1M4cSyBfn1cfx");



async function main() {

    const interestedAddress = ["0x873f9d1fce73bc58de54ecdeda3e71132c27341b", "0xb73664d81129150964b07c6447b2949cf5f11619"];

    const transactions = await getTransactionReceipt(CURRENT_BLOCK_NUMBER.toString()); // Contains all tnx in this particular block i.e (interested + others)

    const interestedTransactions = transactions.result.filter(x => interestedAddress.includes(x.to));

    // This map is doing an async rpc/http call
    const fullTxn = await Promise.all(interestedTransactions.map(async ({ transactionHash }) => {
        const txn = await provider.getTransaction(transactionHash);
        return txn;
    }));

    console.log(fullTxn);

}

interface TransactionReceipt {
    transactionHash: string;
    from: string;
    to: string
}

interface TransactionReceiptResponse {
    result: TransactionReceipt[];
}

async function getTransactionReceipt(blockNumber: string): Promise<TransactionReceiptResponse> {
   
    let data = JSON.stringify({
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_getBlockReceipts",
    "params": [
        "0x14B0BB7" // add block number here
    ]
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://eth-mainnet.g.alchemy.com/v2/CHBrMPyFqQsNKl-rVKw1M4cSyBfn1cfx',
    headers: { 
        'Content-Type': 'application/json', 
        'Cookie': '_cfuvid=LCc020LszSjWBtnBKhxptdHxILlGuLeXECxf9qlX48g-1739172581706-0.0.1.1-604800000'
    },
    data : data
    };

    const response = await axios.request(config);
    return response.data;

    

}


main();