import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';

// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Avatar,
  Divider,
  Chip,
  Switch,
  Box,
  Alert,
  TextField,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { EmailRounded, KeyboardBackspace } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import { updateUserDetails } from '../../server/api/users';
// components
import UpdatePasswordModal from '../../sections/@dashboard/app/CreateKuri';
import Iconify from '../../components/iconify';
import { MetaHelmet } from '../../layouts/Helmet/Helmet';
import { colors } from '../../theme/colors';
import { useGetRoles } from '../../hooks/useHandleSessions';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useGetRoles();

  const { loading, profile, error } = useSelector((state) => ({
    loading: state.auth.loading,
    profile: state.auth.user,
    error: state.auth.error,
  }));

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [roles, setRoles] = useState(() => []);
  const [isSaved, setIsSaved] = useState(false);

  const handleRoles = (event, newAlignment) => {
    setRoles(newAlignment);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
  });

  useEffect(() => {
    reset({
      username: profile?.username,
      email: profile?.email,
    });
    setRoles(profile?.roles);
  }, [reset, profile]);

  const onSubmit = async (formData, e) => {
    e?.preventDefault();
    const credentials = {
      state: { ...profile, ...formData, roles },
      dispatch,
      userId: profile?._id,
      navigate: isSaved ? navigate('/dashboard/app') : '',
    };
    dispatch(updateUserDetails(credentials));
  };

  const handleUpdateStatus = (event) => {
    const credentials = {
      dispatch,
      userId: profile?._id,
      state: {
        ...profile,
        isActive: event.target.checked,
      },
    };
    dispatch(updateUserDetails(credentials));
  };

  return (
    <>
      <MetaHelmet title="Users" />
      <UpdatePasswordModal setOpen={setOpenPasswordModal} open={openPasswordModal} />
      <Container>
        <form onSubmit={handleSubmit((value, e) => onSubmit(value, e))}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Stack direction="row" alignItems="center">
              <KeyboardBackspace onClick={() => navigate(-1)} sx={{ cursor: 'pointer', mr: 2, mb: 1 }} />
              <Typography variant="h4" gutterBottom>
                User Profile / Settings
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="inherit"
              sx={{ backgroundColor: colors.green, color: 'white' }}
              startIcon={<Iconify icon="eva:save-fill" />}
              type="submit"
              onClick={() => setIsSaved(true)}
            >
              Save
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Card sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
              <Stack>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Stack direction={'row'}>
                    <Avatar variant="rounded" sx={{ mr: 2 }} src="/assets/images/avatars/avatar_default.jpg" />
                    <Stack spacing={0.5} sx={{ mt: '-5px' }}>
                      <Typography fontWeight={700}>{profile?.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <EmailRounded sx={{ color: grey[500], mb: '-3px', fontSize: '16px' }} /> {profile?.email}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    {profile?.roles?.map((role, key) => (
                      <Chip color="default" key={key} label={role} variant="filled" />
                    ))}
                  </Stack>
                </Box>
                <Divider />
                <Stack direction={'row'} alignItems={'center'} sx={{ mt: 2 }}>
                  <SyncLockIcon fontSize="16px" sx={{ ml: 2, mr: 1 }} />
                  <Typography
                    color={colors.secondary}
                    onClick={() => setOpenPasswordModal(true)}
                    fontWeight={400}
                    variant="button"
                    sx={{ cursor: 'pointer' }}
                  >
                    Change Password
                  </Typography>
                </Stack>

                <Stack direction={'row'} alignItems={'center'} sx={{ mt: 2 }}>
                  <SyncLockIcon fontSize="16px" sx={{ ml: 2, mr: 1 }} />
                  <Typography color={colors.black} fontWeight={400} variant="button" textTransform={'inherit'}>
                    Currently logged as an {role},&nbsp;
                  </Typography>
                  <Typography
                    color={colors.secondary}
                    onClick={() => navigate('/redirect')}
                    fontWeight={400}
                    variant="button"
                    sx={{ cursor: 'pointer' }}
                  >
                    Change logged role
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
              >
                <Chip
                  sx={{ bgcolor: profile?.isActive ? colors.light : '' }}
                  label={profile?.isActive ? 'Active account' : 'Inactive account'}
                />
                <Switch checked={profile?.isActive} onChange={(e) => handleUpdateStatus(e)} />
              </Stack>
            </Card>

            <Card sx={{ width: '100%', p: 3 }}>
              <Typography variant="p" gutterBottom>
                Edit Details
              </Typography>
              <Stack sx={{ width: '100%', marginBottom: '15px' }} spacing={2}>
                {error.message && <Alert severity="error">{error?.message}</Alert>}
              </Stack>
              <Stack spacing={2} direction={'row'}>
                <TextField
                  name="username"
                  // label="User name"
                  {...register('username', {
                    required: { value: true, message: 'username is required' },
                  })}
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  sx={{ width: '100%', mb: 2 }}
                  size="small"
                />
                <TextField
                  name="email"
                  // label="Email"
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'email is required',
                    },
                  })}
                  sx={{ width: '100%', mb: 2 }}
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
                  size="small"
                />
              </Stack>
              <InputLabel sx={{ mb: 1 }} id="demo-select-small-label">
                roles
              </InputLabel>
              <ToggleButtonGroup
                color="info"
                sx={{ mb: 3 }}
                value={roles}
                onChange={handleRoles}
                aria-label="text roles"
              >
                <ToggleButton size="small" value="admin" aria-label="admin">
                  Admin
                </ToggleButton>
                <ToggleButton size="small" value="customer" aria-label="customer">
                  Customer
                </ToggleButton>
                <ToggleButton size="small" value="employee" aria-label="employee">
                  Employee
                </ToggleButton>
              </ToggleButtonGroup>

              <LoadingButton
                sx={{
                  backgroundColor: colors.green,
                  color: 'white',
                }}
                fullWidth
                size="small"
                type="submit"
                variant="contained"
                color="info"
                loading={loading}
              >
                Update
              </LoadingButton>
            </Card>
          </Stack>
        </form>
      </Container>
    </>
  );
}
