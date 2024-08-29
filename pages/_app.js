import "@/styles/globals.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import Loading from "./Loading";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ThemeProvider attribute="class">
      <div className="relative">
        {loading ? <Loading /> : <Component {...pageProps} />}
      </div>
    </ThemeProvider>
  );
}

export default MyApp;