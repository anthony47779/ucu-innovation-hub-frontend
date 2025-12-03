import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    faculty: '',
    category: '',
    technology: '',
    year: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`http://localhost:5000/api/projects?${params.toString()}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="projects-header">
        <h1 className="page-title">Innovation Gallery</h1>
        <p className="page-subtitle">Explore student innovations and projects</p>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Search projects..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="faculty"
            className="form-control"
            placeholder="Filter by faculty..."
            value={filters.faculty}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Filter by category..."
            value={filters.category}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="technology"
            className="form-control"
            placeholder="Filter by technology..."
            value={filters.technology}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="year"
            className="form-control"
            placeholder="Filter by year..."
            value={filters.year}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p>No projects found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.status}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-card-description">
                {project.description.length > 150
                  ? `${project.description.substring(0, 150)}...`
                  : project.description}
              </p>
              <div className="project-card-tags">
                <span className="tag">{project.category}</span>
                {project.faculty && <span className="tag">{project.faculty}</span>}
              </div>
              <div className="project-card-footer">
                <div className="project-card-meta">
                  <span>By {project.submitter_name}</span>
                  {project.year && <span>{project.year}</span>}
                </div>
                <Link to={`/projects/${project.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Chatbot />
    </div>
  );
};

export default Projects;

