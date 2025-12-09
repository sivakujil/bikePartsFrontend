import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Container
} from "@mui/material";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme Colors
  const THEME = {
    primary: '#FFD700', // Yellow
    bgCard: '#1c1c1e', // Dark Grey Card
    textMain: '#FFFFFF',
    textSecondary: '#9ca3af',
    border: 'rgba(255, 255, 255, 0.1)'
  };

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/cart-order/order/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to load order", err);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress sx={{ color: THEME.primary }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography sx={{ color: THEME.textMain }}>Order not found!</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" mb={3} fontWeight="bold" sx={{ color: THEME.textMain }}>
          Order Details
        </Typography>

        {/* Main Order Info Card */}
        <Card sx={{ mb: 4, bgcolor: THEME.bgCard, color: THEME.textMain, border: `1px solid ${THEME.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" sx={{ color: THEME.textSecondary }}>Order ID</Typography>
                 <Typography variant="body1" gutterBottom>{order._id}</Typography>

                 <Typography variant="subtitle2" sx={{ color: THEME.textSecondary, mt: 2 }}>Status</Typography>
                 <Typography variant="body1" sx={{ color: THEME.primary, fontWeight: 'bold', textTransform: 'uppercase' }} gutterBottom>
                   {order.status}
                 </Typography>

                 <Typography variant="subtitle2" sx={{ color: THEME.textSecondary, mt: 2 }}>Total Amount</Typography>
                 <Typography variant="h5" sx={{ color: THEME.primary, fontWeight: 'bold' }} gutterBottom>
                   Rs {order.totalAmount?.toLocaleString()}
                 </Typography>

                 <Typography variant="subtitle2" sx={{ color: THEME.textSecondary, mt: 2 }}>User Email</Typography>
                 <Typography variant="body1">{order.user?.email}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ color: THEME.primary, mb: 1 }}>Shipping Address</Typography>
                  <Typography variant="body1" fontWeight="bold">{order.shippingAddress?.fullName}</Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db', mt: 1 }}>
                    {order.shippingAddress?.addressLine}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1d5db' }}>
                    {order.shippingAddress?.city}, {order.shippingAddress?.zip}
                  </Typography>
                  <Typography variant="body2" sx={{ color: THEME.textSecondary, mt: 1 }}>
                    📞 {order.shippingAddress?.phone}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h5" mb={2} fontWeight="bold" sx={{ color: THEME.textMain }}>
          Items Ordered
        </Typography>
        
        {/* Items List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {order.items.map((item, index) => (
            <Card key={index} sx={{ bgcolor: THEME.bgCard, color: THEME.textMain, border: `1px solid ${THEME.border}`, borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: THEME.primary, fontWeight: 'bold' }}>
                  Rs {item.price?.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}