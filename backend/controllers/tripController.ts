import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Trip from '../models/Trip';
import { IUserRequest } from '../models/User';

// @Desc Get All Trips
// @Route /api/trips
// @Method GET
export const getAll = asyncHandler(async(req: Request, res: Response) => {

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        $or: [
            {name: { $regex: req.query.keyword, $options: "i" }},
            {description: { $regex: req.query.keyword, $options: "i" }},
        ]
    }
    : {};

    const numOfBeds = req.query.numOfBeds ? {numOfBeds: req.query.numOfBeds} : {};

    const category = req.query.tripType ? {category: req.query.tripType} : {};

    const count = await Trip.countDocuments({ ...keyword, ...numOfBeds, ...category })

    const trips = await Trip.find({ ...keyword, ...numOfBeds, ...category }).limit(pageSize)
    .skip(pageSize * (page - 1));
    res.status(201).json({
        trips,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})

// @Desc Search trips
// @Route /api/trips/search/
// @Method GET
export const searchTrips = asyncHandler(async(req: Request, res: Response) => {
    const filterd = await Trip.find({ $and: [ 
        { $or: [{name: req.query.keyword },{description: req.query.keyword}] }, 
        {numOfBeds: req.query.numOfBeds}, 
        {category: req.query.tripType} 
    ] });
    res.status(201).json(filterd);
})

// @Desc Get Single trip
// @Route /api/trips/:id
// @Method GET
export const getSingle = asyncHandler(async (req: Request, res: Response) => {

    const trip = await Trip.findById(req.params.id);

    if(!trip) {
        res.status(404);
        throw new Error("Trip not found");
    }

    res.status(201).json(trip);

})

// @Desc Create new trip
// @Route /api/trips
// @Method POST
export const addTrip = asyncHandler(async (req: IUserRequest, res: Response) => {

    req.body.user = req.user._id;

    const trip = await Trip.create(req.body);

    res.status(201).json(trip);

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