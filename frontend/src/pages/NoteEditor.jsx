import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createNote, updateNote, getNoteById } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import './NoteEditor.css';

const COLOR_OPTIONS = ['#ffffff', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4'];

function NoteEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tagsInput, setTagsInput] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNoteById(id, token);
          const note = response.data.note;
          setTitle(note.title);
          setContent(note.content);
          setCategory(note.category || 'General');
          setTagsInput((note.tags || []).join(', '));
          setColor(note.color || '#ffffff');
        } catch (err) {
          setError('Failed to load note');
        }
      };
      fetchNote();
    }
  }, [id, isEditMode, token]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      const payload = { title, content, category, tags, color };
      if (isEditMode) {
        await updateNote(id, payload, token);
        setSavedMessage('Saved just now');
        setTimeout(() => setSavedMessage(''), 2000);
      } else {
        await createNote(payload, token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  }, [title, content, category, tagsInput, color, isEditMode, id, token, navigate]);

  // Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <Link className="back-link" to="/dashboard">← Back</Link>
        {savedMessage && <span className="saved-indicator">{savedMessage}</span>}
      </div>
      <h2 style={{ marginBottom: 20 }}>{isEditMode ? 'Edit Note' : 'New Note'}</h2>
      {error && <p role="alert" className="auth-error" style={{ marginBottom: 16 }}>{error}</p>}
      <form className="editor-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="editor-meta-row">
          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              placeholder="e.g. Work, Personal"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              placeholder="e.g. urgent, ideas"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label>Color</label>
          <div className="color-picker">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c}
                className={`color-swatch ${color === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="content">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div className="editor-actions">
          <button className="save-btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button className="cancel-btn" type="button" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteEditor;