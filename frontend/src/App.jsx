import { useState } from 'react';
import DashboardPage   from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage      from './pages/VentesPage';

const PAGES = {
  dashboard:   { label: ' Dashboard',    component: <DashboardPage /> },
  medicaments: { label: ' Médicaments',  component: <MedicamentsPage /> },
  ventes:      { label: ' Ventes',       component: <VentesPage /> },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', background: '#f5f7fa' }}>

      {/* Navbar */}
      <nav style={{ background: '#2c3e50', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem', padding: '1rem 0' }}>
          💊 PharmaManager
        </span>
        {Object.entries(PAGES).map(([key, { label }]) => (
          <button key={key} onClick={() => setActivePage(key)}
            style={{
              padding: '1rem 1.2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              background: activePage === key ? '#3498db' : 'transparent',
              color: activePage === key ? 'white' : '#bdc3c7',
              borderBottom: activePage === key ? '3px solid #2980b9' : '3px solid transparent',
              fontSize: '0.95rem',
            }}>
            {label}
          </button>
        ))}
      </nav>

      {/* Contenu */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {PAGES[activePage].component}
      </main>

    </div>
  );
}