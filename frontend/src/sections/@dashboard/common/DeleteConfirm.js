import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

export default function DeleteConfirm({ open, setOpen, onConfirmClick }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Delete User?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <br />
            You can't undo this action.
          </DialogContentText>
          <Chip
            sx={{ mt: 2 }}
            color="warning"
            label="By deleting this Kuri, All the activity related to this installments will also be deleted."
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onConfirmClick} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteConfirm.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onConfirmClick: PropTypes.func,
};
