const express = require('express');
const { XrplClient } = require('xrpl-client');
const { Wallet, xrpToDrops, validate, dropsToXrp } = require('xrpl');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const client = new XrplClient('wss://s.altnet.rippletest.net:51233');

async function getBalance(address) {
  try {
    const response = await client.send({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });
    return dropsToXrp(response.result.account_data.Balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

async function sendPayment(seed, destination, amount) {
  try {
    const wallet = Wallet.fromSeed(seed);
    const prepared = await client.send({
      command: 'prepare_payment',
      account: wallet.address,
      amount: xrpToDrops(amount),
      destination: destination,
    });
    const signed = wallet.sign(prepared.tx_json);
    const response = await client.send({
      command: 'submit',
      tx_blob: signed.tx_blob
    });
    return response.result;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

async function getTransactionStatus(txid) {
    try {
        const tx = await client.send({
            command: 'tx',
            transaction: txid
        });
        return tx.result;
    } catch (error) {
        console.error("Error fetching transaction:", error);
        throw error;
    }
}

app.get('/balance/:address', async (req, res) => {
  const { address } = req.params;
  try {
    if(!validate(address)){
      throw new Error('Invalid address');
    }
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/send_payment', async (req, res) => {
  const { seed, destination, amount } = req.body;
  try {
    if (!validate(destination)) {
      throw new Error("Invalid destination address");
    }
    const result = await sendPayment(seed, destination, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/transaction/:txid', async (req, res) => {
    const { txid } = req.params;
    try {
        const transaction = await getTransactionStatus(txid);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});