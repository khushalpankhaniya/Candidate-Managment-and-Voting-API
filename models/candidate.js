import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        party: {
            type: String,
            require: true,
        },
        age: {
            type: Number,
            require: true,
        },
        votes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    require: true,
                },
                votedAt: {
                    type: Date,
                    default: Date.now(),
                }
            }
        ],
        voteCount: {
            type: Number,
            default: 0,
        }
    })

const Candidate = mongoose.model('Candidate', candidateSchema);
export { Candidate }