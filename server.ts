import express from 'express';
import { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import { errorHandler, notFound } from './middlewares/errorMiddleware';

// Routes
import { rootRouter } from './routes';

const app: Application = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Default 
app.get("/api", (req: Request, res: Response)  => {
    res.status(201).json({ message: "Welcome to Ve xe re App" });
})
//Router
app.use("/api/v1",rootRouter);


app.get("/api/config/paypal", (req, res) => {
  res.status(201).send(process.env.PAYPAL_CLIENT_ID);
});

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server is running on PORT ${PORT}`));
