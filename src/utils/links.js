export function buildPageLink({ req, page }) {
  if (!page) return null;
  const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
  url.searchParams.set('page', page);
  return url.pathname.startsWith('/api/') ? url.toString() : `${url.pathname}${url.search}`;
}