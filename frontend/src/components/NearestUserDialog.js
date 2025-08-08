import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function NearestUserDialog({ user, onClose, onNotify }) {
  if (!user) return null;
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Nearest Helper Found</DialogTitle>
      <DialogContent>
        <Typography>Name: {user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
        {/* Optional distance info here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onNotify} color='primary'>Notify</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
