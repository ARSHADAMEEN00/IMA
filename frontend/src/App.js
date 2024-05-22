import React, { useEffect, useRef } from 'react';
import axios from 'axios';
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
import { API_URL } from './server/api/http';

// ----------------------------------------------------------------------

export default function App() {
  const intervalIdRef = useRef(null);

  useEffect(() => {
    const callApi = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      // Check if current time is between 9 AM and 10 PM
      if (currentHour >= 9 && currentHour < 22) {
        // Call your API here
        axios
          .get(`${API_URL}/auth/profile`)
          .then((response) => {
            console.log('API response:', response.data);
          })
          .catch((error) => {
            console.error('API call error:', error);
          });
      }
    };

    // Check if interval is already set
    if (!intervalIdRef.current) {
      // Call the API immediately if the time is within range
      callApi();

      // Set up an interval to call the API every hour (3600000 milliseconds)
      intervalIdRef.current = setInterval(callApi, 3600000);
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []);

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
