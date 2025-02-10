import express from "express";
import { Client } from "pg";
import { HDNodeWallet } from "ethers6";
import { mnemonicToSeedSync } from "bip39";
import { MNUEMONICS } from "./config";

const client = new Client("postgresql://postgres:mysecretpassword@localhost:5432/mynewdb");
client.connect();

const seed = mnemonicToSeedSync(MNUEMONICS);

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const result = await client.query("INSERT INTO users (username, password, depositAddress, privateKey, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id", [username, password, "", "", 0]);
    const userId = result.rows[0].id;
    console.log(result);
    const derivationPathForEthWallet = `m/44'/60/${userId}'/0`;
    console.log(derivationPathForEthWallet);
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPathForEthWallet);

    await client.query("UPDATE users SET depositAddress=$1, privateKey=$2 WHERE id=$3", [child.address, child.privateKey, userId]);

    console.log(child.privateKey);
    console.log(child.address);

    res.json({
        userId
    });
});


app.get("/deposit-address/:userId", (req, res) => {

});





app.listen(3000);