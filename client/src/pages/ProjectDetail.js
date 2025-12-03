import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to comment');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/projects/${id}/comments`, {
        comment
      });
      setComment('');
      fetchProject();
    } catch (error) {
      setError('Error adding comment');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!project) {
    return <div className="container"><p>Project not found</p></div>;
  }

  return (
    <div className="container">
      <Link to="/projects" className="back-link">← Back to Projects</Link>
      
      <div className="project-detail">
        <div className="project-detail-header">
          <h1>{project.title}</h1>
          <span className={`status-badge ${project.status}`}>
            {project.status}
          </span>
        </div>

        <div className="project-detail-content">
          <div className="project-main">
            <div className="card">
              <h2>Description</h2>
              <p>{project.description}</p>
            </div>

            <div className="card">
              <h2>Project Details</h2>
              <div className="project-details-grid">
                <div>
                  <strong>Category:</strong> {project.category}
                </div>
                <div>
                  <strong>Technologies:</strong> {project.technologies}
                </div>
                <div>
                  <strong>Faculty:</strong> {project.faculty || 'N/A'}
                </div>
                <div>
                  <strong>Department:</strong> {project.department || 'N/A'}
                </div>
                <div>
                  <strong>Year:</strong> {project.year || 'N/A'}
                </div>
                <div>
                  <strong>Submitted by:</strong> {project.submitter_name}
                </div>
              </div>
            </div>

            {project.github_link && (
              <div className="card">
                <h2>Links</h2>
                <div className="project-links">
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    View on GitHub
                  </a>
                  {project.live_demo_link && (
                    <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}

            {project.team_members && project.team_members.length > 0 && (
              <div className="card">
                <h2>Team Members</h2>
                <div className="team-members">
                  {project.team_members.map(member => (
                    <div key={member.id} className="team-member">
                      <strong>{member.full_name}</strong>
                      <span>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.review_comments && (
              <div className="card">
                <h2>Review Comments</h2>
                <p>{project.review_comments}</p>
                {project.reviewer_name && (
                  <p className="reviewer">Reviewed by: {project.reviewer_name}</p>
                )}
              </div>
            )}

            <div className="card">
              <h2>Comments ({project.comments?.length || 0})</h2>
              
              {user ? (
                <form onSubmit={handleComment} className="comment-form">
                  {error && <div className="alert alert-error">{error}</div>}
                  <textarea
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    required
                  />
                  <button type="submit" className="btn btn-primary">Post Comment</button>
                </form>
              ) : (
                <p>Please <Link to="/login">login</Link> to comment</p>
              )}

              <div className="comments-list">
                {project.comments && project.comments.length > 0 ? (
                  project.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <strong>{comment.full_name}</strong>
                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

