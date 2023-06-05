import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Container, CircularProgress } from '@mui/material';

import { MetaHelmet } from '../layouts/Helmet/Helmet';
import { logoutApi } from '../server/api/auth';
import { useGetToken } from '../hooks/useHandleSessions';
import { TOKEN_PREFIX } from '../server/api/http';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, token } = useGetToken(TOKEN_PREFIX);

  useEffect(() => {
    const credentials = {
      dispatch,
      navigate,
    };
    dispatch(logoutApi(credentials));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isSuccess && !token) {
      navigate('/');
    }
  }, [isSuccess, token, navigate]);

  return (
    <>
      <MetaHelmet title="Logout" />

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <CircularProgress color="warning" />
        </StyledContent>
      </Container>
    </>
  );
}
