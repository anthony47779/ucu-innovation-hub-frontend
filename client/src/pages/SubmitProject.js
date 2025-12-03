import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './SubmitProject.css';

const SubmitProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    github_link: '',
    live_demo_link: '',
    project_document: '',
    faculty: user.faculty || '',
    department: user.department || '',
    year: new Date().getFullYear()
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/projects', formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Submit New Project</h1>
      <p className="page-subtitle">Share your innovation with the UCU community</p>

      <div className="submit-project-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Describe your project in detail..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Technologies Used *</label>
            <input
              type="text"
              name="technologies"
              className="form-control"
              value={formData.technologies}
              onChange={handleChange}
              required
              placeholder="e.g., React, Node.js, MySQL, Express"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <input
                type="text"
                name="faculty"
                className="form-control"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="e.g., Faculty of Science and Technology"
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
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="form-group">
            <label>GitHub Repository Link</label>
            <input
              type="url"
              name="github_link"
              className="form-control"
              value={formData.github_link}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-group">
            <label>Live Demo Link</label>
            <input
              type="url"
              name="live_demo_link"
              className="form-control"
              value={formData.live_demo_link}
              onChange={handleChange}
              placeholder="https://your-demo.com"
            />
          </div>

          <div className="form-group">
            <label>Project Document (PDF URL)</label>
            <input
              type="url"
              name="project_document"
              className="form-control"
              value={formData.project_document}
              onChange={handleChange}
              placeholder="URL to project documentation PDF"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Project'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;

