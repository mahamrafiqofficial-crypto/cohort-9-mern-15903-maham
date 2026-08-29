const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    category: { type: String, default: 'General', trim: true },
    tags: { type: [String], default: [] },
    color: { type: String, default: '#ffffff' },
}, { timestamps: true });

// text index for search feature (title + content)
noteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);