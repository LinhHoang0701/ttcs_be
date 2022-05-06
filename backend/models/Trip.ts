import mongoose from 'mongoose';

interface IReviews {   
    user: string,
    name: string,
    rating: number,
    comment: string
}


export interface ITrip extends mongoose.Document {
    price: Number,
    guestCapacity: Number,
    ratings?: Number,
    numOfReviews?: Number,
    category: String,
    reviews?: IReviews[],
    user: mongoose.Types.ObjectId,
    routeId: String,
    createdAt: Date,
    updatedAt: Date,
}

const TripSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },

    guestCapacity: {
        type: Number,
        required: true,
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

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    routeId: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const Trip = mongoose.model<ITrip>("Trip", TripSchema);

export default Trip;