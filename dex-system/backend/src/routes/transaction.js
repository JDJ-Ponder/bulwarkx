const express = require('express');
const { getXrplClient, getTransactionDetails } = require('../xrpl_utils');

const router = express.Router();

router.get('/:txid', async (req, res) => {
  const { txid } = req.params;

  try {
    const client = getXrplClient();
    const transaction = await getTransactionDetails(client, txid);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
    client.disconnect();
  } catch (error) {
    console.error('Error getting transaction details:', error);
    res.status(500).json({ error: 'Failed to get transaction details' });
  }
});

module.exports = router;