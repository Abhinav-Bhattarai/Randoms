import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    CreationDate: {
        type: String,
        default: new Date(parseInt(Date.now())).toLocaleDateString,
        // required: false
    }
});

const RegisterModel = mongoose.model('RegisterModel', Schema);

export default RegisterModel;