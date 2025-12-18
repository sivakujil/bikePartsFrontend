import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Container, Stack, Fade, Alert, CircularProgress
} from "@mui/material";
import { styled } from '@mui/system';
import { format } from "date-fns";
import { getUserProductRequests } from "../services/productRequestService";

// === 1. THEME CONFIGURATION ===
const THEME = {
  bg: '#000000', // True Black
  glass: 'rgba(20, 20, 20, 0.8)',
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Yellow Border
  primary: '#FFD700', // Yellow
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  text: '#FFFFFF',
  textMuted: '#9ca3af',
};

// === 2. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  paddingBottom: '80px',
  // Dark Gradient
  backgroundImage: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${THEME.bg} 80%)`,
});

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  overflow: 'hidden',
});

const ModernTable = styled(Table)({
  '& .MuiTableCell-head': {
    color: THEME.textMuted,
    borderBottom: `1px solid ${THEME.glassBorder}`,
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '1px'
  },
  '& .MuiTableCell-body': {
    color: THEME.text,
    borderBottom: `1px solid ${THEME.glassBorder}`,
    fontSize: '0.9rem',
    padding: '16px'
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.04)'
  }
});

// Status Badge
const StatusBadge = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: `rgba(${statuscolor}, 0.15)`,
  color: statuscolor,
  fontWeight: 700,
  borderRadius: '8px',
  border: `1px solid rgba(${statuscolor}, 0.3)`,
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  height: '24px',
  '& .MuiChip-icon': { color: statuscolor }
}));

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getUserProductRequests();
      setRequests(response.requests || []);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "replied": return THEME.success;
      case "pending": return THEME.primary;
      default: return THEME.textMuted;
    }
  };

  if (loading) return (
    <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ color: THEME.primary }} />
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <Container sx={{ pt: 10 }}>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
      </Container>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <Container maxWidth="xl" sx={{ pt: 4 }}>

        {/* HEADER */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800}>My Requests</Typography>
          <Typography variant="body2" color={THEME.textMuted}>
            Track your product requests and admin replies.
          </Typography>
        </Box>

        <GlassCard sx={{ p: 0 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <ModernTable>
              <TableHead>
                <TableRow>
                  <TableCell>Product Requested</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Admin Reply</TableCell>
                  <TableCell>Estimated Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color={THEME.primary}>
                          {request.productId?.name}
                        </Typography>
                        {request.messageFromUser && (
                          <Typography variant="caption" color={THEME.textMuted} sx={{ display: 'block', mt: 0.5 }}>
                            {request.messageFromUser}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={request.status}
                        statuscolor={getStatusColor(request.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={THEME.textMuted}>
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </Typography>
                      <Typography variant="caption" color={THEME.textMuted}>
                        {format(new Date(request.createdAt), "HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {request.adminReply ? (
                        <Typography variant="body2" color={THEME.text}>
                          {request.adminReply}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color={THEME.textMuted}>
                          No reply yet
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.estimatedDate ? (
                        <Typography variant="body2" color={THEME.text}>
                          {format(new Date(request.estimatedDate), "MMM dd, yyyy")}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color={THEME.textMuted}>
                          Not set
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ModernTable>
          </Box>

          {requests.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color={THEME.textMuted}>No product requests found.</Typography>
            </Box>
          )}
        </GlassCard>

      </Container>
    </PageWrapper>
  );
}