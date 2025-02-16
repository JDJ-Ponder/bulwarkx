// xrpl_utils.js
const xrpl = require('xrpl');

async function getXrplClient() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  return client;
}

async function getBalance(client, address) {
  try {
    const balance = await client.getXrpBalance(address);
    return balance;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}

async function sendPayment(client, wallet, destination, amount) {
  try {
    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(amount),
      Destination: destination,
    });
    const signed = wallet.sign(prepared);
    const tx = await client.submitAndWait(signed.tx_blob);
    return tx;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

async function getTransactionDetails(client, txid) {
  try {
    const tx = await client.request({
      command: 'tx',
      transaction: txid,
    });
    return tx;
  } catch (error) {
    console.error('Error getting transaction details:', error);
    throw error;
  }
}

module.exports = {
  getXrplClient,
  getBalance,
  sendPayment,
  getTransactionDetails,
};