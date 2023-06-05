import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

// @mui
import { Stack, TextField, Alert } from '@mui/material';

// components
import { createKuri } from '../../../server/api/kuri';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default function CreateEmiModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => ({
    error: state.users.error,
    loading: state.users.loading,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData, e) => {
    e?.preventDefault();
    const credentials = {
      state: formData,
      dispatch,
      handleClose,
    };
    dispatch(createKuri(credentials));
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Create Kuri
            </Typography>
            <form onSubmit={handleSubmit((value, e) => onSubmit(value, e))}>
              <Stack sx={{ width: '100%', marginBottom: '15px' }} spacing={2}>
                {error.message && <Alert severity="error">{error?.message}</Alert>}
              </Stack>
              <Stack direction="column" sx={{ mb: 3 }} spacing={2}>
                <Typography variant="subtitle2" sx={{ opacity: 0.72, mb: -1 }}>
                  Start Date
                </Typography>
                <TextField
                  name="startDate"
                  {...register('startDate', {
                    required: { value: true, message: 'Start Date is required' },
                  })}
                  error={!!errors.startDate}
                  helperText={errors?.startDate?.message}
                  sx={{ width: '100%', mb: 2 }}
                  size="small"
                  type="date"
                />
                <TextField
                  name="name"
                  label="Kuri/EMI name"
                  {...register('name', {
                    required: { value: true, message: 'name is required' },
                  })}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  sx={{ width: '100%' }}
                  size="small"
                />

                <TextField
                  name="totalAmount"
                  label="Total Amount"
                  {...register('totalAmount', {
                    required: { value: true, message: 'Total Amount is required' },
                  })}
                  error={!!errors.totalAmount}
                  helperText={errors?.totalAmount?.message}
                  sx={{ width: '100%', mb: 2 }}
                  size="small"
                  type="number"
                />
                <TextField
                  name="emiAmount"
                  label="Monthly Amount"
                  {...register('emiAmount', {
                    required: { value: true, message: 'Monthly Amount is required' },
                  })}
                  error={!!errors.emiAmount}
                  helperText={errors?.emiAmount?.message}
                  sx={{ width: '100%', mb: 2 }}
                  size="small"
                  type="number"
                />

                <TextField
                  name="description"
                  label="Description"
                  {...register('description', {
                    required: { value: false },
                  })}
                  error={!!errors.description}
                  helperText={errors?.description?.message}
                  sx={{ width: '100%', mb: 2 }}
                  size="small"
                  type="textarea"
                />
              </Stack>

              <LoadingButton
                sx={{
                  backgroundColor: '#418e8c',
                }}
                fullWidth
                type="submit"
                variant="contained"
                loading={loading}
                size={'medium'}
              >
                Submit
              </LoadingButton>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

CreateEmiModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
