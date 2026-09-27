export const fmtUSD = (n) => {
  const num = typeof n === 'number' ? n : parseFloat(n) || 0;
  return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const fmtAddr = (a) => {
  if (!a) return '';
  return a.length > 16 ? a.slice(0, 6) + '...' + a.slice(-4) : a;
};

export const fmtDate = (d) => {
  if (!d) return 'N/A';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? 'N/A' : dt.toDateString();
};

export const fmtDateTime = (d) => {
  if (!d) return 'N/A';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleString();
};

export const riskColor = (level) => {
  const l = (level || '').toLowerCase();
  switch (l) {
    case 'critical': return 'var(--crit)';
    case 'high': return 'var(--high)';
    case 'medium': return 'var(--warn)';
    case 'low': return 'var(--accent)';
    default: return 'var(--accent)';
  }
};

export const riskBadgeClass = (level) => {
  const l = (level || 'medium').toLowerCase();
  switch (l) {
    case 'critical': return 'badge-critical';
    case 'high': return 'badge-high';
    case 'medium': return 'badge-medium';
    case 'low': return 'badge-low';
    default: return 'badge-neutral';
  }
};
