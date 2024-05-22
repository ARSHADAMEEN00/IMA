import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// @mui
import { Stack, IconButton, InputAdornment, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// store
import { loginApi } from '../../../server/api/auth';

// components
import Iconify from '../../../components/iconify';
import { colors } from '../../../theme/colors';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => ({
    error: state.auth.error,
    loading: state.auth.loading,
  }));

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (loginFormData, e) => {
    e?.preventDefault();
    const credentials = {
      state: loginFormData,
      dispatch,
      navigate,
    };
    dispatch(loginApi(credentials));
  };

  return (
    <>
      <form onSubmit={handleSubmit((value, e) => onSubmit(value, e))}>
        <Stack sx={{ width: '100%', marginBottom: '15px' }} spacing={2}>
          {error.message && <Alert severity="error">{error?.message}</Alert>}
        </Stack>
        <Stack spacing={3}>
          <TextField
            name="username"
            label="User name"
            {...register('username', {
              required: { value: true, message: 'username is required' },
            })}
            error={!!errors.username}
            helperText={errors?.username?.message}
          />

          <TextField
            name="password"
            label="Password"
            {...register('password', { required: { value: true, message: 'Password is required' } })}
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
            error={!!errors.password}
            helperText={errors?.password?.message}
          />
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Tooltip placement="right-start" title="Remeber me">
            <Checkbox name="remember" label="Remeber me" />
          </Tooltip>
          <Link variant="subtitle2" underline="hover" sx={{ cursor: 'pointer' }}>
            Forgot password?
          </Link>
        </Stack> */}

        <LoadingButton
          sx={{
            backgroundColor: colors.green,
            mt: 5,
          }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Login
        </LoadingButton>
      </form>
    </>
  );
}
