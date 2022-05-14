import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Seat, { ISeat } from '../models/Seat';
import Vehicle from '../models/Vehicle';

// @Desc Get all seats 
// @Route /api/seats/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Seat.countDocuments();
    const seats = await Seat.find({}).populate('vehicle', 'name').limit(pageSize).skip(pageSize * (page - 1));
    res.status(201).json({  
        seats,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
  
})

// @Desc Get seat
// @Route /api/seats
// @Method GET
export const getSeat = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const seat = await Seat.find({vehicle: id});
        res.status(200).json({  
            seat,
        });
    } catch (error: any) {
        throw new Error(error)
    }
  
})

// @Desc create seat
// @Route /api/seats
// @Method POST
export const createSeat = asyncHandler(async (req: Request, res: Response) => {
    const { sku, vehicle, type } = req.body;
    let guestCapacity;
    try {
        const car = await Vehicle.findById(vehicle);

        if (!car) {
            throw new Error("Vehicle not found");
        }

        guestCapacity = car.guestCapacity;
    } catch (error: any) {
        throw new Error(error);
    }

    try {
        const seatLength = await Seat.find({});
        if (seatLength.length >= guestCapacity) {
            throw new Error('This vehicle is overloaded');
        }
    } catch (error: any) {
        throw new Error(error);
    }
    let seat;
    try {
        seat = new Seat({
            sku, vehicle, type
        });
      
        await seat.save();
    } catch (error: any) {
        throw new Error(error);
    }
  
    res.status(201).json({
        message: "Seat created",
        data: seat
    });
});

// @Desc Update seat
// @Route /api/seats/:id
// @Method PUT
export const updateSeat = asyncHandler(async (req: Request, res: Response) => {
    const { sku, vehicle, type } = req.body;
    const { id } = req.params;
    try {
        const seat = await Seat.findByIdAndUpdate(id, {
            sku, vehicle, type
        }, { new: true });
    
        res.status(201).json({
            seat
        });
    } catch (err: any) {
        throw new Error(err);
    }
  })

// @Desc Delete seat
// @Route /api/seats/:id
// @Method DELETE
export const deleteSeat = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await Seat.findByIdAndDelete(id);

        res.status(200).end();
    } catch (error: any) {
        throw new Error(error);
    }

}) 

export const searchSeat = asyncHandler(async (req: Request, res: Response) => {
    
})