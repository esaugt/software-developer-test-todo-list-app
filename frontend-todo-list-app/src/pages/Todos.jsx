import { useEffect, useMemo, useState } from 'react';
import { Container, Paper, Stack, Typography, Button, IconButton, Tooltip, Divider, Snackbar, Alert, CircularProgress, Chip, Pagination as MUIPagination } from '@mui/material';
import { Add, Edit, Delete, PlayArrow, Done } from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { todosService } from '../api/todos';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import { formatHumanDate } from '../utils/dates';

export default function Todos() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  const params = useMemo(() => ({
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'order',
    dir: searchParams.get('dir') || 'asc',
    per_page: Number(searchParams.get('per_page') || 10),
    page: Number(searchParams.get('page') || 1),
  }), [searchParams]);

  const setParams = (patch) => {
    const next = { ...params, ...patch };
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && !Number.isNaN(v)) sp.set(k, String(v));
    });
    setSearchParams(sp, { replace: true });
  };

  async function load() {
    try {
      setLoading(true);
      const res = await todosService.list(params);
      setItems(Array.isArray(res.data) ? res.data : []);
      setMeta({ current_page: res.current_page, last_page: res.last_page, total: res.total, per_page: res.per_page });
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Error loading tasks.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [params.status, params.sort, params.dir, params.per_page, params.page]);

  const handleCloseErr = () => setErr('');

  const createTask = async (payload) => { await todosService.create(payload); setShowCreate(false); setParams({ page: 1 }); await load(); };
  const updateTask = async (payload) => { await todosService.update(editing.uuid, payload); setEditing(null); await load(); };
  const advance = async (t) => {
    const next = t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'complete' : 'complete';
    await todosService.patch(t.uuid, { status: next }); await load();
  };
  const remove = async (uuid) => {
    await todosService.remove(uuid);
    if (items.length === 1 && params.page > 1) setParams({ page: params.page - 1 }); else await load();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4">My tasks.</Typography>
        <Typography variant="body2" color="text.secondary">Hi, <strong>{user?.email}</strong></Typography>
      </Stack>

      <TaskFilters
        value={{ status: params.status, sort: params.sort, dir: params.dir, per_page: params.per_page }}
        onChange={(v) => setParams({ ...v, page: 1 })}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">{meta.total} total · page {meta.current_page}/{meta.last_page}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditing(null); setShowCreate(s => !s); }}>
          {showCreate ? 'Close' : 'New task'}
        </Button>
      </Stack>

      {showCreate && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Create task</Typography>
          <TaskForm initial={{ status: 'pending', order: 0 }} onSubmit={createTask} onCancel={() => setShowCreate(false)} submitLabel="Create" />
        </Paper>
      )}

      {editing && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Edit task</Typography>
          <TaskForm initial={editing} onSubmit={updateTask} onCancel={() => setEditing(null)} submitLabel="Update" />
        </Paper>
      )}

      <Paper variant="outlined">
        {loading && !items.length ? (
          <Stack alignItems="center" sx={{ py: 6 }}><CircularProgress /></Stack>
        ) : (
          <Stack divider={<Divider />} sx={{ p: 1 }}>
            {items.map(t => (
              <Stack key={t.uuid || t.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1, px: 1 }}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" sx={{ textDecoration: t.status === 'complete' ? 'line-through' : 'none' }}>{t.title}</Typography>
                  {t.description && <Typography variant="body2" color="text.secondary">{t.description}</Typography>}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={t.status} color={t.status === 'complete' ? 'success' : t.status === 'in_progress' ? 'primary' : 'default'} />
                    <Typography variant="caption" color="text.secondary">Due: {formatHumanDate(t.due_date)}</Typography>
                    {Number.isFinite(t.order) && <Typography variant="caption" color="text.secondary">· Order: {t.order}</Typography>}
                    <Typography variant="caption" color="text.secondary">· Created: {formatHumanDate(t.created_at)}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1}>
                  {t.status !== 'complete' && (
                    <Tooltip title="Advance status">
                      <IconButton onClick={() => advance(t)}><PlayArrow /></IconButton>
                    </Tooltip>
                  )}
                  {t.status === 'complete' && (
                    <Tooltip title="Completed">
                      <span><IconButton disabled><Done /></IconButton></span>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit"><IconButton onClick={() => setEditing(t)}><Edit /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => remove(t.uuid)}><Delete /></IconButton></Tooltip>
                </Stack>
              </Stack>
            ))}
            {!items.length && !loading && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No results with these filters.</Typography>
            )}
          </Stack>
        )}
      </Paper>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <MUIPagination
          page={meta.current_page} count={meta.last_page}
          onChange={(_, p) => setParams({ page: p })}
          color="primary" shape="rounded"
        />
      </Stack>

      <Snackbar open={!!err} autoHideDuration={4000} onClose={handleCloseErr} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseErr} severity="error" variant="filled" sx={{ width: '100%' }}>
          {err}
        </Alert>
      </Snackbar>
    </Container>
  );
}
