export default function ErrorMessage({ message }) {
  return (
    <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
      ⚠️ {message}
    </div>
  );
}