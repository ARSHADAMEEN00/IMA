import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';

import { TOKEN_PREFIX } from '../server/api/http';

// hooks
import useResponsive from '../hooks/useResponsive';
import { useGetToken } from '../hooks/useHandleSessions';

// components
import Logo from '../components/logo';
import { MetaHelmet } from '../layouts/Helmet/Helmet';

// sections
import LoginForm from '../sections/auth/login/LoginForm';
import { colors } from '../theme/colors';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

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

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const { token, isSuccess } = useGetToken(TOKEN_PREFIX);

  useEffect(() => {
    if (isSuccess && token) {
      navigate('/redirect');
    }
  }, [navigate, isSuccess, token]);

  return (
    <>
      <MetaHelmet title={'Login'} />

      <StyledRoot>
        {mdUp && (
          <Logo
            sx={{
              position: 'fixed',
              top: { xs: 16, sm: 24, md: 40 },
              left: { xs: 16, sm: 24, md: 40 },
            }}
          />
        )}

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, color: colors.primary }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to IMA
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link href="/auth/register" variant="subtitle2" sx={{ cursor: 'pointer' }}>
                Get started
              </Link>
            </Typography>

            <LoginForm />
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
              Don’t have an account? {''}
              <Link href="/auth/register" variant="subtitle2" sx={{ cursor: 'pointer' }}>
                Get started
              </Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
