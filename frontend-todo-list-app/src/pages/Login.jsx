import { useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
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

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/app';

    const [form, setForm] = useState({ email: '', password: '' });
    const [err, setErr] = useState('');

    const onChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        try {
            await login(form);
            navigate(from, { replace: true });
        } catch (e) {
            if (e.status === 422 && e.data?.errors) {
                const first = Object.values(e.data.errors)[0]?.[0];
                setErr(first || 'Invalid Credentials');
            } else {
                setErr(e.message || 'Error logging in');
            }
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h1" gutterBottom>
               Login
            </Typography>

            <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="tu@correo.com"
                    fullWidth
                    required
                />
                <TextField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    fullWidth
                    required
                />

                {err && <Alert severity="error">{err}</Alert>}

                <Button type="submit" variant="contained" fullWidth>
                    Enter
                </Button>
            </Box>

            <Typography variant="body2" align="center" mt={2}>
                Hasn't you a account?{' '}
                <MuiLink component={RouterLink} to="/register">
                    Register
                </MuiLink>
            </Typography>
        </Paper>
    );
}
