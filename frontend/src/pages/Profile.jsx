import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import './Profile.css';

const MAX_AVATAR_SIZE = 1_500_000; // ~1.5MB

function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
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
        setAvatar(user.avatar || '');
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError('Image is too large. Please choose one under 1.5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({ name, phone, location, bio, avatar }, token);
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
    <div className="profile-page">
      <div className="profile-page-header">
        <Link className="back-link" to="/dashboard">← Back to notes</Link>
        <ThemeToggle />
      </div>

      <div className="profile-container">
        <h2 className="profile-title">Profile Settings</h2>
        <p className="profile-subtitle">Manage your photo, contact info and bio</p>

        {error && <p role="alert" className="auth-error">{error}</p>}
        {message && <p className="profile-success">✓ {message}</p>}

        <form className="profile-form" onSubmit={handleSave}>
          <div className="avatar-section">
            <div className="avatar-preview">
              {avatar ? (
                <img src={avatar} alt="Profile avatar" />
              ) : (
                <span>{name.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="avatar-actions">
              <button type="button" className="avatar-btn" onClick={() => fileInputRef.current?.click()}>
                {avatar ? 'Change photo' : 'Upload photo'}
              </button>
              {avatar && (
                <button type="button" className="avatar-btn-remove" onClick={handleRemoveAvatar}>
                  Remove
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="profile-section">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="profile-section">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} disabled />
          </div>

          <div className="profile-row">
            <div className="profile-section">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" type="text" placeholder="+1 555 000 1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="profile-section">
              <label htmlFor="location">Location</label>
              <input id="location" type="text" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="profile-section">
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
    </div>
  );
}

export default Profile;