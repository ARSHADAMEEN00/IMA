import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';
import PropTypes from 'prop-types';

function SkeletonChildrenDemo() {
  return (
    <Grid container wrap="nowrap">
      <Box sx={{ width: 250, ml: '10px' }}>
        <Skeleton variant="rectangular" width={250} height={118} />
        <Box sx={{ pt: 0.5 }}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      </Box>
    </Grid>
  );
}

SkeletonColorCards.propTypes = {
  color: PropTypes.any,
};
function SkeletonColorCards({ color }) {
  return (
    <Box sx={{ height: '400px', position: 'relative' }}>
      <Skeleton sx={{ height: '100%', bgcolor: color }} />
      <Box
        sx={{
          position: 'absolute',
          top: '100px',
          left: 10,
          width: '100%',
          padding: '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack mb={1} width={'100%'} justifyContent={'center'} alignItems={'center'}>
          <Box sx={{ margin: 4 }}>
            <Skeleton variant="circular">
              <Avatar sx={{ height: '70px', width: '70px' }} />
            </Skeleton>
          </Box>
          <Box sx={{ width: '30%', height: '15px' }}>
            <Skeleton sx={{ bgcolor: 'grey' }} width="100%" height={'100%'}>
              <Typography>.</Typography>
            </Skeleton>
          </Box>
          <Box sx={{ width: '40%', height: '10px' }}>
            <Skeleton sx={{ bgcolor: 'grey' }} width="100%" height={'100%'}>
              <Typography>.</Typography>
            </Skeleton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <SkeletonColorCards color={'#bdd6f2'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SkeletonColorCards color={'#f3e1ac'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SkeletonColorCards color={'#b2d7f3'} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SkeletonColorCards color={'#f4c7be'} />
        </Grid>
      </Grid>
      <Stack direction={'row'}>
        <SkeletonChildrenDemo />
        <SkeletonChildrenDemo />
        <SkeletonChildrenDemo />
        <SkeletonChildrenDemo />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Box sx={{ width: '100%', mt: 6 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ width: '100%', mt: 6 }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
