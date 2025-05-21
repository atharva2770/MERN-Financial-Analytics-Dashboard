import React from 'react';
import DashboardPage from './pages/DashboardPage'; // Import the DashboardPage

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <h1>Financial Analytics Dashboard</h1>
      </header>
      <main>
        <DashboardPage /> {/* Render our main dashboard page */}
      </main>
    </div>
  );
}

export default App;