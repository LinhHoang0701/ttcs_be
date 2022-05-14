import mongoose from 'mongoose';

interface IReviews {   
    user: string,
    name: string,
    rating: number,
    comment: string
}


export interface ITrip extends mongoose.Document {
    from: String,
    to: String,
    startTime: Date,
    price: Number,
    vehicle: String,
    company: String,
    guestCapacity: Number,
    ratings?: Number,
    numOfReviews?: Number,
    reviews?: IReviews[],
    createdAt: Date,
    updatedAt: Date,
}

const TripSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
 
    to: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    guestCapacity: {
        type: Number,
        required: true,
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: false
    },

    ratings: {
        type: Number,
        default: 0
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

}, {
    timestamps: true
});

const Trip = mongoose.model<ITrip>("Trip", TripSchema);

export default Trip;