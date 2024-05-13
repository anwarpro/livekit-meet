import { Dispatch, SetStateAction } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type IProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  duration: number;
  status: any | string;
  message: string;
};

export default function CustomToastAlert(props: IProps) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    props.setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={props.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          onClose={handleClose}
          severity={props.status}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
