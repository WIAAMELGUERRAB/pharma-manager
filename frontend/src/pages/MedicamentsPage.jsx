import { useState } from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import MedicamentTable from '../components/medicaments/MedicamentTable';
import MedicamentForm  from '../components/medicaments/MedicamentForm';
import Loader          from '../components/common/Loader';
import ErrorMessage    from '../components/common/ErrorMessage';

export default function MedicamentsPage() {
  const { medicaments, loading, error, reload } = useMedicaments();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');

  const filtered = medicaments.filter(m =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.dci.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Médicaments</h1>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#2ecc71', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? '✕ Fermer' : '+ Nouveau médicament'}
        </button>
      </div>

      {showForm && (
        <MedicamentForm onSuccess={() => { setShowForm(false); reload(); }} />
      )}

      <input
        type="text"
        placeholder="Rechercher par nom ou DCI..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '1rem',
          borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
      />

      {filtered.length === 0
        ? <p style={{ color: '#888' }}>Aucun médicament trouvé.</p>
        : <MedicamentTable medicaments={filtered} onDelete={reload} />}
    </div>
  );
}