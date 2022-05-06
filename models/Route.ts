import mongoose from 'mongoose';

export interface IRoute {
    from: string,
    to: string,
    trips: Array<any>,
    startTime: Date,
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

   trips: {
       type: [mongoose.Types.ObjectId],
       ref: "Trip",
       required: true
   },
   startTime: {
       type: Date,
       required: true
   }

}, {
    timestamps: true
})

const Route = mongoose.model<IRoute>("Route", RouteSchema);

export default Route;