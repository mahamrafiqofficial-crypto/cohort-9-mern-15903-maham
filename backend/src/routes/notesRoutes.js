const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/notesController');

router.use(protect); 

const mongoose = require('mongoose');

router.param('id', (req,res, next, id)=> {
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

module.exports = router;