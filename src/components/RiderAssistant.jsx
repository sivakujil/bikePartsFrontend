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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const FloatingButton = styled(Fab)(() => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  backgroundColor: '#38BDF8',
  color: '#000',
  '&:hover': {
    backgroundColor: '#0EA5E9',
  },
  animation: `${pulse} 2s infinite`,
}));

const RiderAssistant = ({ rider, orders }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pendingOrders = orders.filter(order => order.status === 'Assigned');
  const completedToday = orders.filter(order =>
    order.status === 'Delivered' &&
    new Date(order.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const tips = [
    "Always confirm delivery address before pickup",
    "Keep customer phone numbers handy for coordination",
    "Update order status immediately after each action",
    "Maintain a professional and friendly demeanor",
    "Check vehicle documents and insurance regularly"
  ];

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
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#F8FAFC'
          }
        }}
      >
        <DialogTitle sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#38BDF8'
        }}>
          <AssistantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Rider Assistant
        </DialogTitle>

        <DialogContent>
          {/* Rider Stats */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#38BDF8' }}>
              Your Performance Today
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<LocalShippingIcon />}
                label={`${pendingOrders.length} Pending Orders`}
                sx={{ bgcolor: '#F59E0B', color: '#000' }}
              />
              <Chip
                icon={<StarIcon />}
                label={`${completedToday} Completed Today`}
                sx={{ bgcolor: '#10B981', color: '#000' }}
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={rider?.isOnline ? "Online" : "Offline"}
                sx={{
                  bgcolor: rider?.isOnline ? '#10B981' : '#6B7280',
                  color: '#000'
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          {/* Quick Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#38BDF8' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pendingOrders.length > 0 && (
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#38BDF8',
                    color: '#38BDF8',
                    '&:hover': { borderColor: '#0EA5E9', bgcolor: 'rgba(56, 189, 248, 0.1)' }
                  }}
                  onClick={() => {
                    // Could navigate to orders or perform bulk action
                    handleClose();
                  }}
                >
                  View All Pending Orders ({pendingOrders.length})
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#10B981',
                  color: '#10B981',
                  '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16, 185, 129, 0.1)' }
                }}
                onClick={() => {
                  // Could open earnings/stats page
                  handleClose();
                }}
              >
                View Earnings & Stats
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          {/* Helpful Tips */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#38BDF8' }}>
              Pro Tips for Success
            </Typography>
            <List>
              {tips.map((tip, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <Avatar sx={{
                    bgcolor: '#38BDF8',
                    color: '#000',
                    mr: 2,
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem'
                  }}>
                    {index + 1}
                  </Avatar>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: '#E2E8F0' }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            sx={{ color: '#94A3B8' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RiderAssistant;