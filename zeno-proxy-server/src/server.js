import express from 'express';
import axios from 'axios';
import qs from 'qs';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Zeno API configuration
const ZENO_API_URL = 'https://api.zeno.africa';
const ACCOUNT_ID = 'zp51883';
const API_KEY = 'YOUR_API_KEY';
const SECRET_KEY = 'YOUR_SECRET_KEY';

// Payment initiation endpoint
app.post('/api/initiate-payment', async (req, res) => {
    try {
        const { accountId, phoneNumber, amount } = req.body;
        
        const data = {
            buyer_name: 'Customer',
            buyer_phone: phoneNumber,
            buyer_email: 'customer@example.com',
            amount: amount,
            account_id: accountId,
            secret_key: SECRET_KEY,
            api_key: API_KEY
        };

        const formattedData = qs.stringify(data);

        const response = await axios.post(ZENO_API_URL, formattedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json({
            status: 'success',
            order_id: response.data.order_id,
            message: 'Payment initiated successfully'
        });
    } catch (error) {
        console.error('Error initiating payment:', error.response?.data || error.message);
        res.status(500).json({
            status: 'error',
            message: error.response?.data?.message || 'Failed to initiate payment'
        });
    }
});

// Order status check endpoint
app.post('/api/check-order-status', async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const data = {
            order_id: orderId,
            account_id: ACCOUNT_ID,
            secret_key: SECRET_KEY,
            api_key: API_KEY
        };

        const formattedData = qs.stringify(data);

        const response = await axios.post(`${ZENO_API_URL}/check-status`, formattedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json({
            status: 'success',
            order_status: response.data.status,
            message: 'Order status retrieved successfully'
        });
    } catch (error) {
        console.error('Error checking order status:', error.response?.data || error.message);
        res.status(500).json({
            status: 'error',
            message: error.response?.data?.message || 'Failed to check order status'
        });
    }
});

// Webhook endpoint
app.post('/api/webhook', (req, res) => {
    const webhookData = JSON.stringify(req.body);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Webhook Data: ${webhookData}\n`;

    fs.appendFile('weblogs.txt', logEntry, (err) => {
        if (err) {
            console.error('Error writing to webhook log:', err);
            res.status(500).json({ status: 'error', message: 'Failed to log webhook data' });
        } else {
            res.json({ status: 'success', message: 'Webhook received and logged' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 