import mongoose from 'mongoose';

export interface IRoute {
    from: string;
    to: string;
    vehicle: String;
    route_id: String;
    createdAt: Date,
    updatedAt: Date
}

const RouteSchema = new mongoose.Schema({

   from: {
       type: String,
       required: true
   },

   to: {
       type: String,
       required: true
   },

   vehicle: {
       type: mongoose.Types.ObjectId,
       ref: 'Vehicle',
       required: true
   },

   route_id: {
       type: String,
       required: true
   }
}, {
    timestamps: true
})

const Route = mongoose.model<IRoute>("Route", RouteSchema);

export default Route;