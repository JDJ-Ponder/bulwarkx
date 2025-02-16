const express = require('express');
const { sendPayment } = require('../xrpl_utils');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { seed, destination, amount } = req.body;
    if (!seed || !destination || !amount) {
      return res.status(400).json({ error: 'Seed, destination, and amount are required' });
    }

    const result = await sendPayment(seed, destination, amount);
    res.json(result);
  } catch (error) {
    console.error('Error sending payment:', error);
    res.status(500).json({ error: 'Failed to send payment', details: error.message });
  }
});

module.exports = router;