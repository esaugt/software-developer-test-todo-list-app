
// Convert to input type date value (yyyy-mm-dd)
export function toInputDate(value) {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
}


export function fromInputDate(input) {
    if (!input) return null;
    
    return input;
    
}

// Render humano (local)
export function formatHumanDate(value) {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}
