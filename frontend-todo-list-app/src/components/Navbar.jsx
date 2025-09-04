import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Stack, Link, Box, Tooltip } from '@mui/material';
import { DarkMode, LightMode, Logout, Login, PersonAdd } from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import { ColorModeContext } from '../theme/ColorModeProvider';

export default function Nav() {
    const { isAuth, logout } = useAuth();
    const { mode, toggle } = useContext(ColorModeContext);
    const navigate = useNavigate();

    const onLogout = async () => {
        try { await logout(); } finally { navigate('/login', { replace: true }); }
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6">ToDo Lisk</Typography>
                    <Link component={RouterLink} to="/" color="inherit" underline="hover">Home</Link>
                    <Link component={RouterLink} to="/app" color="inherit" underline="hover">App</Link>
                </Stack>

                <Box>
                    <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
                        <IconButton color="inherit" onClick={toggle} sx={{ mr: 1 }}>
                            {mode === 'light' ? <DarkMode /> : <LightMode />}
                        </IconButton>
                    </Tooltip>
                    {isAuth ? (
                        <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>Logout</Button>
                    ) : (
                        <Stack direction="row" spacing={1}>
                            <Button color="inherit" component={RouterLink} to="/login" startIcon={<Login />}>Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register" startIcon={<PersonAdd />}>Register</Button>
                        </Stack>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
