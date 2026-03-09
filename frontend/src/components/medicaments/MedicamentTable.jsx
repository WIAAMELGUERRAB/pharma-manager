import { deleteMedicament } from '../../api/medicamentsApi';

export default function MedicamentTable({ medicaments, onDelete }) {
  const handleDelete = async (id, nom) => {
    if (!confirm(`Archiver "${nom}" ?`)) return;
    try {
      await deleteMedicament(id);
      onDelete();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th style={th}>Nom</th>
          <th style={th}>Catégorie</th>
          <th style={th}>Forme</th>
          <th style={th}>Prix vente</th>
          <th style={th}>Stock</th>
          <th style={th}>Alerte</th>
          <th style={th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {medicaments.map((m) => (
          <tr key={m.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={td}>{m.nom} <small style={{ color: '#888' }}>({m.dosage})</small></td>
            <td style={td}>{m.categorie_nom}</td>
            <td style={td}>{m.forme}</td>
            <td style={td}>{m.prix_vente} MAD</td>
            <td style={td}>{m.stock_actuel}</td>
            <td style={td}>
              {m.est_en_alerte
                ? <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Stock bas</span>
                : <span style={{ color: 'green' }}>✅ OK</span>}
            </td>
            <td style={td}>
              <button onClick={() => handleDelete(m.id, m.nom)}
                style={{ color: 'white', background: '#e74c3c', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                Archiver
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const td = { padding: '8px 10px' };