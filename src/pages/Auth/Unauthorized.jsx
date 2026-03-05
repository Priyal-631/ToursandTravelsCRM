import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', height: '100vh',
      background: '#F3F4F6', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px',
        padding: '2.5rem', textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '380px'
      }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
          Access Denied
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '0.6rem 1.5rem', background: '#2563eb',
            color: '#fff', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}