import React, { useEffect, ReactNode } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "../common/components/layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "../styles/globals.css";
import "devextreme/dist/css/dx.light.compact.css";
import useIsMobile from "@/common/hooks/useIsMobile";
import { Toaster } from "sonner";
import Head from "next/head";
import { ConfirmProvider } from "@/common/providers/ConfirmProvider";
import { MasterModalHost } from "@/common/components/MasterModalHost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: any) { console.error("Unhandled error:", error, errorInfo); }
  render() {
    if (this.state.hasError)
      return (
        <div className="flex h-screen items-center justify-center p-4 text-center">
          <div>
            <h2 className="text-2xl font-bold text-red-600">Something went wrong.</h2>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => this.setState({ hasError: false })}>
              Reload
            </button>
          </div>
        </div>
      );
    return this.props.children;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Application.Running.Step.0");
    console.log('isMobile 1 :', isMobile);
  }, []);

  // Logout sync across tabs
  useEffect(() => {
    const handleLogout = (event: StorageEvent) => {
      if (event.key === "logout") {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("lastPath");
        router.replace("/");
      }
    };
    window.addEventListener("storage", handleLogout);
    return () => window.removeEventListener("storage", handleLogout);
  }, [router]);

  const publicRoutes: string[] = ["/"];
  const isPublicPage = publicRoutes.includes(router.pathname);

  return (

    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
      </Head>

      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>

            {isPublicPage ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>

            )}

            <MasterModalHost />
            <Toaster
              position="top-right"
              richColors
              expand
              closeButton
              visibleToasts={5}
              toastOptions={{ duration: 3000 }}
            />
          </ConfirmProvider>
          {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
      </ErrorBoundary>
    </>

  );

}
