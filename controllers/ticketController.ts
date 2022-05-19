import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Ticket, { ITicket } from '../models/Ticket';
import { IUserRequest } from '../models/User';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Trip from '../models/Trip';
import Seat from '../models/Seat';
import Vehicle from '../models/Vehicle';
import { startSession } from 'mongoose';

const moment = extendMoment(Moment as any);

// @Desc new booking
// @Route /api/bookings
// @Method POST
export const newBooking = asyncHandler(async (req: IUserRequest, res: Response) => {
    const session = await startSession();
    const opts = { session, returnOriginal: false };
    const { trip, seat, amountPaid, paymentInfo, vehicle, company } = req.body;

    const seats: any = await Seat.find({_id: seat});
    
    const isBookingSeat = seats.some((seat: any) => seat.status === true);
    
    let booking;

    session.startTransaction();
    
    try {
        if (paymentInfo) {

            booking = new Ticket({
                trip,
                user: req.user._id,
                seat,
                isPaid: true,
                amountPaid,
                paymentInfo,
                vehicle,
                company,
                paidAt: Date.now(),
            });
        
            if (booking) {
                await Seat.update(
                    {
                        _id: {$in: seat}
                    },
                    {
                        $set: {status : true}
                    },
                    {multi: true}
                );
                await booking.save();
            }
        }

        if (!isBookingSeat) {
            await session.commitTransaction();
            session.endSession();
        } else {
            throw new Error("Seat has been booked! Please choose another seat.")
        }

        res.status(201).json(booking);
    } catch (error: any) {

        await session.abortTransaction();
        session.endSession();
        
        console.log(error);
        res.status(400).json(error.message)
    }
})

// @Desc Get all bookings current user
// @Route /api/bookings/me
// @Method GET
export const myBookings = asyncHandler(async (req: IUserRequest, res: Response) => {

    const bookings = await Ticket.find({ user: req.user._id })
    .populate("user", "name email")
    .populate("trip", "from to startTime guestCapacity")
    .populate("seat", "sku type")
    .populate("company", "name")
    .populate("vehicle", "name");

    if(!bookings) {
        res.status(401);
        throw new Error("Bookings not found");
    }

    res.status(201).json(bookings);

})

// @Desc Get all bookings
// @Route /api/bookings
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Ticket.countDocuments();
    const bookings = await Ticket.find({})
    .populate("user", "name email")
    .populate('seat', 'sku status type')
    .populate('trip', 'from to startTime price')
    .limit(pageSize).skip(pageSize * (page - 1));
    res.status(201).json({
        bookings,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
})

// @Desc Delete booking 
// @Route /api/bookings/:id
// @Method DELETE
export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {

    const booking = await Ticket.findById(req.params.id);

    if(!booking) {
        res.status(401);
        throw new Error("Ticket not found");
    }

    try {
        await Ticket.findByIdAndDelete(req.params.id);

        res.status(201).json({});
    } catch (error) {
        res.status(400).json(error)
    }

})

export const getTicketByVehicle = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await Vehicle.findById(req.body.vehicle);

    console.log(vehicle);
    
})