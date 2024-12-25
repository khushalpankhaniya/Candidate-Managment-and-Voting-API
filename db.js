import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

const connection = mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connection was successful');
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
    });


export default connection;