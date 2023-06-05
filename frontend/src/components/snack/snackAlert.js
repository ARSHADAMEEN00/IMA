import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnack } from '../../server/store/common';

export const SnackbarAlert = () => {
  const dispatch = useDispatch();
  const { snack } = useSelector((state) => ({
    snack: state.common.snack,
  }));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return dispatch(hideSnack());
    }
    return dispatch(hideSnack());
  };

  useEffect(() => {
    if (snack.status === true) {
      setTimeout(() => {
        dispatch(hideSnack());
      }, 3000);
    }
  }, [snack.status, dispatch]);

  return (
    <Snackbar anchorOrigin={snack?.position} open={snack?.status} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snack?.type || 'info'} sx={{ width: '100%' }}>
        {snack?.message}
      </Alert>
    </Snackbar>
  );
};
