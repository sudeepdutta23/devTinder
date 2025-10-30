const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../model/connection');
const User = require('../model/user');
const { userAuth } = require('../middlewares/authHandler');
const { Types } = require('mongoose');

// Send connection request
router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;
        const allowedStatuses = ['intrested', 'ignored'];
        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send({ message: `Invalid status: ${status}` })
        }
        // Prevent self-request
        if (fromUserId.equals(toUserId)) {
            return res.status(400).send({ message: `${req.user.firstName} cannot send connection request to self` })
        }

        // Check if to user exists
        const userExists = await User.findById(toUserId);
        if (!userExists) {
            return res.status(404).send({ message: `User with not found ` });
        }

        // Check if connection request already exists
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            return res.status(400).send({ message: `Connection request already exists between users` });
        }

        const newRequest = new ConnectionRequest
            ({
                fromUserId,
                toUserId,
                status
            });
        await newRequest.save();
        res.status(201).send({ data: newRequest, message: `${req.user.firstName} is ${status} to ${userExists.firstName}` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Review connection request
router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const toUserId = req.user._id;
        const allowedStatuses = ['accepted', 'rejected'];
        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status: ${status}` });
        }

        // Find the connection request
        const connectionReq = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId,
            status: 'intrested'
        })
        if (!connectionReq) {
            return res.status(404).json({ message: `Connection request not found` });
        }

        connectionReq.status = status;
        await connectionReq.save();
        return res.status(200).json({
            message: `Connection request ${status} successfully`,
            data: connectionReq
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});

module.exports = router;