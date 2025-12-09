// functions/[[path]].js – jojobet gibi 308 + cache header
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const country = request.headers.get('cf-ipcountry') || 'XX';
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  const eski = "bahiscasino-gir.pages.dev";
  const yeni = "bahiscasino-gir.pagesdev.us";

  const host = url.hostname;

  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  if (/googlebot|mediapartners|adsbot|google-inspectiontool|storebot|googleweblight|googleother/i.test(ua)) {
    return context.next(); // Google 301 görmesin
  }

  if (country === 'TR' && host === eski) {
    const response = Response.redirect(`https://${yeni}${url.pathname}${url.search}`, 308); // jojobet gibi 308
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 yıl cache
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); // HSTS preload
    return response;
  }

  if (country === 'TR' && (host === yeni || host === 'www.' + yeni)) {
    return Response.redirect(`${url.origin}/tr.html`, 302);
  }

  return context.next();
}
