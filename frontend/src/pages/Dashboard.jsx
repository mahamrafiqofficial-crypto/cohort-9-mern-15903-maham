import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotes, deleteNote, togglePinNote, duplicateNote } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import './Dashboard.css';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchNotes = useCallback(async (q, sortValue) => {
    try {
      const response = await getNotes(token, { q, sort: sortValue });
      setNotes(response.data.notes);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // initial load
  useEffect(() => {
    fetchNotes('', 'newest');
  }, [fetchNotes]);

  // debounced search + sort re-fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes(search, sort);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sort, fetchNotes]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id, token);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handlePin = async (id) => {
    try {
      const response = await togglePinNote(id, token);
      setNotes((prev) =>
        prev
          .map((n) => (n._id === id ? response.data.note : n))
          .sort((a, b) => (b.isPinned - a.isPinned) || 0)
      );
    } catch (err) {
      setError('Failed to update pin');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await duplicateNote(id, token);
      setNotes((prev) => [response.data.note, ...prev]);
    } catch (err) {
      setError('Failed to duplicate note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading notes...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">N</div>
          <div>
            <h2>My Notes</h2>
            <p className="dashboard-subtitle">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <ThemeToggle />
          <Link className="profile-link" to="/profile">Profile</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <p role="alert" className="auth-error" style={{ marginBottom: 20 }}>{error}</p>}

      <div className="dashboard-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A-Z</option>
          <option value="edited">Last edited</option>
        </select>
      </div>

      <Link className="new-note-btn" to="/notes/new">+ New Note</Link>

      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <ul className="notes-grid">
          {notes.map((note) => (
            <li
              className="note-card"
              key={note._id}
              style={{ borderLeft: `4px solid ${note.color || 'var(--primary)'}` }}
            >
              <div className="note-card-top">
                <div className="note-card-accent"></div>
                {note.isPinned && <span className="pin-badge">📌 Pinned</span>}
              </div>
              <h3>{note.title}</h3>
              <p>{note.content.replace(/<[^>]+>/g, '').slice(0, 100)}...</p>
              {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map((tag) => (
                    <span className="note-tag" key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
              <div className="note-card-actions">
                <Link to={`/notes/${note._id}`}>Edit</Link>
                <button onClick={() => handlePin(note._id)}>{note.isPinned ? 'Unpin' : 'Pin'}</button>
                <button onClick={() => handleDuplicate(note._id)}>Duplicate</button>
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