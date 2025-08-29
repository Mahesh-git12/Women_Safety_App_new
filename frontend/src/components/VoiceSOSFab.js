import React from 'react';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { Fab, Tooltip } from '@mui/material';

export default function VoiceSOSFab({ listening, onToggle }) {
  return (
    <Tooltip title={listening ? "Disable Voice SOS" : "Enable voice SOS"} placement="left">
      <Fab
  onClick={onToggle}
  sx={{
    position: 'fixed',
    bottom: 200,
    right: 45,
    zIndex: 1300,
    boxShadow: '0 10px 30px rgba(106,130,251,0.3)',
    backgroundColor: listening ? '#3ca4bcff' : '#f44336',  // green when listening, red otherwise
    color: '#fff',  // icon color white
    '&:hover': {
      backgroundColor: listening ? '#387b8eff' : '#d32f2f', // darker on hover
    },
  }}
>
  {listening ? <MicIcon /> : <MicOffIcon />}
</Fab>

    </Tooltip>
  );
}


