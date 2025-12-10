// functions/[[path]].js
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const country = request.headers.get('cf-ipcountry') || 'XX';
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  const eski = "bahiscasino-gir.pages.dev";
  const yeni = "bahiscasino-gir.pagesdev.us";
  const host = url.hostname;

  // Sadece ana sayfa ve index.html için yönlendirme yap
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot vs. görürse hiçbir şey yapma, normal siteyi göstersin
  if (/googlebot|mediapartners|adsbot|google-inspectiontool|storebot|googleweblight|googleother/i.test(ua)) {
    return context.next();
  }

  // Türkiye + eski domain → 308 Permanent Redirect + 1 yıl cache
  if (country === 'TR' && host === eski) {
    return new Response(null, {
      status: 308,
      headers: {
        'Location': `https://${yeni}${url.pathname}${url.search}`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      },
    });
  }

  // Türkiye + yeni domain → tr.html'ye 302 yönlendir
  if (country === 'TR' && (host === yeni || host === 'www.' + yeni)) {
    return Response.redirect(`${url.origin}/tr.html`, 302);
    // Burada 302 olduğu için Response.redirect kullanılabilir, sorun çıkarmaz
  }

  // Diğer tüm durumlar (TR dışı, bot değil vs.)
  return context.next();
}
