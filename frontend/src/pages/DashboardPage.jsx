import { useAlertes } from '../hooks/useAlertes';
import { useMedicaments } from '../hooks/useMedicaments';
import { useVentes } from '../hooks/useVentes';
import Loader from '../components/common/Loader';

export default function DashboardPage() {
  const { medicaments, loading: loadMed } = useMedicaments();
  const { alertes, loading: loadAlertes } = useAlertes();
  const { ventes, loading: loadVentes }   = useVentes();

  const ventesAujourdhui = ventes.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.date_vente.startsWith(today) && v.statut !== 'annulee';
  });

  const totalJour = ventesAujourdhui.reduce((sum, v) => sum + parseFloat(v.total_ttc), 0);

  if (loadMed || loadAlertes || loadVentes) return <Loader />;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <StatCard title="Médicaments actifs" value={medicaments.length} color="#3498db" icon="💊" />
        <StatCard title="Alertes stock" value={alertes.length} color="#e74c3c" icon="⚠️" />
        <StatCard title="Ventes aujourd'hui" value={ventesAujourdhui.length} color="#2ecc71" icon="🛒" />
        <StatCard title="CA du jour" value={`${totalJour.toFixed(2)} MAD`} color="#9b59b6" icon="💰" />
      </div>

      {alertes.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#e74c3c' }}>⚠️ Médicaments en rupture de stock</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fdecea' }}>
                <th style={th}>Médicament</th>
                <th style={th}>Stock actuel</th>
                <th style={th}>Stock minimum</th>
                <th style={th}>Déficit</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={td}>{a.nom} ({a.dosage})</td>
                  <td style={{ ...td, color: 'red', fontWeight: 'bold' }}>{a.stock_actuel}</td>
                  <td style={td}>{a.stock_minimum}</td>
                  <td style={{ ...td, color: 'red' }}>-{a.deficit_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#666', marginTop: '4px' }}>{title}</div>
    </div>
  );
}

const th = { padding: '10px', textAlign: 'left' };
const td = { padding: '8px 10px' };