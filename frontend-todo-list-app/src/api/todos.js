import { request } from './client';

function normalizePaginated(res) {
  // Laravel paginate: { data: [...], current_page, per_page, total, last_page, ... }
  if (res && Array.isArray(res.data)) return res;
  
  return { data: Array.isArray(res) ? res : [], current_page: 1, per_page: res?.per_page ?? 10, total: res?.total ?? (Array.isArray(res) ? res.length : 0), last_page: res?.last_page ?? 1 };
}

export const todosService = {
  list: async (params = {}) => {
    // params: { status, sort, dir, per_page, page }
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
    });
    const q = search.toString();
    const res = await request(`/tasks${q ? `?${q}` : ''}`, { auth: 'required' });
    return normalizePaginated(res);
  },
  get: async (uuid) => request(`/tasks/${uuid}`, { auth: 'required' }),
  create: async (payload) => request('/tasks', { method: 'POST', body: payload, auth: 'required' }),
  update: async (uuid, payload) => request(`/tasks/${uuid}`, { method: 'PUT', body: payload, auth: 'required' }),
  patch: async (uuid, partial) => request(`/tasks/${uuid}`, { method: 'PATCH', body: partial, auth: 'required' }),
  remove: (uuid) => request(`/tasks/${uuid}`, { method: 'DELETE', auth: 'required' }),
};
