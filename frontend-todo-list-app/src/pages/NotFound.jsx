import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper
} from '@mui/material';

export default function NotFound() {
    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 500,
                margin: 'auto',
                mt: 10,
                p: 6,
                textAlign: 'center',
            }}
        >
            <Typography variant="h2" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h6" gutterBottom>
                This page doesn't exist. Just like my abs.
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/"
                >
                    Back to Home
                </Button>
            </Box>
        </Paper>
    );
}
