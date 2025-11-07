const { fi } = require('date-fns/locale');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    receipt: { type: String, required: true },
    notes: {
        firstName: { type: String },
        lastName: { type: String },
        membershipType: { type: String }
    },
    paymentId: { type: String },
    status: { type: String, required: true },
    membershipType: {
        type: String,
        enum: {
            values: ['silver', 'gold'],
            message: '{VALUE} is not a valid membership type'
        },
        required: true
    }
},
    {
        timestamps: true
    });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;