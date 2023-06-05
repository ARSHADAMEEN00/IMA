import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Tooltip, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// store
import { registerApi } from '../../../server/api/auth';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => ({
    error: state.auth.error,
    loading: state.auth.loading,
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [password, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (loginFormData, e) => {
    e?.preventDefault();
    const credentials = {
      state: loginFormData,
      dispatch,
      navigate,
    };
    dispatch(registerApi(credentials));
  };

  const passwordChanged = watch('password');
  const confirmPasswordChanged = watch('confirm');

  useEffect(() => {
    setPassword({
      ...password,
      password: passwordChanged,
      confirmPassword: confirmPasswordChanged,
    });
    // eslint-disable-next-line
  }, [passwordChanged, confirmPasswordChanged]);

  return (
    <>
      <form onSubmit={handleSubmit((value, e) => onSubmit(value, e))}>
        <Stack sx={{ width: '100%', marginBottom: '15px' }} spacing={2}>
          {error.message && <Alert severity="error">{error?.message}</Alert>}

          {/* <Alert severity="success">This is a success alert — check it out!</Alert> */}
        </Stack>
        <Stack spacing={3}>
          <TextField
            name="text"
            label="User name"
            {...register('username', {
              required: {
                value: true,
                message: 'username is required',
              },
            })}
            error={!!errors?.username}
            helperText={errors?.username?.message}
          />
          <TextField
            name="email"
            label="Email"
            {...register('email', {
              required: {
                value: true,
                message: 'email is required',
              },
            })}
            type="email"
            error={!!errors?.email}
            helperText={errors?.email?.message}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            {...register('phoneNumber', {
              required: {
                value: true,
                message: 'Phone Number is required',
              },
            })}
            type="number"
            error={!!errors?.phoneNumber}
            helperText={errors?.phoneNumber?.message}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              name="password"
              label="Password"
              {...register('password', {
                required: { value: true, message: 'Password is required' },
                maxLength: { value: 10, message: 'Password cannot exceed more than 10 characters' },
                minLength: { value: 4, message: 'Password length should be at least 4 characters' },
              })}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors?.password}
              helperText={errors?.password?.message}
            />
            <TextField
              name="confirm"
              label="confirm Password"
              type={showPasswordConfirm ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
                      <Iconify icon={showPasswordConfirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirm', {
                required: { value: true, message: 'Confirm Password is required' },
                maxLength: { value: 10, message: 'Confirm Password cannot exceed more than 10 characters' },
                minLength: { value: 4, message: 'Confirm Password length should be at least 4 characters' },
              })}
              error={password.password !== password.confirmPassword || !!errors?.confirm}
              helperText={
                (password.confirmPassword &&
                  password.password !== password.confirmPassword &&
                  'Passwords do not match') ||
                errors?.confirm?.message
              }
            />
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Tooltip placement="right-start" title="Remember me">
            <Checkbox name="remember" label="Remember me" />
          </Tooltip>
          <Link variant="subtitle2" underline="hover" sx={{ cursor: 'pointer' }}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          sx={{
            backgroundColor: '#418e8c',
          }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Register
        </LoadingButton>
      </form>
    </>
  );
}
