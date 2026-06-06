import { useState, useEffect } from 'react';
import axios from 'axios';
import './CampaignStatus.css';

const SOCKET_SERVER_URL = 'https://server-rcs-3.onrender.com'; // Adjust to your actual URL locally if needed. 
// Since we run both locally we might want to use http://localhost:3000 but the original used the render URL.
// We should match original if we want it to work against the same server. Or use a relative URL if in production.
// Wait, the original App.jsx used that URL.

function CampaignStatus() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      // In a real app we'd get the actual backend URL from config
      // But we will use the same hardcoded one or localhost if local
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : SOCKET_SERVER_URL;
      const response = await axios.get(`${backendUrl}/api/campaigns`);
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Poll every 3 seconds for updates
    const interval = setInterval(fetchCampaigns, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="glass-card status-loading">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return (
      <div className="glass-card empty-state">
        <h2>No Campaigns Yet</h2>
        <p>Your launched campaigns will appear here.</p>
      </div>
    );
  }

  return (
    <div className="campaign-status-page">
      <div className="page-header">
        <h1>Campaign Status</h1>
        <p>Monitor your fleet dispatch progress in real-time.</p>
      </div>

      <div className="campaign-list">
        {campaigns.map(c => {
          const progress = c.total > 0 ? ((c.sent + c.failed) / c.total) * 100 : 0;
          return (
            <div key={c.id} className="glass-card campaign-card">
              <div className="campaign-card-header">
                <h3>{c.message ? (c.message.length > 40 ? c.message.substring(0, 40) + '...' : c.message) : 'Image/Media Campaign'}</h3>
                <span className={`status-badge ${c.status}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <div className="campaign-meta">
                <span>Started: {new Date(c.createdAt).toLocaleString()}</span>
                <span>Total Targets: {c.total}</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-labels">
                  <span className="sent-label">Sent: {c.sent}</span>
                  <span className="failed-label">Failed: {c.failed}</span>
                  <span>Pending: {Math.max(0, c.total - c.sent - c.failed)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CampaignStatus;
