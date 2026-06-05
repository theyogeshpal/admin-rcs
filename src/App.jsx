import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Connect to the Node.js backend
// Make sure the port matches your backend server port
const SOCKET_SERVER_URL = 'http://localhost:3000'; 
const socket = io(SOCKET_SERVER_URL);

function App() {
  const [deviceCount, setDeviceCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const [imageName, setImageName] = useState('Drag & drop an image or click to browse');
  const [excelName, setExcelName] = useState('Upload target numbers sheet *');
  
  const formRef = useRef(null);

  useEffect(() => {
    socket.on('device_count_update', (count) => {
      setDeviceCount(count);
    });

    return () => {
      socket.off('device_count_update');
    };
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name);
    } else {
      setImageName('Drag & drop an image or click to browse');
    }
  };

  const handleExcelChange = (e) => {
    if (e.target.files.length > 0) {
      setExcelName(e.target.files[0].name);
    } else {
      setExcelName('Upload target numbers sheet *');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(formRef.current);

    try {
      const response = await axios.post(`${SOCKET_SERVER_URL}/api/campaign`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setResult({
          type: 'success',
          message: '🚀 Campaign successfully launched!',
          data: response.data.data
        });
        formRef.current.reset();
        setImageName('Drag & drop an image or click to browse');
        setExcelName('Upload target numbers sheet *');
      }
    } catch (err) {
      setResult({
        type: 'error',
        message: err.response?.data?.error || 'Failed to dispatch campaign or server is unreachable.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Left Column: Device Status */}
      <div className="glass-card device-panel">
        <div className="device-title">Active Fleet Status</div>
        <div className="device-count-wrapper">
          <div className="device-count">{deviceCount}</div>
        </div>
        <div className="status-indicator">
          <div className="pulse"></div>
          <span>System Online & Listening</span>
        </div>
        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
          Android devices currently connected via WebSockets ready to broadcast messages.
        </p>
      </div>

      {/* Right Column: Campaign Form */}
      <div className="glass-card">
        <div className="form-header">
          <h1>Launch Campaign</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure and dispatch messages across your device fleet.</p>
        </div>

        <form id="campaignForm" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="textMessage">Campaign Message</label>
            <textarea 
              className="form-control" 
              id="textMessage" 
              name="textMessage" 
              required 
              placeholder="Type your compelling message here..."
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="imageUpload">Attachment (Optional Media)</label>
            <div className="file-input-wrapper">
              <span style={{ color: imageName.includes('Drag & drop') ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                {imageName}
              </span>
              <input type="file" id="imageUpload" name="image" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excelUpload">Contact Database (.xlsx, .csv)</label>
            <div className="file-input-wrapper" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
              <span style={{ color: excelName.includes('Upload target') ? 'var(--accent-color)' : 'var(--text-primary)', fontWeight: 500 }}>
                {excelName}
              </span>
              <input type="file" id="excelUpload" name="excel" accept=".xlsx, .xls, .csv" required onChange={handleExcelChange} />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Dispatching Campaign...' : 'Dispatch Campaign Now'}
          </button>
        </form>
        
        {result && (
          <div className={`alert ${result.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>{result.message}</strong>
            {result.type === 'success' && (
              <>
                Total Contacts Processed: {result.data.totalContacts}<br />
                Fleet Devices Activated: {result.data.devicesUsed}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
