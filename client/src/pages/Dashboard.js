import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Chatbot from '../components/Chatbot';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      let url = 'http://localhost:5000/api/projects';
      
      if (user.role === 'student') {
        url += '?status=pending';
      } else if (user.role === 'supervisor' || user.role === 'admin') {
        url += '?status=pending';
      }

      const response = await axios.get(url);
      setProjects(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(p => p.status === 'pending').length;
      const approved = response.data.filter(p => p.status === 'approved').length;
      const rejected = response.data.filter(p => p.status === 'rejected').length;
      
      setStats({ total, pending, approved, rejected });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (projectId, status) => {
    try {
      const comments = prompt(`Enter review comments for ${status}:`);
      await axios.patch(`http://localhost:5000/api/projects/${projectId}/review`, {
        status,
        review_comments: comments
      });
      fetchProjects();
    } catch (error) {
      alert('Error reviewing project');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, {user.full_name}!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card approved">
          <h3>Approved</h3>
          <p className="stat-number">{stats.approved}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <p className="stat-number">{stats.rejected}</p>
        </div>
      </div>

      {user.role === 'student' && (
        <div className="dashboard-actions">
          <Link to="/submit-project" className="btn btn-primary">
            Submit New Project
          </Link>
        </div>
      )}

      <div className="projects-section">
        <h2>{user.role === 'student' ? 'My Projects' : 'Projects Pending Review'}</h2>
        
        {projects.length === 0 ? (
          <div className="card">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span>Category: {project.category}</span>
                  <span>Faculty: {project.faculty}</span>
                  <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="project-actions">
                  <Link to={`/projects/${project.id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                  {(user.role === 'supervisor' || user.role === 'admin') && project.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReview(project.id, 'approved')}
                        className="btn btn-success"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(project.id, 'rejected')}
                        className="btn btn-danger"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default Dashboard;

