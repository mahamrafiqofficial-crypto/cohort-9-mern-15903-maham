const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  duplicateNote,
  exportNotes,
  importNotes,
} = require('../controllers/notesController');

router.use(protect);

const mongoose = require('mongoose');

// Specific routes BEFORE /:id param routes
router.get('/export', exportNotes);
router.post('/import', importNotes);

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid note ID' });
  }
  next();
});

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/archive', toggleArchive);
router.post('/:id/duplicate', duplicateNote);

module.exports = router;