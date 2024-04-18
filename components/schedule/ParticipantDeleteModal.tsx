import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
type IProps = {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: Dispatch<React.SetStateAction<boolean>>;
  handleDelete: Dispatch<SetStateAction<void>>;
  deleteEmail: string
};

const ParticipantDeleteModal = (props: IProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    props.setOpenDeleteDialog(false);
  };
  const handleConfirm = ()=> {
    props.handleDelete();
    props.setOpenDeleteDialog(false);
  }

  return (
    <Dialog
      open={props.openDeleteDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={'xs'}
    >
      <DialogTitle id="alert-dialog-title" className='text-center'>{"Participant Remove Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className='text-center'>
          Are you sure you want to remove participant - <span style={{color: 'red'}}>{props.deleteEmail}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          NO
        </Button>
        <Button onClick={handleConfirm} autoFocus color='error'>
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ParticipantDeleteModal;