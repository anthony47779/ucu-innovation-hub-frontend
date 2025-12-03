import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    faculty: '',
    department: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name,
        faculty: response.data.faculty || '',
        department: response.data.department || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, formData);
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">My Profile</h1>

      <div className="profile-card">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Faculty</label>
              <input
                type="text"
                name="faculty"
                className="form-control"
                value={formData.faculty}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-info">
              <div className="profile-item">
                <strong>Name:</strong> {profile.full_name}
              </div>
              <div className="profile-item">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="profile-item">
                <strong>Role:</strong> <span className="role-badge">{profile.role}</span>
              </div>
              {profile.faculty && (
                <div className="profile-item">
                  <strong>Faculty:</strong> {profile.faculty}
                </div>
              )}
              {profile.department && (
                <div className="profile-item">
                  <strong>Department:</strong> {profile.department}
                </div>
              )}
              {profile.student_id && (
                <div className="profile-item">
                  <strong>Student ID:</strong> {profile.student_id}
                </div>
              )}
              <div className="profile-item">
                <strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}
              </div>
            </div>

            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          </>
        )}
      </div>

      {profile.projects && profile.projects.length > 0 && (
        <div className="card">
          <h2>My Projects ({profile.projects.length})</h2>
          <div className="projects-list">
            {profile.projects.map(project => (
              <div key={project.id} className="project-item">
                <div>
                  <strong>{project.title}</strong>
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <span className="project-date">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

