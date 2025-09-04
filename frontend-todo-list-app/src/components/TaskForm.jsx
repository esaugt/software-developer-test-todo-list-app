import { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// props: initial, onSubmit, onCancel, submitLabel
export default function TaskForm({ initial, onSubmit, onCancel, submitLabel = 'Guardar' }) {
    const [values, setValues] = useState({
        title: '', description: '', due_date: null, status: 'pending', order: 0
    });
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initial) return;
        setValues({
            title: initial.title ?? '',
            description: initial.description ?? '',
            due_date: initial.due_date ? dayjs(initial.due_date) : null,
            status: initial.status ?? 'pending',
            order: Number.isFinite(initial.order) ? initial.order : 0,
        });
    }, [initial]);

    const handle = (name, val) => setValues(v => ({ ...v, [name]: val }));

    const submit = async (e) => {
        e?.preventDefault();
        setErr('');
        if (!values.title.trim()) return setErr('The title is required.');
        try {
            setLoading(true);
            await onSubmit({
                title: values.title.trim(),
                description: values.description.trim(),
                due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
                status: values.status,
                order: values.order
            });
        } catch (e) {
            if (e.status === 422 && e.data?.errors) {
                const first = Object.values(e.data.errors)[0]?.[0];
                setErr(first || 'Invalid Data');
            } else setErr(e.message || 'Error saving');
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
                <TextField
                    label="Title *"
                    value={values.title}
                    onChange={(e) => handle('title', e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    value={values.description}
                    onChange={(e) => handle('description', e.target.value)}
                    fullWidth multiline minRows={3}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <DatePicker
                        label="Due Date"
                        value={values.due_date}
                        onChange={(v) => handle('due_date', v)}
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                    <TextField
                        select fullWidth label="Status" value={values.status}
                        onChange={(e) => handle('status', e.target.value)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="complete">Complete</MenuItem>
                    </TextField>
                    <TextField
                        type="number" fullWidth label="Order" value={values.order}
                        onChange={(e) => handle('order', Number(e.target.value ?? 0))}
                    />
                </Stack>

                {err && <Box sx={{ color: 'error.main', fontSize: 14 }}>{err}</Box>}

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button onClick={onCancel} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving…' : submitLabel}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
