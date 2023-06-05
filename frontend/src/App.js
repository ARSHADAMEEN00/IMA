import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SnackbarAlert } from './components/snack/snackAlert';

// routes
import Router from './routes';

// theme
import ThemeProvider from './theme';

// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// store
import store from './server/store/store';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Provider store={store}>
            <SnackbarAlert />
            <Router />
          </Provider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
