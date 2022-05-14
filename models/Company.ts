import mongoose from 'mongoose';

export interface ICompanyRequest extends Request {
    company?: any
}

export interface ICompany {
    name: String;
    description: String;
    station: String;
    vehicles: Array<any>;
    imageUrl: String;
    imageKey: String;
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
        required: false
    },
    
    imageUrl: {
        type: String,
        required: false,
        default: 'https://www.sustainable-bus.com/wp-content/uploads/2020/07/20C0355_01-1.jpg'
    },

    imageKey: {
        type: String,
        required: false
    }

}, {
    timestamps: true
})

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;