const cron = require('node-cron');
const { endOfDay, startOfDay, subDays } = require('date-fns');
const ConnectionRequest = require('../model/connection');
const { sendEmail } = require('./mailer');

cron.schedule('32 21 * * *', async () => {
    try {
      const yesterday = subDays(new Date(), 1);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
        status: 'intrested',
        createdAt: { 
            $gte: yesterdayStart, 
            $lte: yesterdayEnd 
        },
    }).populate('fromUserId toUserId');

    const listOfEmails = [
        ...new Set(pendingRequests.map((req)=> req.toUserId.email))
    ];
    
    for (const email of listOfEmails) {
        try {
          sendEmail(
            email,
            'Pending Connection Requests for' + email,
            `You have pending connection requests from yesterday. Please log in to your account to respond to them.`
          );
        } catch (error) {
          
        }
    }
    
  } catch (error) {
    console.error('Error deleting stale connection requests:', error);
  }
});

module.exports = cron;