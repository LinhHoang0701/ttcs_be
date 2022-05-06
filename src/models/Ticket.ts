import mongoose from 'mongoose';

type TPaymentInfo = {
    id: string,
    status: string,
    update_time: Date,
    email_address: string,
}

export interface ITicket {
    user: string,
    trip: String,
    amountPaid: Number,
    paymentInfo: TPaymentInfo,
    paidAt: Date,
    createdAt: Date,
    updatedAt: Date
}

const TicketSchema = new mongoose.Schema({

    trip: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Trip"
    },

    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },

    amountPaid: {
        type: Number,
        required: true,
    },

    paymentInfo: {
      id: { type: String },
      status: { type: String },
      update_time: { type: Date },
      email_address: { type: String },
    },

    paidAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
})

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;