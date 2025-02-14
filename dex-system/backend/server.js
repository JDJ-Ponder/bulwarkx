const express = require('express');
const { Client, xrpToDrops, Wallet } = require('xrpl');
const app = express();
const port = 3001;

const client = new Client('wss://s.altnet.rippletest.net:51233');

// Connect to the XRP Ledger Testnet
async function connectToXrpl() {
  try {
    await client.connect();
    console.log('Connected to XRP Ledger Testnet');
    
  } catch (error) {
    console.error('Error connecting to XRP Ledger:', error);
  }
}

connectToXrpl();

app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend' });
});


app.use(express.json());

// GET /balance/:address
app.get('/balance/:address', async (req, res) => {
    const address = req.params.address;
    console.log(`Fetching balance for address: ${address}`);
    try {
        const accountInfo = await client.request({
            command: 'account_info',
            account: address,
            ledger_index: 'validated',
        });
        res.json({ balance: accountInfo.result.account_data.Balance });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Error fetching balance' });
    }
});

// POST /send_payment
app.post('/send_payment', async (req, res) => {
  const { to, amount, currency } = req.body;
  const seed = 'sEdTM1uX6kmiVpD62q6qX3o4f7R8vQY';
  const wallet = Wallet.fromSeed(seed);
  console.log(`Sending payment from seed: ${seed} to: ${to} amount: ${amount}`);
  try {
    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: {
        currency: currency,
        value: amount,
        issuer: 'rPazHn8ymyG8zQvE447tTazGvJ6H9i26yZ', // Use an issuer address
      },
      Destination: to,
    };
    const prepared = await client.autofill(payment);
    const signed = wallet.sign(prepared);
    const tx = await client.submitAndWait(signed.tx_blob);
    res.json({ status: 'success', transaction: tx });
  } catch (error) {
    console.error('Error sending payment:', error);
    res.status(500).json({ error: 'Error sending payment' });
    }
});

// GET /transaction/:txid
app.get('/transaction/:txid', async (req, res) => {
    const txid = req.params.txid;
    console.log(`Fetching transaction with ID: ${txid}`);
    try {
        const tx = await client.request({
            command: 'tx',
            transaction: txid,
        });
        res.json({ transaction: tx });
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Error fetching transaction' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});