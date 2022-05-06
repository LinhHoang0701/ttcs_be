import mongoose from 'mongoose';

export interface IVehicle {
    name: String;
    company: String;
    guestCapacity: number;
    createdAt: Date,
    updatedAt: Date
}

const VehicleSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    guestCapacity: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);

export default Vehicle;