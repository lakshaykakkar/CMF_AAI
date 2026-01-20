const express = require('express');
const router = express.Router();
const ChangeRequest = require('../models/ChangeRequest');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// File Upload Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   POST /api/requests
// @desc    Create a new change request
// @access  Requester
router.post('/', protect, upload.array('annexures'), async (req, res) => {
    try {
        const {
            projectDepartment, description, reason, priority,
            usersAffected, plannedStart, plannedEnd,
            implementationPlan, rollbackPlan
        } = req.body;

        const annexures = req.files ? req.files.map(file => file.path) : [];

        const newRequest = new ChangeRequest({
            requester: req.user.id,
            projectDepartment,
            description,
            reason,
            priority,
            usersAffected,
            plannedStart,
            plannedEnd,
            implementationPlan,
            rollbackPlan,
            annexures
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/requests
// @desc    Get all requests (filtered by role potentially)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        // Requesters only see their own? Or all? Let's say all for now or own.
        // If Requester, only show own:
        if (req.user.role === 'Requester') {
            query.requester = req.user.id;
        }

        const requests = await ChangeRequest.find(query)
            .populate('requester', 'username email')
            .populate('reviewer.actionBy', 'username')
            .populate('approver.actionBy', 'username')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/requests/:id
// @desc    Get single request
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const request = await ChangeRequest.findById(req.params.id)
            .populate('requester', 'username email')
            .populate('reviewer.actionBy', 'username')
            .populate('approver.actionBy', 'username');

        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Authorization check if needed
        if (req.user.role === 'Requester' && request.requester._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/requests/:id/review
// @desc    Review a request
// @access  Reviewer
router.put('/:id/review', protect, authorize('Reviewer'), async (req, res) => {
    try {
        const { decision, comment } = req.body; // decision: Approved/Rejected
        const request = await ChangeRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.reviewer = {
            decision,
            comment,
            actionDate: Date.now(),
            actionBy: req.user.id
        };

        if (decision === 'Approved') {
            request.status = 'Under Review'; // Wait, maybe 'Reviewed' waiting for Approval
        } else {
            request.status = 'Rejected';
        }

        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/requests/:id/approve
// @desc    Approve a request
// @access  Approver
router.put('/:id/approve', protect, authorize('Approver'), async (req, res) => {
    try {
        const { decision, comment } = req.body;
        const request = await ChangeRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Check if reviewed first
        if (request.reviewer.decision !== 'Approved') {
            return res.status(400).json({ message: 'Request must be reviewed first' });
        }

        request.approver = {
            decision,
            comment,
            actionDate: Date.now(),
            actionBy: req.user.id
        };

        if (decision === 'Approved') {
            request.status = 'Approved';
        } else {
            request.status = 'Rejected';
        }

        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
