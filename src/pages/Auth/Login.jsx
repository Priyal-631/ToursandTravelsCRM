import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login, user, profile, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Once both user AND profile are loaded, redirect based on role
  if (user && profile) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/sales/crm" replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // ✅ Don't navigate here — useAuth will fetch profile async,
      // then the if (user && profile) block above will redirect correctly
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Tours & Travels CRM</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f1f5f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '0.625rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '0.5rem',
  },
};