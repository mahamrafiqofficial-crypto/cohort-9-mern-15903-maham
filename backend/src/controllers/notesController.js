const Note = require('../models/note');
const logger = require('../config/logger');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' ||
        !content || typeof content !== 'string') {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const note = await Note.create({ title, content, user: req.userId });
    res.status(201).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while creating note');
    res.status(500).json({ success: false, message: 'Server error while creating note' });
  }
};

// Get all notes for logged-in user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    logger.error({ err: error }, 'Error while fetching notes');
    res.status(500).json({ success: false, message: 'Server error while fetching notes' });
  }
};

// Get single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while fetching note');
    res.status(500).json({ success: false, message: 'Server error while fetching note' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (
      (title === undefined && content === undefined) ||
      (title !== undefined && (!title || typeof title !== 'string')) ||
      (content !== undefined && (!content || typeof content !== 'string'))
    ) {
      return res.status(400).json({ success: false, message: 'Provide title or content to update' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while updating note');
    res.status(500).json({ success: false, message: 'Server error while updating note' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    logger.error({ err: error }, 'Error while deleting note');
    res.status(500).json({ success: false, message: 'Server error while deleting note' });
  }
};