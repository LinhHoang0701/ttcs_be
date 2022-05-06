import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Vehicle, { IVehicle } from '../models/Vehicle';


// @Desc Get all vehicles 
// @Route /api/vehicles/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Vehicle.countDocuments();
    const vehicles = await Vehicle.find({}).limit(pageSize).skip(pageSize * (page - 1));
    res.status(201).json({  
        vehicles,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
  
})

// @Desc Get Vehicle
// @Route /api/vehicles
// @Method GET
export const getVehicle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const vehicle = await Vehicle.findById(id);
        res.status(200).json({  
            vehicle,
        });
    } catch (error: any) {
        throw new Error(error)
    }
  
})

// @Desc create vehicle
// @Route /api/vehicles
// @Method POST
export const createVehicle = asyncHandler(async (req: Request, res: Response) => {
    const { name, company, guestCapacity } = req.body;
  
    const vehicle = new Vehicle({
      name,
      company,
      guestCapacity,
    });
  
    await vehicle.save();
  
    res.status(201).json({
        message: "Vehicle created"
    });
});

// @Desc update vehicle
// @Route /api/vehicles
// @Method PUT

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
    const { name, company, guestCapacity } = req.body;
    const { id } = req.params;

    try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            name, company, guestCapacity
        }, { new: true });
    
        res.status(201).json({
            vehicle
        });
    } catch (err: any) {
        throw new Error(err);
    }
})

// @Desc Delete Vehicle
// @Route /api/vehicles
// @Method DELETE
export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await Vehicle.findByIdAndDelete(id);

        res.status(200).end();
    } catch (error: any) {
        throw new Error(error);
    }

}) 

