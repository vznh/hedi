import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-primary-dark text-primary">
      <Head>
        <title>Jason Son</title>
        <meta name="description" content="Personal website of Jason Son." />
        <meta name="author" content="Jason Son" />
        <link rel="canonical" href="https://hobin.dev" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Jason Son" />
        <meta property="og:description" content="Personal website of Jason Son." />
        <meta property="og:image" content="https://hobin.dev/images/og-image.png" />
        <meta property="og:url" content="https://hobin.dev" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vivivinh" />
        <meta name="twitter:creator" content="@vivivinh" />

        {/* Theme Color */}
        <meta name="theme-color" content="#000000" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </div>
  );
}
