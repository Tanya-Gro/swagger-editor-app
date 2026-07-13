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
