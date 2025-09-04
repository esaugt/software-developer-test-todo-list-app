import { useEffect, useMemo, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';

const STATUS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
];
const SORT = [
    { value: 'order', label: 'Order' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'created_at', label: 'Created At' },
];

export default function TaskFilters({ value, onChange }) {
    const [local, setLocal] = useState({ status: '', sort: 'order', dir: 'asc', per_page: 10 });

    useEffect(() => { if (value) setLocal(v => ({ ...v, ...value })); }, [value]);
    const selected = useMemo(() => new Set((local.status || '').split(',').filter(Boolean)), [local.status]);

    const toggle = (s) => {
        const next = new Set(selected);
        next.has(s) ? next.delete(s) : next.add(s);
        const status = Array.from(next).join(',');
        setLocal(v => ({ ...v, status }));
        onChange?.({ ...local, status, page: 1 });
    };

    const set = (k, v) => { setLocal(x => ({ ...x, [k]: v })); onChange?.({ ...local, [k]: v, page: 1 }); };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Filters</Typography>

            <FormGroup row sx={{ mb: 2 }}>
                {STATUS.map(s => (
                    <FormControlLabel
                        key={s.value}
                        control={<Checkbox checked={selected.has(s.value)} onChange={() => toggle(s.value)} />}
                        label={s.label}
                    />
                ))}
            </FormGroup>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select label="Sort By" value={local.sort} onChange={(e) => set('sort', e.target.value)}>
                        {SORT.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Direction</InputLabel>
                    <Select label="Direction" value={local.dir} onChange={(e) => set('dir', e.target.value)}>
                        <MenuItem value="asc">Asc</MenuItem>
                        <MenuItem value="desc">Desc</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Per Page</InputLabel>
                    <Select label="Per Page" value={local.per_page} onChange={(e) => set('per_page', Number(e.target.value))}>
                        {[5, 10, 20, 50].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
        </Paper>
    );
}
