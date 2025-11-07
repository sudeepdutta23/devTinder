const express = require('express');
const { userAuth } = require('../middlewares/authHandler');
const razorpayInstance = require('../utils/razorpay');
const Payment = require('../model/payment');
const User = require('../model/user');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');


const router = express.Router();

router.post('/payment/create', userAuth, async (req, res) => {
    try {
        const { amount, currency, receipt, membershipType } = req.body;
        console.log(req.body);
        
        const options = {
            amount: (membershipAmount[membershipType] ?? 0) * 100, // amount in the smallest currency unit
            currency: currency || 'INR',
            receipt: receipt || `rcptid_${Math.random().toString(36).substring(2, 15)}`,
            notes: {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                membershipType: req.membershipType
            }
        };

        const order = await razorpayInstance.orders.create(options);

        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
            membershipType: membershipType || 'silver'
            
        });

        const savedPayment = await payment.save();

        res.status(201).json({
            data: {...savedPayment.toJSON(), keyId: process.env.RAZORPAY_API_KEY, email: req.user.email, },
            message: 'Payment order created successfully'
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
})

router.post("/payment/webhook", async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body), 
            webhookSignature, 
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if(!isWebhookValid){
            return res.status(400).json({
                success: false,
                message: 'Invalid webhook signature'
            });
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();
        
        const user = await User.findOne({  _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.membershipType;
        await user.save();
        
    } catch (error) {
        
    }
});

router.get('/payment/premium/verify', userAuth, async (req, res) => {
    try {
        const user = req.user.toJSON();
        
        if(!user.isPremium){
            return res.status(200).json({
                data: { isPremium: false },
                message: 'User is not premium'
            });
        }
        res.status(200).json({
            data: { isPremium: true },
            message: 'User is premium'
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
})

module.exports = router;