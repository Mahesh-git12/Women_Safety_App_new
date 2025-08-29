import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function VoiceSOSConsentModal({ open, onAllow, onDeny }) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Enable Voice SOS</DialogTitle>
      <DialogContent>
        <Typography>
          Allow the app to listen for emergency keywords like ?helpµ or ?SOSµ hands-free? This improves safety by triggering SOS even if you can't press the button.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDeny} color="secondary">
          No, thanks
        </Button>
        <Button onClick={onAllow} variant="contained" color="primary">
          Enable Voice SOS
        </Button>
      </DialogActions>
    </Dialog>
  );
}
