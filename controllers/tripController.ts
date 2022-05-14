import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Route from '../models/Route';
import Seat from '../models/Seat';
import Trip from '../models/Trip';
import { IUserRequest } from '../models/User';

// @Desc Get All Trips
// @Route /api/trips/all
// @Method GET
export const getAll = asyncHandler(async(req: Request, res: Response) => {

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Trip.countDocuments();

    const trips = await Trip.find({}).limit(pageSize).populate('vehicle', 'name').skip(pageSize * (page - 1));
    res.status(201).json({
        trips,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})

// @Desc Search trips
// @Route /api/trips/search/
// @Method POST
export const searchTrips = asyncHandler(async(req: Request, res: Response) => {
    const { from, to, startTime} = req.body;

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const filterd = await Trip
    .find({})
    .populate('vehicle', 'name')
    .where('from').equals(from)
    .where('to').equals(to)
    .where('startTime').lte(startTime)
    .limit(pageSize).skip(pageSize * (page - 1));

    const count = filterd.length;
    
    res.status(200).json({
        filterd,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})

// @Desc Get Single trip
// @Route /api/trips/:id
// @Method GET
export const getSingle = asyncHandler(async (req: Request, res: Response) => {

    const trip = await Trip.findById(req.params.id);

    const countAvailableSeat = await Seat.countDocuments({status: false});

    if(!trip) {
        res.status(404);
        throw new Error("Trip not found");
    }

    res.status(201).json({trip, countAvailableSeat});

})

// @Desc Create new trip
// @Route /api/trips
// @Method POST
export const addTrip = asyncHandler(async (req: IUserRequest, res: Response) => {

    try {
        const trip = await Trip.create(req.body);
    res.status(201).json(trip);
    } catch (error: any) {
        throw new Error(error);        
    }

})

// @Desc Update trip
// @Route /api/trips/:id
// @Method PUT
export const updateTrip = asyncHandler(async (req: IUserRequest, res: Response) => {

    let trip = await Trip.findById(req.params.id);

    if(!trip) {
        res.status(401);
        throw new Error("Trip not found");
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(201).json(trip);

})

// @Desc Delete Trip
// @Route /api/trips/:id
// @Method DELETE
export const deleteTrip = asyncHandler(async (req: IUserRequest, res: Response) => {

    let trip = await Trip.findById(req.params.id);

    if(!trip) {
        res.status(401);
        throw new Error("Trip not found");
    }

    trip = await Trip.findByIdAndDelete(req.params.id);

    res.status(201).json({});

})

// @Desc Create Trip Review
// @Route /api/trips/:id/reviews
// @Method POST
export const createTripReview = asyncHandler(async (req: IUserRequest, res: Response) => {

    const trip = await Trip.findById(req.params.id);

    if(trip) {

        const alreadyReviewd = trip.reviews?.find(review => review.user.toString() === req.user._id.toString());

        if(alreadyReviewd) {
            res.status(401);
            throw new Error("Already reviewed");
        }

        const { rating, comment } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        trip.reviews?.push(review);

        trip.numOfReviews = trip.reviews?.length;

        trip.ratings = trip.reviews?.reduce((acc: any, item: any) => item?.rating + acc, 0) / Number(trip.reviews?.length);

        await trip.save();

        res.status(201).json({ message: "Review added" });

    } else {
        res.status(401);
        throw new Error("Trip not found");
    }

})