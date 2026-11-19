export async function isPanelAdmin(authorization, fetcher = fetch) {
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ') || authorization.length > 10000) return false;
  try {
    const response = await fetcher('http://127.0.0.1:8080/api/auth/user', {
      headers: { Authorization: authorization },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.user?.id) && data.user?.role === 'admin';
  } catch { return false; }
}