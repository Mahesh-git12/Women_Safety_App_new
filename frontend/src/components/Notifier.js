import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Notifier({ open, message, severity, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
