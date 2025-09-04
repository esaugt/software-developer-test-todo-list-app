import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Link as MuiLink,
  Paper
} from '@mui/material';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [touched, setTouched] = useState({ password: false });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Password rules: ≥8 chars, at least one uppercase, one lowercase, and one number
  const validatePassword = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const isPasswordValid = validatePassword(form.password);
  const canSubmit =
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    isPasswordValid;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!isPasswordValid) {
      setErr('Password does not meet the requirements.');
      return;
    }

    try {
      await register(form);
      navigate('/app', { replace: true });
    } catch (e) {
      if (e.status === 422 && e.data?.errors) {
        const first = Object.values(e.data.errors)[0]?.[0];
        setErr(first || 'Invalid input');
      } else {
        setErr(e.message || 'Registration error');
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Create Account
      </Typography>

      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@email.com"
          fullWidth
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder="••••••••"
          fullWidth
          required
          error={touched.password && !isPasswordValid}
          helperText={
            touched.password && !isPasswordValid
              ? 'Password must meet the requirements below.'
              : ''
          }
        />

        {/* Password instructions (English) */}
        <Typography variant="body2" color="text.secondary">
          Password must be at least 8 characters long and include:
          one uppercase letter, one lowercase letter, and at least one number.
        </Typography>

        {err && <Alert severity="error">{err}</Alert>}

        <Button type="submit" variant="contained" fullWidth disabled={!canSubmit}>
          Sign Up
        </Button>
      </Box>

      <Typography variant="body2" align="center" mt={2}>
        Already have an account?{' '}
        <MuiLink component={RouterLink} to="/login">
          Sign in
        </MuiLink>
      </Typography>
    </Paper>
  );
}
