import { useState, useEffect } from 'react';
import { createMedicament } from '../../api/medicamentsApi';
import { fetchCategories } from '../../api/categoriesApi';

export default function MedicamentForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [form, setForm] = useState({
    nom: '', dci: '', categorie: '', forme: '', dosage: '',
    prix_achat: '', prix_vente: '', stock_actuel: '', stock_minimum: 10,
    date_expiration: '', ordonnance_requise: false,
  });

  useEffect(() => {
    fetchCategories().then(data => setCategories(data.results || data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await createMedicament(form);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Nouveau médicament</h3>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>⚠️ {error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          ['nom', 'Nom commercial', 'text'],
          ['dci', 'DCI', 'text'],
          ['forme', 'Forme', 'text'],
          ['dosage', 'Dosage', 'text'],
          ['prix_achat', "Prix d'achat", 'number'],
          ['prix_vente', 'Prix de vente', 'number'],
          ['stock_actuel', 'Stock actuel', 'number'],
          ['stock_minimum', 'Stock minimum', 'number'],
          ['date_expiration', "Date d'expiration", 'date'],
        ].map(([name, label, type]) => (
          <div key={name}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>{label}</label>
            <input name={name} type={type} value={form[name]} onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        ))}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Catégorie</label>
          <select name="categorie" value={form.categorie} onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="">-- Choisir --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="ordonnance_requise" checked={form.ordonnance_requise} onChange={handleChange} />
          <label>Ordonnance requise</label>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={loading}
        style={{ marginTop: '1rem', padding: '10px 24px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </div>
  );
}