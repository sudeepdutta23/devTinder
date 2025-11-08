const express = require('express');
const router = express.Router();
const Chat = require('../model/chat');
const { userAuth } = require('../middlewares/authHandler');

router.get("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;


