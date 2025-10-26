const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    toUserId: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    status: { 
        type: String, 
        enum: {
            values: ['ignored', 'intrested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status type'
        }, 
        required: true 
    },
},
{
    timestamps: true
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre(('save'), function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error(`User cannot send connection request to self`);
    }
    next();
});

module.exports = model('ConnectionRequest', connectionRequestSchema);