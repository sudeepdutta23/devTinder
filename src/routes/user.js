const express = require('express');
const router = express.Router();
const User = require('../model/user');
const ConnectionRequest = require('../model/connection');
const { userAuth } = require('../middlewares/authHandler');

const USER_SAFE_DATA = 'firstName lastName photoUrl about skills';

// Get received connection requests
router.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const receivedRequests = await ConnectionRequest.find({ toUserId: userId, status: 'intrested' }).populate('fromUserId', USER_SAFE_DATA);
        res.status(200).json({ message: "Connection requests fetched successfully", data: receivedRequests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get connections
router.get('/user/connections', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const acceptedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        }).populate('fromUserId toUserId', USER_SAFE_DATA)

        const data = acceptedRequests.map(request => request.fromUserId._id.equals(userId) ? request.toUserId : request.fromUserId);

        res.status(200).json({ message: "Connections fetched successfully", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        let limit = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit);
        let page = parseInt(req.query.page) >= 0 ? parseInt(req.query.page) : 1;
        let skip = (page - 1) * limit;


        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsersFromFeed) } }
            ]
        }).select(USER_SAFE_DATA).limit(limit).skip(skip);
        return res.status(200).json({ message: "User feed fetched successfully", data: users });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



module.exports = router;