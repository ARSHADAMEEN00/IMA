import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// @mui
import { Container, Typography } from '@mui/material';

// components
import { MetaHelmet } from '../layouts/Helmet/Helmet';

// action

// sections
import DashboardSkeleton from '../sections/@dashboard/app/DashoardLoader';
import DashboardContent from '../sections/@dashboard/app/DashboardContent';
import { getAllKuri } from '../server/api/kuri';

// ----------------------------------------------------------------------

export default function DashboardAdminApp() {
  const dispatch = useDispatch();
  const [showWelcome, setShowWelcome] = useState(true);

  const { loading } = useSelector((state) => ({
    loading: state.kuri.getLoading,
  }));

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 8000);
  }, []);

  useEffect(() => {
    const requestData = {
      limit: 10,
      search: '',
    };
    dispatch(getAllKuri(requestData));
  }, [dispatch]);

  return (
    <>
      <MetaHelmet title={'Dashboard'} />

      <Container maxWidth="xl">
        {showWelcome && (
          <Typography variant="h4" sx={{ mb: 5 }}>
            Hi, Welcome back Admin
          </Typography>
        )}
        {loading ? <DashboardSkeleton /> : <DashboardContent />}
      </Container>
    </>
  );
}
