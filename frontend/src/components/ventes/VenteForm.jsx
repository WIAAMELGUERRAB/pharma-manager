import { useState, useEffect } from 'react';
import { createVente } from '../../api/ventesApi';
import { fetchMedicaments } from '../../api/medicamentsApi';

export default function VenteForm({ onSuccess }) {
  const [medicaments, setMedicaments] = useState([]);
  const [lignes, setLignes]           = useState([{ medicament: '', quantite: 1 }]);
  const [notes, setNotes]             = useState('');
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    fetchMedicaments().then(data => setMedicaments(data.results || data));
  }, []);

  const addLigne = () => setLignes(prev => [...prev, { medicament: '', quantite: 1 }]);

  const removeLigne = (index) => setLignes(prev => prev.filter((_, i) => i !== index));

  const updateLigne = (index, field, value) => {
    setLignes(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await createVente({
        notes,
        lignes: lignes.map(l => ({ medicament: parseInt(l.medicament), quantite: parseInt(l.quantite) })),
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Erreur lors de la vente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Nouvelle vente</h3>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>⚠️ {error}</div>}

      {lignes.map((ligne, index) => (
        <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <select value={ligne.medicament} onChange={e => updateLigne(index, 'medicament', e.target.value)}
            style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="">-- Médicament --</option>
            {medicaments.map(m => (
              <option key={m.id} value={m.id}>{m.nom} ({m.dosage}) — stock: {m.stock_actuel}</option>
            ))}
          </select>
          <input type="number" min="1" value={ligne.quantite}
            onChange={e => updateLigne(index, 'quantite', e.target.value)}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          {lignes.length > 1 &&
            <button onClick={() => removeLigne(index)}
              style={{ color: 'white', background: '#e74c3c', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              ✕
            </button>}
        </div>
      ))}

      <button onClick={addLigne}
        style={{ marginBottom: '1rem', padding: '6px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        + Ajouter une ligne
      </button>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{ marginTop: '1rem', padding: '10px 24px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        {loading ? 'Enregistrement...' : 'Valider la vente'}
      </button>
    </div>
  );
}