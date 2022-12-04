import mongoose from 'mongoose';

export interface ISeat {
    sku: String;
    vehicle: String;
    type: String;
    status: Boolean,
    createdAt: Date,
    updatedAt: Date
}

const SeatSchema = new mongoose.Schema({
    sku: { 
        type: String,
        required: true
    },
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['VIP', 'Economy'],
        default: 'Economy',
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

const Seat = mongoose.model<ISeat>("Seat", SeatSchema);

export default Seat;