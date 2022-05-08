import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
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
    const companies = await Company.find({}).populate('station', 'name').populate('vehicles', 'name').limit(pageSize).skip(pageSize * (page - 1));
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

    const image = req.file;
   
    let imageUrl = "";
    let imageKey = "";

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
  

    if (company) {
        await Station.findByIdAndUpdate(station, {
            company: company._id
        })
    }
  
    await company.save();
  
    res.status(201).json({
        message: "Company created",
        data: company
    });
});

// @Desc Update company
// @Route /api/companies
// @Method PUT
export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, vehicles } = req.body;
    const { id } = req.params;
    try {
        const company = await Company.findByIdAndUpdate(id, {
            name, description, vehicles
        }, { new: true });
    
        res.status(201).json({
            company
        });
    } catch (err: any) {
        throw new Error(err);
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