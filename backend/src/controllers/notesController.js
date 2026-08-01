const Note = require('../models/note');

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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while creating note' });
  }
};

//Get all notes for logged-in user
exports.getNotes = async (req, res) => {
    try{
        const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notes });
    }catch(error){
        console.error(error);
        res.status(500).json({ success: false, message:'Server error while fetching notes'});
    }
};

//Get single note by ID
exports.getNoteById = async (req,res) => {
    try {
        const note = await Note.findOne({_id: req.params.id, user: req.userId });

        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found'});
        }

        res.status(200).json({ success: true, note });
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching note'});
    }
};

//update a note
exports.updateNote = async (req, res)=> {
    try{
       const { title, content } = req.body;

       if(!title && !content) {
        return res.status(400).json({ success: false, message: 'Provide title or content to update'});
       }
       const note = await Note.findOneAndUpdate(
        { _id:req.params.id, user:req.userId },
        { ...(title && { title }), ...(content && { content }) },
        { new: true, runValidators: true }
       );

       if (!note){
        return req.status(404).json({ success: false, message: 'Note not found'});
       }

       res.status(200).json({ success: true, note});
    }catch(error){
     console.error(error);
     res.status(500).json({ success: false, message: 'Server error while updating note'});
    }
};

//Delete a note
exports.deleteNote = async (req, res)=> {
    try{
      const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId});

      if (!note) {
        return res.status(404).json({ success: false, message: 'Note not found'});
      }

      res.status(200).json({ success: true, messgage: 'Note deleted successfully'});
    }catch(error){
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error while deleting note'});
    }
};