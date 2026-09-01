const Note = require('../models/note');
const ALLOWED_COLORS = ['#ffffff', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4'];
const logger = require('../config/logger');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags, color } = req.body;
    const safeColor = ALLOWED_COLORS.includes(color) ? color : '#ffffff';
    if (!title || typeof title !== 'string' ||
        !content || typeof content !== 'string') {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const note = await Note.create({
      title,
      content,
      user: req.userId,
      ...(category !== undefined && { category }),
      ...(Array.isArray(tags) && { tags }),
      color: safeColor,
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while creating note');
    res.status(500).json({ success: false, message: 'Server error while creating note' });
  }
};

// Get all notes for logged-in user (with search, sort, filter)
exports.getNotes = async (req, res) => {
  try {
    const { q, sort, category, tag, archived } = req.query;

    const filter = { user: req.userId };

    if (archived === 'true') {
      filter.isArchived = true;
    } else {
      // default: hide archived notes from main list
      filter.isArchived = { $ne: true };
    }

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (q && q.trim()) filter.$text = { $search: q.trim() };

    let sortOption = { isPinned: -1, createdAt: -1 }; // default: pinned first, newest first
    if (sort === 'oldest') sortOption = { isPinned: -1, createdAt: 1 };
    else if (sort === 'title') sortOption = { isPinned: -1, title: 1 };
    else if (sort === 'edited') sortOption = { isPinned: -1, updatedAt: -1 };

    const notes = await Note.find(filter).sort(sortOption);
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
    const { title, content, category, tags, color } = req.body;

    if (
      (title === undefined && content === undefined && category === undefined && tags === undefined && color === undefined) ||
      (title !== undefined && (!title || typeof title !== 'string')) ||
      (content !== undefined && (!content || typeof content !== 'string'))
    ) {
      return res.status(400).json({ success: false, message: 'Provide fields to update' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(Array.isArray(tags) && { tags }),
        color: safeColor,
      },
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

// Toggle pin
exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isPinned = !note.isPinned;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while toggling pin');
    res.status(500).json({ success: false, message: 'Server error while toggling pin' });
  }
};

// Toggle archive
exports.toggleArchive = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isArchived = !note.isArchived;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error({ err: error }, 'Error while toggling archive');
    res.status(500).json({ success: false, message: 'Server error while toggling archive' });
  }
};

// Duplicate a note
exports.duplicateNote = async (req, res) => {
  try {
    const original = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!original) return res.status(404).json({ success: false, message: 'Note not found' });

    const copy = await Note.create({
      title: `${original.title} (Copy)`,
      content: original.content,
      user: req.userId,
      category: original.category,
      tags: original.tags,
      color: original.color,
      isPinned: false,
      isArchived: false,
    });

    res.status(201).json({ success: true, note: copy });
  } catch (error) {
    logger.error({ err: error }, 'Error while duplicating note');
    res.status(500).json({ success: false, message: 'Server error while duplicating note' });
  }
};

// Export all notes as JSON
exports.exportNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).select('-user -__v');
    res.status(200).json({ success: true, exportedAt: new Date().toISOString(), count: notes.length, notes });
  } catch (error) {
    logger.error({ err: error }, 'Error while exporting notes');
    res.status(500).json({ success: false, message: 'Server error while exporting notes' });
  }
};

// Import notes from JSON array
exports.importNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid notes found to import' });
    }

    const toInsert = notes
      .filter((n) => n && typeof n.title === 'string' && typeof n.content === 'string')
      .map((n) => ({
        title: n.title,
        content: n.content,
        user: req.userId,
        category: typeof n.category === 'string' ? n.category : 'General',
        tags: Array.isArray(n.tags) ? n.tags : [],
        color: typeof n.color === 'string' ? n.color : '#ffffff',
        isPinned: false,
        isArchived: false,
      }));

    if (toInsert.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid notes found to import' });
    }

    const inserted = await Note.insertMany(toInsert);
    res.status(201).json({ success: true, imported: inserted.length, notes: inserted });
  } catch (error) {
    logger.error({ err: error }, 'Error while importing notes');
    res.status(500).json({ success: false, message: 'Server error while importing notes' });
  }
};