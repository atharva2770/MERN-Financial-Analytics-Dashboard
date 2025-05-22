// src/App.jsx
import React from 'react';
import DashboardPage from './pages/DashboardPage';
import './App.css'; // Import App-specific styles
import './index.css'; // Import global styles (ensure this is present)

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Financial Analytics Dashboard</h1>
      </header>
      <main className="app-main">
        <DashboardPage />
      </main>
    </div>
  );
}

export default App;