import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getCustomTheme } from '../utils/theme';
import '../styles/globals.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const colorMode = 'dark';
  const mode = colorMode === 'dark' || colorMode === 'light' ? colorMode : 'light';
  const theme = getCustomTheme(mode);

  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
