import express from 'express'
import bcrypt from 'bcryptjs'
import { jwtAutoMiddleware } from '../jwt.js';
import { Candidate } from '../models/Candidate.js'
import { User } from '../models/user.js';

const router = express.Router();

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';
    } catch (error) {
        return false;
    }
}

// create Candidate
router.post('/', jwtAutoMiddleware, async (req, res) => {
    const { name, age, party } = req.body;

    try {
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(404).json({ message: 'User does not have admin role', success: false });
        }

        // Check if candidate already exists (can be by name or party)
        const existingCandidate = await Candidate.findOne({ name, party });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate already exists', success: false });
        }

        // Create a new Candidate object
        const newCandidate = new Candidate({ name, party, age });

        const response = await newCandidate.save();

        // Send success response
        res.status(201).json({ message: 'Candidate created successfully', Candidate: response, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', success: false });
    }
});

// update Candidate
router.put('/:candidateId', jwtAutoMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(404).json({ message: 'User does not have admin role', success: false });
        }

        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, { new: true, runValidators: true, })

        if (!response) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate updated successfully', candidate: response, success: true });

    } catch (error) {
        console.error('Candidate update error:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
})

// delete Candidate
router.delete('/:candidateId', jwtAutoMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);

        if (!isAdmin) {
            return res.status(404).json({ message: 'User does not have admin role', success: false });
        }

        const candidateId = req.params.candidateId;

        // Find and delete the candidate by their ID
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found', success: false });
        }

        res.status(200).json({ message: 'Candidate deleted successfully', success: true });

    } catch (error) {
        console.error('Candidate deletion error:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});


router.post('/vote/:candidateId', jwtAutoMiddleware, async (req, res) => {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found', success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: 'User has already voted', success: false });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admins cannot vote', success: false });
        }

        // update the Candidate document for vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true;
        await user.save();

        res.status(200).json({
            message: 'Vote cast successfully',
            candidate: {
                id: candidate._id,
                name: candidate.name,
                party: candidate.party,
            },
            success: false,
        });

    } catch (error) {
        console.error('Voting error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.get('/vote/count', async (req, res) => {
    try {
        // find the candidate and sort votecount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount,
            }
        })
        return res.status(200).json(voteRecord);

    } catch (error) {
        console.error('Vote Count error:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
})

// display candidate info
router.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find({}, "name party age");
        res.status(200).json({ candidates, success: true });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
});

export default router;
