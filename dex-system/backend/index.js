const express = require('express');
const app = express();
const cors = require('cors'); // Import cors
const balanceRoutes = require('./routes/balance');
const paymentRoutes = require('./routes/payment');
const transactionRoutes = require('./routes/transaction');
const { monitorServer } = require('../../shared/utils');

const PORT = 3001;

app.use(cors()); // use cors
app.use(express.json());

app.use('/balance', balanceRoutes);
app.use('/send_payment', paymentRoutes);
app.use('/transaction', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Start the monitoring process
monitorServer(PORT);