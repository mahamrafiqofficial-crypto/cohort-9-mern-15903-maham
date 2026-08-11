import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotes, deleteNote } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const response = await getNotes(token);
      setNotes(response.data.notes);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id, token);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading notes...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Notes</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p role="alert" style={{ color: '#dc2626', marginBottom: 16 }}>{error}</p>}

      <Link className="new-note-btn" to="/notes/new">+ New Note</Link>

      {notes.length === 0 ? (
        <p className="empty-state">No notes yet. Create your first note!</p>
      ) : (
        <ul className="notes-grid">
          {notes.map((note) => (
            <li className="note-card" key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.content.slice(0, 100)}...</p>
              <div className="note-card-actions">
                <Link to={`/notes/${note._id}`}>Edit</Link>
                <button onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;