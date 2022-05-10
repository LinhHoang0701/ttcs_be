import mongoose from 'mongoose';

export interface IStation {
    name: string;
    address: string;
    company: Array<any>;
    createdAt: Date,
    updatedAt: Date
}

const StationSchema = new mongoose.Schema({

   name: {
       type: String,
       required: true
   },

   address: {
       type: String,
       required: true
   }, 

   company: {
       type: [mongoose.Types.ObjectId],
       ref: 'Company'
   }

}, {
    timestamps: true
})

const Station = mongoose.model<IStation>("Station", StationSchema);

export default Station;