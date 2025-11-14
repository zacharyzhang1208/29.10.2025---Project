export function getBasename() {
  const host = window.location.hostname;
  const path = window.location.pathname;
  if (host.endsWith('github.io')) {
    const seg = path.split('/').filter(Boolean)[0];
    return seg ? `/${seg}` : '/';
  }
  return undefined;
}