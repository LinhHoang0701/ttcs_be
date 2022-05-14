import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { startSession } from 'mongoose';
import Company, { ICompany, ICompanyRequest } from '../models/Company';
import Station from '../models/Station';
const AWS = require("aws-sdk/clients/s3");


// @Desc Get all companies 
// @Route /api/companies/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Company.countDocuments();
    const companies = await Company.find({}).populate('station', 'name').populate('vehicles', 'name guestCapacity').limit(pageSize).skip(pageSize * (page - 1));
    res.status(200).json({  
        companies,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
  
})

// @Desc Get company
// @Route /api/companies
// @Method GET
export const getCompany = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const company = await Company.findById(id);
        res.status(200).json({  
            company,
        });
    } catch (error: any) {
        throw new Error(error)
    }
  
})

// @Desc create company
// @Route /api/companys
// @Method POST
export const createCompany = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, station, vehicles } = req.body;
    const session = await startSession();
    const opts = { session, returnOriginal: false };

    let companies = [];

    const image = req.file;
   
    let imageUrl = "";
    let imageKey = "";


    session.startTransaction();
    try {

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

        const company = new Company({
            name,
            description,
            station,
            vehicles,
            imageUrl,
            imageKey
        });

        await company.save();
    
        if (company) {
            let stations = await Station.findById(station);
            companies = stations?.company as Array<any>;
            if (stations) {
                companies.push(company._id);
            }
            
            await Station.findByIdAndUpdate(station, {company: companies});
        }

        await session.commitTransaction();
        session.endSession();
    
        res.status(201).json({
            message: "Company created",
            data: company
        });
    } catch (err: any) {

        await session.abortTransaction();
        session.endSession();
        console.log(err);
        
        res.status(400).json({
          error: err.errors,
        });
    }
});

// @Desc Update company
// @Route /api/companies
// @Method PUT
export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, vehicles } = req.body;
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

        const company = await Company.findByIdAndUpdate(id, {
            name, description, vehicles, imageUrl, imageKey
        }, { new: true, opts });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            company
        });
    } catch (error) {

        await session.abortTransaction();
        session.endSession();
    
        res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }
  })

// @Desc Delete company
// @Route /api/companies
// @Method DELETE
export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await Company.findByIdAndDelete(id);

        res.status(200).end();
    } catch (error: any) {
        throw new Error(error);
    }

}) 

// @Desc Delete Many Companies
// @Route /api/companies
// @Method DELETE


export const searchCompany = asyncHandler (async (req: Request, res: Response) => {
    const {value} = req.body;
  
    try {
      const companies = await Company.find({
        $or : [
          {
            name: {$regex: value},
          }
        ]
      });
  
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;
      const count = companies.length;
  
      res.status(200).json({
        companies,
        page,
        pages: Math.ceil(count / pageSize),
        count
      })
    } catch (error: any) {
      throw new Error(error)
    }
  })