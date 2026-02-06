import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import ReactDOMServer from 'react-dom/server';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';

const { renderToString } = ReactDOMServer;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const head = renderHeadToString({ request, remixContext, Head });
  
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="${themeStore.value}">
<head>${head}</head>
<body>
<div id="root" class="w-full h-full">${markup}</div>
</body>
</html>`;

  responseHeaders.set('Content-Type', 'text/html');
  
  // Required for WebContainer SharedArrayBuffer support
  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return new Response(html, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
