// components/RiderAssistant.js
import React, { useState } from 'react';
import {
  Fab, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, List, ListItem, ListItemText, Chip,
  Divider, Avatar
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import AssistantIcon from '@mui/icons-material/Assistant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

// மஞ்சள் நிற Pulse அனிமேஷன்
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
`;

const FloatingButton = styled(Fab)(() => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  backgroundColor: '#FFC107', // மஞ்சள்
  color: '#000', // கருப்பு ஐகான்
  zIndex: 1000,
  '&:hover': {
    backgroundColor: '#FFD54F',
  },
  animation: `${pulse} 2s infinite`,
}));

const RiderAssistant = ({ rider, orders }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pendingOrders = orders.filter(order => order.status === 'Assigned' || order.status === 'Picked Up');
  const completedToday = orders.filter(order =>
    order.status === 'Delivered' &&
    new Date(order.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <>
      <FloatingButton onClick={handleOpen}>
        <AssistantIcon />
      </FloatingButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #121212 0%, #212121 100%)', // கருப்பு கிரேடியன்ட்
            color: '#F8FAFC',
            border: '1px solid #333'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#FFC107' }}>
          <AssistantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rider Copilot
        </DialogTitle>

        <DialogContent>
          {/* Stats Box */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFC107' }}>
              Today's Performance
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocalShippingIcon style={{ color: '#000' }} />}
                label={`${pendingOrders.length} Pending`}
                sx={{ bgcolor: '#FFC107', color: '#000', fontWeight: 'bold' }}
              />
              <Chip
                icon={<StarIcon style={{ color: '#000' }} />}
                label={`${completedToday} Delivered`}
                sx={{ bgcolor: '#FFF', color: '#000' }}
              />
              <Chip
                icon={<AccessTimeIcon style={{ color: rider?.isOnline ? '#000' : '#FFF' }} />}
                label={rider?.isOnline ? "Online" : "Offline"}
                sx={{
                  bgcolor: rider?.isOnline ? '#4CAF50' : '#424242',
                  color: rider?.isOnline ? '#000' : '#FFF'
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          {/* Quick Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#FFC107' }}>
              Actions
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#FFC107',
                color: '#FFC107',
                '&:hover': { borderColor: '#FFF', bgcolor: 'rgba(255, 193, 7, 0.1)' }
              }}
              onClick={handleClose}
            >
              Back to Dashboard
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} sx={{ color: '#94A3B8' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RiderAssistant;