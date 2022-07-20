import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

function getBaseUrl() {
  // The browser should use the current path.
  if (process.browser) return '';
  // SSR should use the vercel URL.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // For local development use localhost.
  return `http://localhost:${process.env.PORT}`;
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
    };
  },
  ssr: false,
})(MyApp);
