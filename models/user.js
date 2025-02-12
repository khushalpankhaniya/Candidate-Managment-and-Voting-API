import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        age: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        mobileno: {
            type: Number,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        aadharCardNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['voter', 'admin'],
            default: 'voter',
        },
        isVoted: {
            type: Boolean,
            default: false,
        },
    })

userSchema.methods.comparePassword = async function (currenPassword) {
    try {
        return await bcrypt.compare(currenPassword, this.password);
    } catch (error) {
        console.error('Password comparison error:', error);
        throw new Error('Error comparing password');
    }
};

const User = mongoose.model('User', userSchema);
export { User };