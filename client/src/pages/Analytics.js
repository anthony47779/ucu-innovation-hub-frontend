import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!analytics) {
    return <div className="container"><p>No analytics data available</p></div>;
  }

  const statusData = {
    labels: analytics.projectsByStatus.map(item => item.status),
    datasets: [
      {
        label: 'Projects',
        data: analytics.projectsByStatus.map(item => item.count),
        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
      },
    ],
  };

  const facultyData = {
    labels: analytics.projectsByFaculty.map(item => item.faculty || 'Unknown'),
    datasets: [
      {
        label: 'Projects',
        data: analytics.projectsByFaculty.map(item => item.count),
        backgroundColor: '#0066cc',
      },
    ],
  };

  const categoryData = {
    labels: analytics.projectsByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Projects',
        data: analytics.projectsByCategory.map(item => item.count),
        backgroundColor: [
          '#0066cc',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#17a2b8',
          '#6c757d',
        ],
      },
    ],
  };

  const yearData = {
    labels: analytics.projectsByYear.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Projects',
        data: analytics.projectsByYear.map(item => item.count),
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container">
      <h1 className="page-title">Analytics Dashboard</h1>
      <p className="page-subtitle">Insights into UCU Innovators Hub</p>

      <div className="analytics-stats">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-number">{analytics.totalProjects}</p>
        </div>
        <div className="stat-card approved">
          <h3>Approved</h3>
          <p className="stat-number">{analytics.approvalRate.approved}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{analytics.approvalRate.pending}</p>
        </div>
        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <p className="stat-number">{analytics.approvalRate.rejected}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Projects by Status</h2>
          <Doughnut data={statusData} />
        </div>

        <div className="chart-card">
          <h2>Projects by Faculty</h2>
          <Bar data={facultyData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h2>Projects by Category</h2>
          <Doughnut data={categoryData} />
        </div>

        <div className="chart-card">
          <h2>Projects by Year</h2>
          <Line data={yearData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="card">
        <h2>Most Active Innovators</h2>
        <div className="innovators-list">
          {analytics.activeInnovators.map((innovator, index) => (
            <div key={innovator.id} className="innovator-item">
              <span className="rank">#{index + 1}</span>
              <div className="innovator-info">
                <strong>{innovator.full_name}</strong>
                <span>{innovator.email}</span>
              </div>
              <span className="project-count">{innovator.project_count} projects</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Recent Projects</h2>
        <div className="recent-projects">
          {analytics.recentProjects.map(project => (
            <div key={project.id} className="recent-project-item">
              <div>
                <strong>{project.title}</strong>
                <span className="project-meta">
                  {project.submitter_name} • {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

