import express from 'express';
import tripRoutes from './tripRoutes';
import userRoutes from './userRoutes';
import uploadRoutes from './uploadRoutes';
import companyRoutes from './companyRoutes';
import routeRoutes from './routeRoutes';
import seatRoutes from './seatRoutes';
import stationRoutes from './stationRoutes';
import ticketRoutes from './ticketRoutes';
import vehicleRoutes from './vehicleRoutes';

const rootRouter = express.Router();

// Trip Route
rootRouter.use("/trips", tripRoutes);

// User Route
rootRouter.use("/users", userRoutes);

// Company Route
rootRouter.use("/companies", companyRoutes);

rootRouter.use("/routes", routeRoutes);

rootRouter.use("/seats", seatRoutes);

rootRouter.use("/stations", stationRoutes);

rootRouter.use("/tickets", ticketRoutes);

rootRouter.use("/vehicles", vehicleRoutes);

// Upload Route
rootRouter.use("/uploads", uploadRoutes);

export {rootRouter};
  