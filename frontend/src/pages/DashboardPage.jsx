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

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ padding: '2rem 0' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>
          Tableau de bord
        </h1>
        <p style={{ color: '#888', fontSize: '0.95rem' }}>{today}</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard
          title="Médicaments actifs"
          value={medicaments.length}
          subtitle="dans l'inventaire"
          accent="#2563eb"
          bg="#eff6ff"
        />
        <StatCard
          title="Alertes de stock"
          value={alertes.length}
          subtitle="sous le seuil minimum"
          accent="#dc2626"
          bg="#fef2f2"
        />
        <StatCard
          title="Ventes du jour"
          value={ventesAujourdhui.length}
          subtitle="transactions complétées"
          accent="#16a34a"
          bg="#f0fdf4"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={`${totalJour.toFixed(2)}`}
          subtitle="MAD — aujourd'hui"
          accent="#7c3aed"
          bg="#faf5ff"
        />
      </div>

      {/* Alertes Table */}
      {alertes.length > 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '2px' }}>
                Ruptures de stock
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>
                {alertes.length} médicament{alertes.length > 1 ? 's' : ''} nécessite{alertes.length === 1 ? '' : 'nt'} un réapprovisionnement
              </p>
            </div>
            <span style={{
              background: '#fef2f2', color: '#dc2626', fontSize: '0.8rem',
              fontWeight: '600', padding: '4px 12px', borderRadius: '20px'
            }}>
              {alertes.length} alerte{alertes.length > 1 ? 's' : ''}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={th}>Médicament</th>
                <th style={th}>Catégorie</th>
                <th style={th}>Stock actuel</th>
                <th style={th}>Stock minimum</th>
                <th style={th}>Déficit</th>
                <th style={th}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map((a, index) => (
                <tr key={a.id} style={{ borderTop: '1px solid #f0f0f0', background: index % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={td}>
                    <div style={{ fontWeight: '500', color: '#1a1a2e' }}>{a.nom}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{a.dosage}</div>
                  </td>
                  <td style={td}>
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{a.categorie_nom}</span>
                  </td>
                  <td style={td}>
                    <span style={{ fontWeight: '700', color: '#dc2626', fontSize: '1rem' }}>{a.stock_actuel}</span>
                  </td>
                  <td style={{ ...td, color: '#555' }}>{a.stock_minimum}</td>
                  <td style={td}>
                    <span style={{ color: '#dc2626', fontWeight: '600' }}>- {a.deficit_stock} unités</span>
                  </td>
                  <td style={td}>
                    <span style={{
                      background: '#fef2f2', color: '#dc2626',
                      fontSize: '0.75rem', fontWeight: '600',
                      padding: '3px 10px', borderRadius: '20px'
                    }}>
                      Stock bas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          background: 'white', borderRadius: '12px', padding: '3rem',
          textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#16a34a', marginBottom: '8px' }}>
            Tous les stocks sont suffisants
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Aucun médicament n'est en dessous du seuil minimum.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, accent, bg }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `3px solid ${accent}`
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: '700', color: accent, marginBottom: '4px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#aaa' }}>{subtitle}</div>
    </div>
  );
}

const th = {
  padding: '10px 16px', textAlign: 'left', fontSize: '0.8rem',
  fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em'
};
const td = { padding: '12px 16px', fontSize: '0.9rem' };