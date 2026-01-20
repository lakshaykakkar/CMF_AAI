const mongoose = require('mongoose');

const ChangeRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Required fields from form
    projectDepartment: { type: String, required: true },
    description: { type: String, required: true },
    reason: { type: String, required: true },
    priority: {
        type: String,
        enum: ['P1-High', 'P2-Medium', 'P3-Low'],
        required: true
    },
    usersAffected: { type: String, required: true },

    // Dates
    plannedStart: { type: Date, required: true },
    plannedEnd: { type: Date, required: true },

    // Status
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Implemented', 'Closed'],
        default: 'Submitted'
    },

    // Attachments (Paths)
    annexures: [{ type: String }],

    // Workflow Section
    reviewer: {
        decision: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        comment: String,
        actionDate: Date,
        actionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },

    approver: {
        decision: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        comment: String,
        actionDate: Date,
        actionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },

    // Implementation Feedback
    impactEvaluation: String,
    implementationPlan: String,
    rollbackPlan: String,

    // Post Implementation
    actualStart: Date,
    actualEnd: Date,
    implementationStatus: String,
    crId: String, // Assigned by DC Helpdesk

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChangeRequest', ChangeRequestSchema);
