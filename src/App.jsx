import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LaunchCampaign from './components/LaunchCampaign';
import CampaignStatus from './components/CampaignStatus';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LaunchCampaign />} />
            <Route path="/status" element={<CampaignStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
