app.get('/balance/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});