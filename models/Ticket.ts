import mongoose from 'mongoose';

type TPaymentInfo = {
    id: string,
    status: string,
    update_time: Date,
    email_address: string
}

export interface ITicket {
    user: string,
    trip: String,
    isPaid: Boolean,
    amountPaid: Number,
    seat: Array<any>,
    paymentInfo: TPaymentInfo,
    company: string,
    vehicle: string,
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
    seat: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: "Seat"
    },
    company: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: "Company"
    },
    vehicle: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Vehicle"
    },
    isPaid: {
        type:  Boolean,
        default: false,
        required: true,
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
        type: Date
    }

}, {
    timestamps: true
})

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;