import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import moment from 'moment';
// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

// sections
import { LoadingButton } from '@mui/lab';
import { DeleteRounded } from '@mui/icons-material';
import CreateEmiModal from './CreateKuri';
import { deleteKuri, updateKuriDetails } from '../../../server/api/kuri';
import { fShortenNumber } from '../../../utils/formatNumber';
import DeleteConfirm from '../common/DeleteConfirm';
import { colors } from '../../../theme/colors';

function DashboardContent() {
  const dispatch = useDispatch();
  const { loading, list } = useSelector((state) => ({
    loading: state.kuri.loading,
    list: state.kuri.kuriList,
  }));

  const [createModal, setCreateModal] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openItem, setOpenItem] = useState();

  const handleUpdateStatus = (event, key, item) => {
    const credentials = {
      dispatch,
      kuriId: item?._id,
      state: {
        [key]: event.target.checked,
      },
    };
    dispatch(updateKuriDetails(credentials));
  };
  const kuriList = list?.list;

  const handleUpdateInstallmentStatus = (event, kuriId, item) => {
    const currentKuri = kuriList?.filter((i) => i._id === kuriId)[0];

    const modifiedInstallment = currentKuri?.installments?.map((i) =>
      i._id === item?._id
        ? {
            ...i,
            isCompleted: event,
          }
        : i
    );

    const credentials = {
      dispatch,
      kuriId,
      state: {
        installments: modifiedInstallment,
      },
    };
    dispatch(updateKuriDetails(credentials));
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleDeleteClick = (id) => {
    setOpenItem(id);
    setOpenDeleteConfirmDialog(true);
  };

  const handleDeleteConfirmClick = () => {
    const credentials = {
      dispatch,
      kuriId: openItem,
      handleCloseDeleteDialog,
    };
    dispatch(deleteKuri(credentials));
  };

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      <DeleteConfirm
        onConfirmClick={handleDeleteConfirmClick}
        open={openDeleteConfirmDialog}
        setOpen={setOpenDeleteConfirmDialog}
      />

      <CreateEmiModal open={createModal} setOpen={setCreateModal} />

      {kuriList?.map((item, key) => (
        <Box key={key} sx={{ minHeight: '200px', background: '#d1f2ff', color: 'black', p: 3, borderRadius: 2, mb: 4 }}>
          <Stack direction={{ sm: 'column', md: 'row' }} mb={2}>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ mb: 0 }} variant="caption" display="block" gutterBottom>
                Kuri Number
              </Typography>
              <Typography variant="h5" gutterBottom>
                {key + 1}
              </Typography>
              <Typography sx={{ mb: 0 }} variant="caption" display="block" gutterBottom>
                Kuri Name
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {item?.name}
              </Typography>
              <Typography sx={{ mb: 0 }} variant="caption" display="block" gutterBottom>
                Description
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {item?.description}
              </Typography>
              {loading && (
                <Typography sx={{ mt: 2, maxWidth: '150px' }} variant="caption" display="block" gutterBottom>
                  loading...
                  <LinearProgress color="success" size="sm" sx={{ borderRadius: '10px' }} />
                </Typography>
              )}
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ mb: 0 }} variant="caption" display="block" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h5" gutterBottom>
                ₹{item?.totalAmount}
              </Typography>
              <Typography sx={{ mb: 0 }} variant="caption" display="block" gutterBottom>
                Instalment Amount (Monthly)
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ₹{item?.emiAmount}
              </Typography>

              <Stack direction={'row'}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={item?.isActive} onChange={(e) => handleUpdateStatus(e, 'isActive', item)} />
                    }
                    label="Active"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={item?.isCompleted}
                        onChange={(e) => handleUpdateStatus(e, 'isCompleted', item)}
                      />
                    }
                    label="Completed"
                  />
                </FormGroup>
              </Stack>
              <Stack direction={'row'} alignItems={'start'} justifyContent={'end'}>
                <Button color="inherit" onClick={() => handleDeleteClick(item?._id)}>
                  <DeleteRounded fontSize="small" color="warning" />
                  Remove
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Divider />

          <Typography sx={{ mt: 2 }} variant="h6" display="block" gutterBottom>
            Installments
          </Typography>
          <Grid container spacing={3}>
            {item?.installments?.map((install, index) => (
              <Grid
                item
                xs={6}
                sm={6}
                key={index}
                md={3}
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => handleUpdateInstallmentStatus(!install?.isCompleted, item?._id, install)}
              >
                <Card
                  sx={{
                    py: 5,
                    boxShadow: 0,
                    textAlign: 'center',
                    color: (theme) => theme.palette[install?.isCompleted ? 'primary' : 'grey'].darker,
                    bgcolor: (theme) => theme.palette[install?.isCompleted ? 'primary' : 'grey'].lighter,
                  }}
                >
                  <Typography variant="h3">
                    {install?.InstallmentNo ? fShortenNumber(install?.InstallmentNo) : 0}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                    {moment(install?.date).format('ll')}
                  </Typography>

                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        label="Success"
                        color="success"
                        checked={install?.isCompleted}
                        onChange={(e) => handleUpdateInstallmentStatus(e, item?._id, install)}
                      />
                    }
                    label="Completed"
                  /> */}
                  {install?.isCompleted && (
                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                      Completed
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      {kuriList?.length <= 0 && (
        <Box>
          <Stack pt={10} direction={'column'} alignItems={'center'} justifyContent={'center'}>
            <img style={{ marginLeft: '25px' }} src="/assets/illustrations/notfound.png" alt="not found" />
            <Typography variant="h5" color={'gray'} gutterBottom>
              No Installments found
            </Typography>
            <LoadingButton
              sx={{
                backgroundColor: colors.green,
                margin: 'auto',
              }}
              size="large"
              type="submit"
              variant="contained"
              onClick={() => setCreateModal(true)}
            >
              Create New Installment
            </LoadingButton>
          </Stack>
        </Box>
      )}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: '75px',
        }}
      >
        <Tooltip title="Create Kuri">
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab color="error" aria-label="add " onClick={() => setCreateModal(true)}>
              <AddIcon />
            </Fab>
          </Box>
        </Tooltip>
      </div>
    </div>
  );
}

export default DashboardContent;
