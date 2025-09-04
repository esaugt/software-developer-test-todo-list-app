export default function Pagination({ meta, onPage }) {
    // meta: { current_page, last_page, total }
    const current = meta?.current_page ?? 1;
    const last = meta?.last_page ?? 1;
    if (last <= 1) return null;

    const prev = () => onPage(Math.max(1, current - 1));
    const next = () => onPage(Math.min(last, current + 1));

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
            <button disabled={current <= 1} onClick={prev}>Back</button>
            <span style={{ fontSize: 12, color: '#666' }}>{current} / {last}</span>
            <button disabled={current >= last} onClick={next}>Next</button>
        </div>
    );
}
