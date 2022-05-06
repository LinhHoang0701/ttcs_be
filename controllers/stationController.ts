import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Station, { IStation } from '../models/Station';

// @Desc Get all stations 
// @Route /api/stations/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Station.countDocuments();
  const stations = await Station.find({}).populate('company', 'name').limit(pageSize).skip(pageSize * (page - 1));
  res.status(200).json({
      stations,
      page,
      pages: Math.ceil(count / pageSize),
      count
  });

})

// @Desc Get station
// @Route /api/stations
// @Method GET
export const getStation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      const station = await Station.findById(id);
      res.status(200).json({  
          station,
      });
  } catch (error: any) {
      throw new Error(error)
  }

})


// @Desc create station
// @Route /api/stations
// @Method POST
export const createStaion = asyncHandler(async (req: Request, res: Response) => {
  const { name, address, company } = req.body;

  const station = new Station({
    name,
    address,
    company,
  });

  await station.save();

  res.status(201).json({
      message: "Station created",
      data: station
  });
});

// @Desc Update station
// @Route /api/stations
// @Method PUT
export const updateStation = asyncHandler(async (req: Request, res: Response) => {
  const { name, address, company } = req.body;
  const { id } = req.params;
  try {
      const station = await Station.findByIdAndUpdate(id, {
          name, address, company
      }, { new: true });
  
      res.status(201).json({
          station
      });
  } catch (err: any) {
      throw new Error(err);
  }
})

// @Desc Delete company
// @Route /api/companies
// @Method DELETE
export const deleteStation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      await Station.findByIdAndDelete(id);

      res.status(200).end();
  } catch (error: any) {
      throw new Error(error);
  }

}) 