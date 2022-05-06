import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Route, { IRoute } from '../models/Route';
import { genarateRouteId } from '../utils/genarateRouteId';

// @Desc Get all routes 
// @Route /api/routes/all
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Route.countDocuments();
    const routes = await Route.find({}).limit(pageSize).skip(pageSize * (page - 1));
    res.status(200).json({  
        routes,
        page,
        pages: Math.ceil(count / pageSize),
        count
    });
  
})

// @Desc Get route
// @Route /api/routes
// @Method GET
export const getRoute = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const route = await Route.findById(id);
        res.status(200).json({  
            route,
        });
    } catch (error: any) {
        throw new Error(error)
    }
  
})

// @Desc create route
// @Route /api/routes
// @Method POST
export const createRoute = asyncHandler(async (req: Request, res: Response) => {
    const { from, to, trips, startTime } = req.body;

    if (!from || !to || !startTime) {
        throw new Error("Fill all field!");
    }

    const route_id = genarateRouteId(from, to);
    
    if (route_id) {
        const route = new Route({
            from,
            to,
            trips,
            startTime
        });
      
        await route.save();
    } else {
        throw new Error("Fill all field!");
    }
  
    res.status(201).json({
        message: "Route created"
    });
});


// @Desc Update route
// @Route /api/routes
// @Method PUT
export const updateRoute = asyncHandler(async (req: Request, res: Response) => {
    const { from, to, trips, startTime } = req.body;
    const { id } = req.params;
    try {
        const route = await Route.findByIdAndUpdate(id, {
            from, to, trips, startTime
        }, { new: true });
    
        res.status(201).json({
            route
        });
    } catch (err: any) {
        throw new Error(err);
    }
})

// @Desc Delete route
// @Route /api/routes
// @Method DELETE
export const deleteRoute = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await Route.findByIdAndDelete(id);

        res.status(200).end();
    } catch (error: any) {
        throw new Error(error);
    }

}) 