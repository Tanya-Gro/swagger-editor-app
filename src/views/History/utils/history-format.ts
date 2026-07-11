export function formatBytes(bytes: number): string {
  const kilobyte = 1024;

  if (bytes === 0) {
    return '0 B';
  }

  if (bytes < kilobyte) {
    return `${String(bytes)} B`;
  }

  return `${(bytes / kilobyte).toFixed(1)} KB`;
}

export function formatTimestamp(timestamp: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
