import { useState } from 'react';
import { useVentes } from '../hooks/useVentes';
import VenteForm    from '../components/ventes/VenteForm';
import Loader       from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { annulerVente } from '../api/ventesApi';

export default function VentesPage() {
  const { ventes, loading, error, reload } = useVentes();
  const [showForm, setShowForm] = useState(false);

  const handleAnnuler = async (id, reference) => {
    if (!confirm(`Annuler la vente ${reference} et réintégrer le stock ?`)) return;
    try {
      await annulerVente(id);
      reload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Ventes</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#2ecc71', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? '✕ Fermer' : '+ Nouvelle vente'}
        </button>
      </div>

      {showForm && (
        <VenteForm onSuccess={() => { setShowForm(false); reload(); }} />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={th}>Référence</th>
            <th style={th}>Date</th>
            <th style={th}>Total TTC</th>
            <th style={th}>Statut</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={td}>{v.reference}</td>
              <td style={td}>{new Date(v.date_vente).toLocaleString('fr-FR')}</td>
              <td style={td}>{v.total_ttc} MAD</td>
              <td style={td}>
                <span style={{
                  padding: '3px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                  background: v.statut === 'annulee' ? '#fdecea' : '#eafaf1',
                  color: v.statut === 'annulee' ? '#e74c3c' : '#2ecc71',
                }}>
                  {v.statut === 'annulee' ? 'Annulée' : 'Complétée'}
                </span>
              </td>
              <td style={td}>
                {v.statut !== 'annulee' && (
                  <button onClick={() => handleAnnuler(v.id, v.reference)}
                    style={{ color: 'white', background: '#e74c3c', border: 'none',
                      padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const td = { padding: '8px 10px' };