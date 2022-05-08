import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { startSession } from 'mongoose';
import Company from '../models/Company';
import Vehicle, { IVehicle } from '../models/Vehicle';
const AWS = require("aws-sdk/clients/s3");


// @Desc Get all vehicles 
// @Route /api/vehicles/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Vehicle.countDocuments();
    const vehicles = await Vehicle.find({}).populate('company', 'name').limit(pageSize).skip(pageSize * (page - 1));
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

    let vehicles = [];

    const image = req.file;
   
    let imageUrl = "";
    let imageKey = "";

    const session = await startSession();
    const opts = { session, returnOriginal: false };

    try {
        session.startTransaction();

        if (image) {
            const s3bucket = new AWS({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image.originalname,
                Body: image.buffer,
                ContentType: image.mimetype,
                ACL: "public-read",
            };
            const s3Upload = await s3bucket.upload(params).promise();

            imageUrl = s3Upload.Location;
            imageKey = s3Upload.key;
        }

        const vehicle = new Vehicle({
            name,
            company,
            guestCapacity,
            imageUrl,
            imageKey
          });
      
          if (vehicle) {
              vehicles.push(vehicle._id);
          }
          await vehicle.save(opts);
      
          let companies = await Company.findById(company);
      
          if (companies) {
              vehicles.push(companies.vehicles)
          }
          await Company.findByIdAndUpdate(company, {vehicles: vehicles.flat()}, opts);

          await session.commitTransaction();
          session.endSession();
        
          res.status(201).json({
              message: "Vehicle created",
              data: vehicle
          });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
    
        res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
    }
});

// @Desc update vehicle
// @Route /api/vehicles
// @Method PUT

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
    const { name, company, guestCapacity } = req.body;
    const { id } = req.params;

    const image = req.file;
   
    let imageUrl = "";
    let imageKey = "";

    const session = await startSession();
    const opts = { session, returnOriginal: false };

    try {
        session.startTransaction();

        if (image) {
            const s3bucket = new AWS({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image.originalname,
                Body: image.buffer,
                ContentType: image.mimetype,
                ACL: "public-read",
            };
            const s3Upload = await s3bucket.upload(params).promise();

            imageUrl = s3Upload.Location;
            imageKey = s3Upload.key;
        }

        const vehicle = await Vehicle.findByIdAndUpdate(id, {
            name, company, guestCapacity,imageUrl,imageKey
        }, { new: true, opts });

        await session.commitTransaction();
          session.endSession();
    
        res.status(201).json({
            vehicle
        });
    } catch (err: any) {
        await session.abortTransaction();
        session.endSession();
    
        res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
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

