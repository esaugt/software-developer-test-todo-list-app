import { createContext, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';

export const ColorModeContext = createContext({ toggle: () => { } });

export default function ColorModeProvider({ children }) {
    const [mode, setMode] = useState(() => localStorage.getItem('mui:mode') || 'light');

    const theme = useMemo(() => {
        const base = createTheme({
            palette: {
                mode,
                primary: { main: '#3f51b5' },
                secondary: { main: '#00bfa5' },
            },
            shape: { borderRadius: 10 },
        });
        return responsiveFontSizes(base);
    }, [mode]);

    const value = useMemo(() => ({
        mode,
        toggle: () => {
            setMode(m => {
                const next = m === 'light' ? 'dark' : 'light';
                localStorage.setItem('mui:mode', next);
                return next;
            });
        },
    }), []);

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
