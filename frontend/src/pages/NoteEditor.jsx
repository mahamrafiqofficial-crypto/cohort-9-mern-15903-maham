import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createNote, updateNote, getNoteById } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import './NoteEditor.css';

function NoteEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNoteById(id, token);
          setTitle(response.data.note.title);
          setContent(response.data.note.content);
        } catch (err) {
          setError('Failed to load note');
        }
      };
      fetchNote();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEditMode) {
        await updateNote(id, { title, content }, token);
      } else {
        await createNote({ title, content }, token);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <Link className="back-link" to="/dashboard">← Back</Link>
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