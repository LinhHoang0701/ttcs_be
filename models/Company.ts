import mongoose from 'mongoose';

export interface ICompanyRequest extends Request {
    company?: any
}

export interface ICompany {
    name: String;
    description: String;
    station: String;
    vehicles: Array<any>;
    createdAt: Date,
    updatedAt: Date
}

const CompanySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    station: {
        type: mongoose.Types.ObjectId,
        ref: 'Station',
        required: true
    },

    vehicles: {
        type: [mongoose.Types.ObjectId],
        ref: 'Vehicle',
        required: true
    }


}, {
    timestamps: true
})

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;