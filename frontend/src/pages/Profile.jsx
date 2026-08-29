import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import './Profile.css';

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(token);
        const user = response.data.user;
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setLocation(user.location || '');
        setBio(user.bio || '');
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({ name, phone, location, bio }, token);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading profile...</p>;

  return (
    <div className="profile-container">
      <Link className="back-link" to="/dashboard">← Back</Link>
      <h2 style={{ margin: '20px 0' }}>Profile Settings</h2>

      {error && <p role="alert" className="auth-error">{error}</p>}
      {message && <p className="profile-success">{message}</p>}

      <form className="profile-form" onSubmit={handleSave}>
        <div className="profile-avatar">{name.charAt(0).toUpperCase() || 'U'}</div>

        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} disabled />
        </div>

        <div className="profile-row">
          <div>
            <label htmlFor="phone">Phone number</label>
            <input id="phone" type="text" placeholder="+1 555 000 1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input id="location" type="text" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            maxLength={240}
            placeholder="A short line about you"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="bio-count">{bio.length}/240</p>
        </div>

        <button className="save-btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;